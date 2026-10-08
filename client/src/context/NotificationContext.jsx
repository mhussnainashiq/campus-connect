import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getStorage,
  setStorage,
} from "../utils/storage";
import { useAuth } from "./AuthContext";

const NotificationContext =
  createContext(null);

function NotificationProvider({ children }) {
  const { currentUser } = useAuth();

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const allNotifications =
      getStorage("notifications", []);

    const userNotifications =
      allNotifications.filter(
        (notification) =>
          notification.userId ===
          currentUser.id
      );

    setNotifications(userNotifications);
  }, [currentUser]);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) =>
        !notification.read
    ).length;
  }, [notifications]);

  const addNotification = ({
    userId,
    type,
    title,
    message,
    link = "",
    actorId = "",
    actorName = "",
  }) => {
    if (!userId) {
      return;
    }

    const allNotifications =
      getStorage("notifications", []);

    const newNotification = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
      userId,
      type,
      title,
      message,
      link,
      actorId,
      actorName,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const updatedNotifications = [
      newNotification,
      ...allNotifications,
    ];

    setStorage(
      "notifications",
      updatedNotifications
    );

    if (
      currentUser &&
      userId === currentUser.id
    ) {
      setNotifications((previous) => [
        newNotification,
        ...previous,
      ]);
    }

    return newNotification;
  };

  const markAsRead = (notificationId) => {
    const allNotifications =
      getStorage("notifications", []);

    const updatedNotifications =
      allNotifications.map(
        (notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
      );

    setStorage(
      "notifications",
      updatedNotifications
    );

    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    if (!currentUser) {
      return;
    }

    const allNotifications =
      getStorage("notifications", []);

    const updatedNotifications =
      allNotifications.map(
        (notification) =>
          notification.userId ===
          currentUser.id
            ? {
                ...notification,
                read: true,
              }
            : notification
      );

    setStorage(
      "notifications",
      updatedNotifications
    );

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (
    notificationId
  ) => {
    const allNotifications =
      getStorage("notifications", []);

    const updatedNotifications =
      allNotifications.filter(
        (notification) =>
          notification.id !== notificationId
      );

    setStorage(
      "notifications",
      updatedNotifications
    );

    setNotifications((previous) =>
      previous.filter(
        (notification) =>
          notification.id !== notificationId
      )
    );
  };

  const clearNotifications = () => {
    if (!currentUser) {
      return;
    }

    const allNotifications =
      getStorage("notifications", []);

    const updatedNotifications =
      allNotifications.filter(
        (notification) =>
          notification.userId !==
          currentUser.id
      );

    setStorage(
      "notifications",
      updatedNotifications
    );

    setNotifications([]);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}

export default NotificationContext;

export { NotificationProvider };