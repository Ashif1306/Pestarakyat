import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Pesta Rakyat X KKN IAIN — Turnamen Olahraga Antar Dusun',
  description: 'Website resmi turnamen olahraga Pesta Rakyat X KKN IAIN Parepare. Jadwal, klasemen, bagan knockout, dan hasil pertandingan Volly Putra, Volly Putri, & Sepak Bola Mini di Dusun Bala Batu, Kab. Enrekang.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-[#0a1628] text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
