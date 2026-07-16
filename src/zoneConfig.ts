import type { ZoneId } from './types';

export const zoneConfig: Record<ZoneId, { name: string; color: string; bg: string; text: string; border: string; dot: string }> = {
  study: { name: 'Study', color: '#8B5CF6', bg: 'bg-study-50', text: 'text-study-600', border: 'border-study-500', dot: 'bg-study-500' },
  work: { name: 'Work', color: '#3B82F6', bg: 'bg-work-50', text: 'text-work-600', border: 'border-work-500', dot: 'bg-work-500' },
  play: { name: 'Play', color: '#EC4899', bg: 'bg-play-50', text: 'text-play-600', border: 'border-play-500', dot: 'bg-play-500' },
  personal: { name: 'Personal', color: '#14B8A6', bg: 'bg-personal-50', text: 'text-personal-600', border: 'border-personal-500', dot: 'bg-personal-500' },
};

export const zoneOrder: ZoneId[] = ['study', 'work', 'play', 'personal'];
