import {
  User,
  Mail,
  MapPin,
  Shield,
  LogOut,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./Profile.css";


function Profile() {

  const navigate = useNavigate();


  const [user, setUser] =
    useState(null);


  /* =========================================
     LOAD USER
  ========================================= */

  useEffect(() => {

    try {

      const storedUser =
        localStorage.getItem("user");


      if (storedUser) {

        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);

      }

    } catch (error) {

      console.error(
        "Unable to load user:",
        error
      );

    }

  }, []);


  /* =========================================
     USER DETAILS
  ========================================= */

  const userName =
    user?.name ||
    user?.username ||
    "Traveler";


  const userEmail =
    user?.email ||
    "Not available";


  const userLocation =
    user?.startingLocation ||
    user?.location ||
    "India";


  const authProvider =
    user?.auth_provider ||
    user?.authProvider ||
    "Email";


  const avatarLetter =
    userName
      .charAt(0)
      .toUpperCase();


  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  /* =========================================
     RENDER
  ========================================= */

  return (

    <div className="page-inner profile-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="profile-heading">

        <span>
          ACCOUNT
        </span>


        <h1>
          Profile & Settings
        </h1>


        <p>
          Manage your account and travel preferences.
        </p>

      </div>


      {/* =====================================
          PROFILE LAYOUT
      ===================================== */}

      <div className="profile-layout">


        {/* ===================================
            PROFILE CARD
        =================================== */}

        <div className="profile-card card">


          <div className="large-avatar">

            {avatarLetter}

          </div>


          <h2>
            {userName}
          </h2>


          <p>
            Traveler
          </p>


          <button
            className="secondary-button"
            onClick={() => {
              alert(
                "Profile editing will be added next."
              );
            }}
          >

            Edit Profile

          </button>


          <button
            className="secondary-button"
            onClick={handleLogout}
            style={{
              marginTop: "10px",
            }}
          >

            <LogOut size={16} />

            Logout

          </button>

        </div>


        {/* ===================================
            SETTINGS
        =================================== */}

        <div className="settings-card card">


          <h3>
            Personal Information
          </h3>


          {/* NAME */}

          <div className="profile-field">

            <User size={17} />

            <div>

              <span>
                Name
              </span>


              <strong>
                {userName}
              </strong>

            </div>

          </div>


          {/* EMAIL */}

          <div className="profile-field">

            <Mail size={17} />

            <div>

              <span>
                Email
              </span>


              <strong>
                {userEmail}
              </strong>

            </div>

          </div>


          {/* LOCATION */}

          <div className="profile-field">

            <MapPin size={17} />

            <div>

              <span>
                Starting Location
              </span>


              <strong>
                {userLocation}
              </strong>

            </div>

          </div>


          {/* AUTHENTICATION */}

          <div className="profile-field">

            <Shield size={17} />

            <div>

              <span>
                Authentication
              </span>


              <strong>
                {authProvider}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}


export default Profile;