import {
  Award,
  Briefcase,
  Code2,
  Link,
  MessageCircle,
  Rocket,
  Shield,
  Smartphone,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  star: Star,
  rocket: Rocket,
  users: Users,
  award: Award,
  shield: Shield,
  github: Code2,
  linkedin: Link,
  link: Link,
  "message-circle": MessageCircle,
  briefcase: Briefcase,
  smartphone: Smartphone,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Star;
}

export const ICON_OPTIONS = Object.keys(iconMap);
