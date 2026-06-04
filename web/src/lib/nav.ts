export interface NavItem {
  href: string;
  key: string; // i18n key under nav.*
  icon: string;
}

export const sectionNav: NavItem[] = [
  { href: "/preschool", key: "preschool", icon: "Baby" },
  { href: "/students", key: "students", icon: "Backpack" },
  { href: "/university", key: "university", icon: "GraduationCap" },
  { href: "/applicants", key: "applicants", icon: "School" },
  { href: "/competitions", key: "competitions", icon: "Trophy" },
  { href: "/games", key: "games", icon: "Gamepad2" },
  { href: "/iq", key: "iq", icon: "BrainCircuit" },
  { href: "/languages", key: "languages", icon: "Languages" },
];

export const mainNav: NavItem[] = [
  { href: "/", key: "home", icon: "Sparkles" },
  ...sectionNav,
  { href: "/pricing", key: "pricing", icon: "Award" },
];
