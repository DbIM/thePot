// src/pages/LobbyScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LobbyScreen = () => {
    const navigate = useNavigate();

    const playerName = localStorage.getItem("playerName");
    const playerWords = JSON.parse(localStorage.getItem("playerWords") || "[]");

    const handleStartGame = () => {
        navigate("/game");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Лобби</h2>
            <p>Привет, {playerName}!</p>
            <p>Твои слова: {playerWords.join(", ")}</p>
            <button onClick={handleStartGame}>Начать игру</button>
        </div>
    );
};

export default LobbyScreen;