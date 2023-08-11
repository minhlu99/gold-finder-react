import React, { useEffect, useState } from "react";
import getLeaderBoardApi from "../api/getLeaderBoard";


interface LeaderBoardProps {
  level: number;
  refresh: boolean;
}

interface PlayerData {
  name: string;
  time: string;
}

export default function LeaderBoard({ level, refresh }: LeaderBoardProps) {
  const [leaderBoardData, setLeaderBoardData] = useState<PlayerData[]>([]);

  useEffect(() => {
    async function fetchLeaderBoard() {
      try {
        const response = await getLeaderBoardApi.getLeaderBoard(level);
        setLeaderBoardData(response.data); // Assuming the response.data contains the leader board data
      } catch (error) {
        console.error("Error fetching leader board:", error);
      }
    }

    fetchLeaderBoard();
  }, [level, refresh]);

  return (
    <div className="leader-board-container">
      <div className="leader-board-content">
        <h2 className="leader-board-header">
          Leader Board <br />
          {level} x {level}
        </h2>
        {leaderBoardData.map((player, index) => (
          <div key={index} className="leader-board-player">
            <h3>Top {index + 1}</h3>
            <p>{player.name}</p>
            <p>{player.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
