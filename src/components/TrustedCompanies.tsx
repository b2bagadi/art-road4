"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type TrustedCompany = {
  id: number;
  logoUrl: string;
  orderIndex: number;
  isActive: boolean;
};

export const TrustedCompanies = () => {
  const { t } = useLanguage();
  const [companies, setCompanies] = useState<TrustedCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/trusted-companies?isActive=true&sort=orderIndex&order=asc&limit=100");
        if (res.ok) {
          const data = await res.json();
          setCompanies(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Failed to fetch trusted companies:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading || companies.length === 0) {
    return null;
  }

  // Duplicate the companies array for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-16 overflow-hidden relative">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          {t("trustedCompanies.title")}
        </h2>

        {/* Marquee Container */}
        <div className="relative">
          {/* Enhanced Gradient Fade Edges - better visibility in both modes */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="flex overflow-hidden group">
            <div className="flex animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={`${company.id}-${index}`}
                  className="flex-shrink-0 mx-10 flex items-center justify-center min-w-[180px]"
                >
                  <img
                    src={company.logoUrl}
                    alt={`Company ${company.id}`}
                    className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};