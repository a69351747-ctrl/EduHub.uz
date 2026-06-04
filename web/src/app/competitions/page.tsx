"use client";

import { Trophy, Users, Gift, Clock } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Section, SectionHeading, Button, Badge } from "@/components/ui";

interface Comp {
  slug: string;
  title: string;
  grade: string;
  prize: string;
  duration: string;
  color: string;
}

export default function CompetitionsPage() {
  const { t, tr } = useI18n();
  const list = tr<Comp[]>("competitions.list") ?? [];

  return (
    <Section>
      <div className="mb-8 text-center">
        <Badge className="border-secondary/40 bg-secondary/10 text-[#9a6b00]">
          <Trophy className="h-3.5 w-3.5" /> {t("nav.competitions")}
        </Badge>
      </div>
      <SectionHeading title={t("competitions.title")} subtitle={t("competitions.subtitle")} />

      <div className="grid gap-6 sm:grid-cols-2">
        {list.map((c) => (
          <div
            key={c.slug}
            className="overflow-hidden rounded-3xl border bg-surface shadow-sm transition hover:shadow-md"
          >
            <div className="h-2" style={{ backgroundColor: c.color }} />
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-extrabold">{c.title}</h3>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: c.color }}
                >
                  <Trophy className="h-5 w-5" />
                </span>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-muted" />
                  <span className="text-muted">{t("competitions.grade")}:</span>
                  <span className="font-bold">{c.grade}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Gift className="h-4 w-4 text-muted" />
                  <span className="text-muted">{t("competitions.prize")}:</span>
                  <span className="font-bold">{c.prize}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-muted" />
                  <span className="text-muted">{t("competitions.duration")}:</span>
                  <span className="font-bold">{c.duration}</span>
                </div>
              </dl>
              <Button href="/login" className="mt-6 w-full">
                {t("competitions.join")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
