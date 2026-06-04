export const gameSlugs = [
  "math-puzzle",
  "memory-matrix",
  "color-match",
  "quick-quiz",
] as const;

export type GameSlug = (typeof gameSlugs)[number];
