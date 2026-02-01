import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './client'; // We'll move the client interactive parts here

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch translations
    const { data: translations } = await supabase
        .from('translations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                        Your Translations
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">{user.email}</span>
                        <form action="/auth/signout" method="post">
                            <button className="text-sm text-red-400 hover:text-red-300">Sign Out</button>
                        </form>
                    </div>
                </div>

                <DashboardClient translations={translations || []} />
            </div>
        </div>
    );
}
