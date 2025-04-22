package com.example.thePot.service;

import com.example.thePot.dto.GameState;
import com.example.thePot.player.Player;
import com.example.thePot.player.Team;
import com.example.thePot.room.GameRoom;
import com.example.thePot.timer.RoundTimer;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {
    private static final Logger log = LoggerFactory.getLogger(GameService.class);
    private final Map<String, GameRoom> rooms = new HashMap<>();
    private final Map<String, RoundTimer> timers = new HashMap<>();

    @PostConstruct
    public void init() {
        rooms.clear();
        log.info("Rooms cleared at startup.");
    }

    public GameState getGameState(String roomId) {
        GameRoom room = rooms.get(roomId);
        if (room == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Комната не найдена");
        }

        return new GameState(room.getCurrentRound(), room.getCurrentTeam(), room.getCurrentWord());
    }

    public String createRoom(String playerName) {
        String roomId = UUID.randomUUID().toString();
        Player host = new Player(UUID.randomUUID().toString(), playerName,false);
        GameRoom room = new GameRoom(roomId, host);
        rooms.put(roomId, room);
        log.info("Created room {} for player {}", roomId, playerName);
        return roomId;
    }

    public void joinRoom(String roomId, String playerName) {
        GameRoom room = rooms.get(roomId);
        if (room == null || room.getPlayers() == null) {
            log.error("Room {} not found", roomId);
            return;
        }

        log.info("Trying to join room: {}, playerName: {}", roomId, playerName);
        log.info("Current players: {}", room.getPlayers().stream().map(Player::getName).toList());

        boolean alreadyInRoom = room.getPlayers().stream()
                .anyMatch(p -> p.getName().equals(playerName));

        if (!alreadyInRoom) {
            room.getPlayers().add(new Player(UUID.randomUUID().toString(), playerName, false));
            log.info("Player {} joined room {}", playerName, roomId);
        } else {
            log.info("Player {} already in room {}", playerName, roomId);
        }
    }

    public void startGame(String roomId) {
        GameRoom room = rooms.get(roomId);
        if (room == null || room.getPlayers().size() < 2) {
            log.error("Cannot start game in room {}", roomId);
            return;
        }

        formTeams(room);
        room.setCurrentRound(1);
        room.setAllWords(collectAllWords(room));
        startRound(roomId);
        log.info("Game started in room {}", roomId);
    }

    private void formTeams(GameRoom room) {
        List<Player> players = new ArrayList<>(room.getPlayers());
        Collections.shuffle(players);

        List<Team> teams = new ArrayList<>();
        int teamSize = players.size() % 2 == 0 ? 2 : 3;

        for (int i = 0; i < players.size(); i += teamSize) {
            Team team = new Team();
            team.setId(UUID.randomUUID().toString());
            team.setPlayers(new ArrayList<>(players.subList(i, Math.min(i + teamSize, players.size()))));
            teams.add(team);
            teamSize = 2;
        }

        room.setTeams(teams);
    }

    private void selectFirstTeam(GameRoom room) {
        if (room.getTeams() == null || room.getTeams().isEmpty()) return;

        room.setCurrentTeam(room.getTeams().get(0));
        List<Player> teamPlayers = room.getCurrentTeam().getPlayers();

        if (teamPlayers != null && !teamPlayers.isEmpty()) {
            room.setCurrentExplainer(teamPlayers.get(0));
            if (teamPlayers.size() > 1) {
                room.setCurrentGuesser(teamPlayers.get(1));
            }
        }
    }

    private List<String> collectAllWords(GameRoom room) {
        List<String> words = new ArrayList<>();
        for (Player player : room.getPlayers()) {
            if (player.getWords() != null) {
                words.addAll(player.getWords());
            }
        }
        Collections.shuffle(words);
        return words;
    }

    public GameRoom getRoom(String roomId) {
        return rooms.get(roomId);
    }

    private void startRound(String roomId) {
        GameRoom room = rooms.get(roomId);
        if (room == null) return;

        room.setRemainingWords(new ArrayList<>(room.getAllWords()));
        selectFirstTeam(room);
        selectNextExplainer(room);

        if (!room.getRemainingWords().isEmpty()) {
            room.setCurrentWord(room.getRemainingWords().remove(0));
        }

        RoundTimer timer = new RoundTimer();
        timer.startTimer(() -> endTurn(roomId));
        timers.put(roomId, timer);
    }

    private void endTurn(String roomId) {
        GameRoom room = rooms.get(roomId);
        if (room == null) return;

        int currentIndex = room.getTeams().indexOf(room.getCurrentTeam());
        int nextIndex = (currentIndex + 1) % room.getTeams().size();
        room.setCurrentTeam(room.getTeams().get(nextIndex));

        selectNextExplainer(room);
        startRound(roomId);
    }

    private void selectNextExplainer(GameRoom room) {
        Team team = room.getCurrentTeam();
        List<Player> players = team.getPlayers();

        if (players.size() == 3) {
            Player current = room.getCurrentExplainer();
            int index = (players.indexOf(current) + 1) % players.size();
            room.setCurrentExplainer(players.get(index));
        } else {
            Player temp = room.getCurrentExplainer();
            room.setCurrentExplainer(room.getCurrentGuesser());
            room.setCurrentGuesser(temp);
        }
    }

    public List<Player> getPlayers(String roomId) {
        GameRoom room = rooms.get(roomId);
        if (room == null) throw new IllegalArgumentException("Комната не найдена");

        log.info("Players in room {}: {}", roomId, room.getPlayers().stream().map(Player::getName).toList());
        return new ArrayList<>(room.getPlayers());
    }

    public void submitWords(String roomId, String playerName, List<String> newWords) {
        GameRoom room = rooms.get(roomId);
        if (room == null) throw new IllegalArgumentException("Room not found");

        // Собираем все слова других игроков
        Set<String> existingWords = room.getPlayers().stream()
                .filter(p -> !p.getName().equals(playerName) && p.getWords() != null)
                .flatMap(p -> p.getWords().stream())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        // Ищем дубликаты
        List<String> duplicates = newWords.stream()
                .filter(word -> existingWords.contains(word.toLowerCase()))
                .toList();

        if (!duplicates.isEmpty()) {
            throw new IllegalArgumentException("Следующие слова уже были: " + duplicates);
        }

        Player player = room.getPlayers().stream()
                .filter(p -> p.getName().equals(playerName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Player not found"));

        player.setWords(newWords);
        player.setReady(true);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}