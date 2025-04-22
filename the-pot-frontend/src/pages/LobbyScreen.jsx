import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function LobbyScreen() {
    const { roomId } = useParams();
    const [words, setWords] = useState(["", "", ""]);
    const [isReady, setIsReady] = useState(false);
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const yourName = localStorage.getItem("playerName");

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await fetch(`/api/game/room/${roomId}/players`);
                const data = await res.json();
                setPlayers(data);
            } catch (err) {
                console.error("Ошибка при получении игроков:", err);
            }
        };

        fetchPlayers();
        const interval = setInterval(fetchPlayers, 3000);
        return () => clearInterval(interval);
    }, [roomId]);

    // Получение команд, когда все готовы
    useEffect(() => {
        const allReady = players.length > 0 && players.every(p => p.ready);
        if (allReady) {
            const fetchTeams = async () => {
                try {
                    const res = await fetch(`/api/game/room/${roomId}/teams`);
                    const data = await res.json();
                    setTeams(data);
                } catch (e) {
                    console.error("Ошибка при получении команд:", e);
                }
            };
            fetchTeams();
        }
    }, [players, roomId]);

    const handleWordChange = (value, index) => {
        const updated = [...words];
        updated[index] = value;
        setWords(updated);
    };

    const confirmWords = async () => {
        if (words.some(w => !w)) return alert("Введите все 3 слова");

        try {
            const res = await fetch(`/api/game/submit-words?roomId=${roomId}&playerName=${yourName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(words),
            });

            if (!res.ok) {
                throw new Error("Не удалось отправить слова");
            }

            setIsReady(true);
        } catch (e) {
            console.error("Ошибка отправки слов:", e);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-lg font-semibold">Комната: {roomId}</h2>

            <h3 className="mt-4 font-bold">Игроки:</h3>
            <ul className="mb-4">
                {Array.isArray(players) && players.map((p, i) => (
                    <li key={i}>{p.name} {p.ready ? "✅" : "❌"}</li>
                ))}
            </ul>

            {!isReady ? (
                <div>
                    <h3>Введите 3 слова:</h3>
                    {words.map((word, index) => (
                        <input
                            key={index}
                            className="w-full border p-2 mb-2"
                            value={word}
                            onChange={(e) => handleWordChange(e.target.value, index)}
                            placeholder={`Слово ${index + 1}`}
                        />
                    ))}
                    <button className="bg-blue-500 text-white p-2 w-full" onClick={confirmWords}>
                        Подтвердить слова
                    </button>
                </div>
            ) : (
                <p className="text-green-600 font-bold">Вы готовы! Ждём остальных…</p>
            )}

            {/* Отображение команд после полной готовности */}
            {teams.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-bold mb-2">Команды:</h3>
                    {teams.map((team, i) => (
                        <div key={i} className="mb-4 p-3 border border-gray-300 rounded-lg">
                            <h4 className="font-semibold mb-1">Команда {i + 1}</h4>
                            <ul className="list-disc list-inside">
                                {team.players.map((p, idx) => (
                                    <li key={idx}>{p.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
