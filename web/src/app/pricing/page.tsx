"use client";

import { Check, Sparkles, CreditCard } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Section, SectionHeading, Button, Card, Badge } from "@/components/ui";

interface Plan {
  key: string;
  name: string;
  price: string;
  note: string;
  features: string[];
}

const PAY = ["Payme", "Click", "Uzumbank"];

export default function PricingPage() {
  const { t, tr } = useI18n();
  const plans = tr<Plan[]>("pricing.plans") ?? [];

  return (
    <>
      <Section>
        <SectionHeading title={t("pricing.title")} subtitle={t("pricing.subtitle")} />

        {/* Demo */}
        <Card className="mx-auto mb-10 max-w-2xl border-primary/30 bg-primary/5 text-center">
          <Badge className="border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {t("common.free")}
          </Badge>
          <h3 className="mt-3 text-xl font-extrabold">{t("pricing.demoTitle")}</h3>
          <p className="mt-2 text-muted">{t("pricing.demoText")}</p>
          <Button href="/" variant="outline" className="mt-4" size="sm">
            {t("common.tryFree")}
          </Button>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, idx) => {
            const popular = plan.key === "quarterly";
            return (
              <div
                key={plan.key}
                className={`relative rounded-3xl border bg-surface p-7 shadow-sm transition hover:shadow-md ${
                  popular ? "border-primary ring-2 ring-primary/30 lg:-translate-y-3" : ""
                }`}
              >
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white">
                    {t("pricing.badgePopular")}
                  </span>
                )}
                <h3 className="text-lg font-extrabold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted">{plan.note}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="mb-1 text-muted">{"so'm"}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href="/login"
                  variant={popular ? "primary" : "outline"}
                  className="mt-7 w-full"
                  size="lg"
                >
                  {t("pricing.cta")}
                </Button>
                {idx === 2 && (
                  <p className="mt-3 text-center text-xs text-success font-bold">
                    {plan.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <section className="bg-surface-2/40">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-info/10 text-info">
            <CreditCard className="h-6 w-6" />
          </span>
          <h3 className="text-2xl font-extrabold">{t("pricing.payTitle")}</h3>
          <p className="mt-2 text-muted">{t("pricing.payText")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {PAY.map((p) => (
              <span
                key={p}
                className="rounded-xl border bg-surface px-6 py-3 font-extrabold shadow-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
