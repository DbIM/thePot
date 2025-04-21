package com.example.thePot.controller;

import com.example.thePot.room.GameRoom;
import com.example.thePot.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {
    private final GameService gameService;

    @Autowired
    public GameWebSocketController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/start")
    @SendTo("/topic/game-progress")
    public GameRoom startGame(String roomId) {
        gameService.startGame(roomId);
        return gameService.getRoom(roomId);
    }
}