import { useCallback, useEffect, useState } from "react";

interface MatrixTableProps {
    rows: number;
    cols: number;
  }

  export default function MatrixTable({ rows, cols }: MatrixTableProps) {

    const [gameOver, setGameOver] = useState(false)
    const [winTime, setWinTime] = useState<NodeJS.Timeout | null>(null);
    const [showWinModal, setShowWinModal] = useState(false);
    const [showLoseModal, setShowLoseModal] = useState(false);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    let startTime = Date.now();


        //Reset timer
    useEffect(() => {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = '00:00:00';
            }
        }, []);

    
    
    function generateMatrix(rows: number, cols: number) {
    const rowsInput = document.getElementById("rows") as HTMLInputElement;
    const colsInput = document.getElementById("cols") as HTMLInputElement;

    rows = parseInt(rowsInput?.value);
    cols = parseInt(rowsInput?.value);

    const matrixTable = document.getElementById("matrixTable");
    if (!matrixTable) {
        // Handle the case when matrixTable is null
        console.error("MatrixTable element not found.");
        return null; // or return an error message or any other appropriate handling
      }

    const isLargeSize = rows > 10;
    const isLargeSize1 = rows > 15;



    const modal = document.getElementById("popup2");

    if (!modal) {
      // Handle the case when modal is null
      console.error("Modal element not found.");
      return null; // or return an error message or any other appropriate handling
    }
  
    if (isNaN(rows) || rows < 6 || rows > 20) {
      modal.style.display = "block";
      return;
    }

    const matrix: string[][] = [];

    for (let i = 0; i < rows; i++) {
        const row: string[] = [];

        for (let j = 0; j < cols; j++) {
            let color = (Math.random() < 0.5) ? 'white' : 'red';
            row.push(color)

        }
        matrix.push(row)
    }

    const rowCounters: number[][] = [];
    for (let i = 0; i < rows; i++) {
        const row: number[] = [];
        let rowCounter = 0
        rowCounters.push([])
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === 'red') {
                rowCounter++
            }
            else if (rowCounter > 0) {
                row.push(rowCounter);
                rowCounter = 0; // Reset rowCounter
            }
        }
        if (rowCounter > 0) {
            row.push(rowCounter); // Save final rows value
        }
    }

    const colCounters = []
    for (let j = 0; j < cols; j++) {
        const col = []
        let colCounter = 0
        for (let i = 0; i < rows; i++) {
            if (matrix[i][j] === 'red') {
                colCounter++
            }
            else if (colCounter > 0) {
                col.push(colCounter);
                colCounter = 0;
            }
        }
        if (colCounter > 0) {
            col.push(colCounter)
        }
        colCounters.push(col)
    }

    let table = document.createElement('table')
    table.className = "matrixTable-child"

    // Header of Row that includes numbers of Gold
    let headerRow = document.createElement('tr')
    headerRow.className = "headerRow"

    headerRow.appendChild(document.createElement('td')) 
    for (let j = 0; j < cols; j++) {
        let headerCell = document.createElement('td');
        headerCell.className = "counterWrapper"
        let colCounts = colCounters[j];
        for (let k = 0; k < colCounts.length; k++) {
            let countCell = document.createElement('td');
            countCell.textContent = colCounts[k].toString();
            countCell.className = 'counter';
            if (isLargeSize) {
                countCell.classList.add('modify-counter-font-size')
            }
            headerCell.appendChild(countCell);
        }
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    // Các hàng còn lại
    for (let i = 0; i < rows; i++) {
        let row = document.createElement("tr");
        
        // Ô đếm hàng
        let countCell = document.createElement("td");
        countCell.className = 'countersWrapper'
        let rowCounts = rowCounters[i];
        let counterWrapper = document.createElement('div');
        counterWrapper.className = 'counters';
        for (let k = 0; k < rowCounts.length; k++) {
            let countDiv = document.createElement('div');
            countDiv.textContent = rowCounts[k].toString();
            countDiv.className = 'counter';
            if (isLargeSize) {
                countDiv.classList.add('modify-counter-font-size')
            }
            counterWrapper.appendChild(countDiv);
        }
        countCell.appendChild(counterWrapper);
        row.appendChild(countCell);

        // Các ô ma trận
        for (let j = 0; j < cols; j++) {
            const isBoom = (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
                    if (gameOver) {return;} //disable click when game over
                    const cell = event.currentTarget;
                    if (cell.classList.contains('flag')) {return;}
                    if (matrix[i][j] === 'red') {
                        cell.classList.remove('red')
                        cell.classList.add('turn-gold')
                    } else if (matrix[i][j] === 'white') {
                        matrix[i][j] = 'turn-boom';
                        cell.classList.remove('white')
                        cell.classList.add('turn-boom');
                    }
                    
                }
                const isFlag = (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
                if (event.type === 'contextmenu') {
                    event.preventDefault();
                    if (gameOver) {return;} //disable click when game over
                    const cell = event.currentTarget;
                    if (!cell.classList.contains('flag')) {
                        cell.classList.add('flag');
                    } else {
                        cell.classList.remove('flag');
                    }    
            }
        }
            let cell = document.createElement("td");
            cell.className = matrix[i][j];
            cell.classList.add('cell-size')

            // responsive for cell and font when the matrix is too large
            if (isLargeSize) {
                cell.classList.remove('cell-size')
                cell.classList.add('modify-cell-size')
            }
            if (isLargeSize1) {
                cell.classList.remove('cell-size')
                cell.classList.add('modify-cell-size1')
            }


            // cell.onclick = isBoom;
            // cell.oncontextmenu = isFlag;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    matrixTable.appendChild(table);}



const generateMatrixMemoized = useCallback(generateMatrix, [rows, cols]);

useEffect(() => {
  resetTimer();
  generateMatrixMemoized(rows, cols);
}, [rows, cols, generateMatrixMemoized]);

      useEffect(() => {
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        const newTimerInterval = setInterval(updateTimer, 1000);
        setTimerInterval(newTimerInterval);
        return () => {
          if (newTimerInterval) {
            clearInterval(newTimerInterval);
          }
        };
      }, []);

      function resetTimer() {
        const timerElement = document.getElementById("timer");
        if (timerElement) {
          timerElement.textContent = "00:00:00";
        }
      }



    // Start the timer
    useEffect(() => {
        const startTime = Date.now();
        setTimerInterval(setInterval(updateTimer, 1000));
    
        return () => {
          if (timerInterval) {
            clearInterval(timerInterval);
          }
        };
      }, []);


    function updateTimer() {
        let currentTime = Date.now();
        let timeDifference = currentTime - startTime;
        let seconds = Math.floor(timeDifference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        seconds = seconds < 10 ? 0 + seconds : seconds;
        minutes = minutes % 60;
        minutes = minutes < 10 ? 0 + minutes : minutes;
        hours = hours < 10 ? 0 + hours : hours;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = hours + ':' + minutes + ':' + seconds;
          }
    }




  // Close Button
  const closeModal1 = () => {
    setShowWinModal(false);
    setWinTime(null);
  };

  const closeModal3 = () => {
    setShowLoseModal(false);
  };

  // Handle win
  const handleWin = () => {
    const cells1 = document.querySelectorAll('.red');
    const cells2 = document.querySelectorAll('.turn-boom');

    if (cells1.length === 0 && cells2.length === 0) {
        setWinTime(timerInterval);
        setShowWinModal(true);
        setGameOver(true)
    }
  };

  // Handle lose
  const handleLose = () => {
    const cells2 = document.querySelectorAll('.turn-boom');
    if (cells2.length === 1) {
      setShowLoseModal(true);
      setGameOver(true)
    }
  };
//   if (!matrixTable || !modal) {
//     console.error("MatrixTable or Modal element not found.");
//     return null;
//   }

    return(
        <div>
            <table id="matrixTable"></table>
                  {/* Win Modal */}
      {showWinModal && (
        <div className="overlay" id="popup1">
          <div className="popup">
            <h2 id="win-header">Congratulations, You Win!</h2>
            <p className="time-taken">
              Time Taken: <span id="win-time">{winTime ? winTime.toString() : null}</span>
            </p>
            <br />
            <button onClick={closeModal1} className="glow-on-hover close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Lose Modal */}
      {showLoseModal && (
        <div className="overlay" id="popup3">
          <div className="popup">
            <div className="lose-wrapper">
              <h2>Oops! ... You clicked on a bomb!</h2>
              <br />
              <button onClick={closeModal3} className="glow-on-hover">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
    )
}