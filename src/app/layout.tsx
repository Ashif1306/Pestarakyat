import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  metadataBase: new URL('https://pestarakyat.vercel.app'),
  title: {
    default: 'Pesta Rakyat X KKN IAIN Parepare — Turnamen Olahraga Bala Batu',
    template: '%s | Pesta Rakyat X KKN IAIN Parepare',
  },
  description:
    'Website resmi turnamen olahraga Pesta Rakyat X KKN IAIN Parepare 2026 di Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang. Jadwal, hasil live, klasemen grup, dan bagan sistem gugur Volly Putra, Volly Putri, & Sepak Bola Mini.',
  keywords: [
    'Pesta Rakyat',
    'KKN IAIN Parepare',
    'Pesta Rakyat Bala Batu',
    'Turnamen Olahraga Bala Batu',
    'Buntu Barana',
    'Curio Enrekang',
    'Volly Putra Bala Batu',
    'Volly Putri Bala Batu',
    'Sepak Bola Mini Enrekang',
    'Jadwal Pertandingan Volly',
    'Klasemen Pesta Rakyat',
    'Bagan Sistem Gugur',
    'Turnamen KKN IAIN',
  ],
  authors: [{ name: 'KKN IAIN Parepare Posko Bala Batu', url: 'https://pestarakyat.vercel.app' }],
  creator: 'KKN IAIN Parepare',
  publisher: 'Posko KKN IAIN Parepare Dusun Bala Batu',
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
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://pestarakyat.vercel.app',
    title: 'Pesta Rakyat X KKN IAIN Parepare — Turnamen Olahraga Bala Batu 2026',
    description:
      'Website resmi turnamen olahraga Pesta Rakyat X KKN IAIN Parepare di Dusun Bala Batu, Kab. Enrekang. Cek jadwal live, klasemen grup, dan bagan perempat final secara real-time!',
    siteName: 'Pesta Rakyat X KKN IAIN Parepare',
    images: [
      {
        url: 'https://pestarakyat.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pesta Rakyat X KKN IAIN Parepare 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pesta Rakyat X KKN IAIN Parepare — Turnamen Olahraga Bala Batu',
    description:
      'Website resmi turnamen olahraga Pesta Rakyat X KKN IAIN Parepare di Dusun Bala Batu, Kab. Enrekang. Jadwal, hasil, & klasemen live!',
    site: '@balabatu_official',
    creator: '@balabatu_official',
    images: ['https://pestarakyat.vercel.app/og-image.png'],
  },
  alternates: {
    canonical: 'https://pestarakyat.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Pesta Rakyat X KKN IAIN Parepare Turnamen Olahraga 2026',
    description:
      'Turnamen Olahraga Volly Putra, Volly Putri, dan Sepak Bola Mini Antar Dusun Pesta Rakyat X KKN IAIN Parepare 2026 di Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang.',
    startDate: '2026-08-10',
    endDate: '2026-08-25',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Lapangan Utama & Lapangan Mini Bala Batu',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Dusun Bala Batu, Desa Buntu Barana',
        addressLocality: 'Kecamatan Curio',
        addressRegion: 'Kabupaten Enrekang, Sulawesi Selatan',
        addressCountry: 'ID',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'KKN IAIN Parepare Posko Dusun Bala Batu',
      url: 'https://pestarakyat.vercel.app',
    },
  };

  return (
    <html lang="id" className={`dark ${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#0a1628] text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
