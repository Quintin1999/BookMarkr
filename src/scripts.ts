const apiUrl: string = "http://localhost:3000/api"; // Base API URL
import { FormEvent } from "react";

// Function to get the JWT token
export async function getAuthToken(): Promise<string> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("You must be logged in.");
    throw new Error("No JWT token found.");
  }
  return token;
}

// Function to handle login form submission
export async function submitLoginForm(event: FormEvent<HTMLFormElement>): Promise<void> {
  event.preventDefault(); // Prevent the default form submission behavior

  // Access DOM elements and cast them to HTMLInputElement
  const emailInput = document.getElementById("loginEmail") as HTMLInputElement;
  const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;

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

    const result: { token?: string; message?: string } = await response.json();

    if (response.ok && result.token) {
      localStorage.setItem("jwtToken", result.token); // Store the token
      alert("Login successful");
      console.log("Login Successful");
    } else {
      alert("Login failed: " + (result.message || "Unknown error"));
      console.log("Login Unsuccessful");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Error during login");
  }
}