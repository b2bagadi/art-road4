"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, X, ArrowRight } from "lucide-react";
import Link from "next/link";

type GalleryItem = {
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
};

const normalizeUrl = (url?: string) => {
  const u = (url || "").trim();
  if (!u) return "";
  if (/^(https?:)?\/\//i.test(u) || /^data:/i.test(u) || /^blob:/i.test(u) || u.startsWith("/")) return u;
  return `https://${u}`;
};

export const HomeGallery = () => {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchHomeGallery = async () => {
      try {
        const res = await fetch("/api/gallery?isActive=true&showOnHomepage=true&sort=orderIndex&order=asc&limit=100");
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        setItems([]);
      }
    };
    fetchHomeGallery();
  }, []);

  const getTitle = (item: GalleryItem) => (language === "fr" ? item.titleFr : language === "ar" ? item.titleAr : item.titleEn);
  const getDesc = (item: GalleryItem) => (language === "fr" ? item.descriptionFr : language === "ar" ? item.descriptionAr : item.descriptionEn);

  // Modal controls
  const closeModal = () => setOpenIndex(null);
  const nextItem = () => setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
  const prevItem = () => setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, items.length]);

  if (!items.length) return null;

  return (
    <section className="py-16 relative">
      <div className="container">
        {/* Intentionally no title to satisfy 'remove Our Gallery' heading request */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setOpenIndex(idx)}
              className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl hover:shadow-[var(--primary)]/10 transition-all"
            >
              <div className="grid grid-cols-2 gap-0.5 bg-black/20">
                <div className="relative aspect-square bg-gradient-to-br from-red-500/10 to-orange-500/10">
                  {item.beforeImageUrl && (
                    <img
                      src={normalizeUrl(item.beforeImageUrl)}
                      alt={`${getTitle(item)} - ${t("gallery.before")}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase bg-black/60 text-white px-2 py-1 rounded">
                    {t("gallery.before")}
                  </span>
                </div>
                <div className="relative aspect-square bg-gradient-to-br from-green-500/10 to-blue-500/10">
                  {item.afterImageUrl && (
                    <img
                      src={normalizeUrl(item.afterImageUrl)}
                      alt={`${getTitle(item)} - ${t("gallery.after")}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase bg-black/60 text-white px-2 py-1 rounded">
                    {t("gallery.after")}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-semibold text-[var(--primary)] uppercase mb-1">{item.category.replace("-", " ")}</div>
                <h3 className="text-lg font-bold text-foreground">{getTitle(item)}</h3>
                <p className="text-sm text-foreground/70 line-clamp-2">{getDesc(item)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all"
          >
            {t("home.gallery.viewAll") || "Go to gallery"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Modal */}
      {openIndex !== null && items[openIndex] && (
        <div onClick={closeModal} className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center px-4">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row items-stretch gap-0">
              <div className="relative md:w-1/2 w-full aspect-video bg-black">
                {items[openIndex].beforeImageUrl && (
                  <img
                    src={normalizeUrl(items[openIndex].beforeImageUrl)}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
                <span className="absolute top-3 left-3 text-xs font-semibold uppercase bg-black/60 text-white px-2 py-1 rounded">
                  {t("gallery.before")}
                </span>
              </div>
              <div className="relative md:w-1/2 w-full aspect-video bg-black">
                {items[openIndex].afterImageUrl && (
                  <img
                    src={normalizeUrl(items[openIndex].afterImageUrl)}
                    alt="After"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
                <span className="absolute top-3 left-3 text-xs font-semibold uppercase bg-black/60 text-white px-2 py-1 rounded">
                  {t("gallery.after")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-border">
              <button onClick={prevItem} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-card/80" aria-label="Previous">
                <ChevronLeft size={18} />
                Prev
              </button>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-foreground">{getTitle(items[openIndex])}</h4>
                <p className="text-xs text-foreground/60">{openIndex + 1} / {items.length}</p>
              </div>
              <button onClick={nextItem} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-card/80" aria-label="Next">
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGallery;
