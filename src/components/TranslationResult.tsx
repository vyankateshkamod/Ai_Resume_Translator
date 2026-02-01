import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';

interface TranslationResultProps {
    originalText: string;
    translatedText: string;
}

export function TranslationResult({ originalText, translatedText }: TranslationResultProps) {

    const handleDownload = () => {
        const doc = new jsPDF();
        const lineHeight = 6;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        let y = 25;

        // Remove markdown symbols for PDF for now (simple regex strip)
        const cleanText = translatedText.replace(/[#*`_~]/g, '');
        const splitText = doc.splitTextToSize(cleanText, 180);

        doc.setFontSize(16);
        doc.text("Translated Resume", 10, 15);

        doc.setFontSize(12);

        splitText.forEach((line: string) => {
            if (y > pageHeight - margin) {
                doc.addPage();
                y = 20; // Restart at top of new page
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });

        doc.save("translated_resume.pdf");
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto mt-8">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-400 ml-1 uppercase tracking-wider">Original</h3>
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 min-h-[500px] text-slate-300 font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-[800px]">
                    {originalText}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-blue-400 ml-1 uppercase tracking-wider">Translated</h3>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
                    >
                        <Download className="w-3 h-3" /> Download PDF
                    </button>
                </div>
                <div className="p-6 rounded-xl bg-slate-900/50 border border-blue-900/30 min-h-[500px] text-slate-100 text-sm overflow-y-auto max-h-[800px] shadow-[0_0_50px_-12px_rgba(59,130,246,0.1)] prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{translatedText}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
