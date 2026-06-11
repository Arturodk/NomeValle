import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/lib/cart-context";
import Script from "next/script";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Nomenclaturas del Valle — Placas y Números para tu Hogar",
  description: "Tienda online de nomenclaturas, placas metálicas, números en bronce y aluminio para casas y edificios en Colombia. Compra segura y envío a todo el Valle del Cauca.",
  keywords: "nomenclaturas, placas, números casa, bronce, aluminio, metálico, Colombia, Valle del Cauca, Cali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`} data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <Header />
          <main className="page-content">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
        <Script 
          src="https://checkout.wompi.co/widget.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
