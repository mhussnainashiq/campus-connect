const STORAGE_KEYS = {
  users: "campus_connect_users",

  currentUser: "campus_connect_current_user",

  posts: "campus_connect_posts",

  groups: "campus_connect_groups",

  studyGroups: "campus_connect_study_groups",

  groupMemberships:
    "campus_connect_group_memberships",

  events: "campus_connect_events",

  eventRegistrations:
    "campus_connect_event_registrations",

  notifications:
    "campus_connect_notifications",

  connections:
    "campus_connect_connections",
};

export const getStorageKey = (key) => {
  return STORAGE_KEYS[key];
};

export const getStorage = (
  key,
  defaultValue = []
) => {
  try {
    const storageKey = STORAGE_KEYS[key];

    if (!storageKey) {
      return defaultValue;
    }

    const data = localStorage.getItem(storageKey);

    if (!data) {
      return defaultValue;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error(
      "Error reading from LocalStorage:",
      error
    );

    return defaultValue;
  }
};

export const setStorage = (key, value) => {
  try {
    const storageKey = STORAGE_KEYS[key];

    if (!storageKey) {
      return false;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      "Error saving to LocalStorage:",
      error
    );

    return false;
  }
};

export const removeStorage = (key) => {
  try {
    const storageKey = STORAGE_KEYS[key];

    if (!storageKey) {
      return false;
    }

    localStorage.removeItem(storageKey);

    return true;
  } catch (error) {
    console.error(
      "Error removing from LocalStorage:",
      error
    );

    return false;
  }
};

export const clearCampusConnectStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};