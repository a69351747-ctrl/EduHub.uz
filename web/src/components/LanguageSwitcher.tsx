"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { localeFlags, localeNames, locales } from "@/i18n/dictionaries";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-surface px-2.5 text-sm font-bold text-text transition hover:bg-surface-2"
      >
        <span>{localeFlags[locale]}</span>
        <span className="uppercase">{locale}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border bg-surface shadow-lg">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold transition hover:bg-surface-2 ${
                l === locale ? "text-primary" : "text-text"
              }`}
            >
              <span>{localeFlags[l]}</span>
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
