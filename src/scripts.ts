const apiUrl: string = "http://localhost:3000/api"; // Base API URL
import { FormEvent } from "react";
import { BookCardProps } from "./components/bookCard/BookCard";

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

//function to handle signup form submission
export async function submitSignupForm(event: FormEvent<HTMLFormElement>): Promise<void> {
  event.preventDefault(); // Prevent the default form submission

  // Get input elements and their values
  const usernameInput = document.getElementById("username") as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;

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
    // Send a POST request to create the user
    const response = await fetch(`${apiUrl}/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const result: { success?: boolean; message?: string } = await response.json();

    if (response.ok) {
      alert("User created successfully!");
      console.log("Signup successful:", result);
    } else {
      alert("Signup failed: " + (result.message || "Unknown error"));
      console.error("Signup failed:", result);
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("Error during signup");
  }
}

//google books json foramt
interface GoogleBooksResponse {
  items: {
    id: string;
    volumeInfo: {
      title?: string;
      authors?: string[];
      publishedDate?: string;
      imageLinks?: {
        thumbnail?: string;
      };
    };
  }[];
}


// Function to search Google Books and handle UI updates
export async function searchBooks(query: string): Promise<BookCardProps[]> {
  if (!query.trim()) {
    alert("Please enter a search term.");
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    );

    const data: GoogleBooksResponse = await response.json();

    if (data.items && data.items.length > 0) {
      // Map raw API data to BookCardProps
      return data.items.map((book) => {
        const id=book.id;
        const title = book.volumeInfo.title || "Unknown Title";
        const author = book.volumeInfo.authors?.join(", ") || "Unknown Author";
        const year = book.volumeInfo.publishedDate
          ? new Date(book.volumeInfo.publishedDate).getFullYear()
          : 1970; // Default year if none provided
        const thumbnail = book.volumeInfo.imageLinks?.thumbnail || "/public/images/nobook.png";

        return {
          id,
          title,
          author,
          year,
          thumbnail, // Add thumbnail to props
          onAdd: () => console.log(`Adding ${title} to personal library.`),
        };
      });
    } else {
      alert("No results found.");
      return [];
    }
  } catch (error) {
    console.error("Error searching Google Books:", error);
    alert("Error searching books.");
    return [];
  }
}




interface ApiResponse {
  success?: boolean;
  message?: string;
  [key: string]: any; // Optional: For any additional data in the response
}

export async function addBookToPersonalLibrary(bookId: string): Promise<void> {
  console.log("Adding to personal library. Book ID:", bookId);

  const token = getAuthToken(); // Assuming getAuthToken is defined elsewhere and returns a string or null
  if (!token) {
    alert("You must be logged in to add books.");
    return;
  }

  interface AddBookPayload {
    googleId: string;
    targetType: string;
  }
  const payload: AddBookPayload = { googleId: bookId, targetType: "user" };

  try {
    const response = await fetch("http://localhost:3000/api/books/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse = await response.json();
    console.log("API Response for personal library:", result); // Debugging

    if (response.ok) {
      alert("Book added to personal library successfully!");
    } else {
      console.error("Error adding book to personal library:", result.message);
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error adding book to personal library:", error);
    alert("Error adding book to personal library.");
  }
}

async function addBookToClubLibrary(bookId:string, clubId:string) {
  console.log(
    "Adding to club library. Book ID:",
    bookId,
    "Club ID:",
    clubId
  );

  const token = getAuthToken();
  if (!token) {
    alert("You must be logged in to add books.");
    return;
  }

  const payload = { googleId: bookId, targetType: "club", clubId };
  console.log("Payload being sent:", payload); // Debugging

  try {
    const response = await fetch("http://localhost:3000/api/books/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Response from API:", result); // Debugging

    if (response.ok) {
      alert("Book added to club library successfully!");
    } else {
      console.error("Error adding book to club library:", result.message);
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error adding book to club library:", error);
    alert("Error adding book to club library.");
  }
}

interface Club{
  _id:string;
  name:string;
  role:string; //owner, member, etc.
}

export async function selectClub(): Promise<string|null> {
  const token = getAuthToken();
  if (!token) {
    alert("You must be logged in to view your clubs.");
    return null;
  }

  console.log("Fetching clubs for user"); // Debugging
  try {
    const response = await fetch(
      "http://localhost:3000/api/club/my-clubs",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const result: { message?: string } = await response.json();
      console.error("Error response from API:", result);
      alert(
        "Error fetching clubs: " + (result.message || "Unknown error")
      );
      return null;
    }

    const clubs: Club[] = await response.json();
    console.log("Fetched clubs:", clubs); // Debugging

    if (!clubs.length) {
      alert("No clubs available to select.");
      return null;
    }

    const ownedClubs = clubs.filter((club) => club.role === "Owner");
    if (!ownedClubs.length) {
      alert("You do not own any clubs.");
      return null;
    }

    return new Promise((resolve) => {
      // Remove any existing dropdown
      const existingDropdown = document.getElementById("clubDropdownContainer");
      if (existingDropdown) existingDropdown.remove();

      // Create the dropdown container
      const dropdownContainer = document.createElement("div");
      dropdownContainer.id = "clubDropdownContainer";

      // Create the dropdown element
      const dropdown = document.createElement("select");
      dropdown.id = "clubSelect";

      // Populate the dropdown with owned clubs
      ownedClubs.forEach((club) => {
        const option = document.createElement("option");
        option.value = club._id;
        option.textContent = club.name;
        dropdown.appendChild(option);
      });

      // Create the confirm button
      const confirmButton = document.createElement("button");
      confirmButton.textContent = "Confirm";
      confirmButton.addEventListener("click", () => {
        const selectedClubId = (dropdown as HTMLSelectElement).value;
        console.log("Confirmed club selection:", selectedClubId); // Debugging
        dropdownContainer.remove(); // Clean up
        resolve(selectedClubId); // Resolve with selected club ID
      });

      // Append dropdown and button to the container
      dropdownContainer.appendChild(dropdown);
      dropdownContainer.appendChild(confirmButton);

      // Attach the container to the DOM
      document.body.appendChild(dropdownContainer);
      console.log("Dropdown and Confirm Button added to DOM"); // Debugging
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    alert("Error fetching clubs. Check the console for details.");
    return null;
  }
}