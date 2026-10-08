import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Trash2,
  ShieldCheck,
  GraduationCap,
  Mail,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const USERS_KEY = "users";

function ManageStudents() {
  const { currentUser } = useAuth();

  const [students, setStudents] =
    useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const loadStudents = () => {
    try {
      const savedUsers = JSON.parse(
        localStorage.getItem(USERS_KEY) ||
          "[]"
      );

      setStudents(
        Array.isArray(savedUsers)
          ? savedUsers
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load students:",
        error
      );

      setStudents([]);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const search =
      searchQuery.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !search ||
        student.name
          ?.toLowerCase()
          .includes(search) ||
        student.email
          ?.toLowerCase()
          .includes(search) ||
        student.department
          ?.toLowerCase()
          .includes(search);

      const matchesRole =
        roleFilter === "All" ||
        (student.role || "student") ===
          roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    students,
    searchQuery,
    roleFilter,
  ]);

  const handleDelete = (student) => {
    if (
      student.id === currentUser?.id
    ) {
      alert(
        "You cannot delete your own admin account."
      );
      return;
    }

    if (
      student.email?.toLowerCase() ===
      "admin@campusconnect.com"
    ) {
      alert(
        "The main admin account cannot be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete ${student.name}'s account?`
    );

    if (!confirmed) {
      return;
    }

    const updatedUsers = students.filter(
      (user) => user.id !== student.id
    );

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(updatedUsers)
    );

    setStudents(updatedUsers);
  };

  const handleRoleChange = (
    student,
    newRole
  ) => {
    if (
      student.email?.toLowerCase() ===
      "admin@campusconnect.com"
    ) {
      alert(
        "The main admin account must remain an administrator."
      );
      return;
    }

    const updatedUsers = students.map(
      (user) =>
        user.id === student.id
          ? {
              ...user,
              role: newRole,
            }
          : user
    );

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(updatedUsers)
    );

    setStudents(updatedUsers);
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString();
  };

  const studentCount = students.filter(
    (student) =>
      student.role !== "admin"
  ).length;

  const adminCount = students.filter(
    (student) =>
      student.role === "admin"
  ).length;

  return (
    <div className="admin-management-page">

      <div className="admin-management-header">
        <div>
          <span className="admin-dashboard-label">
            ADMIN PANEL
          </span>

          <h1>Manage Students</h1>

          <p>
            View and manage all Campus Connect
            student accounts.
          </p>
        </div>

        <div className="admin-management-total">
          <Users size={22} />

          <div>
            <strong>
              {studentCount}
            </strong>

            <span>
              Students
            </span>
          </div>
        </div>
      </div>


      {/* SUMMARY */}

      <div className="admin-management-summary">

        <div className="admin-management-summary-card">
          <GraduationCap size={20} />

          <div>
            <span>Students</span>
            <strong>
              {studentCount}
            </strong>
          </div>
        </div>

        <div className="admin-management-summary-card">
          <ShieldCheck size={20} />

          <div>
            <span>Administrators</span>
            <strong>
              {adminCount}
            </strong>
          </div>
        </div>

        <div className="admin-management-summary-card">
          <Users size={20} />

          <div>
            <span>Total Accounts</span>
            <strong>
              {students.length}
            </strong>
          </div>
        </div>

      </div>


      {/* TOOLBAR */}

      <div className="admin-management-toolbar">

        <div className="admin-management-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(
              event.target.value
            )
          }
          className="admin-management-filter"
        >
          <option value="All">
            All Accounts
          </option>

          <option value="student">
            Students
          </option>

          <option value="admin">
            Administrators
          </option>
        </select>

      </div>


      {/* STUDENTS */}

      <div className="admin-students-table-wrapper">

        {filteredStudents.length === 0 ? (
          <div className="admin-empty-management">
            <Users size={36} />

            <h2>
              No students found
            </h2>

            <p>
              Try changing your search or
              filter.
            </p>
          </div>
        ) : (
          <div className="admin-students-table">

            <div className="admin-students-table-header">
              <span>Student</span>
              <span>Email</span>
              <span>Department</span>
              <span>Role</span>
              <span>Joined</span>
              <span>Action</span>
            </div>

            {filteredStudents.map(
              (student) => (
                <div
                  className="admin-student-row"
                  key={student.id}
                >

                  <div className="admin-student-name">
                    <div className="admin-student-avatar">
                      {student.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {student.name ||
                          "Unnamed Student"}
                      </strong>

                      <span>
                        ID: {student.id}
                      </span>
                    </div>
                  </div>


                  <div className="admin-student-email">
                    <Mail size={15} />

                    {student.email}
                  </div>


                  <div>
                    {student.department ||
                      "Not specified"}
                  </div>


                  <div>
                    <select
                      className="admin-role-select"
                      value={
                        student.role ||
                        "student"
                      }
                      onChange={(event) =>
                        handleRoleChange(
                          student,
                          event.target.value
                        )
                      }
                      disabled={
                        student.email?.toLowerCase() ===
                        "admin@campusconnect.com"
                      }
                    >
                      <option value="student">
                        Student
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>
                  </div>


                  <div className="admin-student-date">
                    <CalendarDays
                      size={15}
                    />

                    {formatDate(
                      student.createdAt
                    )}
                  </div>


                  <div>
                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(
                          student
                        )
                      }
                      disabled={
                        student.email?.toLowerCase() ===
                        "admin@campusconnect.com"
                      }
                    >
                      <Trash2 size={16} />

                      Delete
                    </button>
                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default ManageStudents;