'use strict'
const numberbox = document.getElementById("numberbox");
const slider = document.getElementById("slider");
const progressBar = document.getElementById("progress-bar")
const playButton = document.getElementById('play-button');

const queen = '<i class="fas fa-chess-queen" style="color:#000"></i>';

// Corrected array of possible arrangements for N-Queens
const array = [0, 1, 0, 0, 2, 10, 4, 40, 92];

class Queen {
    constructor(n) {
        this.n = n;
        this.position = {};
        this.uuid = [];
        this.Board = 0;
    }

    // Setting the slider value onSlide
    setSpeed() {
        let speed = (100 - slider.value) * 10;
        progressBar.style.width = slider.value + "%";
        return speed;
    }

    nQueen = async () => {
        this.Board = 0;
        this.position[`${this.Board}`] = {};
        numberbox.disabled = true;
        await this.solveQueen(this.Board, 0);
        await this.clearColor(this.Board);
        numberbox.disabled = false;
    }

    isValid = async (board, r, col) => {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        const currentRow = table.firstChild.childNodes[r];
        const currentColumn = currentRow.getElementsByTagName("td")[col];
        currentColumn.innerHTML = queen;
        await this.delay();

        // Checking the queen in the same column
        for (let i = r - 1; i >= 0; --i) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[col];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }

        //Checking the upper left diagonal
        for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#fb5607";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }

        // Checking the upper right diagonal
        for (let i = r - 1, j = col + 1; i >= 0 && j < this.n; --i, ++j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }
        return true;
    }

    clearColor = async (board) => {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        for (let j = 0; j < this.n; ++j) {
            const row = table.firstChild.childNodes[j];
            for (let k = 0; k < this.n; ++k)
                (j + k) & 1
                    ? (row.getElementsByTagName("td")[k].style.backgroundColor = "#FF9F1C")
                    : (row.getElementsByTagName("td")[k].style.backgroundColor = "#FCCD90");
        }
    }

    delay = async (ms = null) => {
        const speed = ms || this.setSpeed();
        await new Promise((done) => setTimeout(() => done(), speed));
    }

    solveQueen = async (board, r) => {
        if (r == this.n) {
            // Increment Board only if a new valid arrangement is found
            ++this.Board;
            
            // If we've found more arrangements than expected, stop
            if (this.Board >= array[this.n]) return;

            let table = document.getElementById(`table-${this.uuid[this.Board]}`);
            for (let k = 0; k < this.n; ++k) {
                let row = table.firstChild.childNodes[k];
                row.getElementsByTagName("td")[this.position[board][k]].innerHTML = queen;
            }
            this.position[this.Board] = {...this.position[board]};
            return true;
        }

        for (let i = 0; i < this.n; ++i) {
            await this.delay();
            await this.clearColor(board);
            
            if (await this.isValid(board, r, i)) {
                await this.delay();
                await this.clearColor(board);
                
                let table = document.getElementById(`table-${this.uuid[board]}`);
                let row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = queen;

                this.position[board][r] = i;

                if (await this.solveQueen(board, r + 1))
                    await this.clearColor(board);

                await this.delay();
                
                table = document.getElementById(`table-${this.uuid[board]}`);
                row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = "-";

                delete this.position[`${board}`][`${r}`];
            }
        }
        return false;
    }

    createBoards() {
        const chessBoard = document.getElementById("n-queen-board");
        const arrangement = document.getElementById("queen-arrangement");

        // Clear previous boards
        while (chessBoard.hasChildNodes()) {
            chessBoard.removeChild(chessBoard.firstChild);
        }
        if (arrangement.hasChildNodes()) {
            arrangement.removeChild(arrangement.lastChild)
        }

        // Create paragraph with arrangement info
        const para = document.createElement("p");
        para.setAttribute("class", "queen-info");
        para.innerHTML = `For ${this.n}x${this.n} board, ${array[this.n]} arrangements are possible.`;
        arrangement.appendChild(para);

        // Create boards
        for (let i = 0; i < array[this.n]; ++i) {
            this.uuid.push(Math.random());
            let div = document.createElement('div');
            let table = document.createElement('table');
            let header = document.createElement('h4');
            
            header.innerHTML = `Board ${i + 1} `
            table.setAttribute("id", `table-${this.uuid[i]}`);
            header.setAttribute("id", `paragraph-${i}`);
            
            chessBoard.appendChild(div);
            div.appendChild(header);
            div.appendChild(table);

            // Create board grid
            for (let r = 0; r < this.n; ++r) {
                const row = table.insertRow(r);
                row.setAttribute("id", `Row${r}`);
                for (let c = 0; c < this.n; ++c) {
                    const col = row.insertCell(c);
                    (r + c) & 1
                        ? (col.style.backgroundColor = "#FF9F1C")
                        : (col.style.backgroundColor = "#FCCD90");
                    col.innerHTML = "-";
                    col.style.border = "0.3px solid #373f51";
                }
            }
        }
    }
}

playButton.onclick = async function visualise() {
    const n = parseInt(numberbox.value);

    // Validate input
    if (n > 8) {
        numberbox.value = "";
        alert("Queen value is too large");
        return;
    } else if (n < 1) {
        numberbox.value = "";
        alert("Queen value is too small");
        return;
    }

    // Create and solve N-Queens problem
    const q = new Queen(n);
    q.createBoards();
    await q.nQueen();
};