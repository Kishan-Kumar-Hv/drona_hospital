import {
  Heart,
  Stethoscope,
  Baby,
  Activity,
  Users,
  ClipboardCheck,
  Microscope,
  Home,
  Pill,
  Syringe,
  Ambulance,
  HeartPulse,
  Brain,
  Bone,
  Eye,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Stethoscope,
  Baby,
  Activity,
  Users,
  ClipboardCheck,
  Microscope,
  Home,
  Pill,
  Syringe,
  Ambulance,
  HeartPulse,
  Brain,
  Bone,
  Eye,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export const DEFAULT_ICON: LucideIcon = Stethoscope;
