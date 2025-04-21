package com.example.thePot.timer;

import java.util.concurrent.*;

public class RoundTimer {
    private ScheduledExecutorService executor;
    private ScheduledFuture<?> future;

    public void startTimer(Runnable onEnd) {
        executor = Executors.newSingleThreadScheduledExecutor();
        future = executor.schedule(onEnd, 12, TimeUnit.SECONDS);
    }

    public void stopTimer() {
        if (future != null) future.cancel(false);
        if (executor != null) executor.shutdown();
    }
}