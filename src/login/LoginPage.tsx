import React from 'react';
import { submitLoginForm} from '../scripts';

const LoginPage: React.FC = () => {
  return (
    <form onSubmit={submitLoginForm}>
      <label htmlFor="loginEmail">Email:</label>
      <input type="email" id="loginEmail" required />

      <label htmlFor="loginPassword">Password:</label>
      <input type="password" id="loginPassword" required />

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
