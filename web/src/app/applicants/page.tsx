"use client";

import { useState } from "react";
import { School, MapPin, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/dictionaries";
import { Section, SectionHeading, Button, Card, Badge } from "@/components/ui";

interface Uni {
  slug: string;
  name: string;
  city: string;
  subjects: string[];
}

interface DTMQ {
  topic: Record<Locale, string>;
  q: Record<Locale, string>;
  options: string[];
  correct: number;
}

const DTM: DTMQ[] = [
  { topic: { uz: "Algebra", ru: "Алгебра", en: "Algebra" }, q: { uz: "2x + 6 = 14 bo'lsa, x = ?", ru: "2x + 6 = 14, x = ?", en: "2x + 6 = 14, x = ?" }, options: ["2", "4", "6", "8"], correct: 1 },
  { topic: { uz: "Geometriya", ru: "Геометрия", en: "Geometry" }, q: { uz: "Uchburchak ichki burchaklari yig'indisi?", ru: "Сумма углов треугольника?", en: "Sum of triangle angles?" }, options: ["90°", "180°", "270°", "360°"], correct: 1 },
  { topic: { uz: "Fizika", ru: "Физика", en: "Physics" }, q: { uz: "Tezlik birligi (SI)?", ru: "Единица скорости (СИ)?", en: "Unit of speed (SI)?" }, options: ["m", "m/s", "kg", "N"], correct: 1 },
  { topic: { uz: "Kimyo", ru: "Химия", en: "Chemistry" }, q: { uz: "Suvning formulasi?", ru: "Формула воды?", en: "Formula of water?" }, options: ["CO₂", "H₂O", "O₂", "NaCl"], correct: 1 },
  { topic: { uz: "Ona tili", ru: "Родной язык", en: "Native language" }, q: { uz: "“Kitob” so'zi qaysi so'z turkumi?", ru: "Часть речи слова «книга»?", en: "Part of speech of 'book'?" }, options: ["Ot", "Fe'l", "Sifat", "Son"], correct: 0 },
];

export default function ApplicantsPage() {
  const { t, tr, locale } = useI18n();
  const unis = tr<Uni[]>("applicants.universities") ?? [];

  const [selected, setSelected] = useState<Uni | null>(null);
  const [mode, setMode] = useState<"list" | "test" | "result">("list");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);

  const startTest = (uni: Uni) => {
    setSelected(uni);
    setMode("test");
    setI(0);
    setAnswers([]);
    setPicked(null);
  };

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const next = [...answers, idx];
    setTimeout(() => {
      if (i + 1 >= DTM.length) {
        setAnswers(next);
        setMode("result");
      } else {
        setAnswers(next);
        setI((v) => v + 1);
        setPicked(null);
      }
    }, 700);
  };

  const correctCount = answers.filter((a, idx) => a === DTM[idx]?.correct).length;
  const weakTopics = DTM.filter((q, idx) => answers[idx] !== q.correct).map((q) => q.topic[locale]);

  if (mode === "test" && selected) {
    const item = DTM[i];
    return (
      <Section>
        <div className="mx-auto max-w-xl">
          <button
            onClick={() => setMode("list")}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> {t("common.back")}
          </button>
          <Card>
            <div className="mb-4 flex items-center justify-between text-sm font-bold text-muted">
              <span>{selected.name}</span>
              <span>
                {i + 1} {t("common.of")} {DTM.length}
              </span>
            </div>
            <Badge className="border-info/30 bg-info/10 text-info">{item.topic[locale]}</Badge>
            <p className="my-5 rounded-2xl border bg-surface-2 p-6 text-center text-lg font-extrabold">
              {item.q[locale]}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {item.options.map((opt, idx) => {
                const show = picked !== null;
                const isCorrect = idx === item.correct;
                return (
                  <button
                    key={opt + idx}
                    onClick={() => choose(idx)}
                    className={`rounded-xl border-2 py-4 font-extrabold transition ${
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
        </div>
      </Section>
    );
  }

  if (mode === "result" && selected) {
    return (
      <Section>
        <div className="mx-auto max-w-xl">
          <Card className="text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-muted">
              {selected.name}
            </p>
            <p className="my-2 text-5xl font-black text-primary">
              {correctCount}/{DTM.length}
            </p>
            <div className="mt-5 rounded-2xl border bg-surface-2 p-5 text-left">
              <p className="mb-2 font-extrabold">{t("applicants.analysisTitle")}</p>
              <p className="mb-3 text-sm text-muted">{t("applicants.analysisText")}</p>
              {weakTopics.length === 0 ? (
                <p className="flex items-center gap-2 font-bold text-success">
                  <CheckCircle2 className="h-5 w-5" /> 100%
                </p>
              ) : (
                <ul className="space-y-2">
                  {weakTopics.map((tp) => (
                    <li key={tp} className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-accent-orange" />
                      <span className="font-bold">{tp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button className="mt-6" onClick={() => startTest(selected)}>
              <RefreshCw className="h-4 w-4" /> {t("common.restart")}
            </Button>
          </Card>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="mb-8 text-center">
        <Badge className="border-info/30 bg-info/10 text-info">
          <School className="h-3.5 w-3.5" /> {t("nav.applicants")}
        </Badge>
      </div>
      <SectionHeading title={t("applicants.title")} subtitle={t("applicants.subtitle")} />
      <p className="mb-6 text-center font-bold text-muted">{t("applicants.chooseUni")}</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {unis.map((u) => (
          <Card key={u.slug}>
            <h3 className="text-lg font-extrabold">{u.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4" /> {u.city}
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">
              {t("applicants.requiredSubjects")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {u.subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
            <Button className="mt-5 w-full" size="sm" onClick={() => startTest(u)}>
              {t("applicants.solveTest")}
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}
