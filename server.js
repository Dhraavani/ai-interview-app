const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Interview page
app.get("/interview.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "interview.html"));
});

// Health check
app.get("/api", (req, res) => {
    res.json({
        status: "success",
        message: "AI Interview App is running successfully!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});