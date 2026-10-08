import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  LogOut,
  ShieldCheck,
  UserPlus,
  LogIn,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

function Navbar() {
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const userName =
    currentUser?.name || "Student";

  const userInitial =
    userName.charAt(0).toUpperCase();


  /* =========================
     SEARCH
  ========================== */

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(query)}`
    );

    setSearchQuery("");
  };


  /* =========================
     LOGOUT
  ========================== */

  const handleLogout = () => {
    logout();

    setProfileOpen(false);
    setSearchQuery("");

    navigate("/login");
  };


  /* =========================
     ACTIVE LINK
  ========================== */

  const isActive = (path) => {
    return location.pathname === path;
  };


  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={() =>
            setProfileOpen(false)
          }
        >
          <span className="navbar-logo-mark">
            CC
          </span>

          <span className="navbar-logo-text">
            Campus Connect
          </span>
        </Link>


        {/* =========================
            DESKTOP NAVIGATION
            ONLY AFTER LOGIN
        ========================== */}

        {isAuthenticated && (
          <nav className="navbar-links">

            <Link
              to="/students"
              className={
                isActive("/students")
                  ? "active"
                  : ""
              }
            >
              Students
            </Link>

            <Link
              to="/feed"
              className={
                isActive("/feed")
                  ? "active"
                  : ""
              }
            >
              Feed
            </Link>

            <Link
              to="/groups"
              className={
                isActive("/groups")
                  ? "active"
                  : ""
              }
            >
              Groups
            </Link>

            <Link
              to="/events"
              className={
                isActive("/events")
                  ? "active"
                  : ""
              }
            >
              Events
            </Link>

            <Link
              to="/connections"
              className={
                isActive("/connections")
                  ? "active"
                  : ""
              }
            >
              Connections
            </Link>

          </nav>
        )}


        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="navbar-actions">

          {/* SEARCH */}

          {isAuthenticated && (
            <form
              className="navbar-search"
              onSubmit={handleSearch}
            >
              <Search size={17} />

              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
              />
            </form>
          )}


          {/* NOTIFICATIONS */}

          {isAuthenticated && (
            <NotificationDropdown />
          )}


          {/* ADMIN */}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              className="navbar-admin-button"
            >
              <ShieldCheck size={17} />
              Admin
            </Link>
          )}


          {/* =========================
              ACCOUNT BUTTON
          ========================== */}

          <div className="navbar-profile">

            <button
              type="button"
              className="navbar-profile-button"
              onClick={() =>
                setProfileOpen(
                  !profileOpen
                )
              }
              aria-label="Account menu"
            >

              <span className="navbar-profile-avatar">

                {isAuthenticated &&
                currentUser?.profileImage ? (
                  <img
                    src={
                      currentUser.profileImage
                    }
                    alt={userName}
                  />
                ) : isAuthenticated ? (
                  userInitial
                ) : (
                  <User size={20} />
                )}

              </span>


              {isAuthenticated && (
                <span className="navbar-profile-name">
                  {userName}
                </span>
              )}

            </button>


            {/* =========================
                ACCOUNT DROPDOWN
            ========================== */}

            {profileOpen && (
              <div className="navbar-profile-menu">

                {/* =====================
                    LOGGED OUT
                ====================== */}

                {!isAuthenticated && (
                  <>
                    <div className="navbar-profile-menu-header">

                      <span className="navbar-account-large-icon">
                        <User size={24} />
                      </span>

                      <div>

                        <strong>
                          Welcome to Campus Connect
                        </strong>

                        <span>
                          Connect with your
                          campus community.
                        </span>

                      </div>

                    </div>


                    {/* LOGIN */}

                    <Link
                      to="/login"
                      className="navbar-account-login"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >
                      <LogIn size={17} />
                      Login
                    </Link>


                    {/* SIGN UP */}

                    <div className="navbar-account-signup">

                      <span>
                        Don't have an account?
                      </span>

                      <Link
                        to="/register"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                      >
                        Create an account
                      </Link>

                    </div>

                  </>
                )}


                {/* =====================
                    LOGGED IN
                ====================== */}

                {isAuthenticated && (
                  <>
                    <div className="navbar-profile-menu-header">

                      <span className="navbar-profile-avatar large">

                        {currentUser?.profileImage ? (
                          <img
                            src={
                              currentUser.profileImage
                            }
                            alt={userName}
                          />
                        ) : (
                          userInitial
                        )}

                      </span>

                      <div>

                        <strong>
                          {userName}
                        </strong>

                        <span>
                          {isAdmin
                            ? "Administrator"
                            : "Student"}
                        </span>

                      </div>

                    </div>


                    {/* PROFILE */}

                    <Link
                      to="/profile"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >
                      <User size={17} />
                      My Profile
                    </Link>


                    {/* ADMIN */}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                      >
                        <ShieldCheck
                          size={17}
                        />
                        Admin Dashboard
                      </Link>
                    )}


                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={handleLogout}
                    >
                      <LogOut size={17} />
                      Logout
                    </button>

                  </>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;