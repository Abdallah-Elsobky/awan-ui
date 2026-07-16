import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Sparkles, Eye, EyeOff, Zap, Target, User, ChevronRight } from 'lucide-react';

interface AuthScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "Guilt-Free Productivity",
    subtitle: "The Core Philosophy",
    description: "AWAN is designed to balance active work with intentional rest, preventing stress overload while maintaining high daily output.",
    color: "from-brand-500 to-brand-700",
    renderAnimation: () => (
      <div className="relative w-full h-40 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
        {/* Floating balance scale or nodes */}
        <div className="absolute top-4 left-10 flex flex-col items-center animate-float-slow">
          <div className="px-2.5 py-1.5 rounded-lg bg-work-100 flex items-center justify-center shadow-md">
            <span className="text-[10px] font-bold text-work-600">Work</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-work-400 mt-1 animate-ping" />
        </div>

        <div className="absolute bottom-4 right-10 flex flex-col items-center animate-float-slow" style={{ animationDelay: "1.5s" }}>
          <div className="px-2.5 py-1.5 rounded-lg bg-brand-100 flex items-center justify-center shadow-md">
            <span className="text-[10px] font-bold text-brand-600">Rest</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1 animate-ping" />
        </div>

        {/* Central balancing node */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg z-10 animate-pulse-soft">
          <span className="text-xs">You</span>
        </div>

        {/* Connecting pulse paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="60" y1="40" x2="135" y2="80" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5, 3" className="animate-dash-pulse" />
          <line x1="240" y1="120" x2="165" y2="80" stroke="#22c55e" strokeWidth="2" strokeDasharray="5, 3" className="animate-dash-pulse" />
        </svg>
      </div>
    )
  },
  {
    title: "AI Burnout Guardian",
    subtitle: "AI Prediction Feature",
    description: "Our machine learning engine tracks your scheduled time across life zones and flags burnout risk ahead of schedule conflicts.",
    color: "from-amber-500 to-rose-500",
    renderAnimation: () => (
      <div className="relative w-full h-40 flex flex-col items-center justify-center bg-slate-900 rounded-2xl overflow-hidden shadow-lg p-3">
        {/* Burnout gauge */}
        <div className="relative w-32 h-16 overflow-hidden flex items-end justify-center">
          <svg className="w-28 h-14" viewBox="0 0 100 55">
            {/* Base track */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#334155"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Colored arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="65%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="3" fill="#ffffff" />
            <line x1="50" y1="50" x2="50" y2="15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" className="animate-gauge-sweep" />
          </svg>
        </div>

        {/* Warning Indicator */}
        <div className="mt-1 w-full flex items-center justify-between text-[10px] px-2">
          <span className="text-slate-400 font-medium">Risk Status:</span>
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30 animate-pulse-soft">
            High Risk
          </span>
        </div>

        {/* AI Action suggestion overlay */}
        <div className="absolute bottom-1.5 left-2 right-2 p-1.5 rounded-lg bg-slate-800/90 border border-slate-700/60 shadow-md animate-warning-pulse">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping absolute" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 relative" />
            <span className="text-[9px] text-white font-bold">AI Co-Pilot suggestion:</span>
          </div>
          <p className="text-[8px] text-slate-300 mt-0.5">Auto-scheduling 15m mindfulness recovery.</p>
        </div>
      </div>
    )
  },
  {
    title: "Balanced Life Zones",
    subtitle: "Custom Balance System",
    description: "Categorize tasks by energy pools (Work, Study, Play, Personal) to limit capacity and construct a balanced calendar.",
    color: "from-blue-500 to-indigo-600",
    renderAnimation: () => (
      <div className="relative w-full h-40 flex flex-col justify-center bg-slate-50 rounded-2xl border border-slate-100 p-3 overflow-hidden shadow-inner">
        <div className="space-y-2">
          {/* Work pillar */}
          <div>
            <div className="flex justify-between text-[9px] font-bold text-slate-600 mb-0.5">
              <span>💼 WORK ZONE</span>
              <span className="text-red-500">8.5h / 6h (Over Limit!)</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: "90%" }} />
            </div>
          </div>

          {/* Study pillar */}
          <div>
            <div className="flex justify-between text-[9px] font-bold text-slate-600 mb-0.5">
              <span>📚 STUDY ZONE</span>
              <span className="text-brand-600">3h / 4h</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: "75%" }} />
            </div>
          </div>

          {/* Floating task shift node */}
          <div className="absolute top-[42px] right-6 px-2 py-0.5 bg-white border border-slate-200 rounded-md shadow-md text-[8px] font-bold text-slate-700 flex items-center gap-1 animate-task-shift">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Shift task to Personal</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Gamified XP & Rewards",
    subtitle: "Marketplace & Badges",
    description: "Earn XP by completing tasks, unlock specialized badges, and trade items in the custom items Marketplace.",
    color: "from-pink-500 to-purple-600",
    renderAnimation: () => (
      <div className="relative w-full h-40 flex items-center justify-between bg-slate-50 rounded-2xl border border-slate-100 p-3 overflow-hidden shadow-inner">
        {/* Task list card */}
        <div className="w-[52%] p-2 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5 relative">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-brand-500 bg-brand-500 flex items-center justify-center">
              <span className="text-[8px] text-white font-black">✓</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 line-through truncate">Finish React UI build</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full" style={{ width: "100%" }} />
          </div>
          {/* Floating XP bubble */}
          <div className="absolute -top-2.5 right-1.5 text-[9px] font-extrabold text-brand-600 animate-xp-rise">
            +50 XP
          </div>
        </div>

        {/* Shiny Badge Node */}
        <div className="w-[40%] flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/5 to-yellow-500/10 rounded-xl p-2 border border-yellow-500/20">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white shadow-md animate-badge-sparkle">
            <span className="text-base">🏆</span>
          </div>
          <span className="text-[8px] font-extrabold text-amber-800 mt-1 tracking-tight">Zen Master</span>
        </div>
      </div>
    )
  }
];

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [phase, setPhase] = useState<'splash' | 'tour' | 'login' | 'signup'>('splash');
  const [activeSlide, setActiveSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (phase !== 'splash') return;
    const timer = setTimeout(() => setPhase('tour'), 2500);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'splash') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-study-600 animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center animate-scale-in">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight animate-fade-in animate-delay-200">
            AWAN
          </h1>
          <p className="text-sm text-white/80 animate-fade-in animate-delay-300">
            Your guilt-free productivity companion
          </p>
          <div className="flex gap-1.5 mt-6 animate-fade-in animate-delay-500">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-white/60 animate-pulse-soft"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'tour') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 animate-fade-in justify-between p-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-xs font-black text-slate-800 tracking-wider">AWAN</span>
          </div>
          <button
            onClick={() => setPhase('login')}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Content Area - Slider content */}
        <div className="flex-1 flex flex-col justify-center my-auto">
          {/* Animation View */}
          <div className="mb-6">
            {slides[activeSlide].renderAnimation()}
          </div>

          {/* Texts */}
          <div className="text-center px-1">
            <span className="text-[9px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-full">
              {slides[activeSlide].subtitle}
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-2 mb-1.5 leading-snug">
              {slides[activeSlide].title}
            </h2>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-[280px] mx-auto min-h-[48px]">
              {slides[activeSlide].description}
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="space-y-4">
          {/* Dot Indicators */}
          <div className="flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === i ? 'w-5 bg-brand-600' : 'w-1.5 bg-slate-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                if (activeSlide === slides.length - 1) {
                  setPhase('login');
                } else {
                  setActiveSlide((prev) => prev + 1);
                }
              }}
              className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(34,197,94,0.25)] active:scale-98 transition-all"
            >
              {activeSlide === slides.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight size={14} />
            </button>
            {activeSlide > 0 && (
              <button
                onClick={() => setActiveSlide((prev) => prev - 1)}
                className="w-full h-8 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-bold active:scale-98 transition-all"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col lg:flex-row bg-slate-50">
      {/* Hero side (desktop) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-600 via-brand-700 to-study-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-6">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">AWAN</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            A guilt-free, AI-powered life operating system. Manage tasks, track energy,
            and prevent burnout — all in one place.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'Burnout prediction & energy mapping',
              'Smart task scheduling by zone',
              'AI-powered recovery suggestions',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-3">
              <Sparkles size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">AWAN</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {phase === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {phase === 'login'
              ? 'Sign in to continue to your dashboard.'
              : 'Start your guilt-free productivity journey today.'}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onComplete();
            }}
            className="space-y-4"
          >
            {phase === 'signup' && (
              <Input label="Full name" placeholder="Jane Doe" required />
            )}
            <Input label="Email" type="email" placeholder="you@example.com" required />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" fullWidth size="lg">
              {phase === 'login' ? 'Continue' : 'Sign up'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or continue with Google</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={onComplete}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus-ring"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            {phase === 'login' ? 'New to AWAN? ' : 'Already have an account? '}
            <button
              onClick={() => setPhase(phase === 'login' ? 'signup' : 'login')}
              className="text-brand-600 font-medium hover:underline"
            >
              {phase === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
