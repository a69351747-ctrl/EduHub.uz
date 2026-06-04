"use client";

import Link from "next/link";
import { Backpack, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/dictionaries";
import { Section, SectionHeading, Badge } from "@/components/ui";
import { Icon } from "@/components/Icon";

const CONTENT: Record<Locale, { icon: string; title: string; text: string; href: string; color: string }[]> = {
  uz: [
    { icon: "BookOpen", title: "Kutubxona", text: "Sinflar bo'yicha darsliklar va qo'shimcha materiallar.", href: "/students", color: "#2d7a4f" },
    { icon: "Presentation", title: "Prezentatsiyalar", text: "Tayyor va AI yordamida yaratiladigan taqdimotlar.", href: "/university", color: "#7c4dff" },
    { icon: "Bot", title: "AI bilan o'rganish", text: "Murakkab mavzularni oson tushuntirish va layfhaklar.", href: "/students", color: "#3b82f6" },
    { icon: "Trophy", title: "Musobaqalar", text: "Olimpiada va musobaqalarda qatnashing.", href: "/competitions", color: "#f5a623" },
    { icon: "Target", title: "Kasb tanlash", text: "Test va o'yin orqali kelajak kasbni aniqlash.", href: "/students", color: "#ff6b35" },
    { icon: "Gamepad2", title: "Ta'limiy o'yinlar", text: "Fanlarni o'yin orqali qiziqarli o'rganing.", href: "/games", color: "#e53935" },
  ],
  ru: [
    { icon: "BookOpen", title: "Библиотека", text: "Учебники и доп. материалы по классам.", href: "/students", color: "#2d7a4f" },
    { icon: "Presentation", title: "Презентации", text: "Готовые и создаваемые ИИ презентации.", href: "/university", color: "#7c4dff" },
    { icon: "Bot", title: "Обучение с ИИ", text: "Простое объяснение сложных тем и лайфхаки.", href: "/students", color: "#3b82f6" },
    { icon: "Trophy", title: "Конкурсы", text: "Участвуйте в олимпиадах и конкурсах.", href: "/competitions", color: "#f5a623" },
    { icon: "Target", title: "Выбор профессии", text: "Определение будущей профессии через тесты.", href: "/students", color: "#ff6b35" },
    { icon: "Gamepad2", title: "Обучающие игры", text: "Изучайте предметы через игру.", href: "/games", color: "#e53935" },
  ],
  en: [
    { icon: "BookOpen", title: "Library", text: "Textbooks and extra materials by grade.", href: "/students", color: "#2d7a4f" },
    { icon: "Presentation", title: "Presentations", text: "Ready-made and AI-generated presentations.", href: "/university", color: "#7c4dff" },
    { icon: "Bot", title: "Learn with AI", text: "Simple explanations of hard topics and tips.", href: "/students", color: "#3b82f6" },
    { icon: "Trophy", title: "Competitions", text: "Join olympiads and contests.", href: "/competitions", color: "#f5a623" },
    { icon: "Target", title: "Career choice", text: "Find your future profession via tests.", href: "/students", color: "#ff6b35" },
    { icon: "Gamepad2", title: "Educational games", text: "Learn subjects through play.", href: "/games", color: "#e53935" },
  ],
};

export default function StudentsPage() {
  const { t, locale } = useI18n();
  const items = CONTENT[locale];

  return (
    <Section>
      <div className="mb-8 text-center">
        <Badge className="border-primary/30 bg-primary/10 text-primary">
          <Backpack className="h-3.5 w-3.5" /> {t("sections.students.title")}
        </Badge>
      </div>
      <SectionHeading title={t("sections.students.title")} subtitle={t("sections.students.desc")} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className="group rounded-2xl border bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <span
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: it.color }}
            >
              <Icon name={it.icon} className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-extrabold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{it.text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
              {t("common.learnMore")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
