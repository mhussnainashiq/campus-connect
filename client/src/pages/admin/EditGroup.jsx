
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Users,
} from "lucide-react";

const STORAGE_KEY = "campusGroups";

function EditGroup() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    department: "",
    maxMembers: 50,
    privacy: "Public",
    image: "",
  });

  useEffect(() => {
    const savedGroups = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const group = savedGroups.find(
      (item) => String(item.id) === String(id)
    );

    if (!group) {
      setMessage("Group not found.");
      setLoading(false);
      return;
    }

    setFormData({
      name: group.name || "",
      description: group.description || "",
      category: group.category || "",
      department: group.department || "",
      maxMembers: group.maxMembers || 50,
      privacy: group.privacy || "Public",
      image: group.image || "",
    });

    setLoading(false);
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!formData.name.trim()) {
      setMessage("Please enter a group name.");
      return;
    }

    if (!formData.description.trim()) {
      setMessage("Please enter a group description.");
      return;
    }

    if (!formData.category) {
      setMessage("Please select a category.");
      return;
    }

    const savedGroups = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const existingGroup = savedGroups.find(
      (group) =>
        String(group.id) === String(id)
    );

    if (!existingGroup) {
      setMessage("Group could not be found.");
      return;
    }

    const updatedGroups = savedGroups.map(
      (group) => {
        if (
          String(group.id) !== String(id)
        ) {
          return group;
        }

        return {
          ...group,
          name: formData.name.trim(),
          description:
            formData.description.trim(),
          category: formData.category,
          department:
            formData.department.trim(),
          maxMembers: Number(
            formData.maxMembers
          ),
          privacy: formData.privacy,
          image: formData.image.trim(),
          updatedAt:
            new Date().toISOString(),
        };
      }
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedGroups)
    );

    navigate("/admin/groups");
  };

  if (loading) {
    return (
      <div className="admin-form-page">
        <div className="admin-form-card">
          <p>Loading group...</p>
        </div>
      </div>
    );
  }

  if (message === "Group not found.") {
    return (
      <div className="admin-form-page">
        <div className="admin-form-card admin-form-empty">
          <div className="admin-empty-icon">
            <Users size={28} />
          </div>

          <h1>Group not found</h1>

          <p>
            The group you are trying to edit
            does not exist.
          </p>

          <Link
            to="/admin/groups"
            className="admin-add-group-button"
          >
            <ArrowLeft size={18} />
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

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

          <span className="admin-dashboard-label">
            GROUP MANAGEMENT
          </span>

          <h1>Edit Group</h1>

          <p>
            Update the information for this
            campus group.
          </p>
        </div>
      </div>

      <form
        className="admin-form-card"
        onSubmit={handleSubmit}
      >
        {message && (
          <div className="admin-form-message">
            {message}
          </div>
        )}

        <div className="admin-form-grid">
          <div className="admin-form-field">
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
                Arts
              </option>
              <option value="Career">
                Career
              </option>
              <option value="Social">
                Social
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="department">
              Department
            </label>

            <input
              id="department"
              name="department"
              type="text"
              placeholder="e.g. Computer Science"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="maxMembers">
              Maximum Members
            </label>

            <input
              id="maxMembers"
              name="maxMembers"
              type="number"
              min="1"
              value={formData.maxMembers}
              onChange={handleChange}
            />
          </div>

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

          <div className="admin-form-field">
            <label htmlFor="image">
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/group.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="admin-form-field admin-form-full">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows="6"
            placeholder="Describe the purpose of this group..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditGroup;