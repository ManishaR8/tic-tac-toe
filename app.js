let resetBtn = document.querySelector("#resetBtn");
let newGameBtn = document.querySelector("#newGame");
let startGameBtn = document.querySelector("#startGame");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let gameContainer = document.querySelector(".game");
let gridSizeInput = document.querySelector("#gridSize");
let winStreakInput = document.querySelector("#winStreak");

let boxes = [];
let turnO = true;
let gridSize = 3; 
let winStreak = 3; 
let count = 0;

gridSizeInput.addEventListener('input', () => {
    const value = parseInt(gridSizeInput.value, 10);
    if (value > 5) {
      gridSizeInput.value = 5;
    } else if (value < 3) {
      gridSizeInput.value = 3;
    }
  });

const createGrid = () => {
    gameContainer.innerHTML = ""; 
    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    boxes = [];

    for (let i = 0; i < gridSize * gridSize; i++) {
        const box = document.createElement("button");
        box.classList.add("box");
        box.dataset.index = i;
        gameContainer.appendChild(box);
        boxes.push(box);

        box.addEventListener("click", () => handleBoxClick(box));
    }
};

const handleBoxClick = (box) => {
    if (turnO) {
        box.classList.add("neonColor-blue");
        box.innerText = "O";
    } else {
        box.classList.add("neonColor-red");
        box.innerText = "X";
    }

    count++;
    turnO = !turnO;
    box.disabled = true;

    if (checkWinner(box)) {
        showWinner(box.innerText);
    } else if (count === gridSize * gridSize) {
        showDraw();
    }
};

const checkWinner = (box) => {
    const index = parseInt(box.dataset.index);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const symbol = box.innerText;

    let rowCount = 1 + countConsecutive(row, col, 0, 1, symbol) + countConsecutive(row, col, 0, -1, symbol);

    let colCount = 1 + countConsecutive(row, col, 1, 0, symbol) + countConsecutive(row, col, -1, 0, symbol);

    let diag1Count = 1 + countConsecutive(row, col, 1, 1, symbol) + countConsecutive(row, col, -1, -1, symbol);

    let diag2Count = 1 + countConsecutive(row, col, 1, -1, symbol) + countConsecutive(row, col, -1, 1, symbol);

    return (
        rowCount >= winStreak ||
        colCount >= winStreak ||
        diag1Count >= winStreak ||
        diag2Count >= winStreak
    );
};

const countConsecutive = (row, col, rowInc, colInc, symbol) => {
    let count = 0;
    let r = row + rowInc;
    let c = col + colInc;

    while (r >= 0 && r < gridSize && c >= 0 && c < gridSize && boxes[r * gridSize + c].innerText === symbol) {
        count++;
        r += rowInc;
        c += colInc;
    }

    return count;
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const showDraw = () => {
    msg.innerText = "Game is Draw, Start again";
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    boxes.forEach((box) => (box.disabled = true));
};

const resetGame = () => {
    count = 0;
    turnO = true;
    msgContainer.classList.add("hide");
    createGrid();
};

const errorMsg = document.getElementById("errorMsg");

const startGame = () => {
    gridSize = parseInt(gridSizeInput.value);
    winStreak = parseInt(winStreakInput.value);

    if (winStreak > gridSize) {
        errorMsg.innerText = "Win streak cannot be greater than grid size. adjust it to win streak to grid size.";
        errorMsg.classList.remove("hide");
        winStreakInput.value = gridSize;
        winStreak = gridSize;
    } else {
       
        errorMsg.classList.add("hide");
    }

    resetGame();
};

startGameBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
