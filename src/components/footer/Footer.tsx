import React from "react";
import styles from "./footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={`${styles.footer} container`}>
      <nav className={`${styles.footerLinks}`}>
        <a href="/contact">Contact Us</a>
        <p>Copyright © Bookmarkr 2024</p>
        <a href="/terms">Terms of Service</a>
      </nav>
    </footer>
  );
};

export default Footer;
