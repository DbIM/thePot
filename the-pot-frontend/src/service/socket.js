import { Client } from '@stomp/stompjs';

const socketClient = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    debug: function(str) {
        console.log(str);
    }
});

export function connectToGame(roomId, onWordUpdate) {
    socketClient.onConnect = () => {
        socketClient.subscribe('/topic/game-progress', (message) => {
            const state = JSON.parse(message.body);
            onWordUpdate({
                word: state.word,
                timeLeft: state.roundTime / 1000 // Переводим в секунды
            });
        });
    };
    socketClient.activate();
}