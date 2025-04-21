import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameScreen from './pages/GameScreen';
import LobbyScreen from './pages/LobbyScreen';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LobbyScreen />} />
                <Route path="/game" element={<GameScreen />} />
            </Routes>
        </Router>
    );
}

export default App;