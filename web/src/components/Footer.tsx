"use client";

import Link from "next/link";
import { GraduationCap, Send, Mail } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { sectionNav } from "@/lib/nav";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            Edu<span className="text-primary">Hub</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted leading-relaxed">
            {t("footer.about")}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-muted">
            {t("footer.sections")}
          </h4>
          <ul className="space-y-2 text-sm">
            {sectionNav.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-text hover:text-primary">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-muted">
            {t("footer.company")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/pricing" className="text-text hover:text-primary">{t("nav.pricing")}</Link></li>
            <li><Link href="/admin" className="text-text hover:text-primary">{t("nav.admin")}</Link></li>
            <li><Link href="/login" className="text-text hover:text-primary">{t("nav.login")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-muted">
            {t("footer.contact")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-text">
              <Send className="h-4 w-4 text-primary" /> @eduhub_uz
            </li>
            <li className="flex items-center gap-2 text-text">
              <Mail className="h-4 w-4 text-primary" /> info@eduhub.uz
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto w-full max-w-6xl px-5 py-5 text-center text-xs text-muted sm:px-8">
          © {year} EduHub.uz — {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
