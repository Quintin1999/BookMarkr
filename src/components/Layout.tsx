import React from "react";
import FreshNavbar from "./FreshNavbar";
import Footer from "./footer/Footer";
import "../styles/styles.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <FreshNavbar />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
