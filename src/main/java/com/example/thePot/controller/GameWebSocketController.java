package com.example.thePot.controller;

import com.example.thePot.dto.GameState;
import com.example.thePot.room.GameRoom;
import com.example.thePot.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {

    @Autowired
    private GameService gameService;

    @MessageMapping("/next-word")
    @SendTo("/topic/game-progress")
    public GameState nextWord(String roomId) {
        // Удаляем угаданное слово из списка
        GameRoom room = gameService.getRoom(roomId);
        if (room != null && !room.getRemainingWords().isEmpty()) {
            room.getRemainingWords().remove(0);
        }

        return gameService.getGameState(roomId);
    }
}