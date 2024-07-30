document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".grid");
    const scoreValue = document.querySelector(".score-value");
    const result = document.querySelector(".result");
    let score = 0;
    let moves = 0;
    let moveFactor = 4;
    let matrix = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
    let prevMatrix;
    let colors = ["#caf0f8", "#90e0ef", "#00b4d8", "#0077b6", "#03045e", "#023047", "#fca311", "#14213d", "#e63946", "#ffc300", "#6a040f", "#000000"];

    // Generate grid items dynamically
    for (let i = 0; i < 4; i++) {
        let row = [];
        for (let j = 0; j < 4; j++) {
            let gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridItem.innerHTML = "<p></p>";
            grid.appendChild(gridItem);
            row.push(gridItem);
        }
        matrix[i] = row;
    }

    // Initialize the game with two random tiles
    initializeGame();

    // Function to initialize the game with two random tiles
    function initializeGame() {
        let emptyCells = getEmptyCells();

        if (emptyCells.length >= 2) {
            let randomIdx1 = Math.floor(Math.random() * emptyCells.length);
            let randomIdx2 = Math.floor(Math.random() * emptyCells.length);
            while (randomIdx2 === randomIdx1) {
                randomIdx2 = Math.floor(Math.random() * emptyCells.length);
            }

            let cell1 = emptyCells[randomIdx1];
            let cell2 = emptyCells[randomIdx2];

            matrix[cell1.row][cell1.col].firstElementChild.innerText = "2";
            matrix[cell2.row][cell2.col].firstElementChild.innerText = "2";
        }
    }

    // Function to get empty cells
    function getEmptyCells() {
        let emptyCells = [];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j].firstElementChild.innerText === "") {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        return emptyCells;
    }

    // Add event listener for keydown events
    document.addEventListener("keydown", moveTiles);

    // Function to move tiles based on key pressed
    function moveTiles(event) {
        let key = event.key;
        let moved = false;

        if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
            event.preventDefault();
            prevMatrix = copyMatrix(matrix);

            switch (key) {
                case "ArrowLeft":
                    for (let i = 0; i < 4; i++) {
                        moved = slideRowLeft(matrix[i]) || moved;
                        mergeRowLeft(matrix[i]);
                        moved = slideRowLeft(matrix[i]) || moved;
                    }
                    break;
                case "ArrowRight":
                    for (let i = 0; i < 4; i++) {
                        moved = slideRowRight(matrix[i]) || moved;
                        mergeRowRight(matrix[i]);
                        moved = slideRowRight(matrix[i]) || moved;
                    }
                    break;
                case "ArrowUp":
                    for (let i = 0; i < 4; i++) {
                        moved = slideColumnUp(getColumn(matrix, i)) || moved;
                        mergeColumnUp(getColumn(matrix, i));
                        moved = slideColumnUp(getColumn(matrix, i)) || moved;
                    }
                    break;
                case "ArrowDown":
                    for (let i = 0; i < 4; i++) {
                        moved = slideColumnDown(getColumn(matrix, i)) || moved;
                        mergeColumnDown(getColumn(matrix, i));
                        moved = slideColumnDown(getColumn(matrix, i)) || moved;
                    }
                    break;
            }

            if (moved) {
                moves++;
                scoreValue.innerText = score;
                if (moves % moveFactor === 0) {
                    generateNewTile();
                }
                updateGrid();
            }

            if (gameOver()) {
                handleGameOver("lose");
            }
        }
    }

    // Function to slide non-zero elements to the left in a row
    function slideRowLeft(row) {
        let moved = false;
        for (let i = 1; i < row.length; i++) {
            if (row[i].firstElementChild.innerText !== "") {
                let j = i;
                while (j > 0 && row[j - 1].firstElementChild.innerText === "") {
                    row[j - 1].firstElementChild.innerText = row[j].firstElementChild.innerText;
                    row[j].firstElementChild.innerText = "";
                    j--;
                    moved = true;
                }
            }
        }
        return moved;
    }

    // Function to merge adjacent equal elements to the left in a row
    function mergeRowLeft(row) {
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i].firstElementChild.innerText === row[i + 1].firstElementChild.innerText && row[i].firstElementChild.innerText !== "") {
                let mergedValue = parseInt(row[i].firstElementChild.innerText) * 2;
                row[i].firstElementChild.innerText = mergedValue.toString();
                row[i + 1].firstElementChild.innerText = "";
                score += mergedValue;
            }
        }
    }

    // Function to slide non-zero elements to the right in a row
    function slideRowRight(row) {
        let moved = false;
        for (let i = row.length - 2; i >= 0; i--) {
            if (row[i].firstElementChild.innerText !== "") {
                let j = i;
                while (j < row.length - 1 && row[j + 1].firstElementChild.innerText === "") {
                    row[j + 1].firstElementChild.innerText = row[j].firstElementChild.innerText;
                    row[j].firstElementChild.innerText = "";
                    j++;
                    moved = true;
                }
            }
        }
        return moved;
    }

    // Function to merge adjacent equal elements to the right in a row
    function mergeRowRight(row) {
        for (let i = row.length - 1; i > 0; i--) {
            if (row[i].firstElementChild.innerText === row[i - 1].firstElementChild.innerText && row[i].firstElementChild.innerText !== "") {
                let mergedValue = parseInt(row[i].firstElementChild.innerText) * 2;
                row[i].firstElementChild.innerText = mergedValue.toString();
                row[i - 1].firstElementChild.innerText = "";
                score += mergedValue;
            }
        }
    }

    // Function to slide non-zero elements up in a column
    function slideColumnUp(column) {
        let moved = false;
        for (let i = 1; i < column.length; i++) {
            if (column[i].firstElementChild.innerText !== "") {
                let j = i;
                while (j > 0 && column[j - 1].firstElementChild.innerText === "") {
                    column[j - 1].firstElementChild.innerText = column[j].firstElementChild.innerText;
                    column[j].firstElementChild.innerText = "";
                    j--;
                    moved = true;
                }
            }
        }
        return moved;
    }

    // Function to merge adjacent equal elements up in a column
    function mergeColumnUp(column) {
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i].firstElementChild.innerText === column[i + 1].firstElementChild.innerText && column[i].firstElementChild.innerText !== "") {
                let mergedValue = parseInt(column[i].firstElementChild.innerText) * 2;
                column[i].firstElementChild.innerText = mergedValue.toString();
                column[i + 1].firstElementChild.innerText = "";
                score += mergedValue;
            }
        }
    }

    // Function to slide non-zero elements down in a column
    function slideColumnDown(column) {
        let moved = false;
        for (let i = column.length - 2; i >= 0; i--) {
            if (column[i].firstElementChild.innerText !== "") {
                let j = i;
                while (j < column.length - 1 && column[j + 1].firstElementChild.innerText === "") {
                    column[j + 1].firstElementChild.innerText = column[j].firstElementChild.innerText;
                    column[j].firstElementChild.innerText = "";
                    j++;
                    moved = true;
                }
            }
        }
        return moved;
    }

    // Function to merge adjacent equal elements down in a column
    function mergeColumnDown(column) {
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i].firstElementChild.innerText === column[i - 1].firstElementChild.innerText && column[i].firstElementChild.innerText !== "") {
                let mergedValue = parseInt(column[i].firstElementChild.innerText) * 2;
                column[i].firstElementChild.innerText = mergedValue.toString();
                column[i - 1].firstElementChild.innerText = "";
                score += mergedValue;
            }
        }
    }

    // Function to generate a new tile (2 or 4) in an empty cell
    function generateNewTile() {
        let emptyCells = getEmptyCells();
        if (emptyCells.length > 0) {
            let randomIdx = Math.floor(Math.random() * emptyCells.length);
            let cell = emptyCells[randomIdx];
            matrix[cell.row][cell.col].firstElementChild.innerText = Math.random() < 0.9 ? "2" : "4";
        }
    }

    // Function to update grid display after each move
    function updateGrid() {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                let tileValue = matrix[i][j].firstElementChild.innerText;
                matrix[i][j].style.backgroundColor = getTileColor(tileValue);
                matrix[i][j].firstElementChild.innerText = tileValue === "" ? "" : tileValue;
            }
        }
    }

    // Function to get column from the matrix
    function getColumn(matrix, col) {
        let column = [];
        for (let i = 0; i < matrix.length; i++) {
            column.push(matrix[i][col]);
        }
        return column;
    }

    // Function to check if the game is over (no more valid moves)
    function gameOver() {
        let movesPossible = false;

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                let currentTile = matrix[i][j].firstElementChild.innerText;

                // Check if adjacent tiles have the same value
                if (i > 0 && matrix[i - 1][j].firstElementChild.innerText === currentTile) {
                    movesPossible = true;
                }
                if (i < matrix.length - 1 && matrix[i + 1][j].firstElementChild.innerText === currentTile) {
                    movesPossible = true;
                }
                if (j > 0 && matrix[i][j - 1].firstElementChild.innerText === currentTile) {
                    movesPossible = true;
                }
                if (j < matrix[i].length - 1 && matrix[i][j + 1].firstElementChild.innerText === currentTile) {
                    movesPossible = true;
                }

                // Check if there are any empty cells
                if (currentTile === "") {
                    movesPossible = true;
                }
            }
        }

        return !movesPossible;
    }

    // Function to handle game over (win or lose)
    function handleGameOver(outcome) {
        // Get the previous highest score from localStorage
        const highestBlock = parseInt(localStorage.getItem('highestBlock') || '0');
        
        // Update highest score if current score is higher
        if (score > highestBlock) {
            localStorage.setItem('highestBlock', score);
        }
    
        // Redirect to result.html with outcome, score, and highest block as query parameters
        window.location.href = `result.html?outcome=${outcome}&score=${score}&highestBlock=${highestBlock}`;
    }
    

    // Function to copy the matrix state
    function copyMatrix(matrix) {
        let copy = [];
        for (let i = 0; i < matrix.length; i++) {
            copy.push(matrix[i].slice());
        }
        return copy;
    }

    // Function to get tile color based on its value
    function getTileColor(value) {
        if (value === "") return "#cdc0b0"; // Default background color
        let index = Math.log2(parseInt(value)) - 1;
        return index < colors.length ? colors[index] : colors[colors.length - 1];
    }
});
