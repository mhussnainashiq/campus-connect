
import {
  Mail,
  Pencil,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  const {
    currentUser,
    updateUser,
    loading,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    bio: "",
    interests: [],
  });

  const [interestInput, setInterestInput] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  /*
   * IMPORTANT:
   * Whenever currentUser changes, update the profile form.
   *
   * This prevents the previous user's information
   * from remaining in the form after logout/login.
   */
  useEffect(() => {
    if (!currentUser) {
      setFormData({
        name: "",
        email: "",
        department: "",
        bio: "",
        interests: [],
      });

      setEditing(false);
      setInterestInput("");
      setMessage("");

      return;
    }

    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      department: currentUser.department || "",
      bio: currentUser.bio || "",
      interests: Array.isArray(currentUser.interests)
        ? currentUser.interests
        : [],
    });

    setEditing(false);
    setInterestInput("");
    setMessage("");
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddInterest = () => {
    const interest = interestInput.trim();

    if (!interest) {
      return;
    }

    if (
      formData.interests.some(
        (item) =>
          item.toLowerCase() ===
          interest.toLowerCase()
      )
    ) {
      setInterestInput("");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      interests: [
        ...previous.interests,
        interest,
      ],
    }));

    setInterestInput("");
  };

  const handleRemoveInterest = (
    interestToRemove
  ) => {
    setFormData((previous) => ({
      ...previous,
      interests:
        previous.interests.filter(
          (interest) =>
            interest !== interestToRemove
        ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = updateUser({
      name: formData.name.trim(),
      department:
        formData.department.trim(),
      bio: formData.bio.trim(),
      interests: formData.interests,
    });

    if (result.success) {
      setMessage(
        "Profile updated successfully."
      );

      setEditing(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  /*
   * Wait until authentication has finished loading.
   */
  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <h1>Loading profile...</h1>
          <p>
            Please wait while we load your account.
          </p>
        </div>
      </main>
    );
  }

  /*
   * No logged-in user.
   */
  if (!currentUser) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <h1>Please log in</h1>

          <p>
            You need to be logged in to view
            your profile.
          </p>

          <Button
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              <UserRound size={38} />
            </div>

            <div>
              <span className="profile-label">
                {currentUser.role === "admin"
                  ? "Administrator profile"
                  : "Student profile"}
              </span>

              <h1>
                {currentUser.name}
              </h1>

              <p>
                <Mail size={16} />
                {currentUser.email}
              </p>
            </div>
          </div>

          <Button
            variant={
              editing
                ? "secondary"
                : "primary"
            }
            onClick={() => {
              setEditing(!editing);
              setMessage("");
            }}
          >
            <Pencil size={17} />

            {editing
              ? "Cancel"
              : "Edit profile"}
          </Button>
        </div>

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        <form
          className="profile-content"
          onSubmit={handleSubmit}
        >
          <section className="profile-card">
            <div className="profile-card-header">
              <div>
                <span className="section-label">
                  Personal information
                </span>

                <h2>About you</h2>

                <p>
                  Keep your profile up to
                  date.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="profile-name">
                  Full name
                </label>

                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-email">
                  Email address
                </label>

                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-department">
                  Department
                </label>

                <input
                  id="profile-department"
                  name="department"
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={
                    formData.department
                  }
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="form-group profile-full-width">
                <label htmlFor="profile-bio">
                  Bio
                </label>

                <textarea
                  id="profile-bio"
                  name="bio"
                  rows="5"
                  placeholder="Tell other students a little about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-card-header">
              <div>
                <span className="section-label">
                  Interests
                </span>

                <h2>Your interests</h2>

                <p>
                  Add interests to help other
                  students discover you.
                </p>
              </div>
            </div>

            <div className="interest-list">
              {formData.interests.length >
              0 ? (
                formData.interests.map(
                  (interest) => (
                    <span
                      className="interest-tag"
                      key={interest}
                    >
                      {interest}

                      {editing && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveInterest(
                              interest
                            )
                          }
                          aria-label={`Remove ${interest}`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  )
                )
              ) : (
                <p className="empty-interests">
                  No interests added yet.
                </p>
              )}
            </div>

            {editing && (
              <div className="interest-input-row">
                <input
                  type="text"
                  placeholder="e.g. Web Development"
                  value={
                    interestInput
                  }
                  onChange={(event) =>
                    setInterestInput(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      event.preventDefault();
                      handleAddInterest();
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="secondary"
                  onClick={
                    handleAddInterest
                  }
                >
                  Add
                </Button>
              </div>
            )}
          </section>

          {editing && (
            <div className="profile-save-area">
              <Button
                type="submit"
                size="large"
              >
                <Save size={18} />
                Save changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default Profile;