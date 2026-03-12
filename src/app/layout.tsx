import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/shared/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Scale Progresix - Toko Produk Digital",
    template: "%s | Scale Progresix",
  },
  description: "Scale Progresix adalah toko produk digital terpercaya. Temukan berbagai produk digital berkualitas untuk kebutuhan bisnis dan pengembangan Anda.",
  keywords: ["Produk Digital", "Toko Online", "Digital Product", "Scale Progresix", "Software", "Template", "E-Book", "UI Kit"],
  authors: [{ name: "Scale Progresix Team" }],
  creator: "Scale Progresix",
  publisher: "Scale Progresix",
  metadataBase: new URL("https://scaleprogresix.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Scale Progresix - Toko Produk Digital",
    description: "Toko produk digital terpercaya dengan berbagai pilihan berkualitas",
    type: "website",
    locale: "id_ID",
    siteName: "Scale Progresix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scale Progresix - Toko Produk Digital",
    description: "Toko produk digital terpercaya dengan berbagai pilihan berkualitas",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
