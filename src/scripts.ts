const apiUrl: string = "http://localhost:3000/api"; // Base API URL
import { FormEvent } from "react";
import { Book } from "./types/types.ts";
import { jwtDecode } from "jwt-decode";

// Function to get the JWT token
export async function getAuthToken(): Promise<string> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("You must be logged in.");
    throw new Error("No JWT token found.");
  }
  return token;
}
export const getUserId = (): string | null => {
  const token = localStorage.getItem("jwtToken"); // Retrieve the token from local storage
  if (!token) {
    console.error("No token found in local storage.");
    return null;
  }

  try {
    // Decode the token to extract the user ID
    const decoded: { userId: string } = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

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
export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) {
    alert("Please enter a search term.");
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}`
    );

    const data: GoogleBooksResponse = await response.json();

    if (data.items && data.items.length > 0) {
      // Map raw API data to BookCardProps
      return data.items.map((book) => {
        const _id = book.id;
        const title = book.volumeInfo.title || "Unknown Title";
        const author = book.volumeInfo.authors || ["Unknown Author"];
        const year = book.volumeInfo.publishedDate
          ? new Date(book.volumeInfo.publishedDate).getFullYear()
          : 1970; // Default year if none provided
        const thumbnail =
          book.volumeInfo.imageLinks?.thumbnail || "/public/images/nobook.png";

        return {
          _id,
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

async function addBookToClubLibrary(bookId: string, clubId: string) {
  console.log("Adding to club library. Book ID:", bookId, "Club ID:", clubId);

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

interface Club {
  _id: string;
  name: string;
  role: string; //owner, member, etc.
}

export async function selectClub(): Promise<string | null> {
  const token = getAuthToken();
  if (!token) {
    alert("You must be logged in to view your clubs.");
    return null;
  }

  console.log("Fetching clubs for user"); // Debugging
  try {
    const response = await fetch("http://localhost:3000/api/club/my-clubs", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const result: { message?: string } = await response.json();
      console.error("Error response from API:", result);
      alert("Error fetching clubs: " + (result.message || "Unknown error"));
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

export async function createTaskForPersonalBook(
  event: FormEvent
): Promise<void> {
  event.preventDefault();

  try {
    // Retrieve JWT token
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("You must be logged in to create tasks.");
      return;
    }

    // Retrieve form values
    const bookId = (
      document.getElementById("personalBookSelect") as HTMLSelectElement
    )?.value;
    const description = (
      document.getElementById("personalTaskDescription") as HTMLInputElement
    )?.value;

    if (!bookId || !description.trim()) {
      alert("Book ID and description are required.");
      return;
    }

    // API request
    const response = await fetch("http://localhost:3000/api/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId, description }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Task created successfully!");
      (
        document.getElementById("personalTaskDescription") as HTMLInputElement
      ).value = ""; // Clear the form
    } else {
      console.error("Error creating task:", result.message);
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error creating personal task:", error);
    alert("Error creating personal task.");
  }
}
