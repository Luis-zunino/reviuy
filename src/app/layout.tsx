import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reviuy.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RevieUy - Reseñas de Propiedades e Inmobiliarias en Uruguay',
    template: '%s | RevieUy',
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
  authors: [{ name: 'RevieUy Team' }],
  creator: 'RevieUy',
  publisher: 'RevieUy',
  applicationName: 'RevieUy',
  category: 'Real Estate',

  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: siteUrl,
    siteName: 'RevieUy',
    title: 'RevieUy - Reseñas de Propiedades e Inmobiliarias en Uruguay',
    description:
      'Plataforma de reseñas de propiedades de alquiler e inmobiliarias en Uruguay. Comparte tu experiencia y ayuda a otros a tomar mejores decisiones.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RevieUy - Reseñas de Propiedades',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'RevieUy - Reseñas de Propiedades e Inmobiliarias en Uruguay',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased bg-blue-50`}
      >
        <AuthProvider>
          {children}
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
