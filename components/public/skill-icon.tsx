import {
  Atom,
  Braces,
  Code,
  Code2,
  Container,
  Database,
  DatabaseBackup,
  FileCode2,
  Flame,
  GitBranch,
  Hexagon,
  Palette,
  PenTool,
  Plug,
  Rocket,
  Route,
  Triangle,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const skillIcons: Record<string, LucideIcon> = {
  html: Code2,
  css: Palette,
  javascript: Braces,
  react: Atom,
  "next.js": Triangle,
  "tailwind css": Wind,
  php: FileCode2,
  laravel: Rocket,
  "node.js": Hexagon,
  express: Route,
  "rest api": Plug,
  postgresql: Database,
  mysql: DatabaseBackup,
  supabase: Flame,
  git: GitBranch,
  docker: Container,
  figma: PenTool,
};

export function SkillIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = skillIcons[name.toLowerCase()] ?? Code;
  return <Icon aria-hidden="true" className={cn("size-4 shrink-0", className)} />;
}
