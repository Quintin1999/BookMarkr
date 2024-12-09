import React, { useEffect, useState } from "react";
import BookGrid from "../components/bookGrid/BookGrid";
import styles from "./personalLibrary.module.css";

interface Book {
  _id: string;
  title: string;
  author: string;
  year: number;
  thumbnail: string;
}

const PersonalLibraryPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchPersonalLibrary = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("User is not logged in.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/users/library",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch personal library");
        }

        const data: Book[] = await response.json();
        console.log("Fetched Books:", data); //debugging
        setBooks(data);
      } catch (error) {
        console.error("Error fetching personal library:", error);
      }
    };

    fetchPersonalLibrary();
  }, []);

  const handleAddBook = (bookId: string) => {
    console.log(`Add book clicked with ID: ${bookId}`);
  };

  return (
    <main className="container">
      <div className={`${styles.libraryGrid}`}>
        <h1>My Personal Library</h1>
        {books.length > 0 ? (
          <BookGrid books={books} onAdd={handleAddBook} />
        ) : (
          <p>You should add books!</p>
        )}
      </div>
    </main>
  );
};

export default PersonalLibraryPage;
