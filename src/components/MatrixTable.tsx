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
    let startTime = Date.now();

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
    }, [rows])

function checkWin() {
        const cells1 = document.querySelectorAll(".red");
        const cells2 = document.querySelectorAll(".turn-boom");
      
        if (cells1.length === 0 && cells2.length === 0) {
          setWinTime(timerInterval);
          setShowWinModal(true);
          setGameOver(true);
          setTimerInterval(null);
        } else if (cells2.length === 1) {
          setShowLoseModal(true);
          setGameOver(true);
          setTimerInterval(null);
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
      

      useEffect(() => {
        if (gameOver) {
            setShowWinModal(true);
          }
          setTimerInterval(null);
        
      }, [gameOver]);

        //Reset timer
    useEffect(() => {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = '00:00:00';
            }
        }, []);

    //   useEffect(() => {
    //     if (timerInterval) {
    //       clearInterval(timerInterval);
    //     }
    //     const newTimerInterval = setInterval(updateTimer, 1000);
    //     setTimerInterval(newTimerInterval);
    //     return () => {
    //       if (newTimerInterval) {
    //         clearInterval(newTimerInterval);
    //       }
    //     };
    //   }, []);

      function resetTimer() {
        const timerElement = document.getElementById("timer");
        if (timerElement) {
          timerElement.textContent = "00:00:00";
        }
      }

    

    // Start the timer
    // useEffect(() => {
    //     setTimerInterval(setInterval(updateTimer, 1000));
    
    //     return () => {
    //       if (timerInterval) {
    //         clearInterval(timerInterval);
    //       }
    //     };
    //   }, []);


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
                  {/* Win Modal */}
                  {showWinModal && (
        <div className="overlay" id="popup1">
          <div className="popup">
            <h2 id="win-header">Congratulations, You Win!</h2>
            <p className="time-taken">
              Time Taken: 
              {/* <span id="win-time">{winTime ? winTime.toString() : null}</span> */}
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