import React, { useEffect, useState } from "react";
import BookGrid from "../components/bookGrid/BookGrid";
import styles from "./personalLibrary.module.css";
import { Book } from "../types/types";

const PersonalLibraryPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]); // User's personal library
  const [searchQuery, setSearchQuery] = useState<string>(""); // Google Books search query
  const [searchResults, setSearchResults] = useState<Book[]>([]); // Google Books API results
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false); // Loading state for search

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
        console.log("Fetched Books:", data); // Debugging
        setBooks(data);
      } catch (error) {
        console.error("Error fetching personal library:", error);
      }
    };

    fetchPersonalLibrary();
  }, []);

  const handleGoogleBooksSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoadingSearch(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/books/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books from Google Books API");
      }

      const data: Book[] = await response.json();
      console.log("Search Results:", data); // Debugging
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <main className="container">
      <div className={`${styles.libraryGrid}`}>
        <h1>My Personal Library</h1>

        {/* Personal Library Section */}
        {books.length > 0 ? (
          <BookGrid books={books} onAdd={(bookId) => console.log(bookId)} />
        ) : (
          <p>You should add books!</p>
        )}

        {/* Google Books Search Section */}
        <div className={styles.searchSection}>
          <h2>Find More Books</h2>
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Google Books..."
              className={styles.searchBar}
            />
            <button
              onClick={handleGoogleBooksSearch}
              disabled={loadingSearch}
              className={styles.searchButton}
            >
              {loadingSearch ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Display Google Books Search Results */}
          {searchResults.length > 0 ? (
            <BookGrid
              books={searchResults}
              onAdd={(bookId) => console.log(`Add book from search: ${bookId}`)}
            />
          ) : (
            !loadingSearch && <p>No books found. Try another query!</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default PersonalLibraryPage;
