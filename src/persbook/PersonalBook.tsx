import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  author: string;
  year: number;
  description: string;
  thumbnail?: string;
  dateAdded: string;
}

const PersonalBook: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the book ID from the URL
  console.log("Book ID from url:",id);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/books/${id}`);
        console.log("Book ID being sent to backend:", id);
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
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
          <p>{book.author}</p>
          <p>Publication Year: {book.year}</p>
          <div className="metadata">
            <p>
              <strong>Date Added:</strong> {book.dateAdded}
            </p>
          </div>
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
