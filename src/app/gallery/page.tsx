"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
      <main className="bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background to-black/30 text-foreground">
          <div className="container text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">{t("gallery.hero.title")}</h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
              {t("gallery.hero.description")}
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="container">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`${
                    selectedCategory === cat.value
                      ? "bg-gradient-to-r from-[var(--primary)] to-[#E05A00] text-white"
                      : "bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--card)]/80 border border-[var(--border)]"
                  } px-6 py-2 rounded-full font-medium transition-colors`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20">
          <div className="container">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
              </div>
            ) : gallery.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[var(--muted-foreground)] text-lg">{t("gallery.noProjects")}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setOpenIndex(idx)}
                    className="group cursor-pointer bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden hover:shadow-xl hover:shadow-orange-500/15 transition-all"
                  >
                    <div className="grid grid-cols-2 gap-0.5 bg-black/30">
                      <div className="relative aspect-square bg-gradient-to-br from-red-500/10 to-orange-500/10">
                        {item.beforeImageUrl ? (
                          <img
                            src={normalizeUrl(item.beforeImageUrl)}
                            alt={`${getTitle(item)} - ${t("gallery.before")}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : null}
                        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase bg-black/60 text-white px-2 py-1 rounded">
                          {t("gallery.before")}
                        </span>
                      </div>
                      <div className="relative aspect-square bg-gradient-to-br from-green-500/10 to-blue-500/10">
                        {item.afterImageUrl ? (
                          <img
                            src={normalizeUrl(item.afterImageUrl)}
                            alt={`${getTitle(item)} - ${t("gallery.after")}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : null}
                        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase bg-black/60 text-white px-2 py-1 rounded">
                          {t("gallery.after")}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="text-xs font-semibold text-[var(--primary)] uppercase">
                        {item.category.replace("-", " ")}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{getTitle(item)}</h3>
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {getDescription(item)}
                      </p>
                    </div>
                  </div>
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