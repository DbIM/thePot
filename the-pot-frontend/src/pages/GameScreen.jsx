import React, { useEffect } from 'react';
import { connect } from './websocket';

export default function GameScreen() {
    useEffect(() => {
        connect();
    }, []);

    return (
        <div className="game-container">
            <div id="timer">12</div>
            <div id="current-word"></div>
            <button onClick={() => stompClient.send("/app/next-word")}>Угадано</button>
        </div>
    );
}