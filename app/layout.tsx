import type { Metadata, Viewport } from "next";
import { Albert_Sans, Red_Hat_Display, Aclonica, Alata } from "next/font/google";
import "./globals.css";

const albert = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert",
  display: "swap",
});

const redHat = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-redhat",
  display: "swap",
});

const aclonica = Aclonica({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-aclonica",
  display: "swap",
});

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alata",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#dd1818",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Bus Buddy - Find Best Bus For You | Thangavelu",
  description: "Book bus tickets online with Bus Buddy. Secure payment, instant OTP, live seat selection, and instant boarding pass.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bus Buddy",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${albert.variable} ${redHat.variable} ${aclonica.variable} ${alata.variable}`}>
      <body className="antialiased min-h-screen bg-white text-black overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
