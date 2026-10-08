import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UsersRound,
  CalendarDays,
  Bell,
  Plus,
  ArrowRight,
  UserPlus,
  CalendarPlus,
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] =
    useState({
      students: 0,
      groups: 0,
      events: 0,
      notifications: 0,
    });

  const [recentEvents, setRecentEvents] =
    useState([]);

  const [recentStudents, setRecentStudents] =
    useState([]);

  const loadDashboard = () => {
    try {
      const users = JSON.parse(
        localStorage.getItem(
          "users"
        ) || "[]"
      );

      const groups = JSON.parse(
        localStorage.getItem(
          "campusGroups"
        ) || "[]"
      );

      const events = JSON.parse(
        localStorage.getItem(
          "campusEvents"
        ) || "[]"
      );

      const notifications =
        JSON.parse(
          localStorage.getItem(
            "notifications"
          ) || "[]"
        );

      const studentUsers =
        users.filter(
          (user) =>
            user.role !== "admin"
        );

      setStats({
        students:
          studentUsers.length,

        groups:
          Array.isArray(groups)
            ? groups.length
            : 0,

        events:
          Array.isArray(events)
            ? events.length
            : 0,

        notifications:
          Array.isArray(
            notifications
          )
            ? notifications.length
            : 0,
      });

      setRecentStudents(
        [...studentUsers]
          .sort(
            (a, b) =>
              new Date(
                b.createdAt || 0
              ) -
              new Date(
                a.createdAt || 0
              )
          )
          .slice(0, 5)
      );

      setRecentEvents(
        Array.isArray(events)
          ? [...events]
              .sort(
                (a, b) =>
                  new Date(
                    b.createdAt || 0
                  ) -
                  new Date(
                    a.createdAt || 0
                  )
              )
              .slice(0, 5)
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load dashboard:",
        error
      );
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="admin-dashboard-page">

      {/* HEADER */}

      <div className="admin-dashboard-header">

        <div>
          <span className="admin-dashboard-label">
            ADMIN PANEL
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage Campus Connect students,
            groups, events and campus activity.
          </p>
        </div>

        <Link
          to="/admin/events/add"
          className="admin-add-group-button"
        >
          <Plus size={18} />
          Add Event
        </Link>

      </div>


      {/* STATS */}

      <div className="admin-stats-grid">

        <Link
          to="/admin/students"
          className="admin-stat-card"
        >
          <div className="admin-stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Students</span>

            <strong>
              {stats.students}
            </strong>
          </div>

          <ArrowRight
            size={18}
            className="admin-stat-arrow"
          />
        </Link>


        <Link
          to="/admin/groups"
          className="admin-stat-card"
        >
          <div className="admin-stat-icon">
            <UsersRound size={22} />
          </div>

          <div>
            <span>Groups</span>

            <strong>
              {stats.groups}
            </strong>
          </div>

          <ArrowRight
            size={18}
            className="admin-stat-arrow"
          />
        </Link>


        <Link
          to="/admin/events"
          className="admin-stat-card"
        >
          <div className="admin-stat-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>Events</span>

            <strong>
              {stats.events}
            </strong>
          </div>

          <ArrowRight
            size={18}
            className="admin-stat-arrow"
          />
        </Link>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Bell size={22} />
          </div>

          <div>
            <span>
              Notifications
            </span>

            <strong>
              {stats.notifications}
            </strong>
          </div>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="admin-dashboard-section">

        <div className="admin-section-header">

          <div>
            <h2>
              Quick Actions
            </h2>

            <p>
              Common administrative tasks.
            </p>
          </div>

        </div>


        <div className="admin-quick-actions">

          <Link
            to="/admin/students"
            className="admin-quick-action"
          >
            <Users size={20} />

            <div>
              <strong>
                Manage Students
              </strong>

              <span>
                View and manage all student
                accounts.
              </span>
            </div>
          </Link>


          <Link
            to="/admin/events/add"
            className="admin-quick-action"
          >
            <CalendarPlus size={20} />

            <div>
              <strong>
                Create Event
              </strong>

              <span>
                Publish a new campus event.
              </span>
            </div>
          </Link>


          <Link
            to="/admin/events"
            className="admin-quick-action"
          >
            <CalendarDays size={20} />

            <div>
              <strong>
                Manage Events
              </strong>

              <span>
                Edit or remove campus events.
              </span>
            </div>
          </Link>


          <Link
            to="/admin/groups"
            className="admin-quick-action"
          >
            <UsersRound size={20} />

            <div>
              <strong>
                Manage Groups
              </strong>

              <span>
                Manage study and campus groups.
              </span>
            </div>
          </Link>

        </div>

      </div>


      {/* RECENT ACTIVITY */}

      <div className="admin-dashboard-recent-grid">

        {/* RECENT STUDENTS */}

        <div className="admin-recent-card">

          <div className="admin-recent-header">

            <div>
              <h2>
                Recent Students
              </h2>

              <p>
                Latest registered students.
              </p>
            </div>

            <Link to="/admin/students">
              View All
              <ArrowRight size={15} />
            </Link>

          </div>


          {recentStudents.length ===
          0 ? (
            <div className="admin-recent-empty">
              No students registered yet.
            </div>
          ) : (
            <div className="admin-recent-list">

              {recentStudents.map(
                (student) => (
                  <div
                    className="admin-recent-item"
                    key={student.id}
                  >

                    <div className="admin-student-avatar">
                      {student.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {student.name}
                      </strong>

                      <span>
                        {student.email}
                      </span>
                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>


        {/* RECENT EVENTS */}

        <div className="admin-recent-card">

          <div className="admin-recent-header">

            <div>
              <h2>
                Recent Events
              </h2>

              <p>
                Recently created campus events.
              </p>
            </div>

            <Link to="/admin/events">
              View All
              <ArrowRight size={15} />
            </Link>

          </div>


          {recentEvents.length ===
          0 ? (
            <div className="admin-recent-empty">
              No events created yet.
            </div>
          ) : (
            <div className="admin-recent-list">

              {recentEvents.map(
                (event) => (
                  <div
                    className="admin-recent-item"
                    key={event.id}
                  >

                    <div className="admin-recent-event-icon">
                      <CalendarDays
                        size={18}
                      />
                    </div>

                    <div>
                      <strong>
                        {event.title}
                      </strong>

                      <span>
                        {event.location ||
                          "Location not set"}
                      </span>
                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;