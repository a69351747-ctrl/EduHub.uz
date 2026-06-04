"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Section, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/Icon";

interface GameItem {
  slug: string;
  title: string;
  desc: string;
  category: "preschool" | "students" | "university";
  icon: string;
  color: string;
}

type Cat = "all" | "preschool" | "students" | "university";

export default function GamesPage() {
  const { t, tr } = useI18n();
  const games = tr<GameItem[]>("games.list") ?? [];
  const [cat, setCat] = useState<Cat>("all");

  const cats: Cat[] = ["all", "preschool", "students", "university"];
  const filtered = cat === "all" ? games : games.filter((g) => g.category === cat);

  return (
    <Section>
      <SectionHeading title={t("games.title")} subtitle={t("games.subtitle")} />

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
              cat === c
                ? "border-primary bg-primary text-white"
                : "bg-surface hover:bg-surface-2"
            }`}
          >
            {t(`games.categories.${c}`)}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => (
          <Link
            key={g.slug}
            href={`/games/${g.slug}`}
            className="group rounded-2xl border bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <span
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: g.color }}
            >
              <Icon name={g.icon} className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-extrabold">{g.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{g.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              <Play className="h-4 w-4" /> {t("games.play")}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
