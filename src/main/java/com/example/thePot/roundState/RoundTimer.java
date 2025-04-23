package com.example.thePot.roundState;

import lombok.Getter;

import java.util.Timer;
import java.util.TimerTask;

@Getter
public class RoundTimer {
    private Timer timer;
    private int secondsLeft;
    private Runnable onTimeUp;

    public void startTimer(Runnable onTimeUp) {
        stop();
        this.onTimeUp = onTimeUp;
        this.secondsLeft = 12;

        timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                secondsLeft--;
                if (secondsLeft <= 0) {
                    stop();
                    if (onTimeUp != null) {
                        onTimeUp.run();
                    }
                }
            }
        }, 1000, 1000);
    }

    public void stop() {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }
}