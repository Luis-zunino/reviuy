import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { getSiteOrigin } from '@/lib/site-url';

// Use a client without cookies for static sitemap generation
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(supabaseUrl, supabaseKey);
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteOrigin();
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/review/create`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/real-estate`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/real-estate/create`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tips`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/good-practices`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    const supabase = getSupabaseClient();

    // Fetch real estates (only non-deleted ones)
    const { data: realEstates } = await supabase
      .from('real_estates')
      .select('id, updated_at')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    // Fetch reviews (only non-deleted ones)
    const { data: reviews } = await supabase
      .from('reviews')
      .select('id, updated_at')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    // Generate URLs for real estates
    const realEstatePages: MetadataRoute.Sitemap =
      realEstates?.map((estate) => ({
        url: `${baseUrl}/real-estate/${estate.id}`,
        lastModified: new Date(estate.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })) || [];

    // Generate URLs for reviews
    const reviewPages: MetadataRoute.Sitemap =
      reviews?.map((review) => ({
        url: `${baseUrl}/review/${review.id}`,
        lastModified: new Date(review.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })) || [];

    return [...staticPages, ...realEstatePages, ...reviewPages];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    // Return static pages if database query fails
    return staticPages;
  }
}
