"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { TrustedCompanies } from "@/components/TrustedCompanies";
import { HomeGallery } from "@/components/home/HomeGallery";

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
      } catch (e) {}
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
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background text-foreground">
        {/* Dynamic background image from settings - IMPROVED VISIBILITY IN LIGHT MODE */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url(${normalizeUrl(heroBg)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            opacity: 0.7,
            filter: "brightness(1.1) contrast(1.1)",
          }}
        />
        {/* Improved overlay gradient - fades from 80% to transparent */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-transparent" />
        <div className="container relative z-10 text-center space-y-8 py-20">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {t("home.hero.title")}
            <span className="block bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {t("home.hero.subtitle")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {t("home.hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/services"
              className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-semibold hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all flex items-center gap-2"
            >
              {t("home.hero.explore")}
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              {t("home.hero.quote")}
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Companies - Add after hero */}
      <TrustedCompanies />

      {/* Homepage Gallery from dashboard toggles (no heading) */}
      <HomeGallery />

      {/* Services Preview (dynamic favourites) */}
      <section className="py-20 bg-background">
        <div className="container space-y-12 animate-on-scroll">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">{t("home.services.title")}</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              {t("home.services.description")}
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {loadingFavs && (
              <div className="col-span-3 text-center text-foreground/70">{t("loading") || "Loading..."}</div>
            )}
            {!loadingFavs && favServices.length === 0 && (
              <div className="col-span-3 text-center text-foreground/70">{t("home.services.empty") || "No favourite services yet."}</div>
            )}
            {!loadingFavs && favServices.map((s) => (
              <div
                key={s.id}
                className="group bg-card border border-border rounded-xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--primary)]/15"
              >
                <div className="relative aspect-video bg-muted/30">
                  {s.imageUrl ? (
                    <img
                      src={normalizeUrl(s.imageUrl)}
                      alt={getTitle(s)}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">💡</div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-card-foreground">{getTitle(s)}</h3>
                  <p className="text-sm text-foreground/70 line-clamp-3">{getDesc(s)}</p>
                  <div className="font-semibold text-[var(--primary)]">
                    {`${t("home.services.from") || "À partir de"} ${s.priceStart ?? 0} ${s.currency || "MAD"}`}
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Link
                    href="/contact"
                    className="block w-full text-center px-4 py-3 bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors font-medium"
                  >
                    {t("home.services.requestQuote")}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg hover:scale-[1.02] hover:shadow-[0_0_18px_rgba(139,92,246,0.3)] transition-all"
            >
              {t("home.services.viewAll")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container animate-on-scroll">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-foreground">{t("home.why.title")}</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              {t("home.why.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t("home.why.expert"), desc: t("home.why.expert.desc") },
              { title: t("home.why.quality"), desc: t("home.why.quality.desc") },
              { title: t("home.why.custom"), desc: t("home.why.custom.desc") },
              { title: t("home.why.timely"), desc: t("home.why.timely.desc") }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-card rounded-lg border border-border text-center hover:border-[var(--primary)] transition-colors">
                <div className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent mb-2">
                  0{idx + 1}
                </div>
                <h3 className="font-semibold mb-2 text-card-foreground">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card text-card-foreground">
        <div className="container text-center space-y-8 animate-on-scroll">
          <h2 className="text-4xl font-bold">{t("home.cta.title")}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {t("home.cta.description")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-semibold hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all"
          >
            {t("home.cta.button")}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomeContent;