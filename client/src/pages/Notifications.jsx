import {
  Bell,
  Check,
  CheckCheck,
  Heart,
  MessageCircle,
  Trash2,
  UserPlus,
  Users,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useNotifications,
} from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

function Notifications() {
  const { currentUser } = useAuth();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={19} />;

      case "comment":
        return (
          <MessageCircle size={19} />
        );

      case "connection":
        return <UserPlus size={19} />;

      case "group":
        return <Users size={19} />;

      case "event":
        return (
          <CalendarDays size={19} />
        );

      default:
        return <Bell size={19} />;
    }
  };

  const formatDate = (date) => {
    return new Date(
      date
    ).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!currentUser) {
    return (
      <main className="notifications-page">
        <div className="notifications-container">
          <div className="notifications-empty">
            <div className="notifications-empty-icon">
              <Bell size={30} />
            </div>

            <h1>Sign in to view notifications</h1>

            <p>
              Sign in to see your campus
              activity and notifications.
            </p>

            <Link
              to="/login"
              className="notifications-button"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="notifications-page">
      <div className="notifications-container">

        {/* Header */}

        <div className="notifications-heading">
          <div>
            <span className="section-label">
              Stay updated
            </span>

            <h1>Notifications</h1>

            <p>
              Keep track of activity from your
              campus community.
            </p>
          </div>

          <div className="notifications-count">
            <Bell size={19} />

            <div>
              <strong>
                {unreadCount}
              </strong>

              <span>
                Unread
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}

        {notifications.length > 0 && (
          <div className="notifications-actions">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>

            <button
              type="button"
              className="notifications-clear-button"
              onClick={clearNotifications}
            >
              <Trash2 size={16} />
              Clear all
            </button>
          </div>
        )}

        {/* Empty */}

        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="notifications-empty-icon">
              <Bell size={30} />
            </div>

            <h2>
              No notifications yet
            </h2>

            <p>
              When students interact with
              your content, notifications
              will appear here.
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(
              (notification) => (
                <article
                  key={notification.id}
                  className={`notification-card ${
                    notification.read
                      ? ""
                      : "notification-unread"
                  }`}
                >
                  <div
                    className={`notification-icon notification-icon-${notification.type}`}
                  >
                    {getIcon(
                      notification.type
                    )}
                  </div>

                  <div className="notification-content">
                    <div className="notification-top">
                      <div>
                        <h2>
                          {
                            notification.title
                          }
                        </h2>

                        <p>
                          {
                            notification.message
                          }
                        </p>
                      </div>

                      {!notification.read && (
                        <span className="notification-dot"></span>
                      )}
                    </div>

                    <div className="notification-bottom">
                      <span>
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>

                      <div className="notification-buttons">
                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                          >
                            <Check
                              size={14}
                            />
                            Mark read
                          </button>
                        )}

                        {notification.link && (
                          <Link
                            to={
                              notification.link
                            }
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                          >
                            View
                          </Link>
                        )}

                        <button
                          type="button"
                          className="notification-delete"
                          onClick={() =>
                            deleteNotification(
                              notification.id
                            )
                          }
                          aria-label="Delete notification"
                        >
                          <Trash2
                            size={14}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Notifications;