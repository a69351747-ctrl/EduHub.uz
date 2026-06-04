"use client";

import {
  Bot,
  Gamepad2,
  Languages,
  Trophy,
  GraduationCap,
  Moon,
  Palette,
  Hash,
  BookA,
  Music,
  Calculator,
  Brain,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Volume2,
  Presentation,
  FileText,
  BookMarked,
  Grid3x3,
  ClipboardList,
  UserSquare,
  FlaskConical,
  Baby,
  Backpack,
  School,
  Target,
  Award,
  BrainCircuit,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Bot,
  Gamepad2,
  Languages,
  Trophy,
  GraduationCap,
  Moon,
  Palette,
  Hash,
  BookA,
  Music,
  Calculator,
  Brain,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Volume2,
  Presentation,
  FileText,
  BookMarked,
  Grid3x3,
  ClipboardList,
  UserSquare,
  FlaskConical,
  Baby,
  Backpack,
  School,
  Target,
  Award,
  BrainCircuit,
  Sparkles,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = map[name] ?? Sparkles;
  return <Cmp className={className} />;
}
