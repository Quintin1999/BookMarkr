import React from "react";
import { submitSignupForm } from "../scripts";
import styles from "../styles/login.module.css";

const SignupPage: React.FC = () => {
  return (
    <main className={`${styles.formPage} container`}>
      <div className={`${styles.formContainer}`}>
        <form onSubmit={submitSignupForm} className={styles.loginForm}>
          <h1>Sign Up</h1>

          <label htmlFor="username">
            Username
            <input type="text" name="username" id="username" required />
          </label>

          <label htmlFor="email">
            Email
            <input type="email" name="email" id="email" required />
          </label>

          <label htmlFor="password">
            Password
            <input type="password" name="password" id="password" required />
          </label>

          <button type="submit">Sign Up</button>
        </form>

        <img className={styles.bookImage} src="/images/book-vector.svg" />
      </div>
    </main>
  );
};

export default SignupPage;
