import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UsersRound,
  Image,
  Save,
} from "lucide-react";

function AddGroup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    department: "",
    maxMembers: "",
    privacy: "Public",
    image: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter a group name.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a group description.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.department) {
      setError("Please select a department.");
      return;
    }

    if (!formData.maxMembers) {
      setError("Please enter the maximum number of members.");
      return;
    }

    const existingGroups =
      JSON.parse(localStorage.getItem("campusGroups")) || [];

    const newGroup = {
      id: Date.now(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      department: formData.department,
      maxMembers: Number(formData.maxMembers),
      privacy: formData.privacy,
      image: formData.image.trim(),
      members: 0,
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };

    localStorage.setItem(
      "campusGroups",
      JSON.stringify([...existingGroups, newGroup])
    );

    navigate("/admin/groups");
  };

  return (
    <div className="admin-form-page">

      <div className="admin-form-header">
        <div>
          <Link
            to="/admin/groups"
            className="admin-back-link"
          >
            <ArrowLeft size={17} />
            Back to Groups
          </Link>

          <h1>Create New Group</h1>

          <p>
            Create a new study, academic, or campus community group.
          </p>
        </div>
      </div>

      <form
        className="admin-group-form"
        onSubmit={handleSubmit}
      >

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <div className="admin-form-icon">
              <UsersRound size={21} />
            </div>

            <div>
              <h2>Group Information</h2>
              <p>Basic information about the group.</p>
            </div>
          </div>

          {error && (
            <div className="admin-form-error">
              {error}
            </div>
          )}

          <div className="admin-form-grid">

            {/* Group Name */}
            <div className="admin-form-field full">
              <label htmlFor="name">
                Group Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Web Development Club"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="admin-form-field full">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe what this group is about..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div className="admin-form-field">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Select category
                </option>

                <option value="Academic">
                  Academic
                </option>

                <option value="Technology">
                  Technology
                </option>

                <option value="Sports">
                  Sports
                </option>

                <option value="Arts">
                  Arts & Culture
                </option>

                <option value="Social">
                  Social
                </option>

                <option value="Career">
                  Career
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Department */}
            <div className="admin-form-field">
              <label htmlFor="department">
                Department
              </label>

              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">
                  Select department
                </option>

                <option value="Computer Science">
                  Computer Science
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>

                <option value="Information Technology">
                  Information Technology
                </option>

                <option value="Business Administration">
                  Business Administration
                </option>

                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>

                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>

                <option value="Arts">
                  Arts
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Maximum Members */}
            <div className="admin-form-field">
              <label htmlFor="maxMembers">
                Maximum Members
              </label>

              <input
                id="maxMembers"
                name="maxMembers"
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={formData.maxMembers}
                onChange={handleChange}
              />
            </div>

            {/* Privacy */}
            <div className="admin-form-field">
              <label htmlFor="privacy">
                Privacy
              </label>

              <select
                id="privacy"
                name="privacy"
                value={formData.privacy}
                onChange={handleChange}
              >
                <option value="Public">
                  Public
                </option>

                <option value="Private">
                  Private
                </option>
              </select>
            </div>

            {/* Image */}
            <div className="admin-form-field full">
              <label htmlFor="image">
                Group Image URL
              </label>

              <div className="admin-image-input">
                <Image size={18} />

                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/group-image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              <small>
                Optional. Add a public image URL for the group.
              </small>
            </div>

          </div>
        </div>

        {/* Form Actions */}
        <div className="admin-form-actions">

          <Link
            to="/admin/groups"
            className="admin-cancel-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-save-button"
          >
            <Save size={18} />
            Create Group
          </button>

        </div>

      </form>
    </div>
  );
}

export default AddGroup;