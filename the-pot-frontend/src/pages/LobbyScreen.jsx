import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function LobbyScreen() {
    const { roomId } = useParams();
    const [words, setWords] = useState(["", "", ""]);
    const [isReady, setIsReady] = useState(false);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Здесь можешь подключать WebSocket или polling
        // Получение текущего списка игроков
    }, []);

    const handleWordChange = (value, index) => {
        const updated = [...words];
        updated[index] = value;
        setWords(updated);
    };

    const confirmWords = () => {
        if (words.some(w => !w)) return alert("Введите все 3 слова");
        // Отправляем слова и меняем статус игрока
        setIsReady(true);
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-lg font-semibold">Комната: {roomId}</h2>
            <h3 className="mt-4 font-bold">Игроки:</h3>
            <ul className="mb-4">
                {players.map((p, i) => (
                    <li key={i}>{p.name} {p.isReady ? "✅" : "❌"}</li>
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
