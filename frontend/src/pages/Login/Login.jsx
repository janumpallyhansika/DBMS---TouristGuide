import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock
} from "lucide-react";
import {
  Link,
  useNavigate
} from "react-router-dom";
import {
  GoogleLogin
} from "@react-oauth/google";

import "./Login.css";

// Backend URL
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";


function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ============================================
  // NORMAL EMAIL + PASSWORD LOGIN
  // ============================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      );

      // Read response safely
      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Backend returned non-JSON response:",
          text
        );

        throw new Error(
          `Backend returned an invalid response (${response.status}). Make sure the backend is running on ${API_URL}.`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save token
      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      // Save user
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to the backend."
      );

    } finally {
      setLoading(false);
    }
  };


  // ============================================
  // GOOGLE LOGIN
  // ============================================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    setError("");
    setLoading(true);

    try {
      if (
        !credentialResponse ||
        !credentialResponse.credential
      ) {
        throw new Error(
          "Google did not return a login credential."
        );
      }

      const response = await fetch(
        `${API_URL}/api/auth/google`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            credential:
              credentialResponse.credential
          })
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Google login backend returned non-JSON:",
          text
        );

        throw new Error(
          `Google login backend returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Google login failed"
        );
      }

      // Save token
      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      // Save user
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      setError(
        error.message ||
        "Google login failed."
      );

    } finally {
      setLoading(false);
    }
  };


  // ============================================
  // GOOGLE LOGIN ERROR
  // ============================================

  const handleGoogleError = () => {
    setError(
      "Google authentication failed. Please try again."
    );
  };


  // ============================================
  // UI
  // ============================================

  return (
    <div className="login-page">

      {/* LEFT VISUAL SECTION */}

      <div className="login-visual">

        <div className="login-overlay"></div>

        <div className="login-visual-content">

          <div className="login-logo">
            ✈️ IndiaGuide
          </div>

          <div>

            <span className="login-eyebrow">
              YOUR JOURNEY STARTS HERE
            </span>

            <h1>
              Explore India.
              <br />

              <span>
                Discover yourself.
              </span>
            </h1>

            <p>
              Plan unforgettable journeys across
              India's cities, beaches, mountains
              and heritage sites.
            </p>

          </div>

          <div className="login-stats">

            <div>
              <strong>28+</strong>
              <span>States & UTs</span>
            </div>

            <div>
              <strong>1000+</strong>
              <span>Places</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Travel Guide</span>
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT LOGIN SECTION */}

      <div className="login-form-section">

        <div className="login-form-container">

          <div className="mobile-login-logo">
            ✈️ IndiaGuide
          </div>


          <div className="login-heading">

            <span>
              WELCOME BACK
            </span>

            <h2>
              Let's continue your journey.
            </h2>

            <p>
              Sign in to access your trips
              and travel plans.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div
              className="login-error"
              style={{
                marginBottom: "15px",
                padding: "10px 12px",
                borderRadius: "8px",
                background:
                  "rgba(255, 70, 70, 0.1)",
                color: "#ff6b6b",
                fontSize: "14px",
                lineHeight: "1.5"
              }}
            >
              {error}
            </div>
          )}


          {/* EMAIL + PASSWORD */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="auth-form-group">

              <label>
                Email address
              </label>

              <div className="auth-input">

                <Mail size={17} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="auth-form-group">

              <div className="password-label">

                <label>
                  Password
                </label>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    alert(
                      "Password reset will be connected next."
                    );
                  }}
                >
                  Forgot password?
                </button>

              </div>


              <div className="auth-input">

                <Lock size={17} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  disabled={loading}
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>


            {/* SIGN IN */}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>


          {/* DIVIDER */}

          <div className="auth-divider">
            <span>
              OR CONTINUE WITH
            </span>
          </div>


          {/* GOOGLE LOGIN */}

          <div
            className="google-login-container"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center"
            }}
          >

            <GoogleLogin
              onSuccess={
                handleGoogleSuccess
              }
              onError={
                handleGoogleError
              }
              useOneTap={false}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
            />

          </div>


          {/* REGISTER */}

          <p className="register-text">

            Don't have an account?{" "}

            <Link to="/register">
              Create one
            </Link>

          </p>


          <p className="login-footer">

            By continuing, you agree to our
            Terms and Privacy Policy.

          </p>

        </div>

      </div>

    </div>
  );
}


export default Login;