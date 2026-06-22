import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Inter, Space_Grotesk } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HEAT | bZ VST Suite — Premium Plugins for Producers Who Want Fire",
  description: "Ignite your mixes with bZ VSTs. Characterful, low-CPU plugins built for hip-hop, trap & cinematic sound design. Heat This Week featured drops + instant free audio tools to start creating today. Built in Louisville, KY.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-[#0A0A0F] text-[#E8E8F0] antialiased`}>
        <Nav />
        {children}
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}