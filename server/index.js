import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "HTTP-Referer": "https://visualai.vercel.app",
                "X-Title": "Visual AI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat", // Good all-around model
                "messages": [
                    {
                        "role": "system",
                        "content": "You are Karthik's AI Fitness & Life Coach. You are motivational, precise, and helpful. You help with workouts, diet, and general motivation. Keep answers concise."
                    },
                    { "role": "user", "content": message }
                ]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error("OpenRouter Error:", data);
            return "I'm having trouble connecting to my brain right now. Please try again.";
        }
    } catch (error) {
        console.error("AI Fetch Error:", error);
        return "Sorry, I couldn't reach the AI server.";
    }
};

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await generateAIResponse(message);

        res.json({
            reply: response,
            timestamp: new Date().toISOString(),
            aiModel: 'OpenRouter-DeepSeek'
        });

    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to process AI request' });
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
