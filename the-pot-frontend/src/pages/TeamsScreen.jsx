import React from "react";
import { useLocation } from "react-router-dom";

export default function TeamsScreen() {
  const { state } = useLocation(); // передаём команды через useNavigate(..., { state })

  const { teams, order } = state;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Команды</h2>
      {teams.map((team, index) => (
        <div key={index} className="mb-4 border p-2 rounded bg-gray-50">
          <h3 className="font-semibold">Команда {index + 1}</h3>
          <ul>
            {team.players.map((player, i) => (
              <li key={i}>{player.name}</li>
            ))}
          </ul>
        </div>
      ))}
      <h3 className="mt-6 font-bold">Очередность ходов:</h3>
      <ol className="list-decimal ml-6">
        {order.map((teamIndex, i) => (
          <li key={i}>Команда {teamIndex + 1}</li>
        ))}
      </ol>
    </div>
  );
}
