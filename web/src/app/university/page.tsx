"use client";

import { GraduationCap, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Section, SectionHeading, Card, Badge } from "@/components/ui";
import { Icon } from "@/components/Icon";

interface Tool {
  icon: string;
  title: string;
  text: string;
}

export default function UniversityPage() {
  const { t, tr } = useI18n();
  const tools = tr<Tool[]>("university.tools") ?? [];

  return (
    <Section>
      <div className="mb-8 text-center">
        <Badge className="border-tertiary/30 bg-tertiary/10 text-tertiary">
          <GraduationCap className="h-3.5 w-3.5" /> {t("sections.university.title")}
        </Badge>
      </div>
      <SectionHeading title={t("university.title")} subtitle={t("university.subtitle")} />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="group">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
              <Icon name={tool.icon} className="h-5 w-5" />
            </span>
            <h3 className="font-extrabold">{tool.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{tool.text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-muted">
              <Sparkles className="h-3.5 w-3.5" /> AI · {t("common.soon")}
            </span>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">{t("university.aiNote")}</p>
    </Section>
  );
}
