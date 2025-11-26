import { Circle, Box, Triangle, Diamond, Sliders, Layers } from '@/components/ui/icons';

export const PALETTE_TYPES = [
  { id: 'analogous', icon: Circle, label: 'ANA' },
  { id: 'monochromatic', icon: Box, label: 'MON' },
  { id: 'triad', icon: Triangle, label: 'TRI' },
  { id: 'tetrad', icon: Diamond, label: 'TET' },
  { id: 'complementary', icon: Sliders, label: 'COM' },
  { id: 'split', icon: Layers, label: 'SPL' },
] as const;

