"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: number;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  descriptionEn: string;
  descriptionFr: string;
  descriptionAr: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  category: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { t, language } = useLanguage();

  // Modal state for before/after preview
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    { value: "all", label: t("gallery.filter.all") },
    { value: "led-panels", label: t("gallery.filter.led") },
    { value: "3d-decoration", label: t("gallery.filter.3d") },
    { value: "events", label: t("gallery.filter.events") },
    { value: "other", label: t("gallery.filter.other") },
  ];

  const normalizeUrl = (url?: string) => {
    const u = (url || "").trim();
    if (!u) return "";
    if (/^(https?:)?\/\//i.test(u) || /^data:/i.test(u) || /^blob:/i.test(u) || u.startsWith("/")) return u;
    return `https://${u}`;
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const url = selectedCategory === "all"
          ? "/api/gallery?limit=100&sort=orderIndex&order=asc"
          : `/api/gallery?category=${selectedCategory}&limit=100&sort=orderIndex&order=asc`;
        const response = await fetch(url);
        const data = await response.json();
        setGallery(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        setGallery([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [selectedCategory]);

  const getTitle = (item: GalleryItem) => {
    if (language === "fr") return item.titleFr;
    if (language === "ar") return item.titleAr;
    return item.titleEn;
  };

  const getDescription = (item: GalleryItem) => {
    if (language === "fr") return item.descriptionFr;
    if (language === "ar") return item.descriptionAr;
    return item.descriptionEn;
  };

  // Modal controls
  const closeModal = () => setOpenIndex(null);
  const nextItem = () => setOpenIndex((i) => (i === null ? i : (i + 1) % gallery.length));
  const prevItem = () => setOpenIndex((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
    };
    document.addEventListener("keydown", onKeyDown);

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, gallery.length]);

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
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6 max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                {t("gallery.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70">
                {t("gallery.hero.description")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter with animations */}
        <section className="py-8 border-b border-border/50 backdrop-blur-sm bg-background/50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              {categories.map((cat, index) => (
                <motion.button
                  key={cat.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`${selectedCategory === cat.value
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/30"
                    : "bg-card/60 backdrop-blur-sm text-foreground/70 hover:bg-card border border-border/50"
                    } px-6 py-3 rounded-full font-medium transition-all`}
                >
                  {cat.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Gallery Grid with animations */}
        <section className="py-20 relative">
          <div className="container">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
              </div>
            ) : gallery.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-foreground/70 text-lg">{t("gallery.noProjects")}</p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    onClick={() => setOpenIndex(idx)}
                    className="group cursor-pointer relative bg-card/60 backdrop-blur-sm border-2 border-border/50 rounded-2xl overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/20 transition-all"
                  >
                    {/* Glassmorphic glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--accent)]/0 group-hover:from-[var(--primary)]/10 group-hover:to-[var(--accent)]/10 transition-all duration-500 pointer-events-none z-10" />

                    <div className="grid grid-cols-2 gap-1 bg-background/20">
                      <div className="relative aspect-square overflow-hidden">
                        {item.beforeImageUrl ? (
                          <img
                            src={normalizeUrl(item.beforeImageUrl)}
                            alt={`${getTitle(item)} - ${t("gallery.before")}`}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 text-xs font-bold uppercase bg-black/70 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                          {t("gallery.before")}
                        </span>
                      </div>
                      <div className="relative aspect-square overflow-hidden">
                        {item.afterImageUrl ? (
                          <img
                            src={normalizeUrl(item.afterImageUrl)}
                            alt={`${getTitle(item)} - ${t("gallery.after")}`}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 text-xs font-bold uppercase bg-black/70 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                          {t("gallery.after")}
                        </span>
                      </div>
                    </div>
                    <div className="relative p-6 space-y-2 bg-card/80 backdrop-blur-sm">
                      <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-wide">
                        {item.category.replace("-", " ")}
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-[var(--primary)] transition-colors">{getTitle(item)}</h3>
                      <p className="text-sm text-foreground/70 line-clamp-2">
                        {getDescription(item)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Before/After Modal */}
      {openIndex !== null && gallery[openIndex] && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[90vh] bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row items-stretch gap-0">
              <div className="relative md:w-1/2 w-full aspect-video bg-black">
                {gallery[openIndex].beforeImageUrl && (
                  <img
                    src={normalizeUrl(gallery[openIndex].beforeImageUrl)}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
                <span className="absolute top-3 left-3 text-xs font-semibold uppercase bg-black/60 text-white px-2 py-1 rounded">
                  {t("gallery.before")}
                </span>
              </div>
              <div className="relative md:w-1/2 w-full aspect-video bg-black">
                {gallery[openIndex].afterImageUrl && (
                  <img
                    src={normalizeUrl(gallery[openIndex].afterImageUrl)}
                    alt="After"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
                <span className="absolute top-3 left-3 text-xs font-semibold uppercase bg-black/60 text-white px-2 py-1 rounded">
                  {t("gallery.after")}
                </span>
              </div>
            </div>

            {/* Title and navigation */}
            <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
              <button
                onClick={prevItem}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-foreground hover:bg-[var(--card)]/80"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
                Prev
              </button>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-foreground">{getTitle(gallery[openIndex])}</h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {openIndex + 1} / {gallery.length}
                </p>
              </div>
              <button
                onClick={nextItem}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-foreground hover:bg-[var(--card)]/80"
                aria-label="Next"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}