"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[var(--charcoal)] text-white border-t border-gray-800">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
              Art Road
            </h3>
            <p className="text-sm text-gray-400">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-[var(--cyan)] transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/services" className="hover:text-[var(--cyan)] transition-colors">{t("nav.services")}</Link></li>
              <li><Link href="/gallery" className="hover:text-[var(--cyan)] transition-colors">{t("nav.gallery")}</Link></li>
              <li><Link href="/about" className="hover:text-[var(--cyan)] transition-colors">{t("nav.about")}</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--cyan)] transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{t("footer.services")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t("footer.services.led")}</li>
              <li>{t("footer.services.3d")}</li>
              <li>{t("footer.services.event")}</li>
              <li>{t("footer.services.signage")}</li>
              <li>{t("footer.services.lighting")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+971 4 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@artroad.ae</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Dubai Design District, UAE</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};