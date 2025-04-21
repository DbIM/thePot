import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameScreen from './components/GameScreen';
import LobbyScreen from './components/LobbyScreen';

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