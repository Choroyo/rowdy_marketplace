import { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../lib/firebaseServices';
import { store } from '../lib/store';
import { NotificationProps } from '../../type';
import toast from 'react-hot-toast';

const NotificationItem = ({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: NotificationProps;
  onMarkAsRead: (id: string) => void;
}) => {
  return (
    <div className={`p-4 border-b ${notification.read ? 'bg-white' : 'bg-blue-50'}`}>
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-900">
          {notification.type === 'purchase' && '🛒 Purchase'}
          {notification.type === 'sale' && '💰 Sale'}
          {notification.type === 'rating' && '⭐ Rating'}
          {notification.type === 'status-change' && '🔄 Status Update'}
        </span>
        <span className="text-xs text-gray-500">
          {notification.createdAt && new Date(notification.createdAt.seconds * 1000).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
      {!notification.read && (
        <button
          onClick={() => onMarkAsRead(notification._id)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
        >
          Mark as read
        </button>
      )}
    </div>
  );
};

const NotificationCenter = () => {
  const { currentUser } = store();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const fetchedNotifications = await getUserNotifications(currentUser.id);
        setNotifications(fetchedNotifications as NotificationProps[]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [currentUser]);
  
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notification => 
        notification._id === notificationId ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#0C2340]">Notifications</h2>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      
      {!currentUser ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">Please log in to view your notifications</p>
        </div>
      ) : loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0C2340] mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">You don't have any notifications yet</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 