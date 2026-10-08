import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Check,
} from "lucide-react";

const EVENTS_KEY = "campusEvents";
const EVENT_REGISTRATIONS_KEY =
  "campusEventRegistrations";

function Events() {
  const [events, setEvents] =
    useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [registrations, setRegistrations] =
    useState({});

  const currentUser = JSON.parse(
    localStorage.getItem(
      "currentUser"
    ) || "null"
  );

  const loadEvents = () => {
    try {
      const savedEvents = JSON.parse(
        localStorage.getItem(
          EVENTS_KEY
        ) || "[]"
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

  const loadRegistrations = () => {
    if (!currentUser?.id) {
      setRegistrations({});
      return;
    }

    try {
      const allRegistrations =
        JSON.parse(
          localStorage.getItem(
            EVENT_REGISTRATIONS_KEY
          ) || "{}"
        );

      setRegistrations(
        allRegistrations[
          currentUser.id
        ] || {}
      );
    } catch {
      setRegistrations({});
    }
  };

  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        events
          .map(
            (event) =>
              event.category
          )
          .filter(Boolean)
      ),
    ];

    return [
      "All",
      ...uniqueCategories,
    ];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const search =
      searchQuery
        .trim()
        .toLowerCase();

    return events.filter(
      (event) => {
        const matchesSearch =
          !search ||
          event.title
            ?.toLowerCase()
            .includes(search) ||
          event.description
            ?.toLowerCase()
            .includes(search) ||
          event.location
            ?.toLowerCase()
            .includes(search);

        const matchesCategory =
          categoryFilter ===
            "All" ||
          event.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    events,
    searchQuery,
    categoryFilter,
  ]);

  const formatDate = (date) => {
    if (!date) {
      return "Date not set";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      undefined,
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const handleRegister = (
    event
  ) => {
    if (!currentUser?.id) {
      alert(
        "Please log in to register for an event."
      );

      return;
    }

    const allRegistrations =
      JSON.parse(
        localStorage.getItem(
          EVENT_REGISTRATIONS_KEY
        ) || "{}"
      );

    const userRegistrations = {
      ...(allRegistrations[
        currentUser.id
      ] || {}),
    };

    if (
      userRegistrations[event.id]
    ) {
      return;
    }

    const capacity =
      Number(event.capacity) || 0;

    const attendees =
      Number(event.attendees) || 0;

    if (
      capacity > 0 &&
      attendees >= capacity
    ) {
      alert(
        "This event has reached its capacity."
      );

      return;
    }

    userRegistrations[event.id] =
      true;

    const updatedRegistrations = {
      ...allRegistrations,

      [currentUser.id]:
        userRegistrations,
    };

    localStorage.setItem(
      EVENT_REGISTRATIONS_KEY,
      JSON.stringify(
        updatedRegistrations
      )
    );

    const updatedEvents =
      events.map((item) => {
        if (
          String(item.id) ===
          String(event.id)
        ) {
          return {
            ...item,
            attendees:
              (Number(
                item.attendees
              ) || 0) + 1,
          };
        }

        return item;
      });

    localStorage.setItem(
      EVENTS_KEY,
      JSON.stringify(
        updatedEvents
      )
    );

    setEvents(updatedEvents);

    setRegistrations(
      userRegistrations
    );
  };

  return (
    <div className="student-events-page">

      {/* HEADER */}

      <div className="student-events-header">

        <div>
          <span className="student-events-label">
            CAMPUS ACTIVITIES
          </span>

          <h1>
            Campus Events
          </h1>

          <p>
            Discover workshops, activities,
            academic events and opportunities
            happening around campus.
          </p>
        </div>

        <div className="student-events-total">
          <CalendarDays size={21} />

          <div>
            <strong>
              {events.length}
            </strong>

            <span>
              Events
            </span>
          </div>
        </div>

      </div>


      {/* TOOLBAR */}

      <div className="student-events-toolbar">

        <div className="student-events-search">
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

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
          className="student-events-filter"
        >
          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>

      </div>


      {/* EVENTS */}

      {filteredEvents.length === 0 ? (
        <div className="student-events-empty">

          <CalendarDays size={42} />

          <h2>
            No events available
          </h2>

          <p>
            New campus events created by
            administrators will appear here.
          </p>

        </div>
      ) : (
        <div className="student-events-grid">

          {filteredEvents.map(
            (event) => {
              const isRegistered =
                Boolean(
                  registrations[
                    event.id
                  ]
                );

              const attendees =
                Number(
                  event.attendees
                ) || 0;

              const capacity =
                Number(
                  event.capacity
                ) || 0;

              const isFull =
                capacity > 0 &&
                attendees >=
                  capacity;

              return (
                <article
                  className="student-event-card"
                  key={event.id}
                >

                  <div className="student-event-image">

                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                      />
                    ) : (
                      <CalendarDays
                        size={44}
                      />
                    )}

                    <span>
                      {event.category ||
                        "Campus Event"}
                    </span>

                  </div>


                  <div className="student-event-body">

                    <h2>
                      {event.title}
                    </h2>

                    <p>
                      {event.description ||
                        "No description available."}
                    </p>


                    <div className="student-event-info">

                      <span>
                        <CalendarDays
                          size={16}
                        />

                        {formatDate(
                          event.date
                        )}
                      </span>

                      <span>
                        <Clock size={16} />

                        {event.time ||
                          "Time not set"}
                      </span>

                      <span>
                        <MapPin size={16} />

                        {event.location ||
                          "Location not set"}
                      </span>

                      <span>
                        <Users size={16} />

                        {attendees}

                        {capacity > 0
                          ? ` / ${capacity}`
                          : ""}{" "}
                        attendees
                      </span>

                    </div>


                    <button
                      type="button"
                      className={`student-event-register ${
                        isRegistered
                          ? "registered"
                          : ""
                      }`}
                      disabled={
                        isRegistered ||
                        isFull
                      }
                      onClick={() =>
                        handleRegister(
                          event
                        )
                      }
                    >

                      {isRegistered ? (
                        <>
                          <Check
                            size={17}
                          />

                          Registered
                        </>
                      ) : isFull ? (
                        <>
                          Event Full
                        </>
                      ) : (
                        <>
                          Register for Event
                        </>
                      )}

                    </button>

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

export default Events;