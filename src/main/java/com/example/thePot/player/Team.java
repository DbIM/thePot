package com.example.thePot.player;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Team {
    private String id;
    private List<Player> players;
    private int score = 0;

    public void addPlayer(Player player) {
        if (this.players == null) {
            this.players = new ArrayList<>();
        }
        this.players.add(player);
    }

    public void incrementScore() {
        this.score++;
    }
}