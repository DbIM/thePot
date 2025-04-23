import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GameScreen() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const playerName = localStorage.getItem("playerName");

    const [roundState, setRoundState] = useState(null);
    const [isExplainer, setIsExplainer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const showWord = isExplainer && roundState?.timerStarted && roundState.secondsLeft > 0 && roundState.word;

    const fetchRoundState = async () => {
        if (!roomId || !playerName) {
            navigate("/");
            return;
        }

        try {
            const res = await fetch(`/api/game/round-state/${roomId}?playerName=${playerName}`);
            if (!res.ok) throw new Error("Ошибка от сервера");

            const data = await res.json();
            setRoundState(data);
            setIsExplainer(data.explainingPlayer === playerName);
        } catch (err) {
            console.error("Ошибка получения состояния раунда:", err);
            setError("Ошибка получения состояния раунда.");
        }
    };

    const handleReady = async () => {
        try {
            setLoading(true);
            await fetch(`/api/game/ready-to-explain?roomId=${roomId}&playerName=${playerName}`, {
                method: "POST",
            });
            await fetchRoundState();
        } catch (err) {
            console.error("Ошибка при нажатии 'Готов':", err);
            setError("Ошибка старта раунда.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuessed = async () => {
        try {
            await fetch(`/api/game/guess-correct?roomId=${roomId}&playerName=${playerName}`, {
                method: "POST",
            });
            await fetchRoundState();
        } catch (err) {
            console.error("Ошибка при нажатии 'Угадано':", err);
            setError("Не удалось обработать 'Угадано'.");
        }
    };

    const handleStop = async () => {
        try {
            await fetch(`/api/game/skip-word?roomId=${roomId}&playerName=${playerName}`, {
                method: "POST",
            });
            await fetchRoundState();
        } catch (err) {
            console.error("Ошибка при нажатии 'Стоп':", err);
            setError("Не удалось пропустить слово.");
        }
    };

    useEffect(() => {
        fetchRoundState();
        const interval = setInterval(fetchRoundState, 1000);
        return () => clearInterval(interval);
    }, [roomId]);

    if (!roundState) return <p className="text-center mt-10">Загрузка...</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-2xl shadow-lg bg-white">
            <h2 className="text-2xl font-extrabold text-center mb-4 text-blue-700">
                Игра началась!
            </h2>

            <div className="text-center mb-4 text-lg">
                {roundState.secondsLeft > 0 ? (
                    <span className="text-green-700 font-semibold">
                        ⏱ Осталось времени: {roundState.secondsLeft} сек.
                    </span>
                ) : (
                    <span className="text-red-600 font-semibold animate-pulse">
                        ⌛ Время вышло! Ход переходит следующей команде...
                    </span>
                )}
            </div>

            <div className="text-center mb-2">
                <p><strong>Ходит команда:</strong> Команда {roundState.activeTeamIndex + 1}</p>
                <p><strong>Объясняет:</strong> {roundState.explainingPlayer || "Ожидание..."}</p>
            </div>

            {isExplainer && !roundState.timerStarted && (
                <button
                    className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded w-full font-semibold"
                    onClick={handleReady}
                    disabled={loading}
                >
                    {loading ? "Подготовка..." : "Готов!"}
                </button>
            )}

            {showWord && (
                <motion.div
                    className="mt-4 p-6 bg-yellow-100 rounded-xl shadow-md text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className="text-lg font-semibold text-gray-700">Твое слово:</p>
                    <p className="text-3xl font-bold text-yellow-800 mt-2">{roundState.word}</p>

                    <div className="flex gap-4 mt-4">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded w-full font-semibold"
                            onClick={handleGuessed}
                        >
                            ✅ Угадано
                        </button>
                        <button
                            className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded w-full font-semibold"
                            onClick={handleStop}
                        >
                            🔁 Пропустить
                        </button>
                    </div>
                </motion.div>
            )}

            {!isExplainer && roundState.timerStarted && (
                <div className="mt-4 text-center text-gray-700">
                    ⏳ Раунд идёт… ждём объяснение!
                </div>
            )}

            {roundState.teams && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Состав команд:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {roundState.teams.map((team, idx) => (
                            <div key={idx} className={`rounded-lg border p-3 ${idx === roundState.activeTeamIndex ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                                <p className="font-bold mb-2">Команда {idx + 1}</p>
                                <ul className="text-sm text-gray-800 space-y-1">
                                    {team.map((player) => (
                                        <li key={player}>👤 {player}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {roundState.teamScores && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Очки команд:</h3>
                    <div className="flex gap-4 flex-wrap">
                        {roundState.teamScores.map((score, idx) => (
                            <div key={idx} className="bg-gray-100 px-4 py-2 rounded shadow text-sm">
                                🟢 Команда {idx + 1}: <span className="font-bold">{score}</span> очков
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-4 text-red-600 font-medium text-center bg-red-100 px-4 py-2 rounded">
                    ❗ {error}
                </p>
            )}
        </div>
    );
}
