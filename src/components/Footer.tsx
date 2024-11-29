import React from "react";
import "./styles.css";

const Footer: React.FC=()=>{
    return(
        <footer className="footer">
            <div className="footer-links">
                <a href="/contact">Contact Us</a>
                <span>Copyright © Bookmarkr 2024</span>
                <a href="/terms">Terms of Service</a>
            </div>
        </footer>
    );
};

export default Footer;
