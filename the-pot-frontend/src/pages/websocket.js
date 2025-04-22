// src/services/WebSocketService.js
class WebSocketService {
    constructor() {
        this.socket = new WebSocket("ws://localhost:8080/socket");
        this.socket.onopen = () => {
            console.log("Соединение установлено");
        };
        this.socket.onclose = () => {
            console.log("Соединение закрыто");
        };
    }

    sendReady(playerName, words) {
        const message = {
            type: "ready",
            playerName,
            words,
        };
        this.socket.send(JSON.stringify(message));
    }

    // Другие методы для отправки и получения данных от сервера можно добавить здесь
}

export const webSocketService = new WebSocketService();
