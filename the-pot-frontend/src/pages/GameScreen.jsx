import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function GameScreen() {
    const { roomId } = useParams();
    const [gameState, setGameState] = useState(null);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const res = await fetch(`/api/game/state/${roomId}`);
                const data = await res.json();
                setGameState(data);
            } catch (err) {
                console.error("Ошибка при получении состояния игры:", err);
            }
        };

        fetchState();
        const interval = setInterval(fetchState, 3000);
        return () => clearInterval(interval);
    }, [roomId]);

    // ВАЖНО: объявляем внутри компонента
    const activeTeam = gameState?.activeTeam;
    const currentWord = gameState?.currentWord;

    return (
        <div className="p-4 max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Игра началась!</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold">Текущий раунд:</h2>
                <p className="text-lg text-blue-600">{gameState?.currentRound || 1}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold">Команда ходит:</h2>
                <p className="text-lg text-green-700">
                    {activeTeam?.players?.map(p => p.name).join(', ') || "Ожидание..."}
                </p>
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Слово:</h3>
                <p className="text-2xl">{currentWord || "Ждём слово..."}</p>
            </div>

            <div className="flex gap-4 justify-center mt-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded">Угадано</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">Пропустить</button>
            </div>
        </div>
    );
}
