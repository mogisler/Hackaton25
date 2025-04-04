import express from "express";
import Configuration from "openai";
import OpenAIApi from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// OpenAI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API endpoint for OpenAI completion
app.post("/api/completion", async (req, res) => {
    const { prompt } = req.body;

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: 4000,
        });
        res.json({ response: completion.data.choices[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch completion" });
    }
});

try {
// Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
} catch (error) {
    console.error("Failed to start the server:", error);
}