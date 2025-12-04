"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Loader2, MessageCircle, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "next/navigation";

export default function ContactForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    serviceInterest: searchParams?.get("service") || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Contact settings from database
  const [contactInfo, setContactInfo] = useState({
    email: "info@artroad.ae",
    phone: "+971 4 123 4567",
    whatsapp: "971501234567",
    address: "Dubai Design District, Dubai, UAE",
    locationUrl: "https://maps.app.goo.gl/z3kkX3hSu3oaH9Cb7",
    logoUrl: "",
    googleMapsIframeCode: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      
      const settingsMap: any = {};
      if (Array.isArray(data)) {
        data.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value;
        });
      }

      setContactInfo({
        email: settingsMap.contact_email || "info@artroad.ae",
        phone: settingsMap.contact_phone || "+971 4 123 4567",
        whatsapp: settingsMap.contact_whatsapp || settingsMap.whatsapp_number || "971501234567",
        address: settingsMap.contact_address || "Dubai Design District, Dubai, UAE",
        locationUrl: settingsMap.contact_location_url || "https://maps.app.goo.gl/z3kkX3hSu3oaH9Cb7",
        logoUrl: settingsMap.logo_url || "",
        googleMapsIframeCode: settingsMap.google_maps_iframe_code || "",
      });
    } catch (error) {
      console.error("Failed to fetch contact settings:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const getWhatsAppUrl = () => {
    const whatsapp = contactInfo.whatsapp;
    if (whatsapp.startsWith('wa.link/') || whatsapp.startsWith('http')) {
      return whatsapp.startsWith('http') ? whatsapp : `https://${whatsapp}`;
    }
    return `https://wa.me/${whatsapp}`;
  };

  const getMapEmbedSrc = () => {
    const url = (contactInfo.locationUrl || "").trim();
    const addr = (contactInfo.address || "").trim();
    if (!url && !addr) return "";

    const lower = url.toLowerCase();
    if (lower.includes("/maps/embed")) return url;

    if (
      lower.includes("google.com/maps") ||
      lower.includes("maps.app.goo.gl") ||
      lower.includes("goo.gl")
    ) {
      return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(url)}`;
    }

    if (addr) return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(addr)}`;

    return "";
  };

  const buildMessage = () => {
    return `NEW QUOTE REQUEST - Art Road

👤 Client: ${formData.name}
📞 Phone: ${formData.phone}
✉️ Email: ${formData.email}
${formData.serviceInterest ? `🛠️ Service: ${formData.serviceInterest}\n` : ''}
💬 Message:
${formData.message}

Date: ${new Date().toLocaleString()}`;
  };

  const handleSendViaWhatsApp = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setError(t("contact.form.error") || "Please fill in all required fields");
      return;
    }

    const message = buildMessage();
    const whatsappUrl = getWhatsAppUrl();
    const finalUrl = whatsappUrl.includes("wa.me") 
      ? `${whatsappUrl}?text=${encodeURIComponent(message)}`
      : whatsappUrl;

    window.open(finalUrl, "_blank", "noopener,noreferrer");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSendViaEmail = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setError(t("contact.form.error") || "Please fill in all required fields");
      return;
    }

    const message = buildMessage();
    const subject = formData.serviceInterest 
      ? `Quote Request - ${formData.serviceInterest}` 
      : "Quote Request - Art Road";
    
    const mailtoUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        serviceInterest: "",
      });
    } catch (err) {
      setError(t("contact.form.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-black/30 text-foreground">
        <div className="container text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">{t("contact.hero.title")}</h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            {t("contact.hero.description")}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-foreground">{t("contact.form.title")}</h2>
              {success && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg">
                  {t("contact.form.success")}
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">{t("contact.form.name")} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-[var(--border)] text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">{t("contact.form.email")} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-[var(--border)] text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">{t("contact.form.phone")} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-[var(--border)] text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">{t("contact.form.service")}</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-[var(--border)] text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  >
                    <option value="">{t("contact.form.service.select")}</option>
                    <option value="LED Panel Installation">{t("contact.form.service.led")}</option>
                    <option value="3D Wall Decoration">{t("contact.form.service.3d")}</option>
                    <option value="Event Decoration">{t("contact.form.service.event")}</option>
                    <option value="Custom Signage">{t("contact.form.service.signage")}</option>
                    <option value="Lighting Design">{t("contact.form.service.lighting")}</option>
                    <option value="Other">{t("contact.form.service.other")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">{t("contact.form.message")} *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-[var(--border)] text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                    placeholder={t("contact.form.message.placeholder")}
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">Send your request via:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleSendViaWhatsApp}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle size={20} />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleSendViaEmail}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Send size={20} />
                      Email
                    </button>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] text-center">Or save to our database:</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t("contact.form.sending")}
                    </>
                  ) : (
                    t("contact.form.send")
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">{t("contact.info.title")}</h2>
                {settingsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">{t("contact.info.phone")}</h3>
                        <p className="text-[var(--muted-foreground)]">{contactInfo.phone}</p>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">{t("contact.info.phone.hours")}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">{t("contact.info.email")}</h3>
                        <p className="text-[var(--muted-foreground)]">{contactInfo.email}</p>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">{t("contact.info.email.note")}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">{t("contact.info.address")}</h3>
                        <p className="text-[var(--muted-foreground)] whitespace-pre-line">{contactInfo.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle size={28} />
                  <h3 className="text-xl font-semibold">{t("contact.whatsapp.title")}</h3>
                </div>
                <p className="mb-6 text-green-50">
                  {t("contact.whatsapp.description")}
                </p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                >
                  {t("contact.whatsapp.button")}
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps Section */}
          {!settingsLoading && (contactInfo.googleMapsIframeCode || contactInfo.locationUrl || contactInfo.address) && (
            <div className="mt-16 max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-foreground text-center">{t("contact.map.title") || "Find Us"}</h2>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
                {contactInfo.googleMapsIframeCode ? (
                  <div
                    className="w-full"
                    style={{ height: 450 }}
                    dangerouslySetInnerHTML={{ __html: contactInfo.googleMapsIframeCode }}
                  />
                ) : getMapEmbedSrc() ? (
                  <iframe
                    src={getMapEmbedSrc()}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  ></iframe>
                ) : (
                  <div className="p-6 text-center text-[var(--muted-foreground)]">Unable to display map. Please verify the embed code or address in dashboard.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
