import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./styles.css";

const Layout: React.FC<{children: React.ReactNode }> = ({children})=>{
    return(
        <div className="layout">
            <Navbar/>
            <main className="content">{children}</main>
            <Footer/>
        </div>
    );
};

export default Layout;