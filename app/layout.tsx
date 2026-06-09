import type { Metadata } from 'next';
import { Cormorant_Garamond, Lato } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Signed by Sue — Custom Hand-Painted Signs',
    template: '%s | Signed by Sue',
  },
  description:
    'Custom hand-painted signs and artwork for weddings, graduations, missionary farewells, showers, birthdays, and every celebration in between. Made by hand. Made for memories.',
  keywords: [
    'custom signs',
    'hand painted signs',
    'wedding signs',
    'graduation signs',
    'custom artwork',
    'missionary farewell signs',
  ],
  openGraph: {
    siteName: 'Signed by Sue',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col bg-warm-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
