import { useState } from 'react';
import type { UserProfile, MarketplaceItem } from '../types';
import { AVATARS, BADGES, rarityColors } from '../marketplace';
import { calculateLevel } from '../points';
import {
  Settings as SettingsIcon,
  ChevronRight,
  ShoppingBag,
  Flame,
  Trophy,
  Star,
  Lock,
  Check,
  Crown,
  Zap,
} from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  onBuyItem: (item: MarketplaceItem) => void;
  onEquipAvatar: (id: string) => void;
  onEquipBadge: (id: string) => void;
  onNavigateSettings: () => void;
}

export function ProfileScreen({
  profile,
  onBuyItem,
  onEquipAvatar,
  onEquipBadge,
  onNavigateSettings,
}: ProfileScreenProps) {
  const [tab, setTab] = useState<'overview' | 'avatars' | 'badges'>('overview');
  const availablePoints = profile.totalPoints - profile.spentPoints;
  const levelInfo = calculateLevel(profile.totalPoints);
  const equippedAvatar = AVATARS.find((a) => a.id === profile.equippedAvatar);
  const equippedBadge = BADGES.find((b) => b.id === profile.equippedBadge);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-4">
      {/* Profile header card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 sm:p-6 mb-5 shadow-card">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shrink-0">
            {equippedAvatar?.emoji ?? '👤'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white">{profile.name}</h1>
              {equippedBadge && (
                <span className="text-lg" title={equippedBadge.name}>{equippedBadge.emoji}</span>
              )}
            </div>
            <p className="text-sm text-white/70">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 text-white text-xs font-semibold">
                <Crown size={12} /> Lv {levelInfo.level} · {levelInfo.title}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 text-white text-xs font-semibold">
                <Zap size={12} /> {availablePoints} pts
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateSettings}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 text-white text-xs font-medium hover:bg-white/25 transition-all"
          >
            <SettingsIcon size={14} /> Settings
          </button>
        </div>

        {/* Level progress bar */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/70">Level {levelInfo.level}</span>
            <span className="text-xs text-white/70">{profile.totalPoints} / {levelInfo.nextLevelAt} pts to Lv {levelInfo.level + 1}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (profile.totalPoints / levelInfo.nextLevelAt) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center mx-auto mb-2">
            <Flame size={20} className="text-warning-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{profile.currentStreak}</p>
          <p className="text-xs text-slate-400 mt-0.5">Day streak</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-2">
            <Trophy size={20} className="text-brand-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{profile.longestStreak}</p>
          <p className="text-xs text-slate-400 mt-0.5">Best streak</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-study-50 flex items-center justify-center mx-auto mb-2">
            <Star size={20} className="text-study-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{profile.totalPoints}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total points</p>
        </div>
      </div>

      {/* Weekly streak */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">This Week's Streak</h3>
          <span className="text-xs text-slate-400">{profile.weeklyStreakDays.filter(Boolean).length}/7 days</span>
        </div>
        <div className="flex gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  profile.weeklyStreakDays[i]
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {profile.weeklyStreakDays[i] ? <Check size={16} /> : d}
              </div>
              <span className="text-[10px] text-slate-400">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marketplace tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {([
            { id: 'overview', label: 'Overview' },
            { id: 'avatars', label: 'Avatars' },
            { id: 'badges', label: 'Badges' },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700">
          <Zap size={14} />
          <span className="text-sm font-semibold">{availablePoints}</span>
          <span className="text-xs text-brand-600">pts</span>
        </div>
      </div>

      {tab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={18} className="text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Marketplace</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Earn points by completing tasks — points are AI-assigned based on task difficulty, duration, and dependencies. You can't set them yourself to prevent cheating.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTab('avatars')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-study-50 flex items-center justify-center text-xl">🥷</div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-900">Avatars</p>
                  <p className="text-xs text-slate-400">{profile.unlockedAvatars.length} owned</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
              <button
                onClick={() => setTab('badges')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center text-xl">🏆</div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-900">Badges</p>
                  <p className="text-xs text-slate-400">{profile.unlockedBadges.length} owned</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            </div>
          </div>

          {/* How to earn */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3">How to Earn Points</h3>
            <div className="space-y-2">
              {[
                { label: 'Complete a low priority task', pts: 10, icon: '🟢' },
                { label: 'Complete a medium priority task', pts: 20, icon: '🟡' },
                { label: 'Complete a high priority task', pts: 35, icon: '🔴' },
                { label: 'Duration bonus (30min+)', pts: '+5', icon: '⏱️' },
                { label: 'Duration bonus (60min+)', pts: '+15', icon: '⏱️' },
                { label: 'Per dependency', pts: '+5', icon: '🔗' },
                { label: 'Daily streak bonus', pts: '+10', icon: '🔥' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span>{row.icon}</span> {row.label}
                  </span>
                  <span className="text-sm font-semibold text-brand-600">+{row.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'avatars' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
          {AVATARS.map((avatar) => {
            const owned = profile.unlockedAvatars.includes(avatar.id);
            const equipped = profile.equippedAvatar === avatar.id;
            const canAfford = availablePoints >= avatar.price;
            const rarity = rarityColors[avatar.rarity];

            return (
              <div
                key={avatar.id}
                className={`relative rounded-2xl border-2 p-4 text-center transition-all ${rarity.border} ${equipped ? rarity.bg + ' ring-2 ring-brand-400' : 'bg-white'} ${rarity.glow}`}
              >
                {equipped && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-brand-500 text-white text-[10px] font-bold">
                    EQUIPPED
                  </span>
                )}
                <div className="text-4xl mb-2">{avatar.emoji}</div>
                <p className="text-sm font-bold text-slate-900">{avatar.name}</p>
                <p className="text-[11px] text-slate-400 mb-2">{avatar.description}</p>
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium ${rarity.bg} ${rarity.text} mb-2`}>
                  {avatar.rarity}
                </span>

                {owned ? (
                  equipped ? (
                    <div className="flex items-center justify-center gap-1 text-xs text-brand-600 font-medium">
                      <Check size={14} /> Active
                    </div>
                  ) : (
                    <button
                      onClick={() => onEquipAvatar(avatar.id)}
                      className="w-full py-2 rounded-lg bg-brand-50 text-brand-700 text-xs font-medium hover:bg-brand-100 transition-all"
                    >
                      Equip
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => canAfford && onBuyItem(avatar)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                      canAfford
                        ? 'bg-brand-600 text-white hover:opacity-90'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? <><Zap size={12} /> {avatar.price}</> : <><Lock size={12} /> {avatar.price} pts</>}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'badges' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
          {BADGES.map((badge) => {
            const owned = profile.unlockedBadges.includes(badge.id);
            const equipped = profile.equippedBadge === badge.id;
            const canAfford = availablePoints >= badge.price;
            const rarity = rarityColors[badge.rarity];

            return (
              <div
                key={badge.id}
                className={`relative rounded-2xl border-2 p-4 text-center transition-all ${rarity.border} ${equipped ? rarity.bg + ' ring-2 ring-brand-400' : 'bg-white'} ${rarity.glow}`}
              >
                {equipped && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-brand-500 text-white text-[10px] font-bold">
                    EQUIPPED
                  </span>
                )}
                <div className="text-4xl mb-2">{badge.emoji}</div>
                <p className="text-sm font-bold text-slate-900">{badge.name}</p>
                <p className="text-[11px] text-slate-400 mb-2">{badge.description}</p>
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium ${rarity.bg} ${rarity.text} mb-2`}>
                  {badge.rarity}
                </span>

                {owned ? (
                  equipped ? (
                    <div className="flex items-center justify-center gap-1 text-xs text-brand-600 font-medium">
                      <Check size={14} /> Active
                    </div>
                  ) : (
                    <button
                      onClick={() => onEquipBadge(badge.id)}
                      className="w-full py-2 rounded-lg bg-brand-50 text-brand-700 text-xs font-medium hover:bg-brand-100 transition-all"
                    >
                      Equip
                    </button>
                  )
                ) : badge.price === 0 ? (
                  <div className="text-xs text-slate-400 py-2">Locked achievement</div>
                ) : (
                  <button
                    onClick={() => canAfford && onBuyItem(badge)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                      canAfford
                        ? 'bg-brand-600 text-white hover:opacity-90'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? <><Zap size={12} /> {badge.price}</> : <><Lock size={12} /> {badge.price} pts</>}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile settings button */}
      <button
        onClick={onNavigateSettings}
        className="sm:hidden w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
      >
        <SettingsIcon size={16} /> Go to Settings
      </button>
    </div>
  );
}
