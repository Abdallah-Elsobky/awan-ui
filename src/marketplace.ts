import type { MarketplaceItem } from './types';

export const AVATARS: MarketplaceItem[] = [
  { id: 'default', type: 'avatar', name: 'Initials', description: 'Your default look', price: 0, emoji: '👤', rarity: 'common' },
  { id: 'ninja', type: 'avatar', name: 'Ninja', description: 'Silent and focused', price: 50, emoji: '🥷', rarity: 'common' },
  { id: 'astronaut', type: 'avatar', name: 'Astronaut', description: 'Reach for the stars', price: 150, emoji: '👨‍🚀', rarity: 'rare' },
  { id: 'wizard', type: 'avatar', name: 'Wizard', description: 'Master of productivity magic', price: 300, emoji: '🧙', rarity: 'rare' },
  { id: 'robot', type: 'avatar', name: 'Cyborg', description: 'Maximum efficiency mode', price: 500, emoji: '🤖', rarity: 'epic' },
  { id: 'dragon', type: 'avatar', name: 'Dragon', description: 'Legendary power unleashed', price: 1000, emoji: '🐉', rarity: 'legendary' },
  { id: 'samurai', type: 'avatar', name: 'Samurai', description: 'Discipline and honor', price: 200, emoji: '⚔️', rarity: 'rare' },
  { id: 'cat', type: 'avatar', name: 'Productivity Cat', description: 'Purring through tasks', price: 80, emoji: '🐱', rarity: 'common' },
  { id: 'fox', type: 'avatar', name: 'Clever Fox', description: 'Outfox your to-do list', price: 120, emoji: '🦊', rarity: 'common' },
  { id: 'phoenix', type: 'avatar', name: 'Phoenix', description: 'Rise from the burnout', price: 750, emoji: '🦅', rarity: 'epic' },
];

export const BADGES: MarketplaceItem[] = [
  { id: 'streak7', type: 'badge', name: '7-Day Streak', description: 'Completed 7 days in a row', price: 0, emoji: '🔥', rarity: 'common' },
  { id: 'centurion', type: 'badge', name: 'Centurion', description: 'Earned 100+ points', price: 0, emoji: '💯', rarity: 'common' },
  { id: 'speedster', type: 'badge', name: 'Speedster', description: 'Completed 5 tasks in one day', price: 100, emoji: '⚡', rarity: 'rare' },
  { id: 'nightowl', type: 'badge', name: 'Night Owl', description: 'Working after midnight', price: 80, emoji: '🦉', rarity: 'common' },
  { id: 'earlybird', type: 'badge', name: 'Early Bird', description: 'Started before 7 AM', price: 80, emoji: '🌅', rarity: 'common' },
  { id: 'godmode', type: 'badge', name: 'God Mode', description: 'Achieved burnout score of 0', price: 500, emoji: '👑', rarity: 'epic' },
  { id: 'balanced', type: 'badge', name: 'Zen Master', description: 'Perfect zone balance for a week', price: 350, emoji: '☯️', rarity: 'rare' },
  { id: 'grinder', type: 'badge', name: 'The Grinder', description: 'Completed 50 tasks total', price: 200, emoji: '⚙️', rarity: 'rare' },
  { id: 'legend', type: 'badge', name: 'Legend', description: 'Reached Level 7', price: 0, emoji: '🏆', rarity: 'legendary' },
  { id: 'socialite', type: 'badge', name: 'Socialite', description: 'Invited 3 friends', price: 0, emoji: '🤝', rarity: 'common' },
];

export const rarityColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  common: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', glow: '' },
  rare: { bg: 'bg-work-50', text: 'text-work-600', border: 'border-work-200', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]' },
  epic: { bg: 'bg-study-50', text: 'text-study-600', border: 'border-study-200', glow: 'shadow-[0_0_16px_rgba(139,92,246,0.3)]' },
  legendary: { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-300', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]' },
};
