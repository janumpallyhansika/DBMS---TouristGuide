import {
  Bell,
  Search,
  Menu,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="mobile-menu">
        <Menu size={21} />
      </div>

      <div className="navbar-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search destinations, cities, places..."
        />
      </div>

      <div className="navbar-actions">
        <button className="notification-button">
          <Bell size={19} />
          <span>3</span>
        </button>

        <button
          className="profile-mini"
          onClick={() => navigate('/profile')}
        >
          <div className="avatar">H</div>

          <div className="profile-mini-info">
            <strong>Hansika</strong>
            <small>Traveler</small>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Navbar;