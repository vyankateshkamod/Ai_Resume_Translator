# AI Resume Translator

An AI-powered application that seamlessly translates and formats resumes into multiple languages (Spanish, French, German) while preserving the original structure. Built with Next.js, Supabase, and Google Gemini.

# Demo Video
https://github.com/vyankateshkamod/Project-Assests/blob/main/Ai_Resume_Translator/Screen%20Recording%202026-02-01%20232812.mp4

## 🚀 Features

- **Upload & Parse**: Supports PDF resume uploads.
- **Hybrid Translation Pipeline**:
  - **Translation**: Uses [Lingo.dev](https://lingo.dev/) for high-quality resume translation.
  - **Formatting**: Uses [Google Gemini](https://ai.google.dev/) to structure the translated text into clean Markdown.
  - **Auto-Fallback**: Automatically switches to a full Gemini pipeline if Lingo.dev quota is exceeded or fails.
- **Smart Formatting**: Automatically detects resume sections and reformats them.
- **Supabase Integration**: Stores original files, translated outputs, and user records.
- **Multi-language Support**: Translate to Spanish (`es`), French (`fr`), or German (`de`).

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Translation**: [Lingo.dev](https://lingo.dev/)
- **Formatting**: [Google Gemini](https://ai.google.dev/) (`gemini-flash-latest`)
- **PDF Processing**: `pdf-parse`

## ⚙️ Requirements

- Node.js (v18 or higher)
- npm / yarn / pnpm
- A Supabase project
- A Lingo.dev API Key
- A Google Gemini API Key

## 🏗 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vyankateshkamod/Ai_Resume_Translator.git
   cd Ai_Resume_Translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Fill in your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   LINGODOTDEV_API_KEY=your_lingo_dev_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📜 Build & Run

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 📂 Project Structure

- `src/app`: App Router pages and API routes.
- `src/lib`: Utility functions and Supabase client setup.
- `src/components`: React components.
- `public`: Static assets.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


