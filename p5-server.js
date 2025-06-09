// This file is a NodeJS web server that will interact with your browser.
// You must use the Express middleware framework.
// You must import and use at least two functions from your game file.
// You must have at least two GET routes that accept and return JSON.
// You must have at least one POST route that accepts and returns JSON.
// You must include the ability to return files in a public subfolder (see app.use with express.static).
// Your server must listen on localhost and port 4000, and display the running IP and port to the server console.
// Recommended: If you haven't used nodemon yet, you are encouraged to use nodemon with this project.

// express setup
const express = require("express");
const app = express();
const PORT = 4000;

const { startNewGame, getGrid, getWords, submitWord } = require("./p5-game");

// routes
app.use(express.json());
app.use(express.static("public"));

app.get("/newgame", (req, res) => {
    const theme = req.query.theme || "Animals";
    const gameData = startNewGame(theme);
    res.json(gameData);
});

// gets the current puzzle grid
app.get("/grid", (req, res) => {
    const grid = getGrid();
    if (!grid) return res.status(400).json({error: "No game in progress."});
    res.json({ grid });
});

// gets the current list of words with the found status
app.get("/words", (req, res) => {
    const words = getWords();
    if (!words) return res.status(400).json({ error: "No game in progress."});
    res.json({ words });
});

// lets the client submit a guessed word to server
app.post("/submit", (req, res) => {
    const { word } = req.body;
    if (!word) return res.status(400).json({ success: false, message: "No word submitted."});

    const result = submitWord(word);
    res.json(result);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});