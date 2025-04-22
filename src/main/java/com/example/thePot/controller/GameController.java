package com.example.thePot.controller;

import com.example.thePot.dto.GameState;
import com.example.thePot.player.Player;
import com.example.thePot.player.Team;
import com.example.thePot.room.GameRoom;
import com.example.thePot.service.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/room/{roomId}/players")
    public List<Player> getPlayers(@PathVariable String roomId) {
        return gameService.getPlayers(roomId);
    }

    @PostMapping("/submit-words")
    public void submitWords(@RequestParam String roomId,
                            @RequestParam String playerName,
                            @RequestBody List<String> words) {
        gameService.submitWords(roomId, playerName, words);
    }

    @PostMapping("/start/{roomId}")
    public void startGame(@PathVariable String roomId) {
        gameService.startGame(roomId);
    }

    @GetMapping("/room/{roomId}/teams")
    public List<Team> getTeams(@PathVariable String roomId) {
        GameRoom room = gameService.getRoom(roomId);
        return room.getTeams();
    }

    @GetMapping("/state/{roomId}")
    public GameState getGameState(@PathVariable String roomId) {
        return gameService.getGameState(roomId);
    }
}