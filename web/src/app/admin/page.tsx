"use client";

import { Users, CreditCard, TrendingUp, Activity, Settings } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Section, Card, Button, Badge } from "@/components/ui";

interface AdminSection {
  title: string;
  text: string;
}

export default function AdminPage() {
  const { t, tr } = useI18n();
  const sections = tr<AdminSection[]>("admin.sections") ?? [];

  const stats = [
    { icon: Activity, label: t("admin.stats.visitors"), value: "12 480", color: "#3b82f6" },
    { icon: Users, label: t("admin.stats.subscribers"), value: "3 215", color: "#2d7a4f" },
    { icon: CreditCard, label: t("admin.stats.revenue"), value: "48.2M", color: "#f5a623" },
    { icon: TrendingUp, label: t("admin.stats.active"), value: "1 092", color: "#7c4dff" },
  ];

  // simple demo bar chart data
  const bars = [40, 65, 55, 80, 72, 95, 88];

  return (
    <Section>
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">{t("admin.title")}</h1>
          <p className="mt-1 text-muted">{t("admin.subtitle")}</p>
        </div>
        <Badge className="border-accent-red/30 bg-accent-red/10 text-accent-red">
          {t("common.demo")}
        </Badge>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <span
              className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: s.color }}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-sm text-muted">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-extrabold">{t("admin.stats.visitors")} — 7d</h3>
          <div className="flex h-44 items-end gap-3">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-primary/80 transition-all"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-muted">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-extrabold">{t("admin.manage")}</h3>
          <div className="space-y-3">
            {sections.map((s) => (
              <div
                key={s.title}
                className="flex items-center justify-between rounded-xl border bg-surface-2 p-3"
              >
                <div>
                  <p className="font-bold text-sm">{s.title}</p>
                  <p className="text-xs text-muted">{s.text}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <p className="mt-8 text-center text-sm text-muted">{t("admin.note")}</p>
    </Section>
  );
}
