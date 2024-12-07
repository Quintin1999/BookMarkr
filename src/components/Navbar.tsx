import React from "react";
import { Link } from "react-router-dom";

// Utility function to check if the user is logged in
const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("jwtToken");
  return !!token; // Returns true if the token exists
};

const Navbar: React.FC = () => {
  const loggedIn = isLoggedIn(); // Determine login state

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/home">
          <img
            src="/images/Bookmarkr_Logo.png"
            alt="Bookmarkr Logo"
            className="navbar-logo-image"
          />
          <span className="navbar-logo-text">Bookmarkr</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        {loggedIn ? (
          <>
            {/* Links for Logged-in Users */}
            <Link to="/personal-library" className="navbar-link">
              Personal Library
            </Link>
            <Link to="/book-clubs" className="navbar-link">
              Book Clubs
            </Link>
          </>
        ) : (
          <>
            {/* Links for Logged-out Users */}
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-link navbar-signup-button">
              Signup
            </Link>
          </>
        )}
      </div>

      {/* User Info (Optional, Only for Logged-in Users) */}
      {loggedIn && (
        <div className="navbar-user">
          <span className="navbar-username">Username</span>
          <img
            src="/images/user-icon.png"
            alt="User Icon"
            className="navbar-user-icon"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
