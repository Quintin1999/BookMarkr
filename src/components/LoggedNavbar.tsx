import React from 'react';

interface LoggedNavbarProps {
  username: string;
  profileImageUrl: string; // New prop for dynamic profile image
}

const LoggedNavbar: React.FC<LoggedNavbarProps> = ({ username, profileImageUrl }) => {
  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <a href="/home">
          <img src="public/images/Bookmarkr_Logo.png" alt="Bookmarkr Logo" />
          Bookmarkr
        </a>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <a href="/personal-library" className="nav-link">Personal Library</a>
        <a href="/book-clubs" className="nav-link">Book Clubs</a>
      </div>

      {/* User Section */}
      <div className="navbar-user">
        <span className="nav-link username">{username}</span>
        <div className="profile-icon">
          <img src={profileImageUrl} alt={`${username}'s Profile`} />
        </div>
      </div>
    </nav>
  );
};

export default LoggedNavbar;
