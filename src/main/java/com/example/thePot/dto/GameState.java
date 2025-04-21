package com.example.thePot.dto;

import lombok.Data;

@Data
public class GameState {
    private String word; // Используем существующее поле из GameRoom
    private int roundTime; // В миллисекундах (12 секунд = 12000)

    // Конструктор
    public GameState(String word, int roundTime) {
        this.word = word;
        this.roundTime = roundTime;
    }
}