import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../contexts/AuthContext';

export default function useWebSocket(roomId) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [leaderboard, setLeaderboard] = useState({});
  const clientRef = useRef(null);

  useEffect(() => {
    if (!roomId || !user) return;

    // We get the token from localStorage since AuthContext manages it there
    const token = localStorage.getItem('token');

    const client = new Client({
      // Provide the SockJS fallback URL mapped to our Spring Boot backend
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setIsConnected(true);
      console.log('Connected to WebSockets:', frame);

      // Subscribe to generic room events (joins, chat, starts)
      client.subscribe(`/topic/room/${roomId}`, (message) => {
        const event = JSON.parse(message.body);
        setMessages(prev => [...prev, event]);
      });

      // Subscribe specifically to leaderboard updates
      client.subscribe(`/topic/room/${roomId}/leaderboard`, (message) => {
        const update = JSON.parse(message.body);
        setLeaderboard(update.playerScores);
      });

      // Announce we joined the room
      client.publish({
        destination: `/app/room/${roomId}/ready`,
        body: JSON.stringify({})
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.onWebSocketClose = () => {
      setIsConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [roomId, user]);

  const sendChatMessage = (content) => {
    if (clientRef.current && clientRef.current.active) {
      clientRef.current.publish({
        destination: `/app/room/${roomId}/chat`,
        body: JSON.stringify({ content })
      });
    }
  };

  return { isConnected, messages, leaderboard, sendChatMessage };
}
