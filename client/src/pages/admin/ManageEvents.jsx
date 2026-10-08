import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  CalendarDays,
  MapPin,
  Clock,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

const EVENTS_KEY = "campusEvents";

function ManageEvents() {
  const [events, setEvents] =
    useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const loadEvents = () => {
    try {
      const savedEvents = JSON.parse(
        localStorage.getItem(EVENTS_KEY) ||
          "[]"
      );

      setEvents(
        Array.isArray(savedEvents)
          ? savedEvents
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load events:",
        error
      );

      setEvents([]);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    const updatedEvents =
      events.filter(
        (event) =>
          String(event.id) !==
          String(eventId)
      );

    localStorage.setItem(
      EVENTS_KEY,
      JSON.stringify(updatedEvents)
    );

    setEvents(updatedEvents);
  };

  const filteredEvents =
    events.filter((event) => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();

      if (!search) {
        return true;
      }

      return (
        event.title
          ?.toLowerCase()
          .includes(search) ||
        event.description
          ?.toLowerCase()
          .includes(search) ||
        event.location
          ?.toLowerCase()
          .includes(search) ||
        event.category
          ?.toLowerCase()
          .includes(search)
      );
    });

  const formatDate = (date) => {
    if (!date) {
      return "Date not set";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="admin-management-page">

      <div className="admin-management-header">

        <div>
          <span className="admin-dashboard-label">
            ADMIN PANEL
          </span>

          <h1>Manage Events</h1>

          <p>
            Create, edit and manage campus
            events for students.
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


      {/* SEARCH */}

      <div className="admin-management-toolbar">

        <div className="admin-management-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
          />
        </div>

        <div className="admin-management-result-count">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1
            ? "event"
            : "events"}
        </div>

      </div>


      {/* EVENTS */}

      {filteredEvents.length === 0 ? (
        <div className="admin-empty-management">

          <CalendarDays size={40} />

          <h2>
            No events found
          </h2>

          <p>
            Create your first campus event
            using the Add Event button.
          </p>

          <Link
            to="/admin/events/add"
            className="admin-add-group-button"
          >
            <Plus size={18} />
            Create Event
          </Link>

        </div>
      ) : (
        <div className="admin-event-management-grid">

          {filteredEvents.map(
            (event) => (
              <article
                className="admin-event-management-card"
                key={event.id}
              >

                <div className="admin-event-management-image">

                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                    />
                  ) : (
                    <CalendarDays
                      size={42}
                    />
                  )}

                  <span>
                    {event.category ||
                      "Campus Event"}
                  </span>

                </div>


                <div className="admin-event-management-body">

                  <h2>
                    {event.title}
                  </h2>

                  <p>
                    {event.description ||
                      "No description available."}
                  </p>


                  <div className="admin-event-meta">

                    <span>
                      <CalendarDays
                        size={15}
                      />

                      {formatDate(
                        event.date
                      )}
                    </span>

                    <span>
                      <Clock size={15} />

                      {event.time ||
                        "Time not set"}
                    </span>

                    <span>
                      <MapPin size={15} />

                      {event.location ||
                        "Location not set"}
                    </span>

                    <span>
                      <Users size={15} />

                      {event.capacity ||
                        "Unlimited"}
                    </span>

                  </div>


                  <div className="admin-event-actions">

                    <Link
                      to={`/admin/events/edit/${event.id}`}
                      className="admin-edit-button"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(
                          event.id
                        )
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>

                </div>

              </article>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default ManageEvents;