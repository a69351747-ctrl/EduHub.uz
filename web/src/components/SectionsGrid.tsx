"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Icon } from "./Icon";
import { sectionNav } from "@/lib/nav";

const colors: Record<string, string> = {
  preschool: "#ff6b35",
  students: "#2d7a4f",
  university: "#7c4dff",
  applicants: "#3b82f6",
  competitions: "#f5a623",
  games: "#e53935",
  iq: "#0ea5e9",
  languages: "#34c759",
};

export function SectionsGrid() {
  const { t } = useI18n();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {sectionNav.map((item) => {
        const color = colors[item.key] ?? "#2d7a4f";
        return (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <span
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: color }}
            >
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-extrabold">
              {t(`sections.${item.key}.title`)}
            </h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {t(`sections.${item.key}.desc`)}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
              {t("common.learnMore")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
