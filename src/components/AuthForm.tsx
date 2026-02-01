'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Using the client-side client we made earlier
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;

                if (data.session) {
                    // Email confirmation disabled, immediate login
                    router.push('/');
                    router.refresh();
                } else {
                    setMessage('Check your email for the confirmation link.');
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
            <form onSubmit={handleAuth} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                </div>
            </div>

            <button
                type="button"
                onClick={async () => {
                    await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: `${location.origin}/auth/callback`,
                        },
                    });
                }}
                className="w-full bg-slate-100 hover:bg-white text-slate-900 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                Google
            </button>

            <div className="mt-6 text-center">
                <button
                    onClick={() => {
                        setMode(mode === 'login' ? 'signup' : 'login');
                        setError(null);
                        setMessage(null);
                    }}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                    {mode === 'login'
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                </button>
            </div>
        </div>
    );
}
