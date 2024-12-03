import React, { useEffect, useState } from "react";
import BookGrid from "../components/BookGrid";

interface Book {
  _id: string;
  title: string;
  author: string;
  year: number;
}

const PersonalLibraryPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchPersonalLibrary = async () => {
      const token = localStorage.getItem("jwtToken"); // Retrieve JWT token
      if (!token) {
        console.error("User is not logged in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/users/library", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch personal library");
        }

        const data: Book[] = await response.json(); // Parse the response as an array of books
        setBooks(data); // Update state with fetched books
      } catch (error) {
        console.error("Error fetching personal library:", error);
      }
    };

    fetchPersonalLibrary();
  }, []);

  const handleAddBook = (bookId: string) => {
    console.log(`Add book clicked with ID: ${bookId}`);
    // Handle add logic (optional for personal library)
  };

  return (
    <div>
      <h1>My Personal Library</h1>
      <BookGrid books={books} onAdd={handleAddBook} />
    </div>
  );
};

export default PersonalLibraryPage;
