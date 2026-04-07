import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { WebVitals } from '@/components/common/WebVitals';
import { StructuredData, createWebSiteSchema } from '@/components/seo';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { NOMINATIM_URL } from '@/constants';
import { getSiteOrigin } from '@/lib/site-url';
import { headers } from 'next/headers';

const inter = Inter({
  subsets: ['latin'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: '/manifest.webmanifest',
  title: {
    default: 'ReviUy - Reseñas de Propiedades e Inmobiliarias en Uruguay',
    template: '%s | ReviUy',
  },
  description:
    'Descubre y comparte experiencias sobre propiedades de alquiler e inmobiliarias en Uruguay. Lee reseñas detalladas, califica tu experiencia y toma decisiones informadas.',
  keywords: [
    'reseñas propiedades uruguay',
    'alquiler uruguay',
    'inmobiliarias uruguay',
    'opiniones alquileres',
    'arrendamientos uruguay',
    'propiedades montevideo',
    'reviews propiedades',
  ],
  authors: [{ name: 'ReviUy Team' }],
  creator: 'ReviUy',
  publisher: 'ReviUy',
  applicationName: 'ReviUy',
  category: 'Real Estate',

  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: siteUrl,
    siteName: 'ReviUy',
    title: 'ReviUy - Reseñas de Propiedades e Inmobiliarias en Uruguay',
    description:
      'Plataforma de reseñas de propiedades de alquiler e inmobiliarias en Uruguay. Comparte tu experiencia y ayuda a otros a tomar mejores decisiones.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReviUy - Reseñas de Propiedades',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ReviUy - Reseñas de Propiedades e Inmobiliarias en Uruguay',
    description:
      'Descubre y comparte experiencias sobre propiedades de alquiler e inmobiliarias en Uruguay.',
    images: ['/og-image.png'],
    creator: '@reviuy',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    // Agregar cuando tengas los códigos de verificación
    google: 'vub9ZtcDwq7nAcxmvNbPLGKme8kXlkRdZIckkGRVtg0',
    // yandex: 'tu-codigo-yandex',
  },

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Resource hints para optimizar performance */}
        <link rel="preconnect" href={NOMINATIM_URL} />
        <link rel="dns-prefetch" href={NOMINATIM_URL} />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased bg-background relative overflow-x-hidden`}
      >
        <WebVitals />
        <StructuredData
          nonce={nonce}
          data={createWebSiteSchema({
            name: 'ReviUy',
            url: siteUrl,
            searchUrl: `${siteUrl}/buscar?q=`,
          })}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
