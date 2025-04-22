package com.example.thePot.dto;

import com.example.thePot.player.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameState {
    private int currentRound;
    private Team activeTeam;
    private String currentWord;
}
