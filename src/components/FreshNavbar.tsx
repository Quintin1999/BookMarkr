import React from 'react';
import '../styles/styles.css';


const FreshNavbar: React.FC = () =>{
    return (
        <nav className="navbar">
            {/* Logo Section */}
            <div className="logo">
                <a href="/home">
                    <img src="public/images/Bookmarkr_Logo.png" alt="Bookmarkr Logo"/>
                    Bookmarkr
                </a>   
            </div>
            {/* Navigation Links */}
            <div className="navbar-links">
                <a href="/login" className="nav-link">Login</a>
                <a href="/signup" className="nav-link button:">Signup</a>
            </div>
        </nav>
    );
};

export default FreshNavbar;