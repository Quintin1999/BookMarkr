import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './login/LoginPage.tsx';
import SignupPage from './signup/SignupPage.tsx';
import './styles/styles.css';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx'

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* route for login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* route for signup page */}
        <Route path="/signup" element={<SignupPage />} />

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
      <Footer/>
    </>
  );

};


export default App;