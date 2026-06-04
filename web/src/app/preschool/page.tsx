"use client";

import { Baby, Gamepad2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Section, Card, Button, Badge } from "@/components/ui";
import { Icon } from "@/components/Icon";

interface Activity {
  icon: string;
  title: string;
  text: string;
}

export default function PreschoolPage() {
  const { t, tr } = useI18n();
  const activities = tr<Activity[]>("preschool.activities") ?? [];

  return (
    <>
      <section className="bg-grid">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center sm:px-8">
          <Badge className="border-accent-orange/30 bg-accent-orange/10 text-accent-orange">
            <Baby className="h-3.5 w-3.5" /> {t("sections.preschool.title")}
          </Badge>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-black sm:text-5xl">
            {t("preschool.hero")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            {t("preschool.intro")}
          </p>
          <Button href="/games" className="mt-7" size="lg">
            <Gamepad2 className="h-5 w-5" /> {t("nav.games")}
          </Button>
        </div>
      </section>

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a, i) => (
            <Card key={a.title}>
              <span
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: ["#ff6b35", "#2d7a4f", "#7c4dff", "#f5a623"][i % 4] }}
              >
                <Icon name={a.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-extrabold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{a.text}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
