import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Art Road - LED Panels & 3D Decoration Dubai",
  description: "Professional LED panel installation and 3D wall decoration services in Dubai",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import ServiceLedBackground from "@/components/ServiceLedBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ServiceLedBackground />
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
      <Script id="scroll-animations" strategy="afterInteractive">
        {`
          if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('animate-visible');
                }
              });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('.animate-on-scroll').forEach(el => {
                  observer.observe(el);
                });
              });
            } else {
              document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
              });
            }
          }
        `}
      </Script>
    </html>
  );
}