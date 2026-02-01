import Link from 'next/link';

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full bg-slate-900/50 p-8 rounded-xl border border-red-500/20 text-center">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Authentication Error</h1>
                <p className="text-slate-400 mb-6">
                    There was a problem signing you in. This could be due to an expired link or a configuration issue.
                </p>
                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="block w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 rounded-lg transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
