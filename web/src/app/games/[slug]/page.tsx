import { notFound } from "next/navigation";
import { GamePlayer } from "@/components/games/GamePlayer";
import { gameSlugs, type GameSlug } from "@/lib/games";

export function generateStaticParams() {
  return gameSlugs.map((slug) => ({ slug }));
}

export default async function GameRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!gameSlugs.includes(slug as GameSlug)) notFound();
  return <GamePlayer slug={slug as GameSlug} />;
}
