"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { MathPuzzle } from "./MathPuzzle";
import { MemoryMatrix } from "./MemoryMatrix";
import { ColorMatch } from "./ColorMatch";
import { QuickQuiz } from "./QuickQuiz";
import { Icon } from "@/components/Icon";
import type { GameSlug } from "@/lib/games";

const registry: Record<GameSlug, React.ComponentType> = {
  "math-puzzle": MathPuzzle,
  "memory-matrix": MemoryMatrix,
  "color-match": ColorMatch,
  "quick-quiz": QuickQuiz,
};

const meta: Record<GameSlug, { index: number; icon: string; color: string }> = {
  "math-puzzle": { index: 0, icon: "Calculator", color: "#2d7a4f" },
  "memory-matrix": { index: 1, icon: "Brain", color: "#7c4dff" },
  "color-match": { index: 2, icon: "Palette", color: "#ff6b35" },
  "quick-quiz": { index: 3, icon: "Lightbulb", color: "#f5a623" },
};

export function GamePlayer({ slug }: { slug: GameSlug }) {
  const { t } = useI18n();
  const Game = registry[slug];
  const m = meta[slug];

  if (!Game) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="text-muted">404</p>
        <Link href="/games" className="text-primary">
          {t("common.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      <Link
        href="/games"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {t("nav.games")}
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: m.color }}
        >
          <Icon name={m.icon} className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-black">{t(`games.list.${m.index}.title`)}</h1>
      </div>
      <div className="rounded-3xl border bg-surface p-6 shadow-sm sm:p-8">
        <Game />
      </div>
    </div>
  );
}
