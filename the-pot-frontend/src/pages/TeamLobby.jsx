import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TeamLobby = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [joined, setJoined] = useState(false);

  const joinRoom = async () => {
    if (!playerName || !roomId) return;
    const res = await fetch(`/api/room/${roomId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: playerName })
    });
    if (res.ok) {
      setJoined(true);
      fetchPlayers();
    }
  };

  const fetchPlayers = async () => {
    const res = await fetch(`/api/room/${roomId}/players`);
    const data = await res.json();
    setPlayers(data);
  };

  const formTeams = async () => {
    const res = await fetch(`/api/room/${roomId}/formTeams`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setTeams(data);
    }
  };

  useEffect(() => {
    if (joined) {
      const interval = setInterval(fetchPlayers, 3000);
      return () => clearInterval(interval);
    }
  }, [joined]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Лобби игры</h1>

      {!joined ? (
        <div className="space-y-4">
          <Input
            placeholder="ID комнаты"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Input
            placeholder="Ваше имя"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <Button className="w-full" onClick={joinRoom}>Присоединиться</Button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mt-4">Игроки в комнате:</h2>
          <ul className="mb-4">
            {players.map((p, i) => (
              <li key={i}>👤 {p.name}</li>
            ))}
          </ul>

          <Button onClick={formTeams}>Сформировать команды</Button>

          {teams.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Команды:</h2>
              {teams.map((team, i) => (
                <div key={i} className="mb-2">
                  <strong>Команда {i + 1}:</strong> {team.players.map(p => p.name).join(", ")}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamLobby;
