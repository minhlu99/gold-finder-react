import flagImg from "../assets/flag.svg";
import goldImg from "../assets/pot-of-gold-2.png";
import boomImg from "../assets/boom-3307008.png";

export default function Introduction() {
  return (
    <div className="tutorial-container">
      <h3 className="tutorial-header">Tutorial</h3>
      <div className="left-click">
        <img
          src={goldImg}
          className="left-click-image gold-image"
          alt="gold"
        ></img>

        <img src={boomImg} className="left-click-image" alt="boom"></img>
        <p>Left Mouse Click</p>
      </div>
      <div className="right-click">
        <img src={flagImg} className="right-click-image" alt="flag"></img>
        <p>Right Mouse Click</p>
      </div>

      <div className="tutorial-content">
        <h4>Left Mouse Click</h4>
        <p>
          + If you click on a cell with gold, it will turn into a gold
          (indicating you found the gold)
          <br />+ If you click on a cell with a bomb, and the cell will turn
          into a bomb (indicating that you lost the game)
        </p>
        <h4>Right Mouse Click</h4>
        <p>
          + To help you keep track of potential bomb locations, you can
          right-click on a cell to mark it with a flag.
          <br />
          + Right-clicking again on a flagged cell will remove the flag.
          <br />
          + The flagged cells are for your reference only and do not affect the
          game mechanics.
          <br />
        </p>
        <p>
          {" "}
          <br />
          <h4>
            Your goal is to find all the gold and avoid the bombs. Let's get
            started:
          </h4>
        </p>
        <p>Step 1: Choose Grid Size</p>
        <p>Step 2: Play the Game</p>
        <p>Step 3: Find All the Gold</p>
        <br />
        <div className="win-or-lose">
          <h3>Win or Lose</h3>
          <p>
            If you successfully reveal all the gold cells without clicking on
            any bombs, you win the game!
            <br />
            However, if you click on any bomb cell, the game is over, and you
            lose.
          </p>
          <br />
          <h3>Enjoy the game!</h3>
        </div>
      </div>
    </div>
  );
}
