
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getStorage,
  removeStorage,
  setStorage,
} from "../utils/storage";

const AuthContext = createContext(null);

const ADMIN_EMAIL =
  "admin@campusconnect.com";

const ADMIN_PASSWORD = "admin123";

function createAdminAccount(users) {
  const existingAdmin = users.find(
    (user) =>
      user.email?.toLowerCase() ===
      ADMIN_EMAIL.toLowerCase()
  );

  const adminUser = {
    id: "admin-001",
    name: "Campus Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
    department: "Administration",
    interests: [],
    bio: "Campus Connect Administrator",
    profileImage: "",
    createdAt:
      existingAdmin?.createdAt ||
      new Date().toISOString(),
  };

  if (!existingAdmin) {
    return [...users, adminUser];
  }

  return users.map((user) => {
    if (
      user.email?.toLowerCase() ===
      ADMIN_EMAIL.toLowerCase()
    ) {
      return {
        ...user,
        ...adminUser,
      };
    }

    return user;
  });
}

function removePassword(user) {
  if (!user) {
    return null;
  }

  const safeUser = {
    ...user,
  };

  delete safeUser.password;

  return safeUser;
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * Load authentication state when
   * the application starts.
   */
  useEffect(() => {
    let users = getStorage(
      "users",
      []
    );

    /*
     * Make sure the admin account
     * always exists.
     */
    users = createAdminAccount(users);

    setStorage("users", users);

    const savedUser = getStorage(
      "currentUser",
      null
    );

    /*
     * If there is no saved session,
     * make sure React also has no user.
     */
    if (!savedUser) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    /*
     * Refresh admin account information.
     */
    if (
      savedUser.email?.toLowerCase() ===
      ADMIN_EMAIL.toLowerCase()
    ) {
      const adminUser = users.find(
        (user) =>
          user.email?.toLowerCase() ===
          ADMIN_EMAIL.toLowerCase()
      );

      const safeAdmin =
        removePassword(adminUser);

      setStorage(
        "currentUser",
        safeAdmin
      );

      setCurrentUser(safeAdmin);
    } else {
      /*
       * Restore the normal student account.
       */
      setCurrentUser(savedUser);
    }

    setLoading(false);
  }, []);

  /*
   * REGISTER
   */
  const register = (userData) => {
    const users = getStorage(
      "users",
      []
    );

    const existingUser = users.find(
      (user) =>
        user.email?.toLowerCase() ===
        userData.email
          .trim()
          .toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        message:
          "An account with this email already exists.",
      };
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name.trim(),
      email: userData.email
        .trim()
        .toLowerCase(),
      password: userData.password,
      role: "student",
      department: "",
      interests: [],
      bio: "",
      profileImage: "",
      createdAt:
        new Date().toISOString(),
    };

    const updatedUsers = [
      ...users,
      newUser,
    ];

    setStorage(
      "users",
      updatedUsers
    );

    const loggedInUser =
      removePassword(newUser);

    setStorage(
      "currentUser",
      loggedInUser
    );

    setCurrentUser(loggedInUser);

    return {
      success: true,
      user: loggedInUser,
    };
  };

  /*
   * LOGIN
   */
  const login = (
    email,
    password
  ) => {
    const cleanEmail = email
      .trim()
      .toLowerCase();

    /*
     * ADMIN LOGIN
     */
    if (
      cleanEmail ===
        ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      let users = getStorage(
        "users",
        []
      );

      users = createAdminAccount(users);

      const admin = users.find(
        (user) =>
          user.email?.toLowerCase() ===
          ADMIN_EMAIL.toLowerCase()
      );

      const adminUser =
        removePassword({
          ...admin,
          role: "admin",
        });

      setStorage(
        "users",
        users
      );

      setStorage(
        "currentUser",
        adminUser
      );

      setCurrentUser(adminUser);

      return {
        success: true,
        user: adminUser,
      };
    }

    /*
     * STUDENT LOGIN
     */
    const users = getStorage(
      "users",
      []
    );

    const user = users.find(
      (item) =>
        item.email?.toLowerCase() ===
          cleanEmail &&
        item.password === password
    );

    if (!user) {
      return {
        success: false,
        message:
          "Invalid email or password.",
      };
    }

    const loggedInUser =
      removePassword({
        ...user,
        role: user.role || "student",
      });

    setStorage(
      "currentUser",
      loggedInUser
    );

    setCurrentUser(loggedInUser);

    return {
      success: true,
      user: loggedInUser,
    };
  };

  /*
   * LOGOUT
   */
  const logout = () => {
    /*
     * Remove the active session.
     */
    removeStorage("currentUser");

    /*
     * Clear React authentication state.
     */
    setCurrentUser(null);
  };

  /*
   * UPDATE PROFILE
   */
  const updateUser = (
    updatedData
  ) => {
    if (!currentUser) {
      return {
        success: false,
        message:
          "No user is currently logged in.",
      };
    }

    const users = getStorage(
      "users",
      []
    );

    const updatedUsers =
      users.map((user) => {
        if (
          user.id === currentUser.id
        ) {
          return {
            ...user,
            ...updatedData,
          };
        }

        return user;
      });

    const updatedUser =
      updatedUsers.find(
        (user) =>
          user.id === currentUser.id
      );

    if (!updatedUser) {
      return {
        success: false,
        message:
          "User account could not be found.",
      };
    }

    const safeUser =
      removePassword(updatedUser);

    /*
     * Update users database.
     */
    setStorage(
      "users",
      updatedUsers
    );

    /*
     * Update active session.
     */
    setStorage(
      "currentUser",
      safeUser
    );

    /*
     * Update React state immediately.
     */
    setCurrentUser(safeUser);

    return {
      success: true,
      user: safeUser,
    };
  };

  const value = {
    currentUser,

    loading,

    isAuthenticated:
      Boolean(currentUser),

    isAdmin:
      currentUser?.role === "admin",

    register,

    login,

    logout,

    updateUser,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

export default AuthContext;

export { AuthProvider };