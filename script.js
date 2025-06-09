// This file contains the JavaScript for your client.
// public/script.js

// This file goes in your "public" folder. It should be named "script.js"
// It is linked by your HTML file using: <script src="script.js"></script>

// This script controls the frontend logic for fetching and displaying
// the grid and word list, and handling user word submissions.

document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("grid");
  const wordListContainer = document.getElementById("word-list");
  const submitButton = document.getElementById("submit-word");
  const resultMessage = document.getElementById("result");
  const startButton = document.getElementById("start-btn");
  const themeSelect = document.getElementById("theme-select");
  const winMessage = document.getElementById("win-message");
  const playAgainButton = document.getElementById("play-again");

  

  let selectedCells = [];

  function renderGrid(grid) {
    gridContainer.innerHTML = "";
    selectedCells = [];

    grid.forEach((row, rowIndex) => {
      row.forEach((letter, colIndex) => {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.textContent = letter;
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;

        cell.addEventListener("click", () => {
          const alreadySelected = selectedCells.find(
            (c) => c.row === rowIndex && c.col === colIndex
          );

          if (alreadySelected) {
            // Deselect the cell
            cell.classList.remove("selected");
            selectedCells = selectedCells.filter(
              (c) => !(c.row === rowIndex && c.col === colIndex)
            );
          } else {
            // If this is the first letter, allow selection
            if (selectedCells.length === 0) {
              cell.classList.add("selected");
              selectedCells.push({ letter, row: rowIndex, col: colIndex });
            } else {
              // Check if this cell is adjacent to the last selected cell
              const last = selectedCells[selectedCells.length - 1];
              const rowDiff = Math.abs(last.row - rowIndex);
              const colDiff = Math.abs(last.col - colIndex);
              const isAdjacent =
                (rowDiff === 1 && colDiff === 0) ||
                (rowDiff === 0 && colDiff === 1);

              if (isAdjacent) {
                cell.classList.add("selected");
                selectedCells.push({ letter, row: rowIndex, col: colIndex });
              } else {
                // Not adjacent: optionally flash the cell red or do nothing
                cell.classList.add("shake");
                setTimeout(() => cell.classList.remove("shake"), 300);
              }
            }
          }
        });

        gridContainer.appendChild(cell);
      });
    });
  }

  function renderWordList(words) {
    wordListContainer.innerHTML = "";
    words.forEach(({ word, found }) => {
      const li = document.createElement("li");
      li.textContent = word;
      if (found) li.classList.add("found");
      wordListContainer.appendChild(li);
    });
  }

  async function loadGame(theme) {
    const res = await fetch(`/newgame?theme=${theme}`);
    const data = await res.json();
    renderGrid(data.grid);
    renderWordList(data.words);
    resultMessage.textContent = "";
    winMessage.style.display = "none";
  }

  startButton.addEventListener("click", () => {
    const selectedTheme = themeSelect.value;
    loadGame(selectedTheme);
  });

  submitButton.addEventListener("click", async () => {
    const guessedWord = selectedCells
      .map((c) => c.letter)
      .join("")
      .toUpperCase();
  
    if (!guessedWord) return;
  
    const res = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: guessedWord }),
    });
  
    const data = await res.json();
    resultMessage.textContent = data.message;
    renderWordList(data.words);
  
    selectedCells.forEach(({ row, col }) => {
      const index = row * 10 + col;
      const cell = gridContainer.children[index];
      if (data.success) {
        cell.classList.add("found");
      }
      cell.classList.remove("selected");
    });
  
    selectedCells = [];
  
    // ✅ Move this check to the end, after `data` is defined:
    const allFound = data.words.every((w) => w.found);
    if (allFound) {
      winMessage.style.display = "block";
    }
  });
  

  playAgainButton.addEventListener("click", () => {
    winMessage.style.display = "none";
    const selectedTheme = themeSelect.value;
    loadGame(selectedTheme);
  });
});
