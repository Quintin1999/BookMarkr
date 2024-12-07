import React from "react";
import { submitLoginForm } from "../scripts";
import styles from "./login.module.css";

const LoginPage: React.FC = () => {
  return (
    <main className={`${styles.formPage} container`}>
      <div className={`${styles.formContainer}`}>
        <form onSubmit={submitLoginForm} className={styles.loginForm}>
          <h1>Login</h1>

          <label htmlFor="loginEmail" className={styles.inputLabel}>
            Email:
            <input
              type="email"
              id="loginEmail"
              required
              className={styles.inputField}
            />
          </label>

          <label htmlFor="loginPassword" className={styles.inputLabel}>
            Password:
            <input
              type="password"
              id="loginPassword"
              required
              className={styles.inputField}
            />
          </label>

          <button type="submit">Login</button>
        </form>

        <img className={styles.bookImage} src="/images/book-vector.svg" />
      </div>
    </main>
  );
};

export default LoginPage;
