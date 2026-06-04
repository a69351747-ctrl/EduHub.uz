"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/dictionaries";
import { Button } from "@/components/ui";

interface QQ {
  q: Record<Locale, string>;
  options: Record<Locale, string[]>;
  correct: number;
}

const BANK: QQ[] = [
  {
    q: { uz: "O'zbekiston poytaxti qaysi shahar?", ru: "Столица Узбекистана?", en: "Capital of Uzbekistan?" },
    options: { uz: ["Samarqand", "Toshkent", "Buxoro", "Xiva"], ru: ["Самарканд", "Ташкент", "Бухара", "Хива"], en: ["Samarkand", "Tashkent", "Bukhara", "Khiva"] },
    correct: 1,
  },
  {
    q: { uz: "7 × 8 = ?", ru: "7 × 8 = ?", en: "7 × 8 = ?" },
    options: { uz: ["54", "56", "64", "48"], ru: ["54", "56", "64", "48"], en: ["54", "56", "64", "48"] },
    correct: 1,
  },
  {
    q: { uz: "Quyosh sistemasidagi eng katta sayyora?", ru: "Самая большая планета Солнечной системы?", en: "Largest planet in the Solar System?" },
    options: { uz: ["Yer", "Mars", "Yupiter", "Saturn"], ru: ["Земля", "Марс", "Юпитер", "Сатурн"], en: ["Earth", "Mars", "Jupiter", "Saturn"] },
    correct: 2,
  },
  {
    q: { uz: "Suvning kimyoviy formulasi?", ru: "Химическая формула воды?", en: "Chemical formula of water?" },
    options: { uz: ["CO2", "H2O", "O2", "NaCl"], ru: ["CO2", "H2O", "O2", "NaCl"], en: ["CO2", "H2O", "O2", "NaCl"] },
    correct: 1,
  },
  {
    q: { uz: "Bir yilda nechta oy bor?", ru: "Сколько месяцев в году?", en: "How many months in a year?" },
    options: { uz: ["10", "11", "12", "13"], ru: ["10", "11", "12", "13"], en: ["10", "11", "12", "13"] },
    correct: 2,
  },
];

export function QuickQuiz() {
  const { t, locale } = useI18n();
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const item = BANK[i];

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === item.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (i + 1 >= BANK.length) setDone(true);
      else {
        setI((v) => v + 1);
        setPicked(null);
      }
    }, 900);
  };

  const restart = () => {
    setI(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  };

  if (done)
    return (
      <div className="text-center">
        <p className="text-2xl font-black">
          {t("common.result")}:{" "}
          <span className="text-primary">
            {score}/{BANK.length}
          </span>
        </p>
        <Button className="mt-6" onClick={restart}>
          <RefreshCw className="h-4 w-4" /> {t("common.restart")}
        </Button>
      </div>
    );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm font-bold text-muted">
        <span>
          {t("common.question")} {i + 1} {t("common.of")} {BANK.length}
        </span>
        <span className="text-primary">{score}</span>
      </div>
      <div className="mb-6 rounded-2xl border bg-surface-2 p-6 text-center text-xl font-extrabold">
        {item.q[locale]}
      </div>
      <div className="grid gap-3">
        {item.options[locale].map((opt, idx) => {
          const isCorrect = idx === item.correct;
          const show = picked !== null;
          return (
            <button
              key={opt + idx}
              onClick={() => choose(idx)}
              className={`flex items-center justify-between rounded-xl border-2 px-5 py-4 text-left font-bold transition ${
                show && isCorrect
                  ? "border-success bg-success/10"
                  : show && picked === idx
                    ? "border-accent-red bg-accent-red/10"
                    : "border-border bg-surface hover:border-primary"
              }`}
            >
              {opt}
              {show && isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
              {show && !isCorrect && picked === idx && (
                <XCircle className="h-5 w-5 text-accent-red" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
