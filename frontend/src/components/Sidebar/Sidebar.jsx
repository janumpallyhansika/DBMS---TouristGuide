import {
  Home,
  Map,
  Compass,
  Target,
  Bot,
  MapPinned,
  Heart,
  BookOpen,
  Settings,
  Plane,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

import './Sidebar.css';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Home,
  },
  {
    label: 'Explore India',
    path: '/explore',
    icon: Compass,
  },
  {
    label: 'Plan My Trip',
    path: '/plan-trip',
    icon: Map,
  },
  {
    label: 'Customize Trip',
    path: '/customize-trip',
    icon: Target,
  },
  {
    label: 'AI Travel Assistant',
    path: '/ai-assistant',
    icon: Bot,
  },
  {
    label: 'My Trips',
    path: '/my-trips',
    icon: MapPinned,
  },
  {
    label: 'Saved Places',
    path: '/saved-places',
    icon: Heart,
  },
  {
    label: 'Travel Guides',
    path: '/explore',
    icon: BookOpen,
  },
  {
    label: 'Settings',
    path: '/profile',
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Plane size={20} />
        </div>

        <span>India<span className="logo-accent">Guide</span></span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-promo">
        <div className="promo-icon">✨</div>

        <h4>Discover India</h4>

        <p>
          Plan your next adventure with our smart travel assistant.
        </p>

        <NavLink to="/plan-trip">
          Start Planning
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;