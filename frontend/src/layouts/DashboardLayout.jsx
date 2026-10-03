import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="app">

      <Sidebar />

      <Navbar />

      <main className="page-content">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;