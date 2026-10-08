import {
  Search,
  Users,
  FileText,
  UsersRound,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getStorage } from "../utils/storage";

function SearchPage() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const users = getStorage("users", []);
  const posts = getStorage("posts", []);
  const groups = getStorage("groups", []);
  const events = getStorage("events", []);

  const term = searchTerm.trim().toLowerCase();

  const filteredUsers = term
    ? users.filter(
        (user) =>
          user.name
            ?.toLowerCase()
            .includes(term) ||
          user.department
            ?.toLowerCase()
            .includes(term) ||
          user.bio
            ?.toLowerCase()
            .includes(term)
      )
    : [];

  const filteredPosts = term
    ? posts.filter(
        (post) =>
          post.content
            ?.toLowerCase()
            .includes(term) ||
          post.userName
            ?.toLowerCase()
            .includes(term)
      )
    : [];

  const filteredGroups = term
    ? groups.filter(
        (group) =>
          group.name
            ?.toLowerCase()
            .includes(term) ||
          group.description
            ?.toLowerCase()
            .includes(term) ||
          group.subject
            ?.toLowerCase()
            .includes(term)
      )
    : [];

  const filteredEvents = term
    ? events.filter(
        (event) =>
          event.title
            ?.toLowerCase()
            .includes(term) ||
          event.description
            ?.toLowerCase()
            .includes(term) ||
          event.location
            ?.toLowerCase()
            .includes(term)
      )
    : [];

  const hasResults =
    filteredUsers.length > 0 ||
    filteredPosts.length > 0 ||
    filteredGroups.length > 0 ||
    filteredEvents.length > 0;

  return (
    <main className="search-page">
      <div className="search-container">

        <div className="search-heading">
          <span className="section-label">
            Campus Connect
          </span>

          <h1>Search</h1>

          <p>
            Find students, posts, study groups,
            and campus events.
          </p>
        </div>

        <div className="search-input-wrapper">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search Campus Connect..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            autoFocus
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() =>
                setSearchTerm("")
              }
              className="search-clear-button"
            >
              Clear
            </button>
          )}
        </div>

        {!searchTerm && (
          <div className="search-empty">
            <div className="search-empty-icon">
              <Search size={30} />
            </div>

            <h2>
              Start searching
            </h2>

            <p>
              Search for students, posts,
              study groups, or events.
            </p>
          </div>
        )}

        {searchTerm && !hasResults && (
          <div className="search-empty">
            <div className="search-empty-icon">
              <Search size={30} />
            </div>

            <h2>
              No results found
            </h2>

            <p>
              We couldn't find anything matching
              "{searchTerm}".
            </p>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <section className="search-section">
            <div className="search-section-heading">
              <h2>
                <Users size={20} />
                Students
              </h2>

              <span>
                {filteredUsers.length}
              </span>
            </div>

            <div className="search-results-grid">
              {filteredUsers.map((user) => (
                <Link
                  to="/students"
                  key={user.id}
                  className="search-result-card"
                >
                  <div className="search-result-icon">
                    <Users size={20} />
                  </div>

                  <div>
                    <h3>{user.name}</h3>

                    <p>
                      {user.department ||
                        "Student"}
                    </p>

                    {user.bio && (
                      <span>
                        {user.bio}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {filteredPosts.length > 0 && (
          <section className="search-section">
            <div className="search-section-heading">
              <h2>
                <FileText size={20} />
                Posts
              </h2>

              <span>
                {filteredPosts.length}
              </span>
            </div>

            <div className="search-results-list">
              {filteredPosts.map((post) => (
                <Link
                  to="/feed"
                  key={post.id}
                  className="search-post-card"
                >
                  <div className="search-result-icon">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h3>
                      {post.userName ||
                        "Campus Connect"}
                    </h3>

                    <p>
                      {post.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {filteredGroups.length > 0 && (
          <section className="search-section">
            <div className="search-section-heading">
              <h2>
                <UsersRound size={20} />
                Study Groups
              </h2>

              <span>
                {filteredGroups.length}
              </span>
            </div>

            <div className="search-results-grid">
              {filteredGroups.map((group) => (
                <Link
                  to="/groups"
                  key={group.id}
                  className="search-result-card"
                >
                  <div className="search-result-icon">
                    <UsersRound size={20} />
                  </div>

                  <div>
                    <h3>{group.name}</h3>

                    <p>
                      {group.description}
                    </p>

                    {group.subject && (
                      <span>
                        {group.subject}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {filteredEvents.length > 0 && (
          <section className="search-section">
            <div className="search-section-heading">
              <h2>
                <CalendarDays size={20} />
                Events
              </h2>

              <span>
                {filteredEvents.length}
              </span>
            </div>

            <div className="search-results-grid">
              {filteredEvents.map((event) => (
                <Link
                  to="/events"
                  key={event.id}
                  className="search-result-card"
                >
                  <div className="search-result-icon">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <h3>{event.title}</h3>

                    <p>
                      {event.description}
                    </p>

                    {event.location && (
                      <span>
                        {event.location}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

export default SearchPage;