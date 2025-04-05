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