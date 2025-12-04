"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { TrustedCompanies } from "@/components/TrustedCompanies";
import { HomeGallery } from "@/components/home/HomeGallery";
import { motion, useScroll, useTransform } from "framer-motion";

type FavService = {
  id: number;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  descriptionEn: string;
  descriptionFr: string;
  descriptionAr: string;
  imageUrl: string;
  icon: string;
  priceStart: number;
  currency: string;
};

export const HomeContent = () => {
  const { t, language } = useLanguage();
  const [heroBg, setHeroBg] = useState<string>(
    "https://i.postimg.cc/N0zW7BDJ/a-need-to-put-my-logo.png"
  );
  const [favServices, setFavServices] = useState<FavService[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    // Fetch hero background URL from settings
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const heroBgSetting = data.find((s: any) => s.key === "hero_background_url" || s.key === "hero_bg_url" || s.key === "heroBgUrl");
            if (heroBgSetting?.value) setHeroBg(heroBgSetting.value);
          }
        }
      } catch (e) { }
    };

    // Fetch favourite services for homepage
    const fetchFavs = async () => {
      setLoadingFavs(true);
      try {
        const res = await fetch(
          "/api/services?isActive=true&isFavourite=true&limit=6&sort=orderIndex&order=asc"
        );
        const data = await res.json();
        setFavServices(Array.isArray(data) ? data : []);
      } catch (e) {
        setFavServices([]);
      } finally {
        setLoadingFavs(false);
      }
    };

    fetchHero();
    fetchFavs();
  }, []);

  const normalizeUrl = (url?: string) => {
    const u = (url || "").trim();
    if (!u) return "";
    if (/^(https?:)?\/\//i.test(u) || /^data:/i.test(u) || /^blob:/i.test(u) || u.startsWith("/")) return u;
    return `https://${u}`;
  };

  const getTitle = (s: FavService) => (language === "fr" ? s.titleFr : language === "ar" ? s.titleAr : s.titleEn);
  const getDesc = (s: FavService) => (language === "fr" ? s.descriptionFr : language === "ar" ? s.descriptionAr : s.descriptionEn);

  return (
    <main className="min-h-screen relative">
      {/* Unified animated background for entire page (below hero) */}
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

      {/* Hero Section with parallax background image */}
      <motion.div
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Parallax background image - only in hero */}
        <motion.div
          style={{ y: y }}
          className="absolute inset-0 -z-20"
        >
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${normalizeUrl(heroBg)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
          {/* Theme-aware overlay - light mode much more transparent to show background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/0 to-background/30 dark:from-background/90 dark:via-background/50 dark:to-background" />
        </motion.div>

        {/* Floating gradient orbs - only in hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -80, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-1/4 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -120, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-1/4 w-[28rem] h-[28rem] bg-[var(--accent)]/20 rounded-full blur-3xl"
          />
        </div>

        {/* Hero Content with fade-in animation */}
        <div className="container relative z-10 text-center space-y-8 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold leading-tight text-black dark:text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
          >
            {t("home.hero.title")}
            <span className="block bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {t("home.hero.subtitle")}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-black dark:text-white max-w-3xl mx-auto drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]"
          >
            {t("home.hero.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              href="/services"
              className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all"
            >
              {t("home.hero.explore")}
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 hover:scale-105 transition-all"
            >
              {t("home.hero.quote")}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* All sections below with unified background - no individual backgrounds */}
      {/* Trusted Companies */}
      <TrustedCompanies />

      {/* Homepage Gallery */}
      <HomeGallery />

      {/* Services Preview */}
      <section className="py-20 relative">
        <div className="container space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t("home.services.title")}</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              {t("home.services.description")}
            </p>
          </motion.div>

          {/* Cards with stagger animation */}
          <div className="grid md:grid-cols-3 gap-8">
            {loadingFavs && (
              <div className="col-span-3 text-center text-foreground/70">{t("loading") || "Loading..."}</div>
            )}
            {!loadingFavs && favServices.length === 0 && (
              <div className="col-span-3 text-center text-foreground/70">{t("home.services.empty") || "No favourite services yet."}</div>
            )}
            {!loadingFavs && favServices.map((s, index) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-card/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden transition-all hover:-translate-y-3 hover:shadow-2xl hover:shadow-[var(--primary)]/20"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--accent)]/0 group-hover:from-[var(--primary)]/10 group-hover:to-[var(--accent)]/10 transition-all duration-300 pointer-events-none" />

                <div className="relative aspect-video bg-muted/30">
                  {s.imageUrl ? (
                    <img
                      src={normalizeUrl(s.imageUrl)}
                      alt={getTitle(s)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">💡</div>
                  )}
                  {/* Image overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                </div>
                <div className="relative p-6 space-y-3">
                  <h3 className="text-xl font-bold text-card-foreground group-hover:text-[var(--primary)] transition-colors">{getTitle(s)}</h3>
                  <p className="text-sm text-foreground/70 line-clamp-3">{getDesc(s)}</p>
                  <div className="font-semibold text-[var(--primary)]">
                    {`${t("home.services.from") || "À partir de"} ${s.priceStart ?? 0} ${s.currency || "MAD"}`}
                  </div>
                </div>
                <div className="relative p-4 pt-0">
                  <Link
                    href="/contact"
                    className="block w-full text-center px-4 py-3 bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all font-medium group-hover:scale-105"
                  >
                    {t("home.services.requestQuote")}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all"
            >
              {t("home.services.viewAll")}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t("home.why.title")}</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              {t("home.why.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t("home.why.expert"), desc: t("home.why.expert.desc") },
              { title: t("home.why.quality"), desc: t("home.why.quality.desc") },
              { title: t("home.why.custom"), desc: t("home.why.custom.desc") },
              { title: t("home.why.timely"), desc: t("home.why.timely.desc") }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border text-center hover:border-[var(--primary)] hover:-translate-y-2 transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent mb-2"
                >
                  0{idx + 1}
                </motion.div>
                <h3 className="font-semibold mb-2 text-card-foreground group-hover:text-[var(--primary)] transition-colors">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container text-center space-y-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold"
          >
            {t("home.cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-foreground/70 max-w-2xl mx-auto"
          >
            {t("home.cta.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all"
            >
              {t("home.cta.button")}
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default HomeContent;