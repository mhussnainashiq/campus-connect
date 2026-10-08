import { useState } from "react";
import {
  Bell,
  UserPlus,
  Users,
  CalendarDays,
  MessageCircle,
  CheckCheck,
  X,
} from "lucide-react";
import { notifications as initialNotifications } from "../data/notifications";


function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(
    initialNotifications
  );

  const unreadCount = notificationList.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotificationList((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "connection":
        return <UserPlus size={18} />;

      case "group":
        return <Users size={18} />;

      case "event":
        return <CalendarDays size={18} />;

      case "message":
        return <MessageCircle size={18} />;

      default:
        return <Bell size={18} />;
    }
  };

  return (
    <div className="notification-wrapper">
      <button
        className="notification-button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Notifications"
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div>
              <h3>Notifications</h3>

              {unreadCount > 0 && (
                <span>
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <button
              className="notification-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>

          <div className="notification-actions">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead}>
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notificationList.length === 0 ? (
              <div className="no-notifications">
                <Bell size={30} />
                <p>No notifications</p>
              </div>
            ) : (
              notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    notification.read ? "read" : "unread"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span>{notification.time}</span>
                  </div>

                  {!notification.read && (
                    <span className="unread-dot"></span>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <button onClick={() => setIsOpen(false)}>
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;