"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Award, Target, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { TrustedCompanies } from "@/components/TrustedCompanies";
import { motion } from "framer-motion";

type TeamMember = {
  id: number;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  photoUrl: string;
  orderIndex: number;
};

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [aboutArtRoadEn, setAboutArtRoadEn] = useState("");
  const [aboutArtRoadFr, setAboutArtRoadFr] = useState("");
  const [aboutArtRoadAr, setAboutArtRoadAr] = useState("");
  const [ourStoryEn, setOurStoryEn] = useState("");
  const [ourStoryFr, setOurStoryFr] = useState("");
  const [ourStoryAr, setOurStoryAr] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team");
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Failed to fetch team:", e);
      } finally {
        setLoadingTeam(false);
      }
    };

    const fetchAboutSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const aboutEn = data.find((s: any) => s.key === "about_art_road_en")?.value || "";
            const aboutFr = data.find((s: any) => s.key === "about_art_road_fr")?.value || "";
            const aboutAr = data.find((s: any) => s.key === "about_art_road_ar")?.value || "";
            const storyEn = data.find((s: any) => s.key === "our_story_en")?.value || "";
            const storyFr = data.find((s: any) => s.key === "our_story_fr")?.value || "";
            const storyAr = data.find((s: any) => s.key === "our_story_ar")?.value || "";

            setAboutArtRoadEn(aboutEn);
            setAboutArtRoadFr(aboutFr);
            setAboutArtRoadAr(aboutAr);
            setOurStoryEn(storyEn);
            setOurStoryFr(storyFr);
            setOurStoryAr(storyAr);
          }
        }
      } catch (e) {
        console.error("Failed to fetch about settings:", e);
      }
    };

    fetchTeam();
    fetchAboutSettings();
  }, []);

  const getName = (member: TeamMember) =>
    language === "fr" ? member.nameFr : language === "ar" ? member.nameAr : member.nameEn;

  const getAboutArtRoad = () =>
    language === "fr" ? aboutArtRoadFr : language === "ar" ? aboutArtRoadAr : aboutArtRoadEn;

  const getOurStory = () =>
    language === "fr" ? ourStoryFr : language === "ar" ? ourStoryAr : ourStoryEn;

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
                {t("about.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70">
                {t("about.hero.description")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Art Road Section */}
        {getAboutArtRoad() && (
          <section className="py-20 bg-background/50 backdrop-blur-sm">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-foreground">
                  {t("about.hero.title")}
                </h2>
                <div className="prose prose-lg mx-auto">
                  <p className="text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">
                    {getAboutArtRoad()}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Story Section */}
        <section className="py-20 bg-card/40 backdrop-blur-sm">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-foreground">
                {t("about.story.title")}
              </h2>
              <div className="prose prose-lg mx-auto">
                {getOurStory() ? (
                  <p className="text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">
                    {getOurStory()}
                  </p>
                ) : (
                  <>
                    <p className="text-lg text-foreground/70 leading-relaxed">
                      {t("about.story.p1")}
                    </p>
                    <p className="text-lg text-foreground/70 leading-relaxed">
                      {t("about.story.p2")}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trusted Companies - Add after story */}
        <TrustedCompanies />

        {/* Values Section with animated icons */}
        <section className="py-20 bg-background/50">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground"
            >
              {t("about.values.title")}
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: t("about.values.innovation"), desc: t("about.values.innovation.desc"), color: "from-[var(--primary)] to-blue-500" },
                { icon: Award, title: t("about.values.quality"), desc: t("about.values.quality.desc"), color: "from-[var(--accent)] to-pink-500" },
                { icon: Users, title: t("about.values.collaboration"), desc: t("about.values.collaboration.desc"), color: "from-yellow-500 to-orange-500" },
                { icon: Target, title: t("about.values.excellence"), desc: t("about.values.excellence.desc"), color: "from-green-500 to-teal-500" },
              ].map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                    className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}
                  >
                    <value.icon className="text-white" size={36} />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="text-foreground/70">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[var(--card)]">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                  500+
                </div>
                <div className="text-foreground font-semibold">{t("about.stats.projects")}</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                  100+
                </div>
                <div className="text-foreground font-semibold">{t("about.stats.clients")}</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                  50+
                </div>
                <div className="text-foreground font-semibold">{t("about.stats.team")}</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                  10+
                </div>
                <div className="text-foreground font-semibold">{t("about.stats.experience")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section - CENTERED LAYOUT */}
        {!loadingTeam && teamMembers.length > 0 && (
          <section className="py-20 bg-background">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">{t("about.team.title")}</h2>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                  {t("about.team.description")}
                </p>
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl hover:shadow-[var(--primary)]/15 transition-all"
                    >
                      <div className="aspect-square bg-muted/30 relative">
                        {member.photoUrl && (
                          <img
                            src={member.photoUrl}
                            alt={getName(member)}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-card-foreground">{getName(member)}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-[var(--card)]">
          <div className="container text-center space-y-8">
            <h2 className="text-4xl font-bold text-foreground">{t("about.cta.title")}</h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("about.cta.description")}
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg"
            >
              {t("about.cta.button")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}