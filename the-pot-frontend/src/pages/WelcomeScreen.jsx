// WelcomeScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const handleCreateRoom = () => {
        if (!name.trim()) return;
        localStorage.setItem('playerName', name);
        navigate('/lobby/create');
    };

    const handleJoinRoom = () => {
        if (!name.trim()) return;
        localStorage.setItem('playerName', name);
        navigate('/lobby/join');
    };

    return (
        <div>
            <h1>Добро пожаловать в игру "The Pot"</h1>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите ваше имя"
            />
            <button onClick={handleCreateRoom}>Создать комнату</button>
            <button onClick={handleJoinRoom}>Присоединиться к комнате</button>
        </div>
    );
};

export default WelcomeScreen;
