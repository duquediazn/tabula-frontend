import { useEffect } from "react";
import API_URL from "../api/config";

export default function useWebSocket(onMessageCallback) {
  useEffect(() => {
    // Detectar protocolo correcto
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socketUrl = `${wsProtocol}://${API_URL.replace(
      /^https?:\/\//,
      ""
    )}/ws/movimientos`;

    // Montaje del websocket
    const socket = new WebSocket(socketUrl);

    socket.onmessage = (event) => {
      console.log("Mensaje recibido:", event.data);
      onMessageCallback(event.data);
    };

    return () => {
      socket.close();
    };
  }, [onMessageCallback]);
}
