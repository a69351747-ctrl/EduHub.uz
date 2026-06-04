"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Container, Section, SectionHeading, Button, Badge, Card } from "@/components/ui";
import { SectionsGrid } from "@/components/SectionsGrid";
import { Icon } from "@/components/Icon";

interface Feature {
  icon: string;
  title: string;
  text: string;
}

export default function Home() {
  const { t, tr } = useI18n();
  const features = tr<Feature[]>("home.features") ?? [];

  const stats = [
    { value: "50K+", label: t("home.statsUsers") },
    { value: "1200+", label: t("home.statsLessons") },
    { value: "40+", label: t("home.statsGames") },
    { value: "60+", label: t("home.statsUniversities") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <Container className="relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
          <div className="animate-fade-up">
            <Badge className="border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {t("home.heroBadge")}
            </Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
              {t("home.heroTitle1")}{" "}
              <span className="text-primary">{t("home.heroTitleHi")}</span>{" "}
              {t("home.heroTitle2")}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted leading-relaxed">
              {t("home.heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/pricing" size="lg">
                {t("home.ctaPrimary")}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="#sections" variant="outline" size="lg">
                <Play className="h-5 w-5" />
                {t("home.ctaSecondary")}
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="grid grid-cols-2 gap-4">
              {["Bot", "Gamepad2", "Trophy", "GraduationCap"].map((ic, i) => (
                <div
                  key={ic}
                  className={`rounded-3xl border bg-surface p-6 shadow-sm ${
                    i % 2 === 0 ? "translate-y-4" : ""
                  }`}
                >
                  <span
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{
                      backgroundColor: ["#2d7a4f", "#ff6b35", "#f5a623", "#7c4dff"][i],
                    }}
                  >
                    <Icon name={ic} className="h-6 w-6" />
                  </span>
                  <p className="font-extrabold">{features[i]?.title}</p>
                  <p className="mt-1 text-xs text-muted">{features[i]?.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-y bg-surface">
        <Container className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-primary sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </Container>
      </section>

      {/* Sections */}
      <Section id="sections">
        <SectionHeading
          title={t("home.sectionsTitle")}
          subtitle={t("home.sectionsSubtitle")}
        />
        <SectionsGrid />
      </Section>

      {/* Why */}
      <section className="bg-surface-2/40">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            title={t("home.whyTitle")}
            subtitle={t("home.whySubtitle")}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title}>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-extrabold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{f.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <Section>
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-white sm:px-12">
          <h2 className="text-3xl font-black sm:text-4xl">
            {t("home.ctaBandTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            {t("home.ctaBandText")}
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-primary transition hover:bg-white/90"
            >
              {t("home.ctaPrimary")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
