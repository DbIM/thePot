package com.example.thePot.room;

import com.example.thePot.player.Player;
import com.example.thePot.player.Team;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class GameRoom {
    private String id;
    private List<Player> players;
    private List<Team> teams;
    private List<String> allWords;
    private List<String> remainingWords;
    private int currentRound;
    private Team currentTeam;
    private Player currentExplainer;
    private Player currentGuesser;
    private String currentWord;
    private boolean isGameStarted;

    public GameRoom(String id, Player host) {
        this.id = id;
        this.players = new ArrayList<>();
        this.players.add(host);
        this.teams = new ArrayList<>();
        this.allWords = new ArrayList<>();
        this.remainingWords = new ArrayList<>();
        this.currentRound = 0;
        this.isGameStarted = false;
    }

}