import { Search } from 'lucide-react';

import './SearchBar.css';

function SearchBar({ placeholder = 'Search destinations...' }) {
  return (
    <div className="large-search">
      <Search size={20} />

      <input
        type="text"
        placeholder={placeholder}
      />

      <button>Search</button>
    </div>
  );
}

export default SearchBar;