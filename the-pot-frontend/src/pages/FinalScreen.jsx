// src/pages/FinalScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const FinalScreen = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Игра завершена</h2>
            <p>Здесь будет статистика и победитель</p>
            <button onClick={() => navigate("/")}>На главный экран</button>
        </div>
    );
};

export default FinalScreen;
