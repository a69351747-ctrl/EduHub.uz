"use client";

import { useState } from "react";
import { BrainCircuit, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/dictionaries";
import { Section, SectionHeading, Button, Card } from "@/components/ui";

interface IQItem {
  prompt: Record<Locale, string>;
  options: string[];
  correct: number;
}

const QUESTIONS: IQItem[] = [
  { prompt: { uz: "Ketma-ketlikni davom ettiring: 2, 4, 8, 16, ?", ru: "Продолжите: 2, 4, 8, 16, ?", en: "Continue: 2, 4, 8, 16, ?" }, options: ["18", "24", "32", "30"], correct: 2 },
  { prompt: { uz: "3, 6, 9, 12, ?", ru: "3, 6, 9, 12, ?", en: "3, 6, 9, 12, ?" }, options: ["13", "14", "15", "16"], correct: 2 },
  { prompt: { uz: "Ortiqchasini toping: 2, 3, 5, 7, 9", ru: "Найдите лишнее: 2, 3, 5, 7, 9", en: "Find the odd one: 2, 3, 5, 7, 9" }, options: ["2", "5", "9", "7"], correct: 2 },
  { prompt: { uz: "1, 1, 2, 3, 5, 8, ?", ru: "1, 1, 2, 3, 5, 8, ?", en: "1, 1, 2, 3, 5, 8, ?" }, options: ["11", "12", "13", "14"], correct: 2 },
  { prompt: { uz: "Agar BARCHA gullar o'simlik bo'lsa, ba'zi o'simliklar ...", ru: "Если ВСЕ цветы — растения, то некоторые растения...", en: "If ALL flowers are plants, then some plants..." }, options: ["gul", "tosh", "hayvon", "metall"].map(String), correct: 0 },
  { prompt: { uz: "100, 90, 81, 73, ?", ru: "100, 90, 81, 73, ?", en: "100, 90, 81, 73, ?" }, options: ["66", "65", "64", "67"], correct: 0 },
  { prompt: { uz: "5 ta ishchi 5 soatda 5 ta detal. 100 ta detal uchun 100 ishchi necha soat?", ru: "5 рабочих за 5 часов делают 5 деталей. Сколько часов 100 рабочим на 100 деталей?", en: "5 workers make 5 parts in 5 hours. How many hours for 100 workers to make 100 parts?" }, options: ["5", "20", "100", "1"], correct: 0 },
  { prompt: { uz: "2, 6, 12, 20, 30, ?", ru: "2, 6, 12, 20, 30, ?", en: "2, 6, 12, 20, 30, ?" }, options: ["40", "42", "36", "44"], correct: 1 },
  { prompt: { uz: "Qaysi son toq: 4, 16, 25, 36", ru: "Какое число нечётное: 4, 16, 25, 36", en: "Which is odd: 4, 16, 25, 36" }, options: ["4", "16", "25", "36"], correct: 2 },
  { prompt: { uz: "7 + 7 ÷ 7 + 7 × 7 − 7 = ?", ru: "7 + 7 ÷ 7 + 7 × 7 − 7 = ?", en: "7 + 7 ÷ 7 + 7 × 7 − 7 = ?" }, options: ["50", "56", "42", "49"], correct: 0 },
];

export default function IQPage() {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<"intro" | "test" | "result">("intro");
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const start = () => {
    setPhase("test");
    setI(0);
    setCorrect(0);
    setPicked(null);
  };

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === QUESTIONS[i].correct;
    if (ok) setCorrect((c) => c + 1);
    setTimeout(() => {
      if (i + 1 >= QUESTIONS.length) setPhase("result");
      else {
        setI((v) => v + 1);
        setPicked(null);
      }
    }, 800);
  };

  const iq = Math.round(85 + (correct / QUESTIONS.length) * 45);
  const levelKey =
    iq >= 120 ? "high" : iq >= 110 ? "above" : iq >= 100 ? "avg" : "below";

  return (
    <Section>
      <SectionHeading title={t("iq.title")} subtitle={t("iq.subtitle")} />
      <div className="mx-auto max-w-xl">
        {phase === "intro" && (
          <Card className="text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-info/10 text-info">
              <BrainCircuit className="h-7 w-7" />
            </span>
            <p className="mb-6 text-muted leading-relaxed">{t("iq.intro")}</p>
            <Button size="lg" onClick={start}>
              {t("iq.start")}
            </Button>
          </Card>
        )}

        {phase === "test" && (
          <Card>
            <div className="mb-4 flex items-center justify-between text-sm font-bold text-muted">
              <span>
                {t("common.question")} {i + 1} {t("common.of")} {QUESTIONS.length}
              </span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((i + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            <p className="mb-6 rounded-2xl border bg-surface-2 p-6 text-center text-xl font-extrabold">
              {QUESTIONS[i].prompt[locale]}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {QUESTIONS[i].options.map((opt, idx) => {
                const show = picked !== null;
                const isCorrect = idx === QUESTIONS[i].correct;
                return (
                  <button
                    key={opt + idx}
                    onClick={() => choose(idx)}
                    className={`rounded-xl border-2 py-4 text-lg font-extrabold transition ${
                      show && isCorrect
                        ? "border-success bg-success/10"
                        : show && picked === idx
                          ? "border-accent-red bg-accent-red/10"
                          : "border-border bg-surface hover:border-primary"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {phase === "result" && (
          <Card className="text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-muted">
              {t("iq.yourIq")}
            </p>
            <p className="my-2 text-6xl font-black text-primary">{iq}</p>
            <p className="text-muted">
              {t("common.correct")}: {correct}/{QUESTIONS.length}
            </p>
            <div className="mt-5 rounded-2xl border bg-surface-2 p-5">
              <p className="font-bold">{t("iq.interpretation")}</p>
              <p className="mt-1 text-muted">{t(`iq.levels.${levelKey}`)}</p>
            </div>
            <Button className="mt-6" onClick={start}>
              <RefreshCw className="h-4 w-4" /> {t("common.restart")}
            </Button>
          </Card>
        )}
      </div>
    </Section>
  );
}
