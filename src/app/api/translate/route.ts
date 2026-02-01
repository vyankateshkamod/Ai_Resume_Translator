import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';
// import { LingoDotDevEngine } from 'lingo.dev/sdk'; // Removed due to quota limits
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// const lingo = new LingoDotDevEngine({
//     apiKey: process.env.LINGODOTDEV_API_KEY!,
// });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const targetLanguage = formData.get('targetLanguage') as string || 'es';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Upload Original PDF to Supabase Storage
        const timestamp = Date.now();
        const filePath = `${user.id}/${timestamp}_${file.name}`;

        // Convert to ArrayBuffer for upload
        const fileBytes = await file.arrayBuffer();
        const fileBuffer = Buffer.from(fileBytes);

        const { error: uploadError } = await supabase.storage
            .from('resume-inputs')
            .upload(filePath, fileBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            throw new Error(`Storage Upload Failed: ${uploadError.message}`);
        }

        // 2. Extract Text
        const parser = new PDFParse({ data: fileBuffer });
        const data = await parser.getText();
        await parser.destroy();

        const originalText = data.text
            .replace(/\n\s*\n/g, '\n\n')
            .replace(/[ \t]+/g, ' ')
            .trim();

        // 3. Translate & Format with Gemini (Combined Step)
        // Lingo.dev quota exceeded, switching to Gemini for full pipeline
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `
    You are a professional resume translator and formatter.
    
    Task:
    1. Detect the language of the provided resume text.
    2. Translate the content into ${targetLanguage === 'es' ? 'Spanish' : targetLanguage === 'fr' ? 'French' : 'German'}.
    3. Format the result into a clean, structured, and professional layout using Markdown.
    
    Rules:
    1. Do NOT summarize or remove any information. Keep all content.
    2. Use standard resume sections (e.g., Experience, Education, Skills) translated appropriate.
    3. Use bullet points and clear spacing.
    4. Output the result as clean Markdown (headings with #, bullets with -).
    
    Text to translate and format:
    ${originalText}
    `;

        const result = await model.generateContent(prompt);
        let formattedTranslatedText = result.response.text();

        // Helper to clean LaTeX if AI uses it despite instructions
        formattedTranslatedText = formattedTranslatedText
            .replace(/\\textbf\{([^}]+)\}/g, '**$1**')
            .replace(/\\textit\{([^}]+)\}/g, '*$1*')
            .replace(/\\section\*?\{([^}]+)\}/g, '## $1')
            .replace(/\\subsection\*?\{([^}]+)\}/g, '### $1')
            .replace(/\\begin\{itemize\}/g, '')
            .replace(/\\end\{itemize\}/g, '')
            .replace(/\\item\s*/g, '- ')
            .replace(/\\[&%$#_]/g, match => match.slice(1)); // Unescape common chars



        // 6. Upload Translated Text to Storage
        const outputFilePath = `${user.id}/${timestamp}_${file.name}_translated.md`;
        await supabase.storage
            .from('resume-outputs')
            .upload(outputFilePath, formattedTranslatedText, {
                contentType: 'text/markdown',
                upsert: false
            });

        // 7. DB Record
        const { error: dbError } = await supabase
            .from('translations')
            .insert({
                user_id: user.id,
                source_lang: 'auto', // Implicitly detected by Gemini
                target_lang: targetLanguage,
                status: 'done',
                original_path: filePath,
                translated_path: outputFilePath
            });

        return NextResponse.json({
            originalText,
            translatedText: formattedTranslatedText
        });

    } catch (error: any) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
