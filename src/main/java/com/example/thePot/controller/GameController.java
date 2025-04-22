package com.example.thePot.controller;

import com.example.thePot.service.GameService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/create-room/{playerName}")
    public String createRoom(@PathVariable String playerName) {
        return gameService.createRoom(playerName);
    }

    @PostMapping("/join-room")
    public void joinRoom(@RequestParam String roomId, @RequestParam String playerName) {
        gameService.joinRoom(roomId, playerName);
    }
}