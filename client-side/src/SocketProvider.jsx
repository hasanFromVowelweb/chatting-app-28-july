import React, { createContext, useContext, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const newSocket = socketIOClient('http://localhost:32000');
    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>
  );
}
