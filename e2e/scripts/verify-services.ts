/**
 * verify-services.ts — Verificación de servicios contra la DB real.
 *
 * Inserta data vía los mismos RPCs que usa la app (supabase-js + auth real)
 * y valida los comportamientos de seguridad esperados:
 *   - create_review / update_review (con rooms)
 *   - vote_review: ajeno OK, propio bloqueado (M4)
 *   - report_review: ajeno OK, propio bloqueado (M3)
 *   - REST directo: bloqued en tablas de negocio (S2/F1/F3), permitido en review_images (F4)
 *   - grants de funciones (has_user_reported_real_estate_review — H1)
 *   - cleanup_test_data: service_role OK, authenticated bloqueado (M1)
 *   - real estate: create/vote/report (self bloqueado), counts
 *   - real_estate_review: create/update/vote/report, counts
 *   - favoritos: toggle + is_favorite (real estate y review)
 *   - paginación: RPCs paginados (auth y anon)
 *   - rol anon: vistas _public accesibles, REST tablas bloqueado
 *   - reporte doble (unique), auditoría review_audit, rate limit (10/60)
 *   - trigger updated_at de review_votes: DEFAULT + BEFORE UPDATE (M6)
 *   - moderate_reports: service_role OK, authenticated bloqueado
 *   - has_user_reported_review (reviews de dirección)
 *   - delete_real_estate_review_safe: self bloqueado + soft-delete
 *   - reviews_public.is_mine: autor vs tercero
 *   - listados: get_reviews_by_current_user / get_favorite_reviews_by_current_user
 *   - reviews_with_votes_public: la vista no filtra identidad
 *
 * Uso:
 *   pnpm test:services            # limpia al final
 *   pnpm test:services:keep       # deja la data para inspección
 *
 * Exit code: 0 = todo PASS, 1 = algún FAIL o error de setup.
 */
import { loadEnvFiles } from '../helpers/env.helper';
loadEnvFiles();
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  E2E_TEST_EMAIL,
  E2E_TEST_PASSWORD,
  ensureTestUser,
  getSupabaseAdmin,
} from '../helpers/auth.helper';

const USER_B_EMAIL = 'smoke-b@reviuy.qa';
const USER_B_PASSWORD = 'TestPassword123!';
const KEEP_DATA = process.argv.includes('--keep');

const TEST_ADDRESS = 'Av. Test 1234, Montevideo';
const TEST_OSM_ID = 'N1234567890';
const TEST_IMAGE_PATH = 'verify-services-test.png';
const FAKE_UUID = '00000000-0000-0000-0000-000000000000';
const TEST_REAL_ESTATE_NAME = `Inmobiliaria Test ${Date.now()}`;

let passCount = 0;
let failCount = 0;

/** Estado compartido para el cleanup del finally (--keep lo desactiva). */
let cleanupAdmin: SupabaseClient | null = null;
let cleanupClientA: SupabaseClient | null = null;
let cleanupUserAId: string | null = null;
let cleanupUserBId: string | null = null;
let cleanupReviewId: string | null = null;
let cleanupRealEstateId: string | null = null;
let cleanupRealEstateReviewId: string | null = null;

function assert(name: string, ok: boolean, detail?: unknown) {
  if (ok) {
    passCount++;
    console.log(`[PASS] ${name}`);
  } else {
    failCount++;
    console.log(`[FAIL] ${name}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ''}`);
  }
}

// --- helpers ---------------------------------------------------------------

async function signIn(email: string, password: string): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || key.includes('placeholder')) {
    throw new Error('Falta NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en .env');
  }
  const client = createClient(url, key);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    throw new Error(`signIn ${email}: ${error?.message ?? 'no session'}`);
  }
  return client;
}

// --- cleanup ---------------------------------------------------------------

/**
 * Limpieza post-run (salvo --keep):
 *  - review_rooms / review_votes / review_reports / review_images de la review del test
 *  - rate_limits de A y B (ventanas de create/vote/report/update)
 *  - la review (REST directo como service_role; fallback delete_review_safe como A)
 *  - usuario B (admin.deleteUserById)
 * security_logs NO se tocan: se conserva la traza de auditoría de M3/M4.
 */
async function cleanup() {
  if (!cleanupAdmin) {
    console.log('[cleanup] Sin admin client (env incompleto) — no hay nada que limpiar');
    return;
  }
  const cleaned: string[] = [];
  const skipped: string[] = [];

  if (cleanupReviewId) {
    const { error: eRooms } = await cleanupAdmin
      .from('review_rooms')
      .delete()
      .eq('review_id', cleanupReviewId);
    if (eRooms) skipped.push(`review_rooms (${eRooms.message})`);
    else cleaned.push('review_rooms');

    const { error: eVotes } = await cleanupAdmin
      .from('review_votes')
      .delete()
      .eq('review_id', cleanupReviewId);
    if (eVotes) skipped.push(`review_votes (${eVotes.message})`);
    else cleaned.push('review_votes');

    const { error: eReports } = await cleanupAdmin
      .from('review_reports')
      .delete()
      .eq('review_id', cleanupReviewId);
    if (eReports) skipped.push(`review_reports (${eReports.message})`);
    else cleaned.push('review_reports');

    const { error: eImages } = await cleanupAdmin
      .from('review_images')
      .delete()
      .eq('review_id', cleanupReviewId);
    if (eImages) skipped.push(`review_images (${eImages.message})`);
    else cleaned.push('review_images');

    const { error: eFavs } = await cleanupAdmin
      .from('review_favorites')
      .delete()
      .eq('review_id', cleanupReviewId);
    if (eFavs) skipped.push(`review_favorites (${eFavs.message})`);
    else cleaned.push('review_favorites');

    // Review: primero REST directo (service_role). Si falla, soft delete auditado
    // vía delete_review_safe como el owner (mismo camino que la app en delete()).
    const { error: delErr } = await cleanupAdmin
      .from('reviews')
      .delete()
      .eq('id', cleanupReviewId);
    if (delErr) {
      if (cleanupClientA) {
        const { error: safeErr } = await cleanupClientA.rpc('delete_review_safe', {
          review_id_param: cleanupReviewId,
        });
        if (safeErr) {
          skipped.push(`reviews (REST: ${delErr.message}; delete_review_safe: ${safeErr.message})`);
        } else {
          cleaned.push('reviews (delete_review_safe)');
        }
      } else {
        skipped.push(`reviews (REST: ${delErr.message}; sin clientA para delete_review_safe)`);
      }
    } else {
      cleaned.push('reviews');
    }
  }

  const rateTargets: Array<{ id: string | null; label: string }> = [
    { id: cleanupUserAId, label: 'rate_limits(A)' },
    { id: cleanupUserBId, label: 'rate_limits(B)' },
  ];
  for (const t of rateTargets) {
    if (!t.id) continue;
    const { error } = await cleanupAdmin.from('rate_limits').delete().eq('user_id', t.id);
    if (error) skipped.push(`${t.label} (${error.message})`);
    else cleaned.push(t.label);
  }

  if (cleanupUserBId) {
    const { error } = await cleanupAdmin.auth.admin.deleteUser(cleanupUserBId);
    if (error) skipped.push(`usuario B (${error.message})`);
    else cleaned.push('usuario B');
  }

  if (cleanupRealEstateId) {
    const { error: eReVotes } = await cleanupAdmin
      .from('real_estate_votes')
      .delete()
      .eq('real_estate_id', cleanupRealEstateId);
    if (eReVotes) skipped.push(`real_estate_votes (${eReVotes.message})`);
    else cleaned.push('real_estate_votes');

    const { error: eReReports } = await cleanupAdmin
      .from('real_estate_reports')
      .delete()
      .eq('real_estate_id', cleanupRealEstateId);
    if (eReReports) skipped.push(`real_estate_reports (${eReReports.message})`);
    else cleaned.push('real_estate_reports');

    const { error: eReFavs } = await cleanupAdmin
      .from('real_estate_favorites')
      .delete()
      .eq('real_estate_id', cleanupRealEstateId);
    if (eReFavs) skipped.push(`real_estate_favorites (${eReFavs.message})`);
    else cleaned.push('real_estate_favorites');

    const { error: eRe } = await cleanupAdmin
      .from('real_estates')
      .delete()
      .eq('id', cleanupRealEstateId);
    if (eRe) skipped.push(`real_estates (${eRe.message})`);
    else cleaned.push('real_estates');
  }

  if (cleanupRealEstateReviewId) {
    const { error: eRerVotes } = await cleanupAdmin
      .from('real_estate_review_votes')
      .delete()
      .eq('real_estate_review_id', cleanupRealEstateReviewId);
    if (eRerVotes) skipped.push(`real_estate_review_votes (${eRerVotes.message})`);
    else cleaned.push('real_estate_review_votes');

    const { error: eRerReports } = await cleanupAdmin
      .from('real_estate_review_reports')
      .delete()
      .eq('real_estate_review_id', cleanupRealEstateReviewId);
    if (eRerReports) skipped.push(`real_estate_review_reports (${eRerReports.message})`);
    else cleaned.push('real_estate_review_reports');
  }

  console.log('[cleanup] security_logs NO se limpian — se conserva la traza de auditoría (M3/M4)');
  console.log(`[cleanup] Limpiado: ${cleaned.length ? cleaned.join(', ') : '(nada)'}`);
  if (skipped.length) {
    console.log(`[cleanup] No limpiado: ${skipped.join('; ')}`);
  }
}

// --- asserts ---------------------------------------------------------------

async function runAsserts(
  clientA: SupabaseClient,
  clientB: SupabaseClient,
  adminClient: SupabaseClient
) {
  // 1. create_review por A (RPC, firma real de la migración: p_ prefijos + p_review_rooms jsonb)
  const { data: createData, error: createErr } = await clientA.rpc('create_review', {
    p_title: 'Review de verificación de servicios',
    p_description: 'Creada por verify-services.ts',
    p_rating: 4,
    p_address_text: TEST_ADDRESS,
    p_address_osm_id: TEST_OSM_ID,
    p_latitude: -34.9,
    p_longitude: -56.16,
    p_real_estate_id: null,
    p_property_type: null,
    p_zone_rating: null,
    p_winter_comfort: null,
    p_summer_comfort: null,
    p_humidity: null,
    p_real_estate_experience: null,
    p_apartment_number: null,
    p_review_rooms: [{ room_type: 'kitchen', area_m2: 15 }],
  });
  const created = (createData ?? {}) as {
    success?: boolean;
    review_id?: string;
    message?: string;
    error?: string;
  };
  assert(
    'create_review (A, RPC) — crea review con rooms',
    !createErr && created.success === true && !!created.review_id,
    { error: createErr?.message, result: created }
  );
  const reviewId = created.success === true && created.review_id ? created.review_id : null;
  if (reviewId) cleanupReviewId = reviewId;
  if (created.success === false) {
    console.warn(`[warn] create_review rechazada: ${created.error ?? created.message ?? ''}`);
  }

  // 2. vote_review — propio bloqueado (M4)
  if (reviewId) {
    const { data: vSelf, error: vSelfErr } = await clientA.rpc('vote_review', {
      p_review_id: reviewId,
      p_vote_type: 'like',
    });
    const vs = (vSelf ?? {}) as { success?: boolean; error?: string };
    assert(
      'vote_review: A NO puede votar su propia review (M4)',
      !vSelfErr && vs.success === false,
      { error: vSelfErr?.message, result: vs }
    );
  } else {
    assert('vote_review: A NO puede votar su propia review (M4)', false, {
      motivo: 'reviewId no disponible (create_review falló)',
    });
  }

  // 3. vote_review — ajeno OK (B vota la review de A)
  if (reviewId) {
    const { data: vB, error: vBErr } = await clientB.rpc('vote_review', {
      p_review_id: reviewId,
      p_vote_type: 'like',
    });
    const vb = (vB ?? {}) as { success?: boolean; action?: string; error?: string };
    assert(
      'vote_review: B vota review ajena (like) — OK',
      !vBErr && vb.success === true && !!vb.action,
      { error: vBErr?.message, result: vb }
    );
  } else {
    assert('vote_review: B vota review ajena (like) — OK', false, {
      motivo: 'reviewId no disponible (create_review falló)',
    });
  }

  // 4. report_review — propio bloqueado (M3)
  if (reviewId) {
    const { data: rSelf, error: rSelfErr } = await clientA.rpc('report_review', {
      p_review_id: reviewId,
      p_reason: 'spam',
      p_description: 'Prueba de servicios',
    });
    const rs = (rSelf ?? {}) as { success?: boolean; error?: string };
    assert(
      'report_review: A NO puede reportar su propia review (M3)',
      !rSelfErr && rs.success === false,
      { error: rSelfErr?.message, result: rs }
    );
  } else {
    assert('report_review: A NO puede reportar su propia review (M3)', false, {
      motivo: 'reviewId no disponible (create_review falló)',
    });
  }

  // 5. report_review — ajeno OK (B reporta la review de A)
  if (reviewId) {
    const { data: rB, error: rBErr } = await clientB.rpc('report_review', {
      p_review_id: reviewId,
      p_reason: 'spam',
      p_description: 'Prueba de servicios',
    });
    const rb = (rB ?? {}) as { success?: boolean; report_id?: string; error?: string };
    assert(
      'report_review: B reporta review ajena (spam) — OK',
      !rBErr && rb.success === true && !!rb.report_id,
      { error: rBErr?.message, result: rb }
    );
  } else {
    assert('report_review: B reporta review ajena (spam) — OK', false, {
      motivo: 'reviewId no disponible (create_review falló)',
    });
  }

  // 6. REST directo con A: writes en tablas de negocio bloqueados (S2/F1/F3).
  //    Se usa FAKE_UUID para que el assert no dependa de reviewId: cualquiera de
  //    error RLS / grants / constraint cuenta como PASS (el resultado es que no se insertó).
  const { error: updReviewErr } = await clientA
    .from('reviews')
    .update({ title: 'hack' })
    .eq('id', FAKE_UUID);
  assert('REST UPDATE reviews bloqueado para A (S2)', !!updReviewErr, updReviewErr?.message ?? 'sin error');

  const { error: insVotesErr } = await clientA
    .from('review_votes')
    .insert({ review_id: FAKE_UUID, vote_type: 'like' });
  assert('REST INSERT review_votes bloqueado para A (S2)', !!insVotesErr, insVotesErr?.message ?? 'sin error');

  const { error: insRoomsErr } = await clientA
    .from('review_rooms')
    .insert({ review_id: FAKE_UUID, room_type: 'kitchen', area_m2: 5 });
  assert('REST INSERT review_rooms bloqueado para A (F1)', !!insRoomsErr, insRoomsErr?.message ?? 'sin error');

  const { error: insRateErr } = await clientA
    .from('rate_limits')
    .insert({ user_id: cleanupUserAId ?? FAKE_UUID, endpoint: 'create_review' });
  assert('REST INSERT rate_limits bloqueado para A (S2)', !!insRateErr, insRateErr?.message ?? 'sin error');

  const { error: insLogErr } = await clientA
    .from('security_logs')
    .insert({ action: 'verify-services', endpoint: 'verify', status: 'test' });
  assert('REST INSERT security_logs bloqueado para A (S2)', !!insLogErr, insLogErr?.message ?? 'sin error');

  // 7. review_images INSERT por REST con A — PERMITIDO (grant insert F4, RLS de owner)
  if (reviewId) {
    const { data: img, error: imgErr } = await clientA
      .from('review_images')
      .insert({
        review_id: reviewId,
        url: TEST_IMAGE_PATH,
        path: TEST_IMAGE_PATH,
      })
      .select('id');
    assert(
      'REST INSERT review_images permitido para A (F4)',
      !imgErr && Array.isArray(img) && img.length > 0,
      { error: imgErr?.message, data: img }
    );
  } else {
    assert('REST INSERT review_images permitido para A (F4)', false, {
      motivo: 'reviewId no disponible (create_review falló)',
    });
  }

  // 8. has_user_reported_real_estate_review — H1: debe ejecutarse sin explotar por grants
  const { data: h1, error: h1Err } = await clientA.rpc('has_user_reported_real_estate_review', {
    p_review_id: FAKE_UUID,
  });
  assert('has_user_reported_real_estate_review no explota (H1)', !h1Err, {
    error: h1Err?.message,
    result: h1,
  });

  // 9. update_review con rooms por A — fix del bug de rooms string (jsonb array)
  if (reviewId) {
    const { data: upd, error: updErr } = await clientA.rpc('update_review', {
      p_review_id: reviewId,
      p_title: 'Review de verificación (editada)',
      p_review_rooms: [{ room_type: 'bedroom', area_m2: 12 }],
    });
    const u = (upd ?? {}) as { success?: boolean; error?: string };
    assert(
      'update_review con rooms (A) — fix rooms string',
      !updErr && u.success === true,
      { error: updErr?.message, result: u }
    );
  } else {
    assert('update_review con rooms (A) — fix rooms string', false, {
      motivo: 'reviewId no disponible (create_review falló)',
    });
  }

  // 10. cleanup_test_data como service_role — debe ser void sin error
  const { data: ctd, error: ctdErr } = await adminClient.rpc('cleanup_test_data');
  assert('cleanup_test_data como service_role — void sin error (M1)', !ctdErr, {
    error: ctdErr?.message,
    data: ctd,
  });

  // 11. cleanup_test_data como A (authenticated) — debe fallar (grant revocado / guard M1)
  const { error: ctdAErr } = await clientA.rpc('cleanup_test_data');
  assert('cleanup_test_data bloqueado para A (M1)', !!ctdAErr, ctdAErr?.message ?? 'sin error');

  // =========================================================================
  // 12-16. REAL ESTATE: create, self-vote (M4), vote ajeno, counts
  // =========================================================================
  const { data: reData, error: reErr } = await clientA.rpc('create_real_estate', {
    p_name: TEST_REAL_ESTATE_NAME,
    p_description: 'Creada por verify-services.ts',
  });
  const re = (reData ?? {}) as { success?: boolean; id?: string; message?: string; error?: string };
  assert(
    'create_real_estate (A) — crea inmobiliaria',
    !reErr && re.success === true && !!re.id,
    { error: reErr?.message, result: re }
  );
  const realEstateId = re.success === true && re.id ? re.id : null;
  if (realEstateId) cleanupRealEstateId = realEstateId;

  if (realEstateId) {
    const { data: reSelfVote, error: reSelfVoteErr } = await clientA.rpc('vote_real_estate', {
      p_real_estate_id: realEstateId,
      p_vote_type: 'like',
    });
    const rsv = (reSelfVote ?? {}) as { success?: boolean; error?: string };
    assert(
      'vote_real_estate: A NO puede votar su propia inmobiliaria (M4)',
      !reSelfVoteErr && rsv.success === false,
      { error: reSelfVoteErr?.message, result: rsv }
    );

    const { data: reBVote, error: reBVoteErr } = await clientB.rpc('vote_real_estate', {
      p_real_estate_id: realEstateId,
      p_vote_type: 'like',
    });
    const rbv = (reBVote ?? {}) as { success?: boolean; action?: string; error?: string };
    assert(
      'vote_real_estate: B vota inmobiliaria ajena (like) — OK',
      !reBVoteErr && rbv.success === true && !!rbv.action,
      { error: reBVoteErr?.message, result: rbv }
    );

    const { data: reCounts, error: reCountsErr } = await adminClient.rpc(
      'get_real_estate_vote_counts',
      { p_real_estate_id: realEstateId }
    );
    const rc = (Array.isArray(reCounts) ? reCounts[0] : {}) as {
      likes_count?: number;
      dislikes_count?: number;
    };
    assert(
      'get_real_estate_vote_counts refleja el voto de B (likes=1)',
      !reCountsErr && Number(rc.likes_count) === 1 && Number(rc.dislikes_count) === 0,
      { error: reCountsErr?.message, result: rc }
    );

    const { data: reSelfReport, error: reSelfReportErr } = await clientA.rpc('report_real_estate', {
      p_real_estate_id: realEstateId,
      p_reason: 'spam',
      p_description: 'Prueba',
    });
    const rsr = (reSelfReport ?? {}) as { success?: boolean; error?: string };
    assert(
      'report_real_estate: A NO puede reportar su propia inmobiliaria (M3)',
      !reSelfReportErr && rsr.success === false,
      { error: reSelfReportErr?.message, result: rsr }
    );

    const { data: reBReport, error: reBReportErr } = await clientB.rpc('report_real_estate', {
      p_real_estate_id: realEstateId,
      p_reason: 'spam',
      p_description: 'Prueba',
    });
    const rbr = (reBReport ?? {}) as { success?: boolean; error?: string };
    assert(
      'report_real_estate: B reporta inmobiliaria ajena — OK',
      !reBReportErr && rbr.success === true,
      { error: reBReportErr?.message, result: rbr }
    );
  } else {
    assert('real estate: sub-flujos (self-vote/vote/counts/self-report/report)', false, {
      motivo: 'realEstateId no disponible (create_real_estate falló)',
    });
  }

  // =========================================================================
  // 17-21. REAL ESTATE REVIEW: create, update, self-vote, vote ajeno, counts
  // =========================================================================
  if (realEstateId) {
    const { data: rerData, error: rerErr } = await clientA.rpc('create_real_estate_review', {
      p_real_estate_id: realEstateId,
      p_title: 'Review de inmobiliaria (verify)',
      p_description: 'Creada por verify-services.ts',
      p_rating: 5,
    });
    const rer = (rerData ?? {}) as { success?: boolean; review_id?: string; error?: string };
    assert(
      'create_real_estate_review (A) — crea review de inmobiliaria',
      !rerErr && rer.success === true && !!rer.review_id,
      { error: rerErr?.message, result: rer }
    );
    const rerId = rer.success === true && rer.review_id ? rer.review_id : null;
    if (rerId) cleanupRealEstateReviewId = rerId;

    if (rerId) {
      const { data: rerUpdate, error: rerUpdateErr } = await clientA.rpc(
        'update_real_estate_review',
        { p_review_id: rerId, p_title: 'Review de inmobiliaria (editada)' }
      );
      const rru = (rerUpdate ?? {}) as { success?: boolean; error?: string };
      assert(
        'update_real_estate_review (A) — edita su review',
        !rerUpdateErr && rru.success === true,
        { error: rerUpdateErr?.message, result: rru }
      );

      const { data: rerSelfVote, error: rerSelfVoteErr } = await clientA.rpc(
        'vote_real_estate_review',
        { p_real_estate_review_id: rerId, p_vote_type: 'like' }
      );
      const rrsv = (rerSelfVote ?? {}) as { success?: boolean; error?: string };
      assert(
        'vote_real_estate_review: A NO puede votar su propia review (M4)',
        !rerSelfVoteErr && rrsv.success === false,
        { error: rerSelfVoteErr?.message, result: rrsv }
      );

      const { data: rerBVote, error: rerBVoteErr } = await clientB.rpc(
        'vote_real_estate_review',
        { p_real_estate_review_id: rerId, p_vote_type: 'like' }
      );
      const rrbv = (rerBVote ?? {}) as { success?: boolean; action?: string; error?: string };
      assert(
        'vote_real_estate_review: B vota review ajena (like) — OK',
        !rerBVoteErr && rrbv.success === true && !!rrbv.action,
        { error: rerBVoteErr?.message, result: rrbv }
      );

      const { data: rerCounts, error: rerCountsErr } = await adminClient.rpc(
        'get_real_estate_review_vote_counts',
        { p_real_estate_review_id: rerId }
      );
      const rrc = (Array.isArray(rerCounts) ? rerCounts[0] : {}) as {
        likes_count?: number;
        dislikes_count?: number;
      };
      assert(
        'get_real_estate_review_vote_counts refleja el voto de B (likes=1)',
        !rerCountsErr && Number(rrc.likes_count) === 1 && Number(rrc.dislikes_count) === 0,
        { error: rerCountsErr?.message, result: rrc }
      );

      // self-report y report ajeno de real_estate_review
      const { data: rerSelfReport, error: rerSelfReportErr } = await clientA.rpc(
        'report_real_estate_review',
        { p_real_estate_review_id: rerId, p_reason: 'spam' }
      );
      const rrsr = (rerSelfReport ?? {}) as { success?: boolean; error?: string };
      assert(
        'report_real_estate_review: A NO puede reportar su propia review (M3)',
        !rerSelfReportErr && rrsr.success === false,
        { error: rerSelfReportErr?.message, result: rrsr }
      );

      const { data: rerBReport, error: rerBReportErr } = await clientB.rpc(
        'report_real_estate_review',
        { p_real_estate_review_id: rerId, p_reason: 'spam' }
      );
      const rrbp = (rerBReport ?? {}) as { success?: boolean; error?: string };
      assert(
        'report_real_estate_review: B reporta review ajena — OK',
        !rerBReportErr && rrbp.success === true,
        { error: rerBReportErr?.message, result: rrbp }
      );
    } else {
      assert('real_estate_review: sub-flujos (update/vote/counts/report)', false, {
        motivo: 'rerId no disponible (create_real_estate_review falló)',
      });
    }
  } else {
    assert('real_estate_review: sub-flujos (create/update/vote/counts/report)', false, {
      motivo: 'realEstateId no disponible (create_real_estate falló)',
    });
  }

  // =========================================================================
  // 22-25. FAVORITOS: real estate y review — S2 bloquea el self-favorite,
  //        B (ajeno) sí puede favoritar
  // =========================================================================
  if (realEstateId) {
    const { data: favReSelf, error: favReSelfErr } = await clientA.rpc('toggle_favorite_real_estate', {
      p_real_estate_id: realEstateId,
    });
    const frs = (favReSelf ?? {}) as { success?: boolean; error?: string };
    assert(
      'toggle_favorite_real_estate (A) — NO puede favoritar su propia inmobiliaria (S2)',
      !favReSelfErr && frs.success === false,
      { error: favReSelfErr?.message, result: frs }
    );

    const { data: favReB, error: favReBErr } = await clientB.rpc('toggle_favorite_real_estate', {
      p_real_estate_id: realEstateId,
    });
    const frb = (favReB ?? {}) as { success?: boolean; is_favorite?: boolean; error?: string };
    assert(
      'toggle_favorite_real_estate (B) — agrega a favoritos la de A',
      !favReBErr && frb.success === true && frb.is_favorite === true,
      { error: favReBErr?.message, result: frb }
    );

    const { data: isReFavB, error: isReFavBErr } = await clientB.rpc('is_real_estate_favorite', {
      p_real_estate_id: realEstateId,
    });
    assert(
      'is_real_estate_favorite (B) — true tras toggle',
      !isReFavBErr && isReFavB === true,
      { error: isReFavBErr?.message, result: isReFavB }
    );
  } else {
    assert('favoritos real estate (toggle + is_favorite)', false, {
      motivo: 'realEstateId no disponible',
    });
  }

  if (reviewId) {
    const { data: favRevSelf, error: favRevSelfErr } = await clientA.rpc('toggle_favorite_review', {
      p_review_id: reviewId,
    });
    const fvs = (favRevSelf ?? {}) as { success?: boolean; error?: string };
    assert(
      'toggle_favorite_review (A) — NO puede favoritar su propia review (S2)',
      !favRevSelfErr && fvs.success === false,
      { error: favRevSelfErr?.message, result: fvs }
    );

    const { data: favRevB, error: favRevBErr } = await clientB.rpc('toggle_favorite_review', {
      p_review_id: reviewId,
    });
    const fvb = (favRevB ?? {}) as { success?: boolean; is_favorite?: boolean; error?: string };
    assert(
      'toggle_favorite_review (B) — agrega a favoritos la de A',
      !favRevBErr && fvb.success === true && fvb.is_favorite === true,
      { error: favRevBErr?.message, result: fvb }
    );

    const { data: isRevFavB, error: isRevFavBErr } = await clientB.rpc('is_review_favorite', {
      p_review_id: reviewId,
    });
    assert(
      'is_review_favorite (B) — true tras toggle',
      !isRevFavBErr && isRevFavB === true,
      { error: isRevFavBErr?.message, result: isRevFavB }
    );
  } else {
    assert('favoritos review (toggle + is_favorite)', false, {
      motivo: 'reviewId no disponible',
    });
  }

  // =========================================================================
  // 26-27. PAGINACIÓN: RPCs paginados (auth y anon)
  // =========================================================================
  const { data: pag, error: pagErr } = await clientA.rpc('get_reviews_paginated', {
    p_limit: 5,
    p_offset: 0,
  });
  assert(
    'get_reviews_paginated (A) — devuelve array',
    !pagErr && Array.isArray(pag),
    { error: pagErr?.message, count: Array.isArray(pag) ? pag.length : undefined }
  );

  const { data: pagRe, error: pagReErr } = await clientA.rpc('get_real_estates_paginated', {
    p_limit: 5,
    p_offset: 0,
  });
  let pagReHasOurs = false;
  if (!pagReErr && Array.isArray(pagRe)) {
    pagReHasOurs = (pagRe as Array<{ id?: string; name?: string }>).some(
      (r) => r.id === realEstateId || r.name === TEST_REAL_ESTATE_NAME
    );
  }
  assert(
    'get_real_estates_paginated (A) — incluye la inmobiliaria del test',
    !pagReErr && Array.isArray(pagRe) && pagReHasOurs,
    { error: pagReErr?.message, result: Array.isArray(pagRe) ? pagRe : undefined }
  );

  // =========================================================================
  // 28-32. ROL ANON: acceso público OK, REST tablas bloqueado
  // =========================================================================
  const anonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anonUrl && anonKey && !anonKey.includes('placeholder')) {
    const anonClient = createClient(anonUrl, anonKey);

    const { data: anonPag, error: anonPagErr } = await anonClient.rpc('get_reviews_paginated', {
      p_limit: 5,
      p_offset: 0,
    });
    assert(
      'anon: get_reviews_paginated accesible (vista pública)',
      !anonPagErr && Array.isArray(anonPag),
      { error: anonPagErr?.message, count: Array.isArray(anonPag) ? anonPag.length : undefined }
    );

    const { data: anonCounts, error: anonCountsErr } = await anonClient.rpc(
      'get_review_vote_counts',
      { p_review_id: FAKE_UUID }
    );
    assert(
      'anon: get_review_vote_counts accesible (grant anon)',
      !anonCountsErr,
      { error: anonCountsErr?.message, result: anonCounts }
    );

    const { error: anonSelErr } = await anonClient
      .from('reviews')
      .select('id')
      .limit(1);
    assert(
      'anon: REST SELECT reviews bloqueado (solo vistas _public)',
      !!anonSelErr,
      anonSelErr?.message ?? 'sin error (debería estar bloqueado)'
    );

    const { error: anonInsErr } = await anonClient
      .from('reviews')
      .insert({ title: 'hack', description: 'x', rating: 1, address_text: 'x' });
    assert('anon: REST INSERT reviews bloqueado', !!anonInsErr, anonInsErr?.message ?? 'sin error');

    const { error: anonVoteErr } = await anonClient.rpc('vote_review', {
      p_review_id: FAKE_UUID,
      p_vote_type: 'like',
    });
    assert(
      'anon: vote_review bloqueado (grant solo authenticated)',
      !!anonVoteErr,
      anonVoteErr?.message ?? 'sin error (debería estar bloqueado)'
    );
  } else {
    assert('anon: sub-flujos (paginación/counts/REST/vote)', false, {
      motivo: 'anon key no disponible',
    });
  }

  // =========================================================================
  // 33-34. REPORTE DOBLE (unique constraints) e INTEGRIDAD
  // =========================================================================
  if (reviewId) {
    const { data: dupReport, error: dupReportErr } = await clientB.rpc('report_review', {
      p_review_id: reviewId,
      p_reason: 'misleading',
      p_description: 'Segundo reporte del mismo usuario',
    });
    const dr = (dupReport ?? {}) as { success?: boolean; error?: string };
    assert(
      'report_review doble (B) — bloqueado por unique constraint',
      !dupReportErr && dr.success === false,
      { error: dupReportErr?.message, result: dr }
    );
  } else {
    assert('report_review doble (B) — bloqueado por unique', false, {
      motivo: 'reviewId no disponible',
    });
  }

  // Auditoría: review_audit debe tener al menos 1 fila para la review (log_review_changes)
  if (reviewId) {
    const { data: auditRows, error: auditErr } = await adminClient
      .from('review_audit')
      .select('id')
      .eq('review_id', reviewId)
      .limit(1);
    assert(
      'review_audit registra cambios de la review (trigger log_review_changes)',
      !auditErr && Array.isArray(auditRows) && auditRows.length > 0,
      { error: auditErr?.message, count: Array.isArray(auditRows) ? auditRows.length : 0 }
    );
  } else {
    assert('review_audit registra cambios de la review', false, {
      motivo: 'reviewId no disponible',
    });
  }

  // =========================================================================
  // 35. RATE LIMIT: update_review (10/60) — la llamada 11 debe fallar
  //     reset de rate_limits de A para aislar el bloque (el test 9 "update_review
  //     con rooms" ya consumió 1 slot de la ventana 10/60)
  // =========================================================================
  if (reviewId && cleanupUserAId) {
    const { error: rlPreErr } = await adminClient
      .from('rate_limits')
      .delete()
      .eq('user_id', cleanupUserAId);
    if (rlPreErr) console.warn(`[setup] No se pudo limpiar rate_limits previo a rate-limit: ${rlPreErr.message}`);
    let okCount = 0;
    let deniedCount = 0;
    let deniedMsg = '';
    for (let i = 0; i < 12; i++) {
      const { data: rlData, error: rlErr } = await clientA.rpc('update_review', {
        p_review_id: reviewId,
        p_title: `Review rate-limit ${i}`,
      });
      const rl = (rlData ?? {}) as { success?: boolean; error?: string };
      if (!rlErr && rl.success === true) okCount++;
      else {
        deniedCount++;
        deniedMsg = rlErr?.message ?? rl.error ?? '';
        break; // primer rechazo: cortar
      }
    }
    assert(
      'rate limit update_review (10/60): 10 OK y la 11ra rechazada',
      okCount === 10 && deniedCount === 1,
      { okCount, deniedCount, deniedMsg }
    );
  } else {
    assert('rate limit update_review (10/60)', false, {
      motivo: 'reviewId no disponible',
    });
  }

  // =========================================================================
  // 36. TRIGGER updated_at de review_votes (regresión M6)
  //     La columna llega con DEFAULT now(), así que el valor por sí solo no
  //     prueba que el trigger BEFORE UPDATE corra. Por eso se escribe un
  //     centinela vía REST como service_role: el discriminador es doble —
  //     con trigger lo pisa y el UPDATE pasa; sin trigger el centinela queda
  //     por debajo de created_at y review_votes_check (updated_at >=
  //     created_at) rechaza la fila, así que el UPDATE también falla.
  // =========================================================================
  if (reviewId) {
    const { data: voteRows, error: voteRowsErr } = await adminClient
      .from('review_votes')
      .select('id, vote_type, updated_at')
      .eq('review_id', reviewId)
      .limit(1);
    const voteRow = (voteRows ?? [])[0] as
      | { id?: string; vote_type?: string; updated_at?: string }
      | undefined;
    assert(
      'review_votes: updated_at poblado por DEFAULT now() al crear el voto (M6)',
      !voteRowsErr && !!voteRow?.updated_at,
      { error: voteRowsErr?.message, vote: voteRow }
    );

    if (voteRow?.id) {
      const sentinel = '2000-01-01T00:00:00Z';
      const { error: upErr } = await adminClient
        .from('review_votes')
        .update({ vote_type: 'dislike', updated_at: sentinel })
        .eq('id', voteRow.id);
      const { data: afterRows, error: afterErr } = await adminClient
        .from('review_votes')
        .select('vote_type, updated_at')
        .eq('id', voteRow.id)
        .limit(1);
      const after = (afterRows ?? [])[0] as
        | { vote_type?: string; updated_at?: string }
        | undefined;
      assert(
        'review_votes: el trigger BEFORE UPDATE pisa el centinela de updated_at (M6)',
        !upErr &&
          !afterErr &&
          after?.vote_type === 'dislike' &&
          !!after?.updated_at &&
          after.updated_at !== sentinel,
        {
          updateError: upErr?.message,
          readError: afterErr?.message,
          sentinel,
          after,
        }
      );
    } else {
      assert('review_votes: el trigger BEFORE UPDATE pisa el centinela (M6)', false, {
        motivo: 'no hay fila de review_votes para la review del test',
      });
    }
  } else {
    assert('review_votes: updated_at / trigger (M6)', false, {
      motivo: 'reviewId no disponible',
    });
  }

  // =========================================================================
  // 37. moderate_reports — sólo service_role
  // =========================================================================
  if (reviewId) {
    const { data: repRows, error: repRowsErr } = await adminClient
      .from('review_reports')
      .select('id, status')
      .eq('review_id', reviewId)
      .limit(1);
    const repRow = (repRows ?? [])[0] as { id?: string; status?: string } | undefined;

    if (repRow?.id) {
      const { error: modBErr } = await clientB.rpc('moderate_reports', {
        p_report_id: repRow.id,
        p_target_type: 'review',
        p_status: 'resolved',
        p_moderation_note: 'intento no autorizado',
      });
      assert(
        'moderate_reports bloqueado para un authenticated (grant sólo service_role)',
        !!modBErr,
        { error: modBErr?.message }
      );

      const { data: modData, error: modErr } = await adminClient.rpc('moderate_reports', {
        p_report_id: repRow.id,
        p_target_type: 'review',
        p_status: 'resolved',
        p_moderation_note: 'moderado por verify-services',
      });
      const mod = (modData ?? {}) as { success?: boolean; error?: string };
      assert(
        'moderate_reports (service_role) — modera el reporte de review',
        !modErr && mod.success === true,
        { error: modErr?.message, result: mod }
      );

      const { data: statusRows, error: statusErr } = await adminClient
        .from('review_reports')
        .select('status')
        .eq('id', repRow.id)
        .limit(1);
      const statusRow = (statusRows ?? [])[0] as { status?: string } | undefined;
      assert(
        'moderate_reports: el nuevo status queda persistido en review_reports',
        !statusErr && statusRow?.status === 'resolved',
        { error: statusErr?.message, status: statusRow?.status }
      );
    } else {
      assert('moderate_reports', false, {
        motivo: 'B no dejó un review_reports para la review del test',
        error: repRowsErr?.message,
      });
    }
  } else {
    assert('moderate_reports', false, { motivo: 'reviewId no disponible' });
  }

  // =========================================================================
  // 38. has_user_reported_review — B reportó, A nunca pudo
  // =========================================================================
  if (reviewId) {
    const { data: hB, error: hBErr } = await clientB.rpc('has_user_reported_review', {
      p_review_id: reviewId,
    });
    assert(
      'has_user_reported_review (B) — true tras reportar',
      !hBErr && hB === true,
      { error: hBErr?.message, value: hB }
    );

    const { data: hA, error: hAErr } = await clientA.rpc('has_user_reported_review', {
      p_review_id: reviewId,
    });
    assert(
      'has_user_reported_review (A) — false, no puede reportar la propia',
      !hAErr && hA === false,
      { error: hAErr?.message, value: hA }
    );
  } else {
    assert('has_user_reported_review', false, { motivo: 'reviewId no disponible' });
  }

  // =========================================================================
  // 39. delete_real_estate_review_safe — B bloqueado, A soft-delete
  // =========================================================================
  if (cleanupRealEstateReviewId) {
    const { data: delB, error: delBErr } = await clientB.rpc('delete_real_estate_review_safe', {
      p_review_id: cleanupRealEstateReviewId,
    });
    const delBR = (delB ?? {}) as { success?: boolean; error?: string };
    assert(
      'delete_real_estate_review_safe (B) — no puede borrar la review ajena',
      !delBErr && delBR.success === false,
      { error: delBErr?.message, result: delBR }
    );

    const { data: delA, error: delAErr } = await clientA.rpc('delete_real_estate_review_safe', {
      p_review_id: cleanupRealEstateReviewId,
    });
    const delAR = (delA ?? {}) as { success?: boolean; error?: string };
    assert(
      'delete_real_estate_review_safe (A) — soft-delete de su propia review',
      !delAErr && delAR.success === true,
      { error: delAErr?.message, result: delAR }
    );

    const { data: stillThere, error: stillErr } = await clientA
      .from('real_estate_reviews_public')
      .select('id')
      .eq('id', cleanupRealEstateReviewId)
      .limit(1);
    assert(
      'delete_real_estate_review_safe: la review desaparece de real_estate_reviews_public',
      !stillErr && (stillThere ?? []).length === 0,
      { error: stillErr?.message, rows: (stillThere ?? []).length }
    );
  } else {
    assert('delete_real_estate_review_safe', false, {
      motivo: 'cleanupRealEstateReviewId no disponible',
    });
  }

  // =========================================================================
  // 40. reviews_public.is_mine — true para el autor, false para el tercero
  // =========================================================================
  if (reviewId) {
    const { data: mineA, error: mineAErr } = await clientA
      .from('reviews_public')
      .select('is_mine')
      .eq('id', reviewId)
      .limit(1);
    const rowA = (mineA ?? [])[0] as { is_mine?: boolean } | undefined;
    assert(
      'reviews_public: is_mine=true para el autor (A)',
      !mineAErr && rowA?.is_mine === true,
      { error: mineAErr?.message, row: rowA }
    );

    const { data: mineB, error: mineBErr } = await clientB
      .from('reviews_public')
      .select('is_mine')
      .eq('id', reviewId)
      .limit(1);
    const rowB = (mineB ?? [])[0] as { is_mine?: boolean } | undefined;
    assert(
      'reviews_public: is_mine=false para un tercero (B)',
      !mineBErr && rowB?.is_mine === false,
      { error: mineBErr?.message, row: rowB }
    );
  } else {
    assert('reviews_public: is_mine', false, { motivo: 'reviewId no disponible' });
  }

  // =========================================================================
  // 41. Listados del usuario actual — propias y favoritas
  //     A es autor de reviewId; B la favoritó pero no la escribió.
  // =========================================================================
  if (reviewId) {
    const { data: mineList, error: mineListErr } = await clientA.rpc(
      'get_reviews_by_current_user'
    );
    const mineIds = ((mineList ?? []) as { id?: string }[]).map((r) => r.id);
    assert(
      'get_reviews_by_current_user (A) — incluye la review que escribió',
      !mineListErr && mineIds.includes(reviewId),
      { error: mineListErr?.message, count: mineIds.length }
    );

    const { data: otherList, error: otherListErr } = await clientB.rpc(
      'get_reviews_by_current_user'
    );
    const otherIds = ((otherList ?? []) as { id?: string }[]).map((r) => r.id);
    assert(
      'get_reviews_by_current_user (B) — no incluye la review de A',
      !otherListErr && !otherIds.includes(reviewId),
      { error: otherListErr?.message, count: otherIds.length }
    );

    const { data: favList, error: favListErr } = await clientB.rpc(
      'get_favorite_reviews_by_current_user'
    );
    const favIds = ((favList ?? []) as { id?: string }[]).map((r) => r.id);
    assert(
      'get_favorite_reviews_by_current_user (B) — incluye la review que favoritó',
      !favListErr && favIds.includes(reviewId),
      { error: favListErr?.message, count: favIds.length }
    );

    const { data: favOther, error: favOtherErr } = await clientA.rpc(
      'get_favorite_reviews_by_current_user'
    );
    const favOtherIds = ((favOther ?? []) as { id?: string }[]).map((r) => r.id);
    assert(
      'get_favorite_reviews_by_current_user (A) — no ve los favoritos de B',
      !favOtherErr && !favOtherIds.includes(reviewId),
      { error: favOtherErr?.message, count: favOtherIds.length }
    );
  } else {
    assert('listados del usuario actual', false, { motivo: 'reviewId no disponible' });
  }

  // =========================================================================
  // 42. reviews_with_votes_public no debe filtrar identidad
  // =========================================================================
  if (reviewId) {
    const { data: wv, error: wvErr } = await clientA
      .from('reviews_with_votes_public')
      .select('*')
      .eq('address_osm_id', TEST_OSM_ID)
      .limit(1);
    const wvRow = (wv ?? [])[0] as Record<string, unknown> | undefined;
    const leaked = wvRow
      ? ['user_id', 'created_by', 'deleted_by', 'reported_by_user_id'].filter((col) =>
          Object.prototype.hasOwnProperty.call(wvRow, col)
        )
      : [];
    assert(
      'reviews_with_votes_public: no expone columnas de identidad (user_id/created_by/...)',
      !wvErr && wvRow !== undefined && leaked.length === 0,
      { error: wvErr?.message, leaked, columnas: wvRow ? Object.keys(wvRow) : null }
    );
  } else {
    assert('reviews_with_votes_public: sin fuga de identidad', false, {
      motivo: 'reviewId no disponible',
    });
  }
}

// --- main -------------------------------------------------------------------

async function main() {
  console.log(`verify-services.ts — --keep=${KEEP_DATA}`);

  const adminClient = getSupabaseAdmin();
  if (!adminClient) {
    throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY en .env (getSupabaseAdmin() devolvió null)');
  }
  cleanupAdmin = adminClient;

  try {
    // --- Setup ---------------------------------------------------------------
    const userA = await ensureTestUser();
    if (!userA) {
      throw new Error('No se pudo asegurar el usuario e2e-test (admin null o createUser falló)');
    }
    cleanupUserAId = userA.id;
    console.log(`[setup] Usuario A: ${userA.id} (${E2E_TEST_EMAIL})`);

    const {
      data: { users },
    } = await adminClient.auth.admin.listUsers();
    let userB = users?.find((u) => u.email === USER_B_EMAIL);
    if (!userB) {
      const { data, error } = await adminClient.auth.admin.createUser({
        email: USER_B_EMAIL,
        password: USER_B_PASSWORD,
        email_confirm: true,
        user_metadata: {
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted_at: new Date().toISOString(),
          terms_version: 'v1',
        },
      });
      if (error) throw new Error(`createUser ${USER_B_EMAIL}: ${error.message}`);
      userB = data.user ?? undefined;
      console.log(`[setup] Usuario B creado: ${userB?.id}`);
    } else {
      console.log(`[setup] Usuario B reutilizado: ${userB.id}`);
    }
    if (!userB) throw new Error(`No se pudo obtener/crear el usuario B (${USER_B_EMAIL})`);
    cleanupUserBId = userB.id;

    // Limpiar rate_limits de A y B previo al run (ventanas de create/vote/report/update).
    const { error: rlAErr } = await adminClient.from('rate_limits').delete().eq('user_id', userA.id);
    if (rlAErr) console.warn(`[setup] No se pudo limpiar rate_limits de A: ${rlAErr.message}`);
    const { error: rlBErr } = await adminClient.from('rate_limits').delete().eq('user_id', userB.id);
    if (rlBErr) console.warn(`[setup] No se pudo limpiar rate_limits de B: ${rlBErr.message}`);
    console.log('[setup] rate_limits de A y B limpiados');

    // Sondeo informativo: service_role debe poder leer reviews (bypasea RLS con grants).
    const { data: probe, error: probeErr } = await adminClient
      .from('reviews')
      .select('id')
      .limit(1);
    if (probeErr) {
      console.warn(`[setup] service_role SELECT reviews → error: ${probeErr.message}`);
    } else {
      console.log(
        `[setup] service_role SELECT reviews → ok (${(probe ?? []).length} fila/s en muestra)`
      );
    }

    const clientA = await signIn(E2E_TEST_EMAIL, E2E_TEST_PASSWORD);
    const clientB = await signIn(USER_B_EMAIL, USER_B_PASSWORD);
    cleanupClientA = clientA;

    // --- Asserts -------------------------------------------------------------
    await runAsserts(clientA, clientB, adminClient);
  } finally {
    if (KEEP_DATA) {
      console.log(
        '\n[cleanup] --keep: se deja la data en DB para inspección (reviews, rooms, votes, reports, review_images, rate_limits, usuario B). security_logs nunca se tocan (auditoría M3/M4).'
      );
    } else {
      try {
        await cleanup();
      } catch (err) {
        console.error('[cleanup] Error inesperado durante la limpieza:', err);
      }
    }
  }

  console.log(`\nResumen: ${passCount} PASS, ${failCount} FAIL`);
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('\n[verify-services] Error de setup:', err);
  process.exit(1);
});