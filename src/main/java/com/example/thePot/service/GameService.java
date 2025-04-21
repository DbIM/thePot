package com.example.thePot.service;

import com.example.thePot.dto.GameState;
import com.example.thePot.player.Player;
import com.example.thePot.player.Team;
import com.example.thePot.room.GameRoom;
import com.example.thePot.timer.RoundTimer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameService {
    private static final Logger log = LoggerFactory.getLogger(GameService.class);
    private final Map<String, GameRoom> rooms = new HashMap<>();
    private final Map<String, RoundTimer> timers = new HashMap<>();

    public GameState getGameState(String roomId) {
        GameRoom room = rooms.get(roomId);
        if (room == null || room.getRemainingWords() == null || room.getRemainingWords().isEmpty()) {
            return new GameState("", 12000); // Возвращаем пустое состояние
        }

        // Берем первое слово из оставшихся
        String currentWord = room.getRemainingWords().get(0);

        return new GameState(currentWord, 12000); // Фиксированное время 12 секунд
    }

    public String createRoom(String playerName) {
        String roomId = UUID.randomUUID().toString();
        Player host = new Player(UUID.randomUUID().toString(), playerName);
        GameRoom room = new GameRoom(roomId, host);
        rooms.put(roomId, room);
        log.info("Created room {} for player {}", roomId, playerName);
        return roomId;
    }

    public void joinRoom(String roomId, String playerName) {
        GameRoom room = rooms.get(roomId);
        if (room != null && room.getPlayers() != null) {
            room.getPlayers().add(new Player(UUID.randomUUID().toString(), playerName));
            log.info("Player {} joined room {}", playerName, roomId);
        } else {
            log.error("Room {} not found", roomId);
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
}