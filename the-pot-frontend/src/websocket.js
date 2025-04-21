let stompClient = null;

function connect() {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        stompClient.subscribe('/topic/game-progress', (message) => {
            updateGameState(JSON.parse(message.body));
        });
    });
}

function updateGameState(state) {
    // Обновляем интерфейс на основе состояния игры
    document.getElementById('current-word').innerText = state.currentWord || '';
    document.getElementById('timer').innerText = state.timeLeft;
}