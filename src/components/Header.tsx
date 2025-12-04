"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

export const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoLightUrl, setLogoLightUrl] = useState("");
  const [logoDarkUrl, setLogoDarkUrl] = useState("");
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const { t, language } = useLanguage();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: "🏠" },
    { href: "/services", label: t("nav.services"), icon: "✨" },
    { href: "/gallery", label: t("nav.gallery"), icon: "🖼️" },
    { href: "/about", label: t("nav.about"), icon: "ℹ️" },
    { href: "/contact", label: t("nav.contact"), icon: "📧" },
  ];

  useEffect(() => {
    setMounted(true);

    const fetchLogos = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const data = await res.json();
        console.log("📸 Fetched settings data:", data);

        if (Array.isArray(data)) {
          const getVal = (key: string) => data.find((s: any) => s.key === key)?.value || "";

          const lightUrl = getVal("logo_url_light") || getVal("logoLightUrl") || "";
          const darkUrl = getVal("logo_url_dark") || getVal("logoDarkUrl") || "";

          console.log("🌞 Light Logo URL:", lightUrl);
          console.log("🌙 Dark Logo URL:", darkUrl);

          setLogoLightUrl(lightUrl);
          setLogoDarkUrl(darkUrl);
        }
      } catch (error) {
        console.error("Failed to fetch logos:", error);
      }
    };

    fetchLogos();

    // Scroll listener for enhanced header effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update current theme when theme changes
  useEffect(() => {
    if (mounted) {
      const currentThemeValue = (resolvedTheme || theme || "dark") as "dark" | "light";
      console.log("🎨 Current theme:", currentThemeValue);
      setCurrentTheme(currentThemeValue);
    }
  }, [theme, resolvedTheme, mounted]);

  // Determine which logo to show based on current theme
  const currentLogo = currentTheme === "light" ? logoLightUrl : logoDarkUrl;
  const fallbackLogo = logoLightUrl || logoDarkUrl;

  // Log which logo is being used
  useEffect(() => {
    if (mounted) {
      console.log("🖼️ Using logo:", currentTheme === "light" ? "LIGHT" : "DARK", "->", currentLogo || fallbackLogo);
    }
  }, [currentTheme, currentLogo, fallbackLogo, mounted]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-500",
        scrolled
          ? "border-[var(--border)] bg-background/70 backdrop-blur-2xl shadow-2xl shadow-primary/5"
          : "border-transparent bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85"
      )}
    >
      {/* Animated gradient line on top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <nav className="container relative flex h-16 items-center px-4 md:h-20">
        {/* Left: Logo - FIXED POSITION FOR RTL */}
        <div className="ltr:ml-3 rtl:mr-3 md:ltr:ml-8 md:rtl:mr-8 flex items-center space-x-2 ltr:pr-4 rtl:pl-4">
          <Link href="/" className="flex items-center group relative">
            {(currentLogo || fallbackLogo) ? (
              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <img
                  src={currentLogo || fallbackLogo}
                  alt="Art Road"
                  className="h-14 md:h-16 w-auto object-contain relative z-10"
                />
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ) : (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient"
              >
                Art Road
              </motion.span>
            )}
          </Link>
        </div>

        {/* Center: Desktop Navigation with enhanced hover effects */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 lg:gap-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={cn(
                  "relative px-4 py-2 rounded-xl transition-all duration-300",
                  pathname === link.href
                    ? "bg-gradient-to-r from-primary/20 to-accent/20"
                    : "hover:bg-primary/10"
                )}
              >
                <span className={cn(
                  "text-sm font-medium transition-all duration-300 flex items-center gap-2",
                  pathname === link.href
                    ? "text-[var(--primary)] font-semibold"
                    : "text-foreground/70 group-hover:text-[var(--primary)]"
                )}>
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </span>

                {/* Animated underline glow */}
                {pathname === link.href && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover glow effect */}
                <motion.span
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--primary)]/0 via-[var(--primary)]/10 to-[var(--accent)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Right: Language + Theme toggle - FIXED POSITION FOR RTL */}
        <div className="ltr:ml-auto rtl:mr-auto flex items-center gap-2 md:gap-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LanguageSwitcher />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ThemeToggle />
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "md:hidden p-2 rounded-lg border border-[var(--border)] transition-all duration-300",
              mobileMenuOpen
                ? "bg-primary/20 text-primary"
                : "bg-background/50 text-foreground hover:bg-primary/10"
            )}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navigation with enhanced staggered animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden overflow-hidden border-t border-[var(--border)] bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-2xl"
          >
            <div className="container py-6 flex flex-col items-center space-y-2">
              {/* Navigation Links with staggered animation */}
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="w-full"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 w-full",
                      pathname === link.href
                        ? "bg-gradient-to-r from-primary/20 to-accent/20 text-[var(--primary)] font-semibold"
                        : "text-foreground/70 hover:bg-primary/10 hover:text-foreground"
                    )}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-base font-medium">{link.label}</span>
                    {pathname === link.href && (
                      <Sparkles className="ml-auto w-4 h-4 text-primary" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};