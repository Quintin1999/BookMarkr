import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const submitLoginForm = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Access DOM elements and cast them to HTMLInputElement
    const emailInput = document.getElementById(
      "loginEmail"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "loginPassword"
    ) as HTMLInputElement;

    // Ensure inputs are valid before proceeding
    if (!emailInput || !passwordInput) {
      console.error("Form inputs not found");
      alert("Form inputs are missing.");
      return;
    }

    const email: string = emailInput.value;
    const password: string = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result: { token?: string; message?: string } =
        await response.json();

      if (response.ok && result.token) {
        localStorage.setItem("jwtToken", result.token); // Store the token
        navigate("/home");
        console.log("Login Successful");
      } else {
        alert("Login failed: " + (result.message || "Unknown error"));
        console.log("Login Unsuccessful");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error during login");
    }
  };

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

          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>

        <img
          className={styles.bookImage}
          src="/images/book-vector.svg"
          alt="Book"
        />
      </div>
    </main>
  );
};

export default LoginPage;
