const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
let oTurn = false;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false, currentClass);
    } else if (isDraw()) {
        endGame(true);
    } else {
        disableClicks();
        setBoardHoverClass();
        setTimeout(() => {
            makeComputerMove();
            if (checkWin(O_CLASS)) {
                endGame(false, O_CLASS);
            } else if (isDraw()) {
                endGame(true);
            } else {
                enableClicks();
                setBoardHoverClass();
            }
        }, 500);
    }
}

function endGame(draw, currentClass) {
    if (draw) {
        winningMessageTextElement.innerText = 'Empate!';
    } else {
        winningMessageTextElement.innerText = `${currentClass === X_CLASS ? "X" : "O"} Venceu!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function makeComputerMove() {
    const bestMove = getBestMove();
    if (bestMove !== null) {
        placeMark(cellElements[bestMove], O_CLASS);
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < cellElements.length; i++) {
        if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)) {
            cellElements[i].classList.add(O_CLASS);
            let score = minimax(cellElements, 0, false);
            cellElements[i].classList.remove(O_CLASS);

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(cells, depth, isMaximizing) {
    const scores = {
        [X_CLASS]: -10,
        [O_CLASS]: 10,
        tie: 0
    };

    let result = checkWin(X_CLASS) ? scores[X_CLASS] :
                 checkWin(O_CLASS) ? scores[O_CLASS] :
                 isDraw() ? scores.tie : null;

    if (result !== null) return result;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].classList.contains(X_CLASS) && !cells[i].classList.contains(O_CLASS)) {
                cells[i].classList.add(O_CLASS);
                let score = minimax(cells, depth + 1, false);
                cells[i].classList.remove(O_CLASS);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].classList.contains(X_CLASS) && !cells[i].classList.contains(O_CLASS)) {
                cells[i].classList.add(X_CLASS);
                let score = minimax(cells, depth + 1, true);
                cells[i].classList.remove(X_CLASS);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function disableClicks() {
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function enableClicks() {
    cellElements.forEach(cell => {
        if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            cell.addEventListener('click', handleClick, { once: true });
        }
    });
}
