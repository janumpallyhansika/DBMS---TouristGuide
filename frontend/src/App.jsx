import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Authentication Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// Main Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import ExploreIndia from "./pages/ExploreIndia/ExploreIndia";
import StateDetails from "./pages/StateDetails/StateDetails";
import DestinationDetails from "./pages/DestinationDetails/DestinationDetails";
import PlanTrip from "./pages/PlanTrip/PlanTrip";
import CustomizeTrip from "./pages/CustomizeTrip/CustomizeTrip";
import TripResult from "./pages/TripResult/TripResult";
import AIChat from "./pages/AIChat/AIChat";
import MyTrips from "./pages/MyTrips/MyTrips";
import SavedPlaces from "./pages/SavedPlaces/SavedPlaces";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <Routes>

      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}

      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Route>


      {/* =====================================================
          MAIN APPLICATION
      ===================================================== */}

      <Route element={<DashboardLayout />}>

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* Explore India */}
        <Route
          path="/explore"
          element={<ExploreIndia />}
        />


        {/* Individual State */}
        <Route
          path="/state/:stateId"
          element={<StateDetails />}
        />


        {/* Individual Destination */}
        <Route
          path="/destination/:destinationId"
          element={<DestinationDetails />}
        />


        {/* AI Trip Planner */}
        <Route
          path="/plan-trip"
          element={<PlanTrip />}
        />


        {/* Customize Trip */}
        <Route
          path="/customize-trip"
          element={<CustomizeTrip />}
        />


        {/* Generated Trip */}
        <Route
          path="/trip/:tripId"
          element={<TripResult />}
        />


        {/* AI Assistant */}
        <Route
          path="/ai-assistant"
          element={<AIChat />}
        />


        {/* My Trips */}
        <Route
          path="/my-trips"
          element={<MyTrips />}
        />


        {/* Saved Places */}
        <Route
          path="/saved-places"
          element={<SavedPlaces />}
        />


        {/* Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>


      {/* =====================================================
          DEFAULT ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/explore"
            replace
          />
        }
      />


      <Route
        path="*"
        element={
          <Navigate
            to="/explore"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;