# Flujo 07 — Contacto y contenido estático

## Propósito

Dar soporte directo al usuario (contacto) y contenido editorial de ayuda (tips, preguntas frecuentes, buenas prácticas) más la información legal de la plataforma.

---

## A) Contacto — `/contact`

### Flujo principal

1. El usuario accede desde el menú (Contáctanos) o el footer.
2. Completa el formulario:

| Campo | Regla |
|---|---|
| Nombre | Entre 2 y 100 caracteres |
| Email | Formato válido |
| Mensaje | Entre 5 y 2000 caracteres |

3. Al enviar:
   - **Requiere sesión iniciada**: un anónimo no puede contactar.
   - El mensaje llega por email al equipo; se responde directamente al email de la cuenta del usuario (el campo email sirve de verificación, no cambia el destinatario de respuesta).
4. Confirmación visual de envío.

### Reglas

- Límite anti-abuso en categoría sensible.
- El email de destino es el correo de contacto configurado del proyecto.

---

## B) Tips — `/tips` y `/tips/:id`

- Listado de consejos para inquilinos (cómo elegir, qué revisar, señales de alerta).
- Cada tip abre su detalle con contenido estructurado (secciones, párrafos, listas) y categoría temática.
- El contenido vive en código (dataset estático), sin CMS: actualizar tips implica un deploy.
- La home muestra 3 tips destacados que enlazan aquí.

## C) Preguntas frecuentes — `/faq`

- Acordeón agrupado por categorías: búsqueda, inmobiliarias, alquiler, reseñas, otros.
- Contenido fijo en código. Incluye aclaraciones clave de producto:
  - El anonimato del reseñador está garantizado.
  - Las opiniones son experiencias individuales, no veredictos.
  - Los propietarios podrán responder en futuras versiones.

## D) Buenas prácticas — `/good-practices`

Página estática con las reglas de convivencia de la comunidad:

- Qué está prohibido publicar: datos personales (propios o de terceros), discriminación, spam.
- Qué suma a la comunidad: detalles concretos de la vivencia, tono respetuoso.

## E) Legal — `/privacidad`, `/terminos`, `/about`

| Página | Contenido |
|---|---|
| Privacidad | Política de tratamiento de datos y anonimato |
| Términos | Términos y condiciones vigentes (mismo texto que exige el gate post-login; comparten constantes) |
| Sobre nosotros | Propuesta de valor y misión del proyecto |

## F) Home — `/`

Landing pública con este orden de secciones:

1. **Hero**: propuesta de valor + buscador de direcciones → lleva al detalle de dirección.
2. Reseñas destacadas (contenido de demostración fijo).
3. Prueba social: estadísticas fijas ("2,500+ reseñas…").
4. Por qué funciona + CTA "Escribir reseña".
5. Barrios más comentados: zonas fijas de demostración (no clickeables individualmente) + "Explorar todas las zonas" → `/explorar`.
6. Tips destacados → detalle de cada tip.
7. Bloque de privacidad/anonimato → `/privacidad`.

> Nota: salvo el buscador del hero, ninguna sección de la home consulta datos reales hoy.

---

## Referencias técnicas

- Contacto: `src/app/(dashboard)/contact/`, API `/api/contact`, módulo `content`
- Tips: `src/app/(dashboard)/tips/`, dataset en `src/modules/content/data/`
- FAQ: `src/app/(dashboard)/faq/`, ítems en `getDoubtsItems.hook.tsx`
- Términos compartidos: `LEGAL_TERMS_*` en `src/constants/legal-terms.constant.ts`
- Home: `src/components/features/Home/`
