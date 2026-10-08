
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Lock,
  Globe,
  ArrowLeft,
} from "lucide-react";

const STORAGE_KEY = "campusGroups";

function ManageGroups() {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const savedGroups = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    setGroups(savedGroups);
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        groups
          .map((group) => group.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [groups]);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const searchText = searchQuery
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchText ||
        group.name?.toLowerCase().includes(searchText) ||
        group.description
          ?.toLowerCase()
          .includes(searchText) ||
        group.department
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        group.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [groups, searchQuery, categoryFilter]);

  const handleDelete = (groupId) => {
    const group = groups.find(
      (item) => String(item.id) === String(groupId)
    );

    if (!group) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${group.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedGroups = groups.filter(
      (item) =>
        String(item.id) !== String(groupId)
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedGroups)
    );

    setGroups(updatedGroups);
  };

  return (
    <div className="admin-groups-page">
      <div className="admin-groups-header">
        <div>
          <Link
            to="/admin"
            className="admin-back-link"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <span className="admin-dashboard-label">
            GROUP MANAGEMENT
          </span>

          <h1>Manage Groups</h1>

          <p>
            Create, edit, search, and manage
            student groups across Campus Connect.
          </p>
        </div>

        <Link
          to="/admin/groups/add"
          className="admin-add-group-button"
        >
          <Plus size={18} />
          Add Group
        </Link>
      </div>

      <div className="admin-groups-toolbar">
        <div className="admin-groups-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
          className="admin-groups-filter"
        >
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-groups-summary">
        <div>
          <strong>{filteredGroups.length}</strong>
          <span>
            {filteredGroups.length === 1
              ? " group"
              : " groups"}
          </span>
        </div>

        <span>
          Total groups: {groups.length}
        </span>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="admin-empty-groups">
          <div className="admin-empty-icon">
            <Users size={28} />
          </div>

          <h2>
            {groups.length === 0
              ? "No groups yet"
              : "No groups found"}
          </h2>

          <p>
            {groups.length === 0
              ? "Create your first campus group to get started."
              : "Try changing your search or category filter."}
          </p>

          {groups.length === 0 && (
            <Link
              to="/admin/groups/add"
              className="admin-add-group-button"
            >
              <Plus size={18} />
              Create First Group
            </Link>
          )}
        </div>
      ) : (
        <div className="admin-groups-grid">
          {filteredGroups.map((group) => (
            <div
              className="admin-group-card"
              key={group.id}
            >
              <div className="admin-group-image">
                {group.image ? (
                  <img
                    src={group.image}
                    alt={group.name}
                  />
                ) : (
                  <div className="admin-group-image-placeholder">
                    <Users size={34} />
                  </div>
                )}

                <span className="admin-group-privacy">
                  {group.privacy === "Private" ? (
                    <>
                      <Lock size={13} />
                      Private
                    </>
                  ) : (
                    <>
                      <Globe size={13} />
                      Public
                    </>
                  )}
                </span>
              </div>

              <div className="admin-group-card-body">
                <div className="admin-group-category">
                  {group.category || "General"}
                </div>

                <h2>{group.name}</h2>

                <p className="admin-group-description">
                  {group.description ||
                    "No description available."}
                </p>

                <div className="admin-group-meta">
                  <span>
                    <Users size={15} />
                    {group.members || 0} members
                  </span>

                  {group.department && (
                    <span>
                      {group.department}
                    </span>
                  )}
                </div>

                <div className="admin-group-actions">
                  <Link
                    to={`/admin/groups/edit/${group.id}`}
                    className="admin-edit-button"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() =>
                      handleDelete(group.id)
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageGroups;
