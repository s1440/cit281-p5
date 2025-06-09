// This file must be a JavaScript class declared using the class keyword.
// You may include multiple classes, but all classes must be within this file.
// You must use the this operator for class properties and have at least three class properties.
// You must have at least three class methods (functions).
// At least one class must be exported for external use by your game.


const THEMES = {
    Animals: ["CAT", "DOG", "BIRD", "TURTLE", "ANT", "FLY"],
    Flowers: ["LILY", "DAISY", "TULIP", "ROSE", "ORCHID", "LILAC"],
    Colors: ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "PURPLE"],
    States: ["UTAH", "TEXAS", "IDAHO", "MAINE", "OHIO", "IOWA"],
    Oregon: ["DUCK", "TREE", "GREEN", "YELLOW", "RAIN", "EUGENE"]
};

// class names are usually capitalized
class WordSearch {
    constructor(gridSize = 10, theme = "animals") {
      this.gridSize = gridSize;
      this.theme = theme;
      this.words = (THEMES[theme] || []).map(word => ({ word, found: false}));
      this.grid = [];
      this.generateGrid();
      this.placeWords();
      this.fillEmptySpaces();
    }
  
    generateGrid() {
        for (let i = 0; i < this.gridSize; i++) {
          const row = [];
          for (let j = 0; j < this.gridSize; j++) {
            row.push(" "); // ← empty spaces for now
          }
          this.grid.push(row);
        }
      }
      
  
    placeWords() {
        this.words.forEach((word) => {
          const upperWord = word.word.toUpperCase();
          const maxAttempts = 100;
          let placed = false;
      
          for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
            const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
            let row, col;
      
            if (direction === "horizontal") {
              row = Math.floor(Math.random() * this.gridSize);
              const maxStartCol = this.gridSize - upperWord.length;
              col = Math.floor(Math.random() * (maxStartCol + 1));
      
              let fits = true;
              for (let i = 0; i < upperWord.length; i++) {
                const cell = this.grid[row][col + i];
                if (cell !== " " && cell !== upperWord[i]) {
                  fits = false;
                  break;
                }
              }
      
              if (fits) {
                for (let i = 0; i < upperWord.length; i++) {
                  this.grid[row][col + i] = upperWord[i];
                }
                placed = true;
              }
      
            } else {
              col = Math.floor(Math.random() * this.gridSize);
              const maxStartRow = this.gridSize - upperWord.length;
              row = Math.floor(Math.random() * (maxStartRow + 1));
      
              let fits = true;
              for (let i = 0; i < upperWord.length; i++) {
                const cell = this.grid[row + i][col];
                if (cell !== upperWord[i] && cell !== " " && cell !== undefined) {
                  fits = false;
                  break;
                }
              }
      
              if (fits) {
                for (let i = 0; i < upperWord.length; i++) {
                  this.grid[row + i][col] = upperWord[i];
                }
                placed = true;
              }
            }
          }
      
          if (!placed) {
            console.warn(`Could not place word: ${word}`);
          }
        });
      }
      fillEmptySpaces() {
        for (let i = 0; i < this.gridSize; i++) {
          for (let j = 0; j < this.gridSize; j++) {
            if (this.grid[i][j] === " ") {
              this.grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
          }
        }
      }
      
    }      
      


  if (require.main === module) {
    const game = new WordSearch(10, "States");
    console.log(`Theme: ${game.theme}`);
    console.log("Generated Grid:");
    console.log(game.grid.map(row => row.join(" ")).join("\n"));
  }
  
  
  module.exports = { WordSearch };