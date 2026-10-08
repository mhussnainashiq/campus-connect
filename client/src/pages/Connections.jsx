import { UserRound, Users } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStorage } from "../utils/storage";

function Connections() {
  const { currentUser } = useAuth();

  const users = getStorage("users", []);
  const connections = getStorage("connections", []);

  const myConnections = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    const myConnectionIds = connections
      .filter(
        (connection) =>
          connection.userId === currentUser.id
      )
      .map(
        (connection) => connection.connectedUserId
      );

    return users.filter((user) =>
      myConnectionIds.includes(user.id)
    );
  }, [currentUser, connections, users]);

  if (!currentUser) {
    return (
      <main className="connections-page">
        <div className="connections-container">
          <div className="connections-empty">
            <div className="connections-empty-icon">
              <UserRound size={30} />
            </div>

            <h1>Sign in to view connections</h1>

            <p>
              Please sign in to see the students you are
              connected with.
            </p>

            <Link
              to="/login"
              className="connections-button"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="connections-page">
      <div className="connections-container">

        <div className="connections-heading">
          <div>
            <span className="section-label">
              Your network
            </span>

            <h1>My Connections</h1>

            <p>
              Students you have connected with on Campus
              Connect.
            </p>
          </div>

          <div className="connections-count">
            <Users size={20} />

            <div>
              <strong>{myConnections.length}</strong>
              <span>Connections</span>
            </div>
          </div>
        </div>

        {myConnections.length === 0 ? (
          <div className="connections-empty">
            <div className="connections-empty-icon">
              <Users size={30} />
            </div>

            <h2>No connections yet</h2>

            <p>
              Start discovering students and connect with
              people who share your interests.
            </p>

            <Link
              to="/students"
              className="connections-button"
            >
              Discover Students
            </Link>
          </div>
        ) : (
          <div className="connections-grid">
            {myConnections.map((student) => (
              <article
                className="connection-card"
                key={student.id}
              >
                <div className="connection-avatar">
                  <UserRound size={30} />
                </div>

                <div className="connection-info">
                  <h2>{student.name}</h2>

                  <p>
                    {student.department ||
                      "Department not added"}
                  </p>

                  <span>
                    {student.email}
                  </span>
                </div>

                <div className="connection-interests">
                  {student.interests?.length > 0 ? (
                    student.interests
                      .slice(0, 3)
                      .map((interest) => (
                        <span key={interest}>
                          {interest}
                        </span>
                      ))
                  ) : (
                    <small>
                      No interests added
                    </small>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Connections;