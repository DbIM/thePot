package com.example.thePot.handler;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketHandler {

    @MessageMapping("/start-round")
    @SendTo("/topic/game-updates")
    public String startRound(String roomId) {
        return "Раунд начался!";
    }
}
