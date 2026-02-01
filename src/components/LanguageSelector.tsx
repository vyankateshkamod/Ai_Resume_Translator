'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/languages';

interface LanguageSelectorProps {
    value: string;
    onChange: (code: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLanguage = SUPPORTED_LANGUAGES.find(l => l.code === value) || SUPPORTED_LANGUAGES[0];

    // Filter languages
    const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
                <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">
                        {selectedLanguage.code}
                    </span>
                    {selectedLanguage.name}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-slate-700/50">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search languages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                        {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        onChange(lang.code);
                                        setIsOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${lang.code === value
                                            ? 'bg-blue-500/10 text-blue-400'
                                            : 'text-slate-300 hover:bg-slate-700/50'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {lang.name}
                                    </span>
                                    {lang.code === value && <Check className="w-4 h-4" />}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-slate-500">
                                No languages found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
