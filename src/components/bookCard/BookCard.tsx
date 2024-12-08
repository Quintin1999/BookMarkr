import React from "react";
import { Link } from "react-router-dom";

export interface BookCardProps {
  id: string; // Add the book ID for navigation
  title: string;
  author: string;
  year: number;
  thumbnail: string; // Add thumbnail to props
  onAdd: () => void; // Triggered when "+" button is clicked
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, year, thumbnail, onAdd }) => {
  return (
    <div className="book-card">
      <Link to={`/books/${id}`} className="book-card-link">
      
        <div className="book-cover">
          <img src={thumbnail} alt={title} className="book-thumbnail" /> {/* Display thumbnail */}
        </div>
        <div className="book-info">
          <h3 className="book-title">{title}</h3>
          <p className="book-author">{author}</p>
          <p className="book-year">{year}</p>
        </div>
      </Link>
      <button className="add-button" onClick={onAdd}>
        +
      </button>
    </div>
  );
};

export default BookCard;
