'use client';

import { useState } from 'react';
import { ResumeUploader } from '@/components/ResumeUploader';
import { TranslationResult } from '@/components/TranslationResult';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

export default function DashboardClient({ translations }: { translations: any[] }) {
    const [isUploading, setIsUploading] = useState(false);
    const [currentTranslation, setCurrentTranslation] = useState<{ original: string, translated: string } | null>(null);
    const [targetLanguage, setTargetLanguage] = useState('es');
    const [history, setHistory] = useState(translations);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetLanguage', targetLanguage);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Translation failed');

            const data = await response.json();
            setCurrentTranslation({
                original: data.originalText,
                translated: data.translatedText
            });

            // Refresh list nicely? For now just append strictly, but page refresh is better for real data.
            // Ideally we re-fetch or optimistically update. 
            // Let's just show the result.
        } catch (error) {
            alert('Error translating resume');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Upload Section */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <h2 className="text-xl font-semibold mb-4 text-slate-300">New Translation</h2>

                    <div className="mb-4">
                        <label className="text-sm font-medium text-slate-400 mr-2">Target Language:</label>
                        <select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto [&>*]:bg-slate-900"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>
                    <ResumeUploader onUpload={handleUpload} isUploading={isUploading} />
                </div>

                {/* Result Section */}
                {currentTranslation && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-semibold text-slate-300">Result</h2>
                        <TranslationResult
                            originalText={currentTranslation.original}
                            translatedText={currentTranslation.translated}
                        />
                    </div>
                )}
            </div>

            {/* Sidebar History */}
            <div className="bg-slate-900/30 rounded-2xl border border-slate-800 p-6 h-fit max-h-[800px] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4 text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> History
                </h2>
                <div className="space-y-3">
                    {history.map((record) => (
                        <div key={record.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-slate-300">Resume</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${record.status === 'done' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                    {record.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                                <span>{new Date(record.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                                    {record.source_lang} <ArrowRight className="w-3 h-3" /> {record.target_lang}
                                </span>
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <p className="text-sm text-slate-600 text-center py-4">No translations yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
