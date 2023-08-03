import { useEffect, useMemo, useState } from "react";

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
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const startTime = Date.now();
    const [matrix, setMatrix] = useState<string[][]>([])

    const _colCounter = useMemo(() => {
        if (!matrix || matrix.length === 0) return []
        const rowLength = matrix.length
        const colLength = matrix[0].length
        
        const colCounters = []
            for (let j = 0; j < colLength; j++) {
                const col = []
                let colCounter = 0
                for (let i = 0; i < rowLength; i++) {
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
            return colCounters
    }, [matrix])

    const _rowCounter = useMemo(() => {
        if (!matrix || matrix.length === 0) return []
        const rowLength = matrix.length
        const colLength = matrix[0].length

        const temp: number[][] = [];
        for (let i = 0; i < rowLength; i++) {

            let rowCounter = 0
            temp.push([])
            for (let j = 0; j < colLength; j++) {
                if (matrix[i][j] === 'red') {
                    rowCounter++
                }
                else if (rowCounter > 0) {
                    temp[i].push(rowCounter);
                    rowCounter = 0; // Reset rowCounter
                }
            }
            if (rowCounter > 0) {
                temp[i].push(rowCounter); // Save final rows value
            }
        }
        return temp
    }, [matrix])

    useEffect(() => {
        const temp: string[][] = []

        for (let i = 0; i < rows; i++) {
            const row: string[] = [];

            for (let j = 0; j < rows; j++) {
                let color = (Math.random() < 0.5) ? 'white' : 'red';
                row.push(color)
            }
            temp.push(row)
        }
        setMatrix(temp)
        setGameOver(false);
        setShowWinModal(false);
        setShowLoseModal(false);
        setElapsedTime(0);

        const interval = setInterval(() => {
            if (!gameOver) {
              const currentTime = Date.now();
              const timeDifference = currentTime - startTime;
              const elapsedSeconds = Math.floor(timeDifference / 1000);
              setElapsedTime(elapsedSeconds);
            }
          }, 1000);
    
        setTimerInterval(interval);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            };
        }, [rows, cols]);

        useEffect(() => {
            if (gameOver) {
              // Game is over, stop the timer
              if (timerInterval) {
                clearInterval(timerInterval);
              }
            }
          }, [gameOver, timerInterval]);

function checkWin() {
        const cells1 = document.querySelectorAll(".red");
        const cells2 = document.querySelectorAll(".turn-boom");
      
        if (cells1.length === 0 && cells2.length === 0) {

            setShowWinModal(true)
            setGameOver(true);

        }
        if (cells2.length === 1) {
            setShowLoseModal(true)
            setGameOver(true);

        }
    }
      
    
      function handleFlag(event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) {
        event.preventDefault();
        if (gameOver) return; //disable click when game over
        const cell = event.currentTarget;
        if (!cell.classList.contains("flag")) {
          cell.classList.add("flag");
        } else {
          cell.classList.remove("flag");
        }
      }
    
      function handleClick(event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) {
        if (gameOver) return; //disable click when game over
        const cell = event.currentTarget;
        if (cell.classList.contains("flag")) return;
        if (cell.classList.contains("red")) {
          cell.classList.remove("red");
          cell.classList.add("turn-gold");
        }
        if (cell.classList.contains("white")) {
          cell.classList.remove("white");
          cell.classList.add("turn-boom");
        }
        checkWin();
    }


  // Close Button
  const closeModal1 = () => {
    setShowWinModal(false);
    setWinTime(null);
  };

  const closeModal3 = () => {
    setShowLoseModal(false);
  };

    
    return(
        <div>
            <table id="matrixTable">
                <table className="matrixTable-child">
                    <tr className="headerRow">
                        <td></td>
                        {_colCounter.map(col => <td className="counterWrapper">
                            {col.map(value => <td className="counter">{value}</td>)}
                        </td>)}
                    </tr>
                    {matrix.map((row, rowIndex) => (
            <tr key={rowIndex + 1}>
              <td className="countersWrapper">
                <div className="counters">
                  {_rowCounter[rowIndex].map((value, index) => (
                    <div key={index} className="counter">
                      {value}
                    </div>
                  ))}
                </div>
              </td>
              {row.map((cell, cellIndex) => (
                <td
                  key={rowIndex * cols + cellIndex}
                  onClick={handleClick}
                  onContextMenu={handleFlag}
                  className={`cell-size ${cell}`}
                ></td>
              ))}
            </tr>
          ))}
                    

                </table>
            </table>
            <div className="timer-container">
        <span id="timer">{new Date(elapsedTime * 1000).toISOString().substr(11, 8)}</span>
    </div>
                  {/* Win Modal */}
                  {showWinModal && (
        <div className="overlay" id="popup1">
          <div className="popup">
            <h2 id="win-header">Congratulations, You Win!</h2>
            <p className="time-taken">
              Time Taken: 
              <span id="win-time">{new Date(elapsedTime * 1000).toISOString().substr(11, 8)}</span>
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