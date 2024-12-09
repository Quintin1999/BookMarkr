import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";

const SignupPage: React.FC = () => {
  const navigate = useNavigate(); // Hook to handle navigation

  const submitSignupForm = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault(); // Prevent the default form submission

    // Get input elements and their values
    const usernameInput = document.getElementById(
      "username"
    ) as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    // Ensure inputs are valid before proceeding
    if (!usernameInput || !emailInput || !passwordInput) {
      console.error("Form inputs not found");
      alert("Please fill out all required fields.");
      return;
    }

    const username: string = usernameInput.value;
    const email: string = emailInput.value;
    const password: string = passwordInput.value;

    try {
      // Replace with your actual API URL
      const apiUrl = "http://localhost:3000/api";

      // Send a POST request to create the user
      const response = await fetch(`${apiUrl}/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const result: { success?: boolean; message?: string } =
        await response.json();

      if (response.ok) {
        alert("User created successfully!");
        console.log("Signup successful:", result);
        navigate("/home"); // Navigate to the home page
      } else {
        alert("Signup failed: " + (result.message || "Unknown error"));
        console.error("Signup failed:", result);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Error during signup");
    }
  };

  return (
    <main className={`${styles.formPage} container`}>
      <div className={`${styles.formContainer}`}>
        <form onSubmit={submitSignupForm} className={styles.loginForm}>
          <h1>Sign Up</h1>

          <label htmlFor="username" className={styles.inputLabel}>
            Username
            <input
              type="text"
              name="username"
              id="username"
              required
              className={styles.inputField}
            />
          </label>

          <label htmlFor="email" className={styles.inputLabel}>
            Email
            <input
              type="email"
              name="email"
              id="email"
              required
              className={styles.inputField}
            />
          </label>

          <label htmlFor="password" className={styles.inputLabel}>
            Password
            <input
              type="password"
              name="password"
              id="password"
              required
              className={styles.inputField}
            />
          </label>

          <button type="submit" className={styles.submitButton}>
            Sign Up
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

export default SignupPage;
