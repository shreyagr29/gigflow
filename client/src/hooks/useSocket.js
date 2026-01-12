import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const useSocket = (url) => {
  const socketRef = useRef();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && !socketRef.current) {
        socketRef.current = io(url);
        socketRef.current.emit('join', userInfo._id);
        console.log('Socket connected for user:', userInfo._id);
    }

    return () => {
      if (socketRef.current) {
        // We don't necessarily want to disconnect on every re-render or navigation if we want persistent connection, 
        // but for a hook it's good practice to clean up unless we move this to global context.
        // For this app, let's keep it alive or manage carefully. 
        // Actually, preventing disconnect on simple unmounts that are just re-renders is tricky with strict mode.
        // Better pattern: Initialize socket in specific top-level component or context.
        // However, user requested a Hook. We will handle cleanup but ensure we don't churn.
        socketRef.current.disconnect(); 
        socketRef.current = null;
      }
    };
  }, [url, userInfo]);

  return socketRef;
};

export default useSocket;
