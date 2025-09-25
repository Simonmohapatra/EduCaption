const express = require("express");
const router = express.Router();
const { generateRecap } = require("../utils/recap");

// POST /api/recap
router.post("/recap", (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Transcript text required" });
        }

        const summary = generateRecap(text);
        res.json({ summary });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate recap" });
    }
});

module.exports = router;
