import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

// Utility function to check if the user is logged in
const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("jwtToken");
  return !!token; // Returns true if the token exists
};

const Navbar: React.FC = () => {
  const loggedIn = isLoggedIn(); // Determine login state

  return (
    <div className="container">
      <nav className={`${styles.navbar}`}>
        {/* Logo Section */}
        <Link to="/home" className={`${styles.navLogo}`}>
          <img
            src="/images/Bookmarkr-Logo.svg"
            alt="Bookmarkr Logo"
            className="navbar-logo-image"
          />
          <p className="navbar-logo-text">Bookmarkr</p>
        </Link>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
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
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* User Info (Optional, Only for Logged-in Users) */}
        {loggedIn && (
          <div className={styles.user}>
            <span className="navbar-username">Username</span>
            <img
              src="/images/user-icon.png"
              alt="User Icon"
              className="navbar-user-icon"
            />
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
