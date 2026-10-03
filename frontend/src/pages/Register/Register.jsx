import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import {
  Link,
  useNavigate
} from "react-router-dom";
import {
  GoogleLogin
} from "@react-oauth/google";

import "./Register.css";


function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ============================================
  // NORMAL REGISTRATION
  // ============================================

  const handleRegister = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Registration failed"
        );

      }


      // Save login information
      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

      }


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
        "Registration error:",
        error
      );

      setError(
        error.message ||
        "Unable to create account"
      );

    } finally {

      setLoading(false);

    }

  };


  // ============================================
  // GOOGLE REGISTRATION / LOGIN
  // ============================================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
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


      const data = await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Google registration failed"
        );

      }


      localStorage.setItem(
        "token",
        data.token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Google registration error:",
        error
      );

      setError(
        error.message ||
        "Google registration failed"
      );

    } finally {

      setLoading(false);

    }

  };


  const handleGoogleError = () => {

    setError(
      "Google authentication failed. Please try again."
    );

  };


  return (

    <div className="register-page">

      <div className="register-card">

        {/* =====================================
            LOGO
        ===================================== */}

        <div className="register-logo">
          ✈️ IndiaGuide
        </div>


        {/* =====================================
            HEADING
        ===================================== */}

        <div className="register-heading">

          <span>
            START YOUR JOURNEY
          </span>

          <h1>
            Create your account
          </h1>

          <p>
            Build trips, save destinations
            and explore India.
          </p>

        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (

          <div
            className="register-error"
            style={{
              marginBottom: "15px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "rgba(255, 70, 70, 0.1)",
              color: "#ff6b6b",
              fontSize: "14px"
            }}
          >
            {error}
          </div>

        )}


        {/* =====================================
            REGISTRATION FORM
        ===================================== */}

        <form onSubmit={handleRegister}>

          {/* NAME */}

          <div className="auth-form-group">

            <label>
              Full name
            </label>

            <div className="auth-input">

              <User size={17} />

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>

          </div>


          {/* EMAIL */}

          <div className="auth-form-group">

            <label>
              Email
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
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="auth-form-group">

            <label>
              Password
            </label>

            <div className="auth-input">

              <Lock size={17} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={6}
              />

              <button
                type="button"
                className="password-toggle"
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


          {/* REGISTER BUTTON */}

          <button
            className="register-submit"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>

        </form>


        {/* =====================================
            DIVIDER
        ===================================== */}

        <div className="auth-divider">

          <span>
            OR
          </span>

        </div>


        {/* =====================================
            GOOGLE
        ===================================== */}

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

            text="signup_with"

          />

        </div>


        {/* =====================================
            LOGIN LINK
        ===================================== */}

        <p className="register-login">

          Already have an account?{" "}

          <Link to="/login">
            Sign in
          </Link>

        </p>

      </div>

    </div>

  );

}


export default Register;