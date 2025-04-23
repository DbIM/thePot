package com.example.thePot.roundState;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoundState {
    private String explainingPlayer;
    private boolean timerStarted;
    private String word; // для объясняющего
    private int secondsLeft;
    private List<Integer> teamScores;

    public RoundState(String explainingPlayer, boolean timerStarted, String word, int secondsLeft, List<Integer> teamScores) {
        this.explainingPlayer = explainingPlayer;
        this.timerStarted = timerStarted;
        this.word = word;
        this.secondsLeft = secondsLeft;
        this.teamScores = teamScores;
    }
}