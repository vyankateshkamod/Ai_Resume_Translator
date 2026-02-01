const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const key = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("Found models, writing to models.json");
            fs.writeFileSync('models.json', JSON.stringify(data.models, null, 2));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
