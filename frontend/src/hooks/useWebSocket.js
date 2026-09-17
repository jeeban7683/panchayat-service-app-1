import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

const getWsUrl = () => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    try {
      const url = new URL(apiUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${url.host}/ws`;
    } catch {
      // fallback
    }
  }
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = typeof window !== 'undefined' ? window.location.host : 'localhost:8080';
  return `${protocol}//${host}/ws`;
};

export const useWebSocket = (onMessageReceived) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // Keep callback ref fresh without restarting connection
  const onMessageRef = useRef(onMessageReceived);
  useEffect(() => {
    onMessageRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    let isMounted = true;

    const client = new Client({
      brokerURL: getWsUrl(),
      reconnectDelay: 5000,
      onConnect: () => {
        if (!isMounted) return;
        console.log('[WS] Connected!');
        setConnected(true);
        client.subscribe('/topic/messages', (frame) => {
          try {
            const msg = JSON.parse(frame.body);
            onMessageRef.current?.(msg);
          } catch (e) {
            console.error('[WS] Failed to parse message:', e);
          }
        });
      },
      onDisconnect: () => {
        console.log('[WS] Disconnected');
        if (isMounted) setConnected(false);
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame.headers?.message);
        if (isMounted) setConnected(false);
      },
      onWebSocketError: (event) => {
        console.error('[WS] WebSocket error:', event);
        if (isMounted) setConnected(false);
      },
      onWebSocketClose: () => {
        if (isMounted) setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      isMounted = false;
      client.deactivate();
    };
  }, []);

  const sendMessage = useCallback((message) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/send',
        body: JSON.stringify(message),
      });
    } else {
      console.warn('[WS] Not connected — message queued for retry.');
    }
  }, []);

  return { sendMessage, connected };
};
