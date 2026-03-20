import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface DocSubsection {
  id: string;
  title: string;
}

export interface DocSection {
  id: string;
  title: string;
  icon: LucideIcon;
  subsections?: DocSubsection[];
  content: ReactNode;
}
