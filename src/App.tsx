import { useEffect, useState } from "react";
import "./App.css";
import Input from "./components/Input";
import Introduction from "./components/Introduction";
import MatrixTable from "./components/MatrixTable";
import LeaderBoard from "./components/LeaderBoard";
import { useSearchParams } from "react-router-dom";
import challengePlayerApi from "./api/challengePlayer";

function App() {
  const [search, setSearch] = useSearchParams();
  const [_colCounter, set_ColCounter] = useState<number[][]>([]); // Define colCounter state
  const [_rowCounter, set_RowCounter] = useState<number[][]>([]);
  const [playById, setPlayById] = useState(false);
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(false);
  const [size, setSize] = useState(6);
  const [time, setTime] = useState(0);
  const [isPlay, setIsPlay] = useState(false);

  const id = search.get("id");

  async function genMatrixById() {
    try {
      const newMatrix = await challengePlayerApi.challengePlayer(id);
      setSize(newMatrix.data.level);
      setIsPlay(true);
      set_ColCounter(newMatrix.data.colCounters);
      set_RowCounter(newMatrix.data.rowCounters);
      setPlayById(true);

      return newMatrix;
    } catch (error) {
      // Handle errors here, for example:
      console.error("Error in createMatrix:", error);
      throw error; // Rethrow the error to be caught at the calling site
    }
  }

  const handleRecordSaved = () => {
    // Call this function after saving a record to trigger leaderboard refresh
    setRefreshLeaderboard(!refreshLeaderboard);
  };

  useEffect(() => {
    id && genMatrixById();
  }, [id]);

  return (
    <div className="App">
      <div className="input-container">
        <Input
          onStart={(_size) => {
            setSize(parseInt(_size));
            setTime(new Date().getTime());
            setIsPlay(true);
          }}
        />
        <Introduction />
      </div>

      {isPlay && (
        <MatrixTable
          rows={size}
          cols={size}
          time={time}
          __colCounter={_colCounter}
          __rowCounter={_rowCounter}
          playById={playById}
          onRecordSaved={handleRecordSaved}
        />
      )}
      <LeaderBoard level={size} refresh={refreshLeaderboard} />
    </div>
  );
}

export default App;
