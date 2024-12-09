import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./login/LoginPage.tsx";
import SignupPage from "./signup/SignupPage.tsx";
import "./styles/styles.css";
import "./styles/styles.colors.css";
import "./styles/styles.components.css";
import Navbar from "./components/navbar/Navbar.tsx";
import Footer from "./components/footer/Footer.tsx";
import HomePage from "./home/HomePage.tsx";
import PersonalBook from "./persbook/PersonalBook.tsx";
import PersonalLibraryPage from "./perslib/PersonalLibrary.tsx";
import ClubLibrary from "./clublib/ClubLibrary.tsx";
import ClubBook from "./clubbook/ClubBook.tsx";

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

        {/*route for club library*/}
        <Route path="/club-library/:clubId" element={<ClubLibrary />} />

        {/*route for club books*/}
        <Route path="/club-book/:bookId" element={<ClubBook />} />

        {/* default page*/}
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
