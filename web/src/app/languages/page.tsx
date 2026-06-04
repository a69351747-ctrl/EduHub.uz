"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Section, SectionHeading, Button, Card } from "@/components/ui";
import { Icon } from "@/components/Icon";

interface Feat {
  icon: string;
  title: string;
  text: string;
}

type Lang = "en" | "ru";

interface LQ {
  q: string;
  options: string[];
  correct: number;
}

const TESTS: Record<Lang, LQ[]> = {
  en: [
    { q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], correct: 1 },
    { q: "I have lived here ___ 2010.", options: ["for", "since", "from", "at"], correct: 1 },
    { q: "If I ___ rich, I would travel.", options: ["am", "was", "were", "be"], correct: 2 },
    { q: "This is the ___ book I've read.", options: ["good", "better", "best", "well"], correct: 2 },
    { q: "The report ___ by tomorrow.", options: ["will finish", "will be finished", "finishes", "finished"], correct: 1 },
    { q: "He asked me where I ___.", options: ["live", "lived", "living", "lives"], correct: 1 },
  ],
  ru: [
    { q: "Я ___ в Ташкенте.", options: ["живу", "живёт", "живут", "жить"], correct: 0 },
    { q: "Она читает ___ книгу.", options: ["интересный", "интересная", "интересную", "интересное"], correct: 2 },
    { q: "Мы пойдём в кино, ___ будет время.", options: ["если", "что", "потому", "хотя"], correct: 0 },
    { q: "Это ___ дом в городе.", options: ["высокий", "самый высокий", "выше", "высоко"], correct: 1 },
    { q: "Книга ___ на столе.", options: ["лежит", "лежат", "лежу", "лежать"], correct: 0 },
    { q: "Он сказал, что ___ завтра.", options: ["приедет", "приехал", "приезжать", "приедут"], correct: 0 },
  ],
};

export default function LanguagesPage() {
  const { t, tr } = useI18n();
  const features = tr<Feat[]>("languages.features") ?? [];

  const [lang, setLang] = useState<Lang | null>(null);
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const startLang = (l: Lang) => {
    setLang(l);
    setI(0);
    setCorrect(0);
    setPicked(null);
    setDone(false);
  };

  const reset = () => {
    setLang(null);
    setDone(false);
  };

  const choose = (idx: number) => {
    if (picked !== null || !lang) return;
    setPicked(idx);
    if (idx === TESTS[lang][i].correct) setCorrect((c) => c + 1);
    setTimeout(() => {
      if (i + 1 >= TESTS[lang].length) setDone(true);
      else {
        setI((v) => v + 1);
        setPicked(null);
      }
    }, 800);
  };

  const total = lang ? TESTS[lang].length : 0;
  const ratio = total ? correct / total : 0;
  const levelKey = ratio >= 0.85 ? "B2" : ratio >= 0.6 ? "B1" : ratio >= 0.35 ? "A2" : "A1";

  return (
    <>
      <Section>
        <SectionHeading title={t("languages.title")} subtitle={t("languages.subtitle")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title}>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <h3 className="font-extrabold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{f.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="bg-surface-2/40">
        <div className="mx-auto max-w-xl px-5 py-16">
          <SectionHeading
            title={t("languages.levelTestTitle")}
            subtitle={t("languages.levelTestText")}
          />
          <Card>
            {!lang && (
              <div className="text-center">
                <p className="mb-5 font-bold text-muted">{t("languages.chooseLang")}</p>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => startLang("en")}>🇬🇧 {t("languages.english")}</Button>
                  <Button variant="secondary" onClick={() => startLang("ru")}>
                    🇷🇺 {t("languages.russian")}
                  </Button>
                </div>
              </div>
            )}

            {lang && !done && (
              <div>
                <div className="mb-4 text-sm font-bold text-muted">
                  {t("common.question")} {i + 1} {t("common.of")} {total}
                </div>
                <p className="mb-6 rounded-2xl border bg-surface-2 p-6 text-center text-lg font-extrabold">
                  {TESTS[lang][i].q}
                </p>
                <div className="grid gap-3">
                  {TESTS[lang][i].options.map((opt, idx) => {
                    const show = picked !== null;
                    const isCorrect = idx === TESTS[lang][i].correct;
                    return (
                      <button
                        key={opt + idx}
                        onClick={() => choose(idx)}
                        className={`rounded-xl border-2 px-5 py-3.5 text-left font-bold transition ${
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
              </div>
            )}

            {done && (
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-wide text-muted">
                  {t("common.yourLevel")}
                </p>
                <p className="my-2 text-5xl font-black text-primary">
                  {levelKey}
                </p>
                <p className="text-muted">{t(`languages.levels.${levelKey}`)}</p>
                <p className="mt-1 text-sm text-muted">
                  {t("common.correct")}: {correct}/{total}
                </p>
                <Button className="mt-6" onClick={reset}>
                  <RefreshCw className="h-4 w-4" /> {t("common.restart")}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </section>
    </>
  );
}
