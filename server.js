import express, { text } from "express";
import OpenAI from "openai";
import RequestOptions from "openai";
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
    const { inputPrompt } = req.body;

    const prompt = '# Einleitung \
    \
    Unten befinden sich Informationen zu einer Veranstaltung. Das Ziel\ ist es, diese Veranstaltung zu analysieren und die relevanten\ Informationen als JSON auszugeben. Es soll nur das JSON ausgegeben\ werden, kein Zusatztext.\
    \
    - Art: Die Art einer Veranstaltung: Private Veranstaltung,\ Wochenmarkt, Demonstration, etc.\
    - Ort: Der Ort im Kanton Uri, sollte mindestens die Gemeinde\ beinhalten\
    - Anzahl Teilnehmer: Zahl der Teilnehmer\
    - Datum: Wenn bekannt das Datum in der Form dd.MM.yyyy\
    - Zeit: Wenn bekannt die Uhrzeit in der Form HH:mm\
    - Ausschank: Boolean-Wert (true, false) ob an der Veranstaltung\ Essen und Getränke verkauft werden\
    \
    Wichtig: Wenn eine Information nicht bekannt ist, bitte `null`\ zurückgeben. Wenn ein boolean nicht bekannt ist gib "false" zurück. Bitte gib ein reines unformatiertes JSON zurück.\
    \
    # JSON Format\
    \
    {\
        "Art": "<string>",\
        "Ort": "<string>",\
        "AnzahlTeilnehmer": <number>,\
        "Datum": "<date>",\
        "Zeit": "<time>",\
        "Ausschank": <bool>\
    }\
    \
    # Information zur Veranstaltung \\ '+ inputPrompt;



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
    try{
        const input = req.body.inputPrompt
        const parameters = req.body.parameters
        const prompt =  `# Infromationen zu den Eventdaten: \n
        - Art: Die Art einer Veranstaltung: Private Veranstaltung,\ Wochenmarkt, Demonstration, etc.\n
        - Ort: Der Ort im Kanton Uri, sollte mindestens die Gemeinde\ beinhalten\n
        - Anzahl Teilnehmer: Zahl der Teilnehmer\n
        - Datum: Wenn bekannt das Datum in der Form dd.MM.yyyy\n
        - Zeit: Wenn bekannt die Uhrzeit in der Form HH:mm\n
        - Ausschank: Boolean-Wert (true, false) ob an der Veranstaltung\ Essen und Getränke verkauft werden\n
        #Struckutierte Eventdaten als JSON \n ${JSON.stringify(parameters)}
        \n #Eventbeschreibung \n ${input} \n `;
        const thread = await client.beta.threads.create({
            tool_resources: {
                file_search: {
                    vector_store_ids: ['vs_67f0ec62c7fc8191839ff5c6e9d9a471'],
                },
                
            },

        });
        await client.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: prompt,
            
        });
        
        const run = await client.beta.threads.runs.create(thread.id, {
            assistant_id:'asst_TIseKb88KKuVNXy7rGbErSpi',
            response_format: {type: 'json_object'},

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
            if(message.content[0].text.value.startsWith('```json')){
                // TODO make variable
                res.json(JSON.parse(message.content[0].text.value.substring(7, message.content[0].text.value.length - 3)));
                return;
            }
            //console.log(`${message.role}: ${message.content[0].text.value}`);
        }
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