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
        socketRef.current.disconnect(); 
        socketRef.current = null;
      }
    };
  }, [url, userInfo]);

  return socketRef;
};

export default useSocket;
