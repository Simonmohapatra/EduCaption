require('dotenv').config();
console.log("OPENAI_API_KEY is:", process.env.OPENAI_API_KEY);
const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// connect DBs (Mongo optional, SQLite always)
connectMongoDB();

// root
app.get('/', (_req, res) => res.send('Backend is running ✅'));

// api routes
app.use('/api', require('./Routes/recapRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);



const { OpenAI } = require("openai");


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Example endpoint for chat completion
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }],
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Error with OpenAI:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);