import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Languages, ArrowRight } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative text-center space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Languages className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Resume Translation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Globalize Your Career in One Click
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
          Instantly translate your resume into any language while maintaining professional tone, context, and formatting. Powered by Lingo.dev.
        </p>

        <div className="pt-8 flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200">
          <Link
            href="/login"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-8 font-medium text-white transition-all duration-300 hover:bg-blue-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="mr-2">Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
