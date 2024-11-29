import React from 'react';
import '../styles/styles.css';


const Navbar: React.FC = () =>{
    return (
        <nav className="navbar">
            <div className="logo">Bookmarkr</div>
            <div className="nav-links">
                <a href="/login" className="nav-link">Login</a>
                <a href="/signup" className="nav-link button:">Signup</a>
            </div>
        </nav>
    );
};

export default Navbar;