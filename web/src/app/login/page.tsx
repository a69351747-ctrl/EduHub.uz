"use client";

import { Send, GraduationCap } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Card, Button } from "@/components/ui";

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
        <GraduationCap className="h-7 w-7" />
      </span>
      <h1 className="text-2xl font-black">{t("auth.loginTitle")}</h1>
      <p className="mt-1 text-muted">EduHub.uz</p>

      <Card className="mt-8 w-full">
        <div className="space-y-3">
          <Button variant="outline" className="w-full" size="lg">
            <span className="text-lg">G</span> {t("auth.google")}
          </Button>
          <Button className="w-full" size="lg">
            <Send className="h-5 w-5" /> {t("auth.telegram")}
          </Button>
        </div>
        <p className="mt-5 text-center text-xs text-muted">{t("auth.note")}</p>
      </Card>
    </div>
  );
}
