"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState, useMemo } from "react";
import { Loader2, Lightbulb, Sparkles, Star, Wrench, Hammer, Brush, Palette, PanelsTopLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

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
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background to-black/30 text-foreground">
          <div className="container text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">{t("services.hero.title")}</h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
              {t("services.hero.description")}
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="group bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--primary)]/15 transition-all"
                  >
                    {service.imageUrl ? (
                      <div className="relative aspect-video bg-black">
                        <img
                          src={normalizeUrl(service.imageUrl)}
                          alt={getTitle(service)}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center">
                        <div className="text-6xl">💡</div>
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        {renderIcon(service.icon, 22)}
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-[var(--primary)] transition-colors">
                          {getTitle(service)}
                        </h3>
                      </div>
                      <p className="text-[var(--muted-foreground)]">
                        {getDescription(service)}
                      </p>
                      <div className="font-semibold text-[var(--primary)]">
                        {`${t("services.from") || "À partir de"} ${service.priceStart ?? 0} ${service.currency || "MAD"}`}
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <Link
                        href={`/contact?service=${encodeURIComponent(getTitle(service))}`}
                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg hover:scale-[1.02] transition-transform font-medium"
                      >
                        {t("services.requestQuote") || "Request Quote"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[var(--card)]">
          <div className="container text-center space-y-6">
            <h2 className="text-4xl font-bold text-foreground">{t("services.custom.title")}</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("services.custom.description")}
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-semibold hover:scale-[1.02] transition-transform"
            >
              {t("services.custom.button")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}