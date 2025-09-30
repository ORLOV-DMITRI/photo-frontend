import type { ThemeType } from '@/contexts/ThemeContext';

export type FilterType = 'classic' | 'vintage' | 'sepia' | 'blackwhite';

export default function moodToFilter(mood: ThemeType): FilterType {
  const mapping: Record<ThemeType, FilterType> = {
    joy: 'classic',
    fun: 'vintage',
    adventure: 'sepia',
    memory: 'blackwhite',
  };

  return mapping[mood];
}