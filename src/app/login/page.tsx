import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">Login to Translator</h1>
                <AuthForm />
            </div>
        </div>
    );
}
