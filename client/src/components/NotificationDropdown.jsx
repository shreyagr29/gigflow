import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every 30s or use socket context to trigger re-fetch
        const interval = setInterval(fetchNotifications, 10000); 
        return () => clearInterval(interval);
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleMarkRead = async (id) => {
        try {
            await axios.patch(`/api/notifications/${id}/read`);
            // Update local state
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleOpen} className="relative p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                )}
            </button>

            {isOpen && (
                <div className="fixed left-2 right-2 top-16 mt-2 sm:absolute sm:right-0 sm:left-auto sm:top-full sm:w-80 sm:mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5 z-50 max-h-[80vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50">Notifications</div>
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-sm text-gray-500 dark:text-gray-400 text-center">No notifications</div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n._id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors ${!n.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                                <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{n.message}</p>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                                    {!n.read && (
                                        <button onClick={() => handleMarkRead(n._id)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">Mark as Read</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
