import React from "react";
import { Link } from "react-router-dom";
import styles from "./bookCard.module.css";
import { Book } from "../../types/types";

const BookCard: React.FC<Book> = ({
  _id,
  title,
  author,
  year,
  thumbnail,
  onAdd,
}) => {
  return (
    <figure className={styles.bookCard}>
      <div className={styles.bookImage}>
        <Link to={`/books/${_id}`}>
          <img src={thumbnail} alt={title} />
        </Link>

        <button className={styles.addBook} onClick={onAdd}>
          <span className={styles.addBookText}>Add Book</span> +
        </button>
      </div>

      <figcaption className={styles.bookDetails}>
        <p className={styles.bookTitle}>{title}</p>
        <p className={styles.bookAuthor}>
          {author?.join(", ") || "Unknown Author"}
        </p>
        <p className={styles.bookYear}>{year}</p>
      </figcaption>
    </figure>
  );
};

export default BookCard;
