import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeScreen() {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();

    localStorage.setItem("playerName", name);

    const createRoom = () => {
        fetch(`/api/game/create-room/${name}`, { method: "POST" })
            .then(res => res.text())
            .then(roomId => {
                navigate(`/lobby/${roomId}`);
            });
    };

    const joinRoom = () => {
        navigate(`/lobby/${roomId}`);
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-20 bg-white rounded-2xl shadow-lg text-center space-y-4">
            <h1 className="text-2xl font-bold text-blue-700">🎉 Добро пожаловать!</h1>
            <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                onClick={createRoom}
            >
                🚀 Создать комнату
            </button>
            <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="Код комнаты"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                onClick={joinRoom}
            >
                🔑 Присоединиться
            </button>
        </div>
    );
}
