import React, { useState, useEffect } from "react";
import genMatrixApi from "../api/genMatrixApi";
import handleClickApi from "../api/handleClickApi";
import checkWinApi from "../api/checkWin";
import saveRecordApi from "../api/saveRecord";

interface MatrixTableProps {
  rows: number;
  cols: number;
  time: number;
  __colCounter: number[][];
  __rowCounter: number[][];
  playById: boolean;
  onRecordSaved: () => void;
}

interface ICell {
  color: string;
  open: boolean;
  flag: boolean;
}

export default function MatrixTable({
  rows,
  cols,
  time,
  __colCounter,
  __rowCounter,
  playById,
  onRecordSaved,
}: MatrixTableProps) {

  const [idMatrix, setIdMatrix] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  // const [isBoomOrGold, setIsBoomOrGold] = useState<string>("")
  const [playerName, setPlayerName] = useState("");
  const [openedGoldCells, setOpenedGoldCells] = useState<number>(0);
  const [_colCounter, set_ColCounter] = useState<number[][]>([]); // Define colCounter state
  const [_rowCounter, set_RowCounter] = useState<number[][]>([]); // Define rowCounter state
  const [cellStatus, setCellStatus] = useState<{
    [key: string]: "boom" | "gold" | "unopened";
  }>({});
  const [gameOver, setGameOver] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const startTime = Date.now();
  const [matrix, setMatrix] = useState<ICell[][]>([]);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(
    null
  );
  const [highlightedColIndex, setHighlightedColIndex] = useState<number | null>(
    null
  );

  function resetGame() {
    const newMatrix: ICell[][] = [];

    // Initialize the matrix with the correct number of rows and columns
    for (let i = 0; i < rows; i++) {
      const row: ICell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          color: Math.random() < 0.5 ? "white" : "red",
          open: false,
          flag: false,
        });
      }
      newMatrix.push(row);
    }

    setMatrix(newMatrix);
    set_ColCounter([]);
    set_RowCounter([]);
    setGameOver(false);
    setShowWinModal(false);
    setShowLoseModal(false);
    setElapsedTime(0);
    setTimerInterval(null);
    setOpenedGoldCells(0);
    setHighlightedRowIndex(null);
    setHighlightedColIndex(null);
    setIsSaved(false);
    setIdMatrix("");
  }

  function handleMouseEnter(rowIndex: number, cellIndex: number) {
    setHighlightedRowIndex(rowIndex);
    setHighlightedColIndex(cellIndex);
  }

  function handleMouseLeave() {
    setHighlightedRowIndex(null);
    setHighlightedColIndex(null);
  }

  async function createMatrix() {
    try {
      console.log("createMatrix");
      resetGame();
      const newMatrix = await genMatrixApi.getMatrix(rows);
      playById
        ? set_RowCounter(__rowCounter)
        : set_RowCounter(newMatrix.data.rowCounters);
      playById
        ? set_ColCounter(__colCounter)
        : set_ColCounter(newMatrix.data.colCounters);

      setIdMatrix(newMatrix.data.id);
      console.log(idMatrix);

      return newMatrix;
    } catch (error) {
      // Handle errors here, for example:
      console.error("Error in createMatrix:", error);
      throw error; // Rethrow the error to be caught at the calling site
    }
  }

  useEffect(() => {
    createMatrix();
  }, [rows, time]);

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
  }, [rows, time]);

  useEffect(() => {
    if (gameOver) {
      // Game is over, stop the timer
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  }, [gameOver]);

  function handleFlag(rowIndex: number, cellIndex: number) {
    if (gameOver || matrix[rowIndex][cellIndex].open) return; //disable click when game over
    const newMat = [...matrix];
    newMat[rowIndex][cellIndex].flag = !newMat[rowIndex][cellIndex].flag;
    setMatrix(newMat);
  }

  async function handleClick(
    idMatrix: string,
    rowIndex: number,
    cellIndex: number
    ) {
    const cell = matrix[rowIndex][cellIndex];
    if (cell.flag || gameOver || cell.open) {
      // Do nothing if the cell is flagged, game over, or already opened
      return;
    }
    const newMat = [...matrix];
    newMat[rowIndex][cellIndex].open = true;
    setMatrix(newMat);

    try {
      console.log("createMatrix");
      const res = await handleClickApi.handleClick(
        idMatrix,
        rowIndex,
        cellIndex
      );

      const result = res.data;

      // if (result === "boom") {
      //   setShowLoseModal(true)
      //   setGameOver(true)
      //   setIsBoomOrGold("boom")
      // } else if (result === "gold") {
      //   setIsBoomOrGold("gold")
      //   setOpenedGoldCells((prevCount) => prevCount + 1)
      // }

      setCellStatus((prevCellStatus) => {
        const cellKey = `${rowIndex}-${cellIndex}`;

        // check lose
        if (result === "boom") {
          setShowLoseModal(true);
          setGameOver(true);
          return { ...prevCellStatus, [cellKey]: "boom" };
        } else if (result === "gold") {
          setOpenedGoldCells((prevCount) => prevCount + 1);

          return { ...prevCellStatus, [cellKey]: "gold" };
        } else {
          return { ...prevCellStatus, [cellKey]: "unopened" };
        }
      });
      checkRemainGold()
    } catch (error) {
      console.error("Error in createMatrix:", error);
      throw error;
    }
  }

  const checkRemainGold = () => {
    console.log(cellStatus)
  }

  useEffect(() => {
    if (!openedGoldCells) return;
    (async () => {
      const resultOfGame = await checkWinApi.checkWin(
        idMatrix,
        openedGoldCells
      );

      if (resultOfGame.data === "win") {
        setShowWinModal(true);
        setGameOver(true);
      }
    })();
  }, [openedGoldCells]);

  // Close Button
  const closeModal1 = () => {
    setShowWinModal(false);
  };

  const closeModal3 = () => {
    setShowLoseModal(false);
  };

  async function saveRecord() {
    try {
      const recordData = {
        name: playerName,
        time: new Date(elapsedTime * 1000).toISOString().substr(11, 8),
        level: rows,
      };

      await saveRecordApi.saveRecord(recordData);

      setIsSaved(true)
      if (onRecordSaved) {
        onRecordSaved();
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  }

  function generateChallengeLink() {
    return `https://gold-finder.techwiz.tech/?id=${idMatrix}`;
  }

  function copyChallengeLink() {
    const challengeLink = generateChallengeLink();
    navigator.clipboard.writeText(challengeLink).then(() => {
      setIsCopied(true);
    });
  }

  return (
    <div className="matrixTable-container">

      <div id="matrixTable">
        <table className="matrixTable-child">
          <thead>
          <tr className="headerRow">
            <td></td>
            {_colCounter?.map((col, index) => (
              <td key={index} className="counterWrapper">
                {col.map((value, index2) => (
                  <div
                    key={index2}
                    className={`counter ${
                      rows > 15 && "modify-counter-font-size"
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </td>
            ))}
          </tr>
          </thead>
          <tbody>
          {matrix.map((row, rowIndex) => (
            <tr
              key={rowIndex + 1}
              className={highlightedRowIndex === rowIndex ? `highlight` : ``}
            >
                            
              <td className="countersWrapper">

                <div className="counters">
                  
                  {_rowCounter[rowIndex]?.map((value, index) => (
                    <div
                      key={index}
                      className={`counter ${
                        rows > 15 && "modify-counter-font-size"
                      }`}
                    >
                      {value}
                      
                    </div>
                  ))}
                </div>
              </td>
              {row.map((cell, cellIndex) => {
                const cellKey = `${rowIndex}-${cellIndex}`;
                const isBoom = cellStatus[cellKey] === "boom";
                const isGold = cellStatus[cellKey] === "gold";
                return (
                  <td
                    key={rowIndex * cols + cellIndex}
                    onClick={() => {
                      handleClick(idMatrix, rowIndex, cellIndex);
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      handleFlag(rowIndex, cellIndex);
                    }}
                    onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
                    onMouseLeave={handleMouseLeave}
                    className={`
                    cell-size
                    ${rows > 10 && "modify-cell-size"}
                    ${rows > 15 && "modify-cell-size1"}
                    ${cell.color} 
                    ${cell.open && isGold && "turn-gold"}
                    ${cell.open && isBoom && "turn-boom"}
                    ${cell.flag && "flag"}
                    ${highlightedColIndex === cellIndex ? `highlight` : ``}
                    `}
                  ></td>
                );
              })}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
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
            <p className="rank-index">You ranked at Top</p>
            <input
              className="input-save-player"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            ></input>
            <br />
            <button
              onClick={saveRecord}
              className="glow-on-hover save-record-btn"
            >
              {isSaved ? "Saved!" : "Save Record"}
            </button>
            <p className="challenge-link-container">
              Challenge Your Friends:{" "}
              <a className="challenge-link" href={generateChallengeLink()}>
                {generateChallengeLink()}
              </a>
              <button className="copy-link" onClick={copyChallengeLink}>
                {isCopied ? "Copied!" : "Copy Link"}
              </button>
            </p>
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
