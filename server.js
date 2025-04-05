import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3000;
app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON requests
app.use(express.json());

// OpenAI configuration
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
  });

// API endpoint for OpenAI completion
app.post('/openAPI', async(req, res) => {
    console.log(`request on ${port}`);
    const { prompt } = req.body;

    try {
        const completion = await client.responses.create({
            model: 'gpt-4o',
            input: prompt,
            text: {format: {type: 'json_object'}},
        });
        const output = completion.output_text;
        const parsedJSON = JSON.parse(output);
        res.json(parsedJSON);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

app.post('/trainedAPI', async(req, res) => {
    const thread = await client.beta.threads.create();
    await client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: "Ich möchte eine private Veranstaltung in meinem Garten in Altdorf organisieren. Es kommen ca. 20 Personen aus der ganzen Schweiz primär mit ihrem Auto. Leider habe ich nicht genügend Parkplätze. Mein Kollege Toni bringt eine Drone mit, damit wir diese nutzen können.",
    });
    
    const run = await client.beta.threads.runs.create(thread.id, {
        assistant_id:'asst_TIseKb88KKuVNXy7rGbErSpi',
    });

    // 4. Poll until the run completes
    let runStatus;
    do {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
        runStatus = await client.beta.threads.runs.retrieve(thread.id, run.id);
    } while (runStatus.status !== "completed");

    // 5. Retrieve the messages
    const messages = await client.beta.threads.messages.list(thread.id);

    for (const message of messages.data.reverse()) {
        console.log(`${message.role}: ${message.content[0].text.value}`);
    }
});

try {
    // Start the server
    const server = app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            console.error(`Error while running the server: Port ${port} is already in use.`);
            process.exit(2);
        } else {
            console.error(`Error while running the server: ${error}`);
            // process.exit(3);
        }
    });
} catch (error) {
    console.error(`Failed to start the server: ${error}`);
    process.exit(1);
}