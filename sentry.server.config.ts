// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [
    // Captura console.log/warn/error como breadcrumbs dentro de los errores
    // (gratuito — no consume quota extra de Logs que es pago)
    Sentry.consoleIntegration({ levels: ['warn', 'error'] }),
  ],

  // En desarrollo sampleamos todo, en producción reducimos para no quemar las 1000 transacciones/mes del free tier
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // NO habilitar enableLogs — Sentry Logs es un producto pago
});
