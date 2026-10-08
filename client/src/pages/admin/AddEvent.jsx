import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarPlus,
  Save,
  ArrowLeft,
} from "lucide-react";

const EVENTS_KEY = "campusEvents";

function AddEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      category: "Academic",
      date: "",
      time: "",
      location: "",
      capacity: "",
      image: "",
    });

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.title.trim() ||
      !formData.date ||
      !formData.location.trim()
    ) {
      setError(
        "Please enter the event title, date and location."
      );

      return;
    }

    const existingEvents =
      JSON.parse(
        localStorage.getItem(
          EVENTS_KEY
        ) || "[]"
      );

    const newEvent = {
      id: Date.now().toString(),

      title:
        formData.title.trim(),

      description:
        formData.description.trim(),

      category:
        formData.category,

      date:
        formData.date,

      time:
        formData.time,

      location:
        formData.location.trim(),

      capacity:
        formData.capacity
          ? Number(formData.capacity)
          : "",

      image:
        formData.image.trim(),

      attendees: 0,

      createdBy:
        "Admin",

      createdAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      EVENTS_KEY,
      JSON.stringify([
        ...existingEvents,
        newEvent,
      ])
    );

    navigate("/admin/events");
  };

  return (
    <div className="admin-form-page">

      <div className="admin-form-header">

        <button
          type="button"
          className="admin-back-button"
          onClick={() =>
            navigate("/admin/events")
          }
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>

        <div>
          <span className="admin-dashboard-label">
            ADMIN PANEL
          </span>

          <h1>Create Event</h1>

          <p>
            Add a new event that students
            can discover and attend.
          </p>
        </div>

      </div>


      <form
        className="admin-form-card"
        onSubmit={handleSubmit}
      >

        {error && (
          <div className="admin-form-error">
            {error}
          </div>
        )}


        <div className="admin-form-title">
          <CalendarPlus size={22} />

          <div>
            <h2>Event Information</h2>
            <p>
              Enter the details for this
              campus event.
            </p>
          </div>
        </div>


        <div className="admin-form-grid">

          <div className="admin-form-field full">
            <label>
              Event Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Annual Tech Conference"
            />
          </div>


          <div className="admin-form-field full">
            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe the event..."
            />
          </div>


          <div className="admin-form-field">
            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Academic">
                Academic
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Social">
                Social
              </option>

              <option value="Workshop">
                Workshop
              </option>

              <option value="Career">
                Career
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>


          <div className="admin-form-field">
            <label>
              Date *
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>


          <div className="admin-form-field">
            <label>
              Time
            </label>

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>


          <div className="admin-form-field">
            <label>
              Capacity
            </label>

            <input
              type="number"
              min="1"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g. 100"
            />
          </div>


          <div className="admin-form-field full">
            <label>
              Location *
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Auditorium"
            />
          </div>


          <div className="admin-form-field full">
            <label>
              Event Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/event-image.jpg"
            />
          </div>

        </div>


        <div className="admin-form-actions">

          <button
            type="button"
            className="admin-cancel-button"
            onClick={() =>
              navigate("/admin/events")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-save-button"
          >
            <Save size={18} />
            Create Event
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddEvent;