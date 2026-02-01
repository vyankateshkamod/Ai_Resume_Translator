'use client';

import { Upload, FileText, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ResumeUploaderProps {
    onUpload: (file: File) => void;
    isUploading: boolean;
}

export function ResumeUploader({ onUpload, isUploading }: ResumeUploaderProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    }, [onUpload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className={`relative w-full max-w-xl mx-auto h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${dragActive
                    ? 'border-blue-500 bg-blue-50/10 scale-[1.02]'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleChange}
                disabled={isUploading}
            />

            <div className="flex flex-col items-center gap-4 text-slate-400">
                {isUploading ? (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                        <p className="text-sm font-medium animate-pulse">Processing your resume...</p>
                    </>
                ) : (
                    <>
                        <div className="p-4 rounded-full bg-slate-800 ring-1 ring-slate-700 shadow-xl">
                            <Upload className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-slate-200">
                                Drop your resume here
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                Supports PDF format only
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
