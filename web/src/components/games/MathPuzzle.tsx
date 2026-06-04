"use client";

import { useCallback, useEffect, useState } from "react";
import { Timer, Star, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui";

type Op = "+" | "-" | "×";

function makeQuestion() {
  const ops: Op[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const delta = Math.floor(Math.random() * 9) - 4;
    const cand = answer + delta;
    if (cand >= 0) options.add(cand);
  }
  return {
    text: `${a} ${op} ${b}`,
    answer,
    options: [...options].sort(() => Math.random() - 0.5),
  };
}

export function MathPuzzle() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(makeQuestion());
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);

  const start = () => {
    setScore(0);
    setTime(60);
    setQ(makeQuestion());
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

  const answer = useCallback(
    (opt: number) => {
      if (phase !== "play") return;
      if (opt === q.answer) {
        setScore((s) => s + 10);
        setFlash("ok");
      } else {
        setScore((s) => Math.max(0, s - 5));
        setFlash("no");
      }
      setTimeout(() => setFlash(null), 180);
      setQ(makeQuestion());
    },
    [phase, q.answer],
  );

  const stars = Math.min(3, Math.floor(score / 100));

  if (phase === "idle") {
    return (
      <div className="text-center">
        <p className="mx-auto mb-6 max-w-md text-muted">
          {t("games.list.0.desc")} — 60 {t("common.seconds")}.
        </p>
        <Button size="lg" onClick={start}>
          {t("common.play")}
        </Button>
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="text-center">
        <div className="mb-2 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              className={`h-9 w-9 ${
                i < stars ? "fill-secondary text-secondary" : "text-border"
              }`}
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
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-bold text-muted">
          <Timer className="h-5 w-5" /> {time}
          {t("common.seconds")}
        </span>
        <span className="inline-flex items-center gap-1.5 font-bold text-primary">
          <Star className="h-5 w-5" /> {score}
        </span>
      </div>
      <div
        className={`mb-8 rounded-2xl border-2 py-12 text-center text-5xl font-black transition ${
          flash === "ok"
            ? "border-success bg-success/10"
            : flash === "no"
              ? "border-accent-red bg-accent-red/10"
              : "border-border bg-surface-2"
        }`}
      >
        {q.text} = ?
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(opt)}
            className="rounded-xl border-2 bg-surface py-5 text-2xl font-extrabold transition hover:border-primary hover:bg-primary/5"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
