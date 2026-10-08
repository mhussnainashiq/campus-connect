import {
  Check,
  Search,
  UserRound,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import {
  getStorage,
  setStorage,
} from "../utils/storage";

function Students() {
  const { currentUser } = useAuth();

  const { addNotification } =
    useNotifications();

  const [search, setSearch] = useState("");

  const [connections, setConnections] =
    useState(() =>
      getStorage("connections", [])
    );

  const users = getStorage("users", []);

  const students = useMemo(() => {
    const currentSearch = search
      .trim()
      .toLowerCase();

    const otherStudents = users.filter(
      (user) =>
        user.id !== currentUser?.id
    );

    if (!currentSearch) {
      return otherStudents;
    }

    return otherStudents.filter((user) => {
      const name =
        user.name?.toLowerCase() || "";

      const department =
        user.department?.toLowerCase() || "";

      const interests =
        user.interests
          ?.join(" ")
          .toLowerCase() || "";

      return (
        name.includes(currentSearch) ||
        department.includes(currentSearch) ||
        interests.includes(currentSearch)
      );
    });
  }, [
    search,
    users.length,
    currentUser?.id,
  ]);

  const isConnected = (studentId) => {
    if (!currentUser) {
      return false;
    }

    return connections.some(
      (connection) =>
        connection.userId ===
          currentUser.id &&
        connection.connectedUserId ===
          studentId
    );
  };

  const handleConnect = (studentId) => {
    if (!currentUser) {
      return;
    }

    if (isConnected(studentId)) {
      return;
    }

    const connectedStudent = users.find(
      (user) => user.id === studentId
    );

    if (!connectedStudent) {
      return;
    }

    const newConnection = {
      id: Date.now().toString(),
      userId: currentUser.id,
      connectedUserId: studentId,
      createdAt:
        new Date().toISOString(),
    };

    const updatedConnections = [
      ...connections,
      newConnection,
    ];

    setStorage(
      "connections",
      updatedConnections
    );

    setConnections(updatedConnections);

    /*
      Create notification for
      the student who received
      the connection.
    */

    addNotification({
      userId: connectedStudent.id,
      type: "connection",
      title: "New connection",
      message: `${currentUser.name} connected with you.`,
      link: "/connections",
      actorId: currentUser.id,
      actorName: currentUser.name,
    });
  };

  return (
    <main className="students-page">
      <div className="students-container">

        {/* Page Header */}

        <div className="students-heading">
          <div>
            <span className="section-label">
              Campus community
            </span>

            <h1>
              Discover students
            </h1>

            <p>
              Find students with similar
              interests, departments, and
              academic goals.
            </p>
          </div>

          <div className="students-count">
            <strong>
              {students.length}
            </strong>

            <span>
              Students
            </span>
          </div>
        </div>

        {/* Search */}

        <div className="students-search">
          <Search size={19} />

          <input
            type="search"
            placeholder="Search by name, department, or interest..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        {/* Not Logged In */}

        {!currentUser ? (
          <div className="students-empty">
            <div className="students-empty-icon">
              <UserRound size={28} />
            </div>

            <h2>
              Sign in to connect
            </h2>

            <p>
              Please sign in to connect
              with other students.
            </p>

            <Link
              to="/login"
              className="students-empty-button"
            >
              Sign in
            </Link>
          </div>
        ) : students.length === 0 ? (
          /* No Students */

          <div className="students-empty">
            <div className="students-empty-icon">
              <UserRound size={28} />
            </div>

            <h2>
              No students found
            </h2>

            <p>
              {search
                ? "Try searching with a different name, department, or interest."
                : "No other students have registered yet."}
            </p>
          </div>
        ) : (
          /* Students */

          <div className="students-grid">
            {students.map((student) => {
              const connected =
                isConnected(student.id);

              return (
                <article
                  className="student-card"
                  key={student.id}
                >

                  {/* Student Header */}

                  <div className="student-card-top">
                    <div className="student-avatar">
                      <UserRound size={27} />
                    </div>

                    <div className="student-basic-info">
                      <h2>
                        {student.name}
                      </h2>

                      <p>
                        {student.department ||
                          "Department not added"}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}

                  <div className="student-bio">
                    <p>
                      {student.bio ||
                        "This student hasn't added a bio yet."}
                    </p>
                  </div>

                  {/* Interests */}

                  <div className="student-interests">
                    {student.interests?.length >
                    0 ? (
                      student.interests
                        .slice(0, 4)
                        .map((interest) => (
                          <span
                            className="student-interest"
                            key={interest}
                          >
                            {interest}
                          </span>
                        ))
                    ) : (
                      <span className="student-no-interests">
                        No interests added
                      </span>
                    )}
                  </div>

                  {/* Footer */}

                  <div className="student-card-footer">
                    <span className="student-email">
                      {student.email}
                    </span>

                    <button
                      type="button"
                      className={`student-connect-button ${
                        connected
                          ? "student-connect-button-connected"
                          : ""
                      }`}
                      onClick={() =>
                        handleConnect(
                          student.id
                        )
                      }
                      disabled={connected}
                    >
                      {connected ? (
                        <>
                          <Check size={15} />
                          Connected
                        </>
                      ) : (
                        <>
                          <UserPlus size={15} />
                          Connect
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Students;