import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

interface AuthScreenProps {
  onComplete: () => void;
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [phase, setPhase] = useState<'splash' | 'login' | 'signup'>('splash');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (phase !== 'splash') return;
    const timer = setTimeout(() => setPhase('login'), 2500);
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
