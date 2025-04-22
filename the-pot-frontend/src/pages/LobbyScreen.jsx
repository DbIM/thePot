import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function LobbyScreen() {
    const { roomId } = useParams();
    const [words, setWords] = useState(["", "", ""]);
    const [isReady, setIsReady] = useState(false);
    const [players, setPlayers] = useState([]);
    const [yourName, setYourName] = useState("");
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        console.log("👤 playerName in localStorage:", localStorage.getItem("playerName"));

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
                console.log("Получены игроки:", data);
                setPlayers(data);
            } catch (err) {
                console.error("Ошибка при получении игроков:", err);
            }
        };

        fetchPlayers();
        const interval = setInterval(fetchPlayers, 3000);
        return () => clearInterval(interval);
    }, [roomId]);

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
                throw new Error(text || "Ошибка при отправке слов");
            }

            setIsReady(true);
        } catch (e) {
            setError(e.message);
            console.error("Ошибка отправки слов:", e);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-lg font-semibold">Комната: {roomId}</h2>
            <h3 className="mt-4 font-bold">Игроки:</h3>
            <ul className="mb-4">
                {players.map((p, i) => (
                    <li key={i}>
                        {p.name} {p.ready ? "✅" : "❌"}
                    </li>
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
        </div>
    );
}
