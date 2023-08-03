import { log } from "console";
import { useEffect, useMemo, useState } from "react";

interface MatrixTableProps {
  rows: number;
  cols: number;
  time: number;
}

interface ICell {
  color: string;
  open: boolean;
  flag: boolean;
}

export default function MatrixTable({ rows, cols, time }: MatrixTableProps) {
  const [gameOver, setGameOver] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const startTime = Date.now();
  const [matrix, setMatrix] = useState<ICell[][]>([]);

  const _colCounter = useMemo(() => {
    if (!matrix || matrix.length === 0) return [];
    const rowLength = matrix.length;
    const colLength = matrix[0].length;

    const colCounters = [];
    for (let j = 0; j < colLength; j++) {
      const col = [];
      let colCounter = 0;
      for (let i = 0; i < rowLength; i++) {
        if (matrix[i][j].color === "red") {
          colCounter++;
        } else if (colCounter > 0) {
          col.push(colCounter);
          colCounter = 0;
        }
      }
      if (colCounter > 0) {
        col.push(colCounter);
      }
      colCounters.push(col);
    }
    return colCounters;
  }, [matrix]);

  const _rowCounter = useMemo(() => {
    if (!matrix || matrix.length === 0) return [];
    const rowLength = matrix.length;
    const colLength = matrix[0].length;

    const temp: number[][] = [];
    for (let i = 0; i < rowLength; i++) {
      let rowCounter = 0;
      temp.push([]);
      for (let j = 0; j < colLength; j++) {
        if (matrix[i][j].color === "red") {
          rowCounter++;
        } else if (rowCounter > 0) {
          temp[i].push(rowCounter);
          rowCounter = 0; // Reset rowCounter
        }
      }
      if (rowCounter > 0) {
        temp[i].push(rowCounter); // Save final rows value
      }
    }
    return temp;
  }, [matrix]);

  useEffect(() => {
    const temp: ICell[][] = [];

    for (let i = 0; i < rows; i++) {
      const row: ICell[] = [];

      for (let j = 0; j < rows; j++) {
        let color = Math.random() < 0.5 ? "white" : "red";
        row.push({
          color: color,
          open: false,
          flag: false,
        });
      }
      temp.push(row);
    }
    setMatrix(temp);
    setGameOver(false);
    setShowWinModal(false);
    setShowLoseModal(false);
    setElapsedTime(0);

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeDifference = currentTime - startTime;
      const elapsedSeconds = Math.floor(timeDifference / 1000);
      setElapsedTime(elapsedSeconds);
    }, 1000);

    setTimerInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [rows, cols, time]);

  useEffect(() => {
    if (gameOver) {
      // Game is over, stop the timer
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  }, [gameOver, timerInterval]);

  function handleFlag(rowIndex: number, cellIndex: number) {
    if (gameOver) return; //disable click when game over
    const newMat = [...matrix];
    newMat[rowIndex][cellIndex].flag = !newMat[rowIndex][cellIndex].flag;
    setMatrix(newMat);
  }

  function handleClick(rowIndex: number, cellIndex: number) {
    if (gameOver) return; //disable click when game over
    const newMat = [...matrix];
    newMat[rowIndex][cellIndex].open = true;
    setMatrix(newMat);

    if (newMat[rowIndex][cellIndex].color === "white") {
      setShowLoseModal(true);
      setGameOver(true);
    }

    if (
      newMat
        .flat(1)
        .filter((x) => x.color === "red")
        .every((x) => x.open === true)
    ) {
      setShowWinModal(true);
      setGameOver(true);
    }
  }

  // Close Button
  const closeModal1 = () => {
    setShowWinModal(false);
  };

  const closeModal3 = () => {
    setShowLoseModal(false);
  };

  return (
    <div>
      <table id="matrixTable">
        <table className="matrixTable-child">
          <tr className="headerRow">
            <td></td>
            {_colCounter.map((col) => (
              <td className="counterWrapper">
                {col.map((value) => (
                  <td className={`counter ${rows > 15 && 'modify-counter-font-size'}`}>{value}</td>
                ))}
              </td>
            ))}
          </tr>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex + 1}>
              <td className="countersWrapper">
                <div className="counters">
                  {_rowCounter[rowIndex].map((value, index) => (
                    <div key={index} className={`counter ${rows > 15 && 'modify-counter-font-size'}`}>
                      {value}
                    </div>
                  ))}
                </div>
              </td>
              {row.map((cell, cellIndex) => (
                <td
                  key={rowIndex * cols + cellIndex}
                  onClick={() => {
                    handleClick(rowIndex, cellIndex);
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    handleFlag(rowIndex, cellIndex);
                  }}
                  className={`
                    cell-size
                    ${rows > 10 && "modify-cell-size"}
                    ${rows > 15 && "modify-cell-size1"}
                    ${cell.color} 
                    ${cell.open && cell.color === "red" && "turn-gold"} 
                    ${cell.open && cell.color === "white" && "turn-boom"} 
                    ${cell.flag && "flag"}`}
                ></td>
              ))}
            </tr>
          ))}
        </table>
      </table>
      <div className="timer-container">
        <span id="timer">
          {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}
        </span>
      </div>
      {/* Win Modal */}
      {showWinModal && (
        <div className="overlay" id="popup1">
          <div className="popup">
            <h2 id="win-header">Congratulations, You Win!</h2>
            <p className="time-taken">
              Time Taken:
              <span id="win-time">
                {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}
              </span>
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
  );
}
