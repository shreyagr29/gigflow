import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PostGigPage from './pages/PostGigPage';
import GigDetailsPage from './pages/GigDetailsPage';

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  // We can use a custom hook or basic effect. 
  // Ideally, useSocket connects. We need to listen to events.
  // Let's implement a simple Toast system here or use the alert for now as requested by user logic "create a notification component... that displays... as toast".
  // Since we don't have a toast library installed, we will build a simple one.
  const [notification, setNotification] = React.useState(null);

  useEffect(() => {
    if (userInfo) {
      const socket = io('http://localhost:5000');
      socket.emit('join', userInfo._id);
      
      socket.on('notification', (data) => {
           setNotification(data);
           // Auto dismiss
           setTimeout(() => setNotification(null), 5000);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
         {/* Toast Notification */}
         {notification && (
            <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg border-l-4 transition-all transform duration-500 ease-in-out ${
                notification.type === 'hired' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
            }`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {/* Icon based on type? */}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">
                            {notification.message}
                        </p>
                    </div>
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button onClick={() => setNotification(null)} className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <span className="sr-only">Dismiss</span>
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        <main className="flex-grow bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!userInfo ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!userInfo ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={userInfo ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/post-gig" element={userInfo ? <PostGigPage /> : <Navigate to="/login" />} />
            <Route path="/gigs/:id" element={<GigDetailsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
