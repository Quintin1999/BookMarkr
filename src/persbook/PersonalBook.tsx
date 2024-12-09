import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Book } from "../types/types";

const PersonalBook: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the book ID from the URL
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/books/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        console.log("Fetched book data:", data); // Debugging
        setBook(data); // Update the state with the fetched book
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  return (
    <div className="personal-book-page">
      <main className="content">
        {/* Left Column */}
        <section className="left-column">
          <div className="book-cover">
            {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
          </div>
          <h2>{book.title}</h2>
          <p>By: {book.author?.join(", ") || "Unknown Author"}</p>{" "}
          {/* Updated here */}
          <p>Publication Year: {book.year}</p>
          {book.dateAdded ? (
            <p>Date Added: {new Date(book.dateAdded).toLocaleDateString()}</p>
          ) : (
            <></>
          )}
        </section>

        {/* Right Column */}
        <section className="right-column">
          {/* Description */}
          <p className="book-description">{book.description}</p>
        </section>
      </main>
    </div>
  );
};

export default PersonalBook;
