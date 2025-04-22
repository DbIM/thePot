import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeScreen() {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();

    const createRoom = () => {
        fetch(`/api/game/create-room/${name}`, { method: "POST" })
            .then(res => res.text()) // потому что контроллер возвращает String
            .then(roomId => {
                navigate(`/lobby/${roomId}`);
            });
    };

    const joinRoom = () => {
        navigate(`/lobby/${roomId}`);
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Добро пожаловать!</h1>
            <input
                className="w-full border p-2 mb-2"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button className="w-full bg-blue-500 text-white p-2 mb-2" onClick={createRoom}>
                Создать комнату
            </button>
            <input
                className="w-full border p-2 mb-2"
                placeholder="Код комнаты"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button className="w-full bg-green-500 text-white p-2" onClick={joinRoom}>
                Присоединиться
            </button>
        </div>
    );
}
