import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";

const EVENTS_KEY = "campusEvents";

function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    try {
      const events = JSON.parse(
        localStorage.getItem(
          EVENTS_KEY
        ) || "[]"
      );

      const event = events.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

      if (!event) {
        setError(
          "Event could not be found."
        );

        return;
      }

      setFormData({
        title: event.title || "",
        description:
          event.description || "",
        category:
          event.category || "Academic",
        date: event.date || "",
        time: event.time || "",
        location:
          event.location || "",
        capacity:
          event.capacity || "",
        image:
          event.image || "",
      });
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load this event."
      );
    }
  }, [id]);

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

    if (!formData) {
      return;
    }

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

    const events = JSON.parse(
      localStorage.getItem(
        EVENTS_KEY
      ) || "[]"
    );

    const updatedEvents =
      events.map((item) => {
        if (
          String(item.id) !==
          String(id)
        ) {
          return item;
        }

        return {
          ...item,

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
              ? Number(
                  formData.capacity
                )
              : "",

          image:
            formData.image.trim(),

          updatedAt:
            new Date().toISOString(),
        };
      });

    localStorage.setItem(
      EVENTS_KEY,
      JSON.stringify(updatedEvents)
    );

    navigate("/admin/events");
  };

  if (error && !formData) {
    return (
      <div className="admin-form-page">

        <div className="admin-empty-management">

          <CalendarDays size={40} />

          <h2>{error}</h2>

          <button
            type="button"
            className="admin-add-group-button"
            onClick={() =>
              navigate("/admin/events")
            }
          >
            <ArrowLeft size={18} />
            Back to Events
          </button>

        </div>

      </div>
    );
  }

  if (!formData) {
    return (
      <div className="page-loading">
        <p>Loading event...</p>
      </div>
    );
  }

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

          <h1>Edit Event</h1>

          <p>
            Update the event information.
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
          <CalendarDays size={22} />

          <div>
            <h2>Event Information</h2>

            <p>
              Update the details for this
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
            />
          </div>


          <div className="admin-form-field full">
            <label>
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              rows="5"
            />
          </div>


          <div className="admin-form-field">
            <label>
              Category
            </label>

            <select
              name="category"
              value={
                formData.category
              }
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
            />
          </div>


          <div className="admin-form-field full">
            <label>
              Location *
            </label>

            <input
              type="text"
              name="location"
              value={
                formData.location
              }
              onChange={handleChange}
            />
          </div>


          <div className="admin-form-field full">
            <label>
              Event Image URL
            </label>

            <input
              type="url"
              name="image"
              value={
                formData.image
              }
              onChange={handleChange}
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
            Save Changes
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditEvent;