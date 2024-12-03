import React from "react";
import { submitSignupForm } from "../scripts";

const SignupPage: React.FC = () => {
  return (
    <form onSubmit={submitSignupForm}>
      <h2>Create User</h2>

      <label htmlFor="username">Username:</label>
      <input type="text" name="username" id="username" required />
      <br />

      <label htmlFor="email">Email:</label>
      <input type="email" name="email" id="email" required />
      <br />

      <label htmlFor="password">Password:</label>
      <input type="password" name="password" id="password" required />
      <br />

      <button type="submit">Create User</button>
    </form>
  );
};

export default SignupPage;
