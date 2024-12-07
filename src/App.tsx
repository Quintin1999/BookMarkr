import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./login/LoginPage.tsx";
import SignupPage from "./signup/SignupPage.tsx";
import "./styles/styles.css";
import "./styles/styles.colors.css";
import Navbar from "./components/navbar/Navbar.tsx";
import Footer from "./components/footer/Footer.tsx";
import HomePage from "./home/HomePage.tsx";
import PersonalBook from "./persbook/PersonalBook.tsx";
import PersonalLibraryPage from "./perslib/PersonalLibrary.tsx";
import Debug from "./debug/Debug.tsx";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* route for login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* route for signup page */}
        <Route path="/signup" element={<SignupPage />} />

        {/*route for home page, left here to keep debugging, remove at later date */}
        <Route path="/home" element={<HomePage />} />

        {/*route for personal book page*/}
        <Route path="/books/:id" element={<PersonalBook />} />

        {/*route for personal library page*/}
        <Route path="/personal-library" element={<PersonalLibraryPage />} />

        {/*route for debug page*/}
        <Route path="/debug" element={<Debug />} />

        {/* default page*/}
        <Route
          path="/"
          element={
            <div>
              <h1>Home Page</h1>
              <p>
                Go to <a href="/login">Login</a> or <a href="/signup">Signup</a>
              </p>
            </div>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
