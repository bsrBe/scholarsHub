import type { LucideIcon } from "lucide-react";
import {
  FileCheck,
  Languages,
  GraduationCap,
  FileText,
  Home,
  Plane,
  Compass,
  Headphones,
  UserPlus,
  MapPin,
  Upload,
  MessageSquare,
  Send,
} from "lucide-react";

const iconMap = {
  FileCheck,
  Languages,
  GraduationCap,
  FileText,
  Home,
  Plane,
  Compass,
  Headphones,
  HeadphonesIcon: Headphones,
  UserPlus,
  MapPin,
  Upload,
  MessageSquare,
  Send,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export const getIconByName = (iconName: string): LucideIcon | undefined => iconMap[iconName];

export default iconMap;

