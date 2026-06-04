"use client";

import { useEffect, useState } from "react";
import { RefreshCw, MousePointerClick } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui";

const EMOJIS = ["🐶", "🐱", "🦊", "🐼", "🦁", "🐸", "🐵", "🐯"];

interface Tile {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function build(): Tile[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return pairs
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5)
    .map((tile, i) => ({ ...tile, id: i }));
}

export function MemoryMatrix() {
  const { t } = useI18n();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [picks, setPicks] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);

  const reset = () => {
    setTiles(build());
    setPicks([]);
    setMoves(0);
    setStarted(true);
  };

  useEffect(() => {
    if (picks.length !== 2) return;
    const [a, b] = picks;
    setMoves((m) => m + 1);
    if (tiles[a].emoji === tiles[b].emoji) {
      setTiles((prev) =>
        prev.map((t, i) => (i === a || i === b ? { ...t, matched: true } : t)),
      );
      setPicks([]);
    } else {
      const id = setTimeout(() => {
        setTiles((prev) =>
          prev.map((t, i) =>
            i === a || i === b ? { ...t, flipped: false } : t,
          ),
        );
        setPicks([]);
      }, 700);
      return () => clearTimeout(id);
    }
  }, [picks, tiles]);

  const flip = (i: number) => {
    if (picks.length === 2 || tiles[i].flipped || tiles[i].matched) return;
    setTiles((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, flipped: true } : t)),
    );
    setPicks((p) => [...p, i]);
  };

  const won = started && tiles.length > 0 && tiles.every((t) => t.matched);

  if (!started) {
    return (
      <div className="text-center">
        <p className="mx-auto mb-6 max-w-md text-muted">{t("games.list.1.desc")}</p>
        <Button size="lg" onClick={reset}>
          {t("common.play")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-bold text-muted">
          <MousePointerClick className="h-5 w-5" /> {moves}
        </span>
        {won && (
          <span className="font-black text-success">🎉 {t("common.finish")}!</span>
        )}
        <Button size="sm" variant="ghost" onClick={reset}>
          <RefreshCw className="h-4 w-4" /> {t("common.restart")}
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {tiles.map((tile, i) => {
          const show = tile.flipped || tile.matched;
          return (
            <button
              key={tile.id}
              onClick={() => flip(i)}
              className={`flex aspect-square items-center justify-center rounded-xl border-2 text-3xl transition sm:text-4xl ${
                show
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface-2 hover:border-primary/50"
              } ${tile.matched ? "opacity-60" : ""}`}
            >
              {show ? tile.emoji : "❓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
