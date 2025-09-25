const express = require("express");
const bodyParser = require("body-parser");
const recapRoutes = require("./routes/recapRoutes");

const app = express();
app.use(bodyParser.json());

// API routes
app.use("/api", recapRoutes);

app.listen(5000, () => {
    console.log("✅ Server running on http://localhost:5000");
});
