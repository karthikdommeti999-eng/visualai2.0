import dotenv from 'dotenv';
dotenv.config();

const testAI = async () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("Testing with API Key:", apiKey ? "Present (Length: " + apiKey.length + ")" : "MISSING");

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat",
                "messages": [{ "role": "user", "content": "Say hello" }]
            })
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Test Error:", error);
    }
};

testAI();
