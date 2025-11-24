"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Award, Target, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { TrustedCompanies } from "@/components/TrustedCompanies";

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
      <main className="bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-[var(--card)] to-background">
          <div className="container text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              {t("about.hero.title")}
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
              {t("about.hero.description")}
            </p>
          </div>
        </section>

        {/* About Art Road Section */}
        {getAboutArtRoad() && (
          <section className="py-20 bg-background">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-8 text-foreground">
                  {t("about.hero.title")}
                </h2>
                <div className="prose prose-lg mx-auto">
                  <p className="text-lg text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">
                    {getAboutArtRoad()}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Story Section */}
        <section className="py-20 bg-[var(--card)]">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold text-center mb-8 text-foreground">
                {t("about.story.title")}
              </h2>
              <div className="prose prose-lg mx-auto">
                {getOurStory() ? (
                  <p className="text-lg text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">
                    {getOurStory()}
                  </p>
                ) : (
                  <>
                    <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
                      {t("about.story.p1")}
                    </p>
                    <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
                      {t("about.story.p2")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Companies - Add after story */}
        <TrustedCompanies />

        {/* Values Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
              {t("about.values.title")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t("about.values.innovation")}</h3>
                <p className="text-[var(--muted-foreground)]">
                  {t("about.values.innovation.desc")}
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t("about.values.quality")}</h3>
                <p className="text-[var(--muted-foreground)]">
                  {t("about.values.quality.desc")}
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t("about.values.collaboration")}</h3>
                <p className="text-[var(--muted-foreground)]">
                  {t("about.values.collaboration.desc")}
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                  <Target className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t("about.values.excellence")}</h3>
                <p className="text-[var(--muted-foreground)]">
                  {t("about.values.excellence.desc")}
                </p>
              </div>
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