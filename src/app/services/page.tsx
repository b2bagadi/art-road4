"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState, useMemo } from "react";
import { Loader2, Lightbulb, Sparkles, Star, Wrench, Hammer, Brush, Palette, PanelsTopLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Service {
  id: number;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  descriptionEn: string;
  descriptionFr: string;
  descriptionAr: string;
  imageUrl: string;
  icon: string;
  priceStart?: number;
  currency?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  const normalizeUrl = (url?: string) => {
    const u = (url || "").trim();
    if (!u) return "";
    if (/^(https?:)?\/\//i.test(u) || /^data:/i.test(u) || /^blob:/i.test(u) || u.startsWith("/")) return u;
    return `https://${u}`;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services?isActive=true&limit=100&sort=orderIndex&order=asc");
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getTitle = (service: Service) => {
    if (language === "fr") return service.titleFr;
    if (language === "ar") return service.titleAr;
    return service.titleEn;
  };

  const getDescription = (service: Service) => {
    if (language === "fr") return service.descriptionFr;
    if (language === "ar") return service.descriptionAr;
    return service.descriptionEn;
  };

  const iconMap = useMemo(() => ({
    lightbulb: Lightbulb,
    sparkles: Sparkles,
    star: Star,
    wrench: Wrench,
    hammer: Hammer,
    brush: Brush,
    palette: Palette,
    panelstopleft: PanelsTopLeft,
    image: ImageIcon,
  }), []);

  const renderIcon = (name?: string, size = 20) => {
    if (!name) return null;
    const key = name.replace(/[\s_-]+/g, "").toLowerCase();
    const IconComp = (iconMap as any)[key] || Lightbulb;
    return <IconComp size={size} className="text-[var(--primary)]" />;
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen">
        {/* Unified animated background for entire page */}
        <div className="fixed inset-0 -z-10 bg-background">
          {/* Multiple moving gradient orbs for depth */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 20%, var(--primary) 0%, transparent 40%), radial-gradient(circle at 80% 80%, var(--accent) 0%, transparent 40%)",
                "radial-gradient(circle at 80% 30%, var(--accent) 0%, transparent 40%), radial-gradient(circle at 20% 70%, var(--primary) 0%, transparent 40%)",
                "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 40%), radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 40%)",
                "radial-gradient(circle at 20% 20%, var(--primary) 0%, transparent 40%), radial-gradient(circle at 80% 80%, var(--accent) 0%, transparent 40%)",
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: 0.15 }}
          />

          {/* Flowing wave gradient */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(120deg, transparent 0%, var(--primary) 50%, transparent 100%)",
                "linear-gradient(240deg, transparent 0%, var(--accent) 50%, transparent 100%)",
                "linear-gradient(120deg, transparent 0%, var(--primary) 50%, transparent 100%)",
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: 0.1 }}
          />
        </div>

        {/* Hero Section with animation */}
        <section className="relative py-24">
          {/* Floating gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-1/4 w-64 h-64 bg-[var(--primary)]/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-1/4 w-72 h-72 bg-[var(--accent)]/20 rounded-full blur-3xl"
            />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6 max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                {t("services.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70">
                {t("services.hero.description")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid with glassmorphism cards */}
        <section className="py-20 relative">
          <div className="container">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, rotateX: 2, rotateY: 2 }}
                    className="group relative bg-card/40 backdrop-blur-xl border-2 border-border/50 rounded-2xl overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/20 transition-all"
                  >
                    {/* Glassmorphic glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 via-transparent to-[var(--accent)]/0 group-hover:from-[var(--primary)]/10 group-hover:to-[var(--accent)]/10 transition-all duration-500" />

                    {service.imageUrl ? (
                      <div className="relative aspect-video bg-muted/20 overflow-hidden">
                        <img
                          src={normalizeUrl(service.imageUrl)}
                          alt={getTitle(service)}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {/* Image overlay for better visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-6xl group-hover:scale-110 transition-transform">💡</div>
                      </div>
                    )}

                    <div className="relative p-6 space-y-4 bg-card/60 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.5 }}
                        >
                          {renderIcon(service.icon, 26)}
                        </motion.div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-[var(--primary)] transition-colors">
                          {getTitle(service)}
                        </h3>
                      </div>
                      <p className="text-foreground/70 leading-relaxed">
                        {getDescription(service)}
                      </p>
                      <div className="font-bold text-lg text-[var(--primary)]">
                        {`${t("services.from") || "À partir de"} ${service.priceStart ?? 0} ${service.currency || "MAD"}`}
                      </div>
                    </div>

                    <div className="relative p-6 pt-0 bg-card/60 backdrop-blur-sm">
                      <Link
                        href={`/contact?service=${encodeURIComponent(getTitle(service))}`}
                        className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-[var(--primary)]/30 transition-all font-medium"
                      >
                        {t("services.requestQuote") || "Request Quote"}
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section with animation */}
        <section className="py-24 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-card/60 backdrop-blur-xl border-2 border-border/50 rounded-3xl p-12 text-center space-y-6 overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--accent)]/10 -z-10" />

              <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t("services.custom.title")}</h2>
              <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
                {t("services.custom.description")}
              </p>
              <Link
                href="/contact"
                className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-[var(--primary)]/40 transition-all text-lg"
              >
                {t("services.custom.button")}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}