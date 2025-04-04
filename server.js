import express from "express";
import Configuration from "openai";
import OpenAIApi from "openai";
import dotenv from "dotenv";
import OpenAI from "openai/index.mjs";

dotenv.config();

const app = express();
const port = 3000;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});