import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the React client build
app.use(express.static(path.join(__dirname, '../dist')));

// Real AI Logic using OpenRouter
const generateAIResponse = async (message) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error("OPENROUTER_API_KEY is not defined in .env file");
        }

        console.log("Sending request to OpenRouter...");
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://visualai.vercel.app",
                "X-Title": "Visual AI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are Karthik's AI Fitness & Life Coach. You are motivational, precise, and helpful. You help with workouts, diet, and general motivation. Keep answers concise."
                    },
                    { "role": "user", "content": message }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OpenRouter API Error (${response.status}):`, errorText);
            throw new Error(`AI Service Error (${response.status})`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error("OpenRouter Response missing choices:", data);
            throw new Error("AI produced an empty response.");
        }
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`User message: ${message}`);
        const response = await generateAIResponse(message);
        console.log(`AI Response: ${response.substring(0, 50)}...`);

        res.json({
            reply: response,
            timestamp: new Date().toISOString(),
            aiModel: 'OpenRouter-DeepSeek'
        });

    } catch (error) {
        console.error('API /api/chat Error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to process AI request' });
    }
});

// Handle React routing, return all requests to React app
app.use((req, res) => {
    // Check if request is for API
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// For Vercel Serverless
export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        // Keep process alive just in case
        setInterval(() => { }, 10000);
    });
}
