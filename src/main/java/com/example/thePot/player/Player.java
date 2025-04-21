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

    public Player(String id, String name) {
        this.id = id;
        this.name = name;
    }
}