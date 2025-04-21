// src/pages/WelcomeScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [words, setWords] = useState(["", "", ""]);

    const handleChangeWord = (index, value) => {
        const updated = [...words];
        updated[index] = value;
        setWords(updated);
    };

    const isFormValid = () => {
        return name.trim() !== "" && words.every(w => w.trim() !== "");
    };

    const handleCreateRoom = () => {
        if (!isFormValid()) return;
        localStorage.setItem("playerName", name);
        localStorage.setItem("playerWords", JSON.stringify(words));
        navigate("/lobby");
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
            <h1>Добро пожаловать в игру "The Pot"</h1>
            <div style={{ marginBottom: "1rem" }}>
                <label>Имя игрока:</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Введите ваше имя"
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                />
            </div>
            <div>
                <label>Загадайте 3 слова:</label>
                {words.map((word, index) => (
                    <input
                        key={index}
                        type="text"
                        value={word}
                        onChange={e => handleChangeWord(index, e.target.value)}
                        placeholder={`Слово ${index + 1}`}
                        style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
                    />
                ))}
            </div>
            <button onClick={handleCreateRoom} disabled={!isFormValid()}>
                Готов
            </button>
        </div>
    );
};

export default WelcomeScreen;