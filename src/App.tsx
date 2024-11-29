import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import LoginPage from './login/LoginPage.tsx';
import SignupPage from './signup/SignupPage.tsx';
import './styles/styles.css'; 

const App: React.FC = () => {

  return (

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
              <h1>404 - Page Not Found</h1>
              <p>
                Go to <a href="/login">Login</a> or <a href="/signup">Signup</a>
              </p>
            </div>
          }
        />
      </Routes>

  );
  
};


export default App;
