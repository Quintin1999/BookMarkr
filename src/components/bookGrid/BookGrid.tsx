import React from "react";
import BookCard from "../bookCard/BookCard";

interface Book {
  _id: string;
  title: string;
  author: string;
  year: number;
  thumbnail: string; // Include the thumbnail field
}

interface BookGridProps {
  books: Book[];
  onAdd: (bookId: string) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, onAdd }) => {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book._id}
          title={book.title}
          author={book.author}
          year={book.year}
          thumbnail={book.thumbnail} // Pass the thumbnail to BookCard
          onAdd={() => onAdd(book._id)} // Pass book ID to the callback
        />
      ))}
    </div>
  );
};

export default BookGrid;
