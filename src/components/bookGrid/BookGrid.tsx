import React from "react";
import BookCard from "../bookCard/BookCard";

interface Book {
  _id: string; // MongoDB ID or unique identifier
  title: string;
  author: string;
  year: number;
}

interface BookGridProps {
  books: Book[]; // Array of book data to render
  onAdd: (bookId: string) => void; // Callback when "+" button is clicked
}

const BookGrid: React.FC<BookGridProps> = ({ books, onAdd }) => {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book._id} // Use the unique identifier for the React key
          title={book.title}
          author={book.author}
          year={book.year}
          onAdd={() => onAdd(book._id)} // Pass book ID to the callback
        />
      ))}
    </div>
  );
};

export default BookGrid;
