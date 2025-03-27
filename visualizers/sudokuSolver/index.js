// Original functionality
document.getElementById("sudoku-board").addEventListener("keyup", function(event) {
  if(event.target && event.target.nodeName == "TD") {
    var validNum = /[1-9]/;
    var tdEl = event.target;
    if (tdEl.innerText.length > 0 && validNum.test(tdEl.innerText[0])) {
      tdEl.innerText = tdEl.innerText[0];
      tdEl.classList.add("filled");
    } else {
      tdEl.innerText = "";
      tdEl.classList.remove("filled");
    }
  }
});

document.getElementById("solve-button").addEventListener("click", function(event) {
  var boardString = boardToString();
  var solution = SudokuSolver.solve(boardString);
  if (solution) {
    markOriginalCells();
    stringToBoard(solution);
    showSuccessMessage();
    document.querySelector('.board-wrapper').classList.add('solved');
  } else {
    showErrorMessage();
  }
});

document.getElementById("clear-button").addEventListener("click", clearBoard);

// Sample puzzle buttons
document.getElementById("easy-puzzle").addEventListener("click", function() {
  clearBoard();
  loadPuzzle(EASY_PUZZLE);
});

document.getElementById("medium-puzzle").addEventListener("click", function() {
  clearBoard();
  loadPuzzle(MEDIUM_PUZZLE);
});

document.getElementById("hard-puzzle").addEventListener("click", function() {
  clearBoard();
  loadPuzzle(HARD_PUZZLE);
});

// Modal functionality
if (document.getElementById("close-modal")) {
  document.getElementById("close-modal").addEventListener("click", function() {
    document.getElementById("success-modal").classList.remove("show");
  });
}

// Mark original cells for styling
function markOriginalCells() {
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    if (tds[i].innerText.length > 0) {
      tds[i].classList.add("filled");
    }
  }
}

function clearBoard() {
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    tds[i].innerText = "";
    tds[i].classList.remove("filled");
    tds[i].classList.remove("solution");
  }
  document.querySelector('.board-wrapper').classList.remove('solved');
}

function boardToString() {
  var string = "";
  var validNum = /[1-9]/;
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    if (validNum.test(tds[i].innerText[0])) {
      string += tds[i].innerText;
    } else {
      string += "-";
    }
  }
  return string;
}

function stringToBoard(string) {
  var currentCell;
  var validNum = /[1-9]/;
  var cells = string.split("");
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    currentCell = cells.shift();
    if (validNum.test(currentCell)) {
      if (tds[i].innerText === "") {
        tds[i].innerText = currentCell;
        tds[i].classList.add("solution");
      }
    }
  }
}

function loadPuzzle(puzzleString) {
  var cells = puzzleString.split("");
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    if (cells[i] !== "-") {
      tds[i].innerText = cells[i];
      tds[i].classList.add("filled");
    }
  }
}

function showSuccessMessage() {
  const modal = document.getElementById("success-modal");
  modal.classList.add("show");
  
  setTimeout(() => {
    modal.classList.remove("show");
  }, 3000);
}

function showErrorMessage() {
  const errorMsg = document.getElementById("error-msg");
  errorMsg.classList.remove("hidden");
  
  setTimeout(() => {
    errorMsg.classList.add("hidden");
  }, 3000);
}