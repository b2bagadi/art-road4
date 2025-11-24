"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";

export const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoLightUrl, setLogoLightUrl] = useState("");
  const [logoDarkUrl, setLogoDarkUrl] = useState("");
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  const { t, language } = useLanguage();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (Array.isArray(data)) {
          const getVal = (key: string) => data.find((s: any) => s.key === key)?.value || "";

          setLogoLightUrl(getVal("logo_url_light") || getVal("logoLightUrl") || "");
          setLogoDarkUrl(getVal("logo_url_dark") || getVal("logoDarkUrl") || "");
        }
      } catch (error) {
        console.error("Failed to fetch logos:", error);
      }
    };

    fetchLogos();

    // Listen to theme changes
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme") as "dark" | "light" || "dark";
      setCurrentTheme(theme);
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });

    return () => observer.disconnect();
  }, []);

  // Determine which logo to show based on current theme
  const currentLogo = currentTheme === "light" ? logoLightUrl : logoDarkUrl;
  const fallbackLogo = logoLightUrl || logoDarkUrl;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <nav className="container relative flex h-16 items-center px-4 md:h-20">
        {/* Left: Logo - FIXED POSITION FOR RTL */}
        <div className="ltr:ml-3 rtl:mr-3 md:ltr:ml-8 md:rtl:mr-8 flex items-center space-x-2 ltr:pr-4 rtl:pl-4">
          <Link href="/" className="flex items-center">
            {(currentLogo || fallbackLogo) ? (
              <img
                src={currentLogo || fallbackLogo}
                alt="Art Road"
                className="h-14 md:h-16 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                Art Road
              </span>
            )}
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[var(--primary)]",
                pathname === link.href ? "text-[var(--primary)]" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Language + Theme toggle - FIXED POSITION FOR RTL */}
        <div className="ltr:ml-auto rtl:mr-auto flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground ml-2"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation with drop-down animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden overflow-hidden border-b border-[var(--border)] bg-background"
          >
            <div className="container py-6 flex flex-col items-center space-y-4">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-base font-medium transition-colors",
                    pathname === link.href ? "text-[var(--primary)]" : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};