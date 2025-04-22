package com.example.thePot.player;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Player {
    private String id;
    private String name;
    private List<String> words;
    private boolean isReady;

    public Player(String id, String name, boolean isReady) {
        this.id = id;
        this.name = name;
        this.isReady = isReady;
    }
}