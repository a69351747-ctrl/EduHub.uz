"use client";

import { useEffect, useState } from "react";
import { Timer, Star, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui";

const COLORS = [
  { uz: "Qizil", ru: "Красный", en: "Red", hex: "#e53935" },
  { uz: "Yashil", ru: "Зелёный", en: "Green", hex: "#2d7a4f" },
  { uz: "Ko'k", ru: "Синий", en: "Blue", hex: "#3b82f6" },
  { uz: "Sariq", ru: "Жёлтый", en: "Yellow", hex: "#f5a623" },
  { uz: "Binafsha", ru: "Фиолетовый", en: "Purple", hex: "#7c4dff" },
  { uz: "To'q sariq", ru: "Оранжевый", en: "Orange", hex: "#ff6b35" },
];

export function ColorMatch() {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(COLORS[0]);
  const [options, setOptions] = useState(COLORS.slice(0, 4));

  const round = () => {
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    const opts = shuffled.slice(0, 4);
    setOptions(opts);
    setTarget(opts[Math.floor(Math.random() * opts.length)]);
  };

  const start = () => {
    setScore(0);
    setTime(30);
    round();
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play") return;
    if (time <= 0) {
      setPhase("over");
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, time]);

  const pick = (hex: string) => {
    if (phase !== "play") return;
    setScore((s) => (hex === target.hex ? s + 10 : Math.max(0, s - 5)));
    round();
  };

  const stars = Math.min(3, Math.floor(score / 80));

  if (phase === "idle")
    return (
      <div className="text-center">
        <p className="mx-auto mb-6 max-w-md text-muted">{t("games.list.2.desc")}</p>
        <Button size="lg" onClick={start}>
          {t("common.play")}
        </Button>
      </div>
    );

  if (phase === "over")
    return (
      <div className="text-center">
        <div className="mb-2 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              className={`h-9 w-9 ${i < stars ? "fill-secondary text-secondary" : "text-border"}`}
            />
          ))}
        </div>
        <p className="text-2xl font-black">
          {t("common.score")}: <span className="text-primary">{score}</span>
        </p>
        <Button className="mt-6" onClick={start}>
          <RefreshCw className="h-4 w-4" /> {t("common.restart")}
        </Button>
      </div>
    );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-bold text-muted">
          <Timer className="h-5 w-5" /> {time}
        </span>
        <span className="inline-flex items-center gap-1.5 font-bold text-primary">
          <Star className="h-5 w-5" /> {score}
        </span>
      </div>
      <p className="mb-6 text-center text-lg font-bold text-muted">
        {locale === "uz" ? "Bu rangni toping:" : locale === "ru" ? "Найдите цвет:" : "Find this color:"}
      </p>
      <div className="mb-8 text-center text-4xl font-black">
        {target[locale]}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((c) => (
          <button
            key={c.hex}
            onClick={() => pick(c.hex)}
            className="h-20 rounded-2xl border-2 border-border transition hover:scale-105"
            style={{ backgroundColor: c.hex }}
            aria-label={c[locale]}
          />
        ))}
      </div>
    </div>
  );
}
