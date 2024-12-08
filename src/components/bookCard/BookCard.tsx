import React from "react";
import { Link } from "react-router-dom";
import styles from "./bookCard.module.css";

export interface BookCardProps {
  id: string; // Add the book ID for navigation
  title: string;
  author: string;
  year: number;
  thumbnail: string; // Add thumbnail to props
  onAdd: () => void; // Triggered when "+" button is clicked
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  year,
  thumbnail,
  onAdd,
}) => {
  return (
    <figure className={styles.bookCard}>
      <Link to={`/books/${id}`}>
        <div className={styles.bookImage}>
          <img src={thumbnail} alt={title} />

          <button className={styles.addBook} onClick={onAdd}>
            <span className={styles.addBookText}>Add Book</span> +
          </button>
        </div>
      </Link>
      <figcaption className={styles.bookDetails}>
        <h3 className={styles.bookTitle}>{title}</h3>
        <p className={styles.bookAuthor}>{author}</p>
        <p className={styles.bookYear}>{year}</p>
      </figcaption>
    </figure>
  );
};

export default BookCard;
