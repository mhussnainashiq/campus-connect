import {
  ArrowRight,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    navigate("/");
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-info">
          <span className="auth-eyebrow">
            <span></span>
            Join Campus Connect
          </span>

          <h1>
            Build your
            <span> campus community.</span>
          </h1>

          <p>
            Create your account to discover students, join study
            groups, explore campus events, and connect with your
            college community.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <div className="auth-feature-icon">
                <UserRound size={19} />
              </div>

              <div>
                <strong>Connect with students</strong>

                <p>
                  Find classmates and students with similar interests.
                </p>
              </div>
            </div>

            <div className="auth-feature">
              <div className="auth-feature-icon">
                <ArrowRight size={19} />
              </div>

              <div>
                <strong>Discover campus life</strong>

                <p>
                  Explore groups, events, activities, and opportunities.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="auth-card">

          <div className="auth-card-header">
            <div className="auth-logo">C</div>

            <h2>Create account</h2>

            <p>
              Create your student account to get started.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label htmlFor="name">
                Full name
              </label>

              <div className="input-wrapper">
                <UserRound size={18} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Muhammad Husnain"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="large"
              loading={loading}
            >
              Create account
            </Button>

          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default Register;