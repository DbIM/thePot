import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function GameScreen() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const playerName = localStorage.getItem("playerName");

    const [roundState, setRoundState] = useState(null);
    const [isExplainer, setIsExplainer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchRoundState = async () => {
        if (!roomId || !playerName) {
            navigate("/"); // если что-то не передано — вернём на главную
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

    const showWord = isExplainer && roundState.timerStarted && roundState.secondsLeft > 0;

    return (
        <div className="max-w-lg mx-auto mt-10 p-4 border rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Игра началась!</h2>

            <p className="mb-1">
                <strong>Ходит команда:</strong>{" "}
                {typeof roundState.activeTeam === "number"
                    ? `Команда ${roundState.activeTeam + 1}`
                    : "—"}
            </p>
            <p className="mb-1">
                <strong>Объясняет:</strong> {roundState.explainingPlayer || "Ожидание..."}
            </p>
            <p className="mb-3">
                <strong>Осталось времени:</strong>{" "}
                {roundState.secondsLeft === 0 && (
                    <div className="mt-4 text-center text-orange-600 font-semibold">
                        Время вышло! Ход переходит следующей команде...
                    </div>
                )}
            </p>

            {isExplainer && !roundState.timerStarted && (
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded w-full"
                    onClick={handleReady}
                    disabled={loading}
                >
                    {loading ? "Подготовка..." : "Готов!"}
                </button>
            )}

            {showWord && (
                <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">Твое слово:</p>
                    <div className="text-2xl font-bold mt-2 bg-yellow-200 p-3 rounded mb-4">
                        {roundState.word}
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                            onClick={handleGuessed}
                        >
                            Угадано
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded w-full"
                            onClick={handleStop}
                        >
                            Стоп
                        </button>
                    </div>
                </div>
            )}

            {!isExplainer && roundState.timerStarted && (
                <div className="mt-4 text-center text-gray-700">
                    Раунд идёт… ждём объяснение!
                </div>
            )}

            {roundState.teams && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-1">Состав команд:</h3>
                    {roundState.teams.map((team, idx) => (
                        <div key={idx} className="mb-2">
                            <p className="font-bold">Команда {idx + 1}:</p>
                            <ul className="list-disc list-inside text-gray-800">
                                {team.map((player) => (
                                    <li key={player}>{player}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {roundState.teamScores && (
                <div className="mt-4">
                    <h3 className="font-semibold mb-1">Очки команд:</h3>
                    <ul className="list-disc pl-5 text-gray-800">
                        {roundState.teamScores.map((score, idx) => (
                            <li key={idx}>Команда {idx + 1}: {score} очков</li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
}
