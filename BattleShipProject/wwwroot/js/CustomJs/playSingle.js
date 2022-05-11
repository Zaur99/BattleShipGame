
var numRows = 10;
var numCols = 10;
var ships = [4, 4, 3, 3, 2];
var grid = populateGrid();
var numRemaining = 16;
var numRemainingP = 16;

function populateGrid() {
    const grid = [];
    // Initialize empty board
    for (let i = 0; i < numRows; i++) {
        grid.push(Array(numCols).fill("x"));
    }
    const orientations = ["x+", "x-", "y+", "y-"];
    this.ships.forEach(ship => {
        // Choose orientation and start coord
        let orientation = orientations[Math.floor(Math.random() * 4)];
        let x = Math.floor(Math.random() * numCols);
        let y = Math.floor(Math.random() * numRows);

        // // While ship doesn't fit
        while (!this.verifyFit(grid, ship, x, y, orientation)) {
            // Choose new orientation and start coord
            orientation = orientations[Math.floor(Math.random() * 4)];
            x = Math.floor(Math.random() * this.numCols);
            y = Math.floor(Math.random() * this.numRows);
        }

        // Set coordinates
        this.setShip(grid, ship, x, y, orientation);
    });
    return grid;
}



function verifyFit(grid, length, x, y, orientation) {
    if (orientation === "x+") {
        if (x + length - 1 > this.numCols - 1) return false;
        if (grid[y].slice(x, x + length).some(el => el !== "x")) return false;
    } else if (orientation === "x-") {
        if (x - length + 1 < 0) return false;
        if (grid[y].slice(x - length + 1, x + 1).some(el => el !== "x")) return false;
    } else if (orientation === "y+") {
        if (y + length - 1 > this.numRows - 1) return false;
        for (let i = y; i < y + length; i++) {
            if (grid[i][x] !== "x") return false;
        }
    } else {
        if (y - length + 1 < 0) return false;
        for (let i = y; i > y - length; i--) {
            if (grid[i][x] !== "x") return false;
        }
    }
    return true;
}

function setShip(grid, length, x, y, orientation) {
    if (orientation === "x+") {
        for (let i = x; i < x + length; i++) {
            grid[y][i] = "o";
        }
    } else if (orientation === "x-") {
        for (let i = x; i > x - length; i--) {
            grid[y][i] = "o";
        }
    } else if (orientation === "y+") {
        for (let i = y; i < y + length; i++) {
            grid[i][x] = "o";
        }
    } else {
        for (let i = y; i > y - length; i--) {
            grid[i][x] = "o";
        }
    }
}
$(document).ready(function () {

    $("#playerOne").html($("#PlayerName").val());
    $("#playerTwo").html("Computer");
    var data = JSON.parse($("#SerializedBFArray").val());
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (data[i][j] !== "") {
                $(`[px = ${i}][py = ${j}]`).attr("class", "selectedField");
            }
        }
    }


    if (true) {


        var currentPlayer = "player";
        $('.tableCell').on("click", playGame);
        function playGame(e) {

            if (currentPlayer == "player") {
                $('#playerTurn').attr("class", "");
                $('#opponentTurn').attr("class", "hide");
                playerGuess(e);
            }
            else {
                $('#playerTurn').attr("class", "hide");
                $('#opponentTurn').attr("class", "");
                setTimeout(computerGuess, 1000);
            }


        }
        function playerGuess(e) {
            var isEmpty = true;
            var x = $(e.target).attr('ox');
            var y = $(e.target).attr('oy');
            if ($(`[ox = ${x}][oy = ${y}]`).attr("class") == "tableCell") {
                if (grid[y][x] == "o") {
                    $(`[ox = ${x}][oy = ${y}]`).attr("class", "gotShot");
                    numRemaining--;
                    isGameOver();
                }
                else {
                    $(`[ox = ${x}][oy = ${y}]`).attr("class", "missed");
                }

            }
            else {
                isEmpty = false;
            }
            if (isEmpty) {
                currentPlayer = "computer";
                playGame();
            }

        }

        function computerGuess() {
            var d = Math.floor(Math.random() * 10);
            var f = Math.floor(Math.random() * 10);

            if (data[d][f] !== "" && $(`[px = ${d}][py = ${f}]`).attr("class") == "selectedField") {
                $(`[px = ${d}][py = ${f}]`).attr("class", "gotShot");
                numRemainingP--;
                isGameOver();

            }
            else if (data[d][f] == "" && $(`[px = ${d}][py = ${f}]`).attr("class") == "tableCellPlayer") {
                $(`[px = ${d}][py = ${f}]`).attr("class", "missed");
            }
            else { computerGuess(); }
            currentPlayer = "player";
            $('#playerTurn').attr("class", "");
            $('#opponentTurn').attr("class", "hide");
        }



        function isGameOver() {
            if (numRemaining == 0) {
                $('#winnerContainer').attr("class", "");
                $('#playGameContent').attr("class", "hide");
                $('#turnContainer').attr("class", "hide");
                $('#infoPlayers').attr("class", "hide");
                $('#youWonText').attr("class", "");
            }
            if (numRemainingP == 0) {
                $('#winnerContainer').attr("class", "");
                $('#playGameContent').attr("class", "hide");
                $('#turnContainer').attr("class", "hide");
                $('#infoPlayers').attr("class", "hide");
                $('#youLostText').attr("class", "");
            }

        }

    }
});



