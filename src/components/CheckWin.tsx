import React, { useState } from 'react';

type CheckWinProps = {
    timerInterval: NodeJS.Timeout | null;
    gameOver: boolean;
  };

const CheckWin: React.FC<CheckWinProps> = ({ timerInterval, gameOver }) => {
  // State to control winTime and modal visibility
  const [winTime, setWinTime] = useState<NodeJS.Timeout | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);


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
        setWinTime(() => timerInterval);
        setShowWinModal(true);
        gameOver = true
    }
  };

  // Handle lose
  const handleLose = () => {
    const cells2 = document.querySelectorAll('.turn-boom');
    if (cells2.length === 1) {
      setShowLoseModal(true);
      gameOver = true
    }
  };

  return (
    <>
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

    </>
  );
};

export default CheckWin;
