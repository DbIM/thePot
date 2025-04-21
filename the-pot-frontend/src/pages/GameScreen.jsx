// src/pages/GameScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const GameScreen = () => {
    const navigate = useNavigate();

    const handleEndRound = () => {
        navigate("/final");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Игровой экран</h2>
            <p>Здесь будет происходить раунд</p>
            <button onClick={handleEndRound}>Завершить игру</button>
        </div>
    );
};

export default GameScreen;