require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectMongoDB } = require("./config/db");
const { OpenAI } = require("openai");

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect DB (Mongo optional, SQLite always)
connectMongoDB();

// Root route
app.get("/", (_req, res) => res.send("✅ Backend is running"));


// Temporary test route for frontend
app.get("/api/test", (req, res) => {
    res.json({ message: "✅ Backend is working!" });
});

// API routes
const recapRoutes = require("./routes/recapRoutes"); // ✅ make sure folder is lowercase "routes"
app.use("/api", recapRoutes);

// OpenAI client
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
        console.error("❌ Error with OpenAI:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Debugging log
console.log("🔑 OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");
