import React, { useEffect, useState } from "react";
import BookCard from "../components/bookCard/BookCard";
import { getAuthToken } from "../scripts";
import styles from "./homepage.module.css";
import { Book } from "../types/types";
import { jwtDecode } from "jwt-decode";

const HomePage: React.FC = () => {
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]); // Books from the user's library
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Current user's ID
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch helper with authentication
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = await getAuthToken();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
    return response.json();
  };

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      setLoading(true);
      try {
        const token = await getAuthToken();
        if (token) {
          const decodedToken: { id: string } = jwtDecode(token);
          setCurrentUserId(decodedToken.id);
        }

        const books = await fetchWithAuth("http://localhost:3000/api/users/library");
        setLibraryBooks(books);
      } catch (err) {
        console.error("Error fetching library books:", err);
        setError("Failed to load your library. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryBooks();
  }, []);

  if (loading) return <p>Loading your library...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`${styles.homePage}`}>
      <section className={`${styles.hero} container`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <h1>Welcome Back!</h1>
            <p className={`text-xl`}>
              Here are some books from your personal library. Keep exploring, or join a book club!
            </p>
            <button className="hero-button">Join a Book Club</button>
          </div>
          <div className="hero-image">
            <img src="../public/images/book-vector.svg" alt="Bookmarkr Logo" />
          </div>
        </div>
      </section>

      {/* User Library Section */}
      <section className={`container`}>
        <h2>Your Library</h2>
        <div className={`${styles.bookGrid}`}>
          {libraryBooks.length > 0 ? (
            libraryBooks.map((book) => (
              <BookCard
                key={book._id}
                _id={book._id}
                title={book.title}
                author={book.author || ["Unknown"]}
                year={2021}
                thumbnail={book.thumbnail || "/images/nobook.png"}
                onAdd={() => alert("Book already in your library!")}
              />
            ))
          ) : (
            <p>Your library is empty. Add some books to get started!</p>
          )}
        </div>
      </section>

      <section className={`container`}>
        <div className={`${styles.featureSection}`}>
          <h2>Manage Your Library</h2>
          <p>
            Track your reading journey and jot down your thoughts at your own pace.
          </p>

          <img src="../public/images/videoplaceholder.png" alt="Video" />

          <button className="section-button">Begin Your Library</button>
        </div>
      </section>

      <section className={`container`}>
        <div className={`${styles.featureSection}`}>
          <h2>Join a Book Club</h2>
          <p>
            Share your reading experiences with others, join clubs, and engage in lively discussions.
          </p>

          <img src="../public/images/videoplaceholder.png" alt="Video" />

          <button className="section-button">Join a Book Club!</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
