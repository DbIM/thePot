// src/pages/LobbyScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketService } from "../services/WebSocketService";  // новый сервис для WebSocket

const LobbyScreen = ({ mode }) => {
    const navigate = useNavigate();
    const playerName = localStorage.getItem("playerName");
    const [words, setWords] = useState(["", "", ""]);
    const [ready, setReady] = useState(false);

    const handleChangeWord = (index, value) => {
        const updated = [...words];
        updated[index] = value;
        setWords(updated);
    };

    const handleStartGame = () => {
        if (ready) {
            WebSocketService.sendReady(playerName, words);
            navigate("/game");
        }
    };

    const handleReady = () => {
        setReady(true);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Лобби</h2>
            <p>Привет, {playerName}!</p>
            {mode === "create" && (
                <div>
                    <label>Загадайте 3 слова:</label>
                    {words.map((word, index) => (
                        <input
                            key={index}
                            type="text"
                            value={word}
                            onChange={(e) => handleChangeWord(index, e.target.value)}
                            placeholder={`Слово ${index + 1}`}
                            style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
                        />
                    ))}
                </div>
            )}
            <button onClick={handleReady} disabled={ready}>Готов</button>
            <button onClick={handleStartGame} disabled={!ready}>Начать игру</button>
        </div>
    );
};

export default LobbyScreen;
