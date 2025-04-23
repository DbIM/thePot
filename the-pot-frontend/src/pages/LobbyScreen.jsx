import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LobbyScreen() {
    const { roomId } = useParams();
    const [words, setWords] = useState(["", "", ""]);
    const [isReady, setIsReady] = useState(false);
    const [players, setPlayers] = useState([]);
    const [yourName, setYourName] = useState("");
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (teams.length > 0) {
            const timeout = setTimeout(() => {
                navigate(`/game/${roomId}`);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [teams, roomId, navigate]);

    useEffect(() => {
        let storedName = localStorage.getItem("playerName");
        if (!storedName) {
            storedName = prompt("Введите ваше имя:");
            localStorage.setItem("playerName", storedName);
        }
        setYourName(storedName);

        const joinRoom = async () => {
            try {
                await fetch(`/api/game/join-room?roomId=${roomId}&playerName=${storedName}`, {
                    method: "POST",
                });
            } catch (err) {
                console.error("Ошибка при входе в комнату:", err);
            }
        };

        joinRoom();

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

            const startGame = async () => {
                try {
                    await fetch(`/api/game/start/${roomId}`, { method: "POST" });
                    fetchTeams();
                } catch (e) {
                    console.error("Ошибка при старте игры:", e);
                }
            };

            startGame();
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
                const text = await res.text();
                alert(`Ошибка: ${text}`);
                return;
            }

            setIsReady(true);
        } catch (e) {
            console.error("Ошибка отправки слов:", e);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Лобби — Комната: {roomId}</h2>

            <h3 className="text-lg font-semibold mb-2">👥 Игроки:</h3>
            <ul className="mb-4 space-y-1">
                {players.map((p, i) => (
                    <li key={i} className="flex items-center justify-between border-b pb-1">
                        <span>{p.name}</span>
                        <span>{p.ready ? "✅" : "⌛"}</span>
                    </li>
                ))}
            </ul>

            {!isReady ? (
                <div className="space-y-2">
                    <h3 className="text-md font-medium">📝 Введите 3 слова:</h3>
                    {words.map((word, index) => (
                        <input
                            key={index}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={word}
                            onChange={(e) => handleWordChange(e.target.value, index)}
                            placeholder={`Слово ${index + 1}`}
                        />
                    ))}
                    <button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition mt-2"
                        onClick={confirmWords}
                    >
                        ✅ Подтвердить слова
                    </button>
                </div>
            ) : (
                <p className="text-green-600 text-center font-semibold mt-4">Готово! Ждём остальных…</p>
            )}
        </div>
    );
}
