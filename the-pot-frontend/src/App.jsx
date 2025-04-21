// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import LobbyScreen from "./pages/LobbyScreen";
import GameScreen from "./pages/GameScreen";
import FinalScreen from "./pages/FinalScreen";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomeScreen />} />
                <Route path="/lobby" element={<LobbyScreen />} />
                <Route path="/game" element={<GameScreen />} />
                <Route path="/final" element={<FinalScreen />} />
            </Routes>
        </Router>
    );
};

export default App;