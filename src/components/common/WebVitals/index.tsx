'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

/**
 * Componente para tracking de Core Web Vitals
 *
 * Métricas rastreadas:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - INP (Interaction to Next Paint): < 200ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * - FCP (First Contentful Paint): < 1.8s
 * - TTFB (Time to First Byte): < 800ms
 *
 * Los datos se envían a diferentes destinos según el entorno:
 * - Desarrollo: Console (para debugging)
 * - Producción: Vercel Analytics (automático) o custom endpoint
 */

export function WebVitals() {
  useReportWebVitals((metric) => {
    // En producción, Vercel Analytics captura esto automáticamente
    // Si usas otro proveedor (Google Analytics, Datadog, etc.), agrégalo aquí

    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // En desarrollo, usar console para debugging
      const { name, value, rating, navigationType } = metric;

      // Colores para rating visual
      const ratingColor = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';

      /* eslint-disable no-console */
      console.group(`${ratingColor} ${name}`);
      console.log('Value:', value);
      console.log('Rating:', rating);
      console.log('Navigation Type:', navigationType);
      console.groupEnd();
      /* eslint-enable no-console */
    } else {
      // En producción, enviar a analytics
      // Ejemplo con Google Analytics:
      // window.gtag?.('event', metric.name, {
      //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      //   event_category: 'Web Vitals',
      //   event_label: metric.id,
      //   non_interaction: true,
      // });
      // Ejemplo con custom endpoint:
      // fetch('/api/analytics/web-vitals', {
      //   method: 'POST',
      //   body: JSON.stringify(metric),
      //   headers: { 'Content-Type': 'application/json' },
      //   keepalive: true,
      // });
    }
  });

  // Detectar navegación lenta y avisar en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const navigationEntry = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

        if (ttfb > 800) {
          console.warn('⚠️ TTFB lento:', Math.round(ttfb), 'ms');
          // eslint-disable-next-line no-console
          console.log('💡 Considera optimizar el servidor o usar Edge Functions');
        }
      }
    }
  }, []);

  return null;
}
