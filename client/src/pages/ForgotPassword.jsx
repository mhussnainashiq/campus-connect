import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

function ForgotPassword() {
  return (
    <main className="auth-page">
      <div className="auth-container auth-container-single">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-logo">
              <KeyRound size={21} />
            </div>

            <h2>Forgot password?</h2>

            <p>
              Enter your email address and we'll help you reset your
              password.
            </p>
          </div>

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="forgot-email">Email address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <Button type="submit" size="large">
              Send reset link
            </Button>
          </form>

          <div className="auth-back-link">
            <Link to="/login">
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;