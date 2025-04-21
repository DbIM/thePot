package com.example.thePot.controller;

import com.example.thePot.room.GameRoom;
import com.example.thePot.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private GameService gameService;

    @PostMapping("/create/{name}")
    public String testCreateGame(@PathVariable String name) {
        try {
            String roomId = gameService.createRoom(name);
            gameService.joinRoom(roomId, "Player2");
            gameService.startGame(roomId);
            return "Game started in room: " + roomId;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // Получение информации о комнате
    @GetMapping("/room/{roomId}")
    public GameRoom getRoom(@PathVariable String roomId) {
        return gameService.getRoom(roomId);
    }
}