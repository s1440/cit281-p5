// This file is a NodeJS file that represents your game logic.
// You must import at least one class from the class file.
// Your game must include some type of array of objects.
// You must use at least one instance of const {} or const [] deconstruction.
// You must use at least one instance of the Array map() or forEach() methods.
// You must export any game functionality to be used by the web server.
// Reminder: You can test your game functionality as a stand alone program before connecting to a web server.

const { WordSearch } = require("./p5-class");

let currentGame = null;

function startNewGame(theme) {
    currentGame = new WordSearch (10, theme);
    return {
        grid: currentGame.grid,
        words: currentGame.words,
        theme: currentGame.theme
    };
}

module.exports = {
    startNewGame,
    getGrid,
    getWords,
    submitWord
};

function getGrid() {
    if (!currentGame) return null;
    return currentGame.grid;
}

function getWords() {
    if (!currentGame) return null;
    return currentGame.words;
}

function submitWord(guess) {
    if (!currentGame) return { success: false, message: "No game in progress." };
  
    const upperGuess = guess.toUpperCase();
    const wordObj = currentGame.words.find(w => w.word === upperGuess);
  
    if (wordObj && !wordObj.found) {
      wordObj.found = true;
      return {
        success: true,
        message: `You found: ${upperGuess}`,
        words: currentGame.words
      };
    } else {
      return {
        success: false,
        message: `${upperGuess} is not in the word list or was already found.`,
        words: currentGame.words
      };
    }
  }
  
  

// Quick test if running this file directly
if (require.main === module) {
    console.log("=== Starting New Game with 'States' Theme ===");
    const gameData = startNewGame("States");
  
    console.log("Grid:");
    console.log(gameData.grid.map(row => row.join(" ")).join("\n"));
  
    console.log("\nWords to find:");
    console.log(gameData.words.map(w => (w.word ? w.word : w)).join(", "));
  
    console.log("\nSubmitting guess: 'UTAH'");
    const result = submitWord("UTAH");
    console.log(result.message);
  
    console.log("\nUpdated word list:");
    console.log(result.words);
  }