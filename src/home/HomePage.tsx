import React from "react";
import BookCard from "../components/bookCard/BookCard";
import { addBookToPersonalLibrary } from "../scripts";
import styles from "./homepage.module.css";

const HomePage: React.FC = () => {
  return (
    <div className={`${styles.homePage}`}>
      <section className={`${styles.hero} container`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <h1>Join a community of growing readers</h1>
            <p className={`text-xl`}>
              Connect with fellow book lovers, explore diverse genres, and dive
              into fresh discussions— all from the comfort of home.
            </p>
            <button className="hero-button">Join a Book Club</button>
          </div>
          <div className="hero-image">
            <img src="../public/images/book-vector.svg" alt="Bookmarkr Logo" />
          </div>
        </div>
      </section>

      {/* Book Grid Section, replace with api calls*/}
      <section className={`container`}>
        <div className={`${styles.bookGrid}`}>
          <BookCard
            id="673bba82fcfb061b2ae19138"
            title="Book Title 1"
            author="Author 1"
            year={2024}
            thumbnail="/images/nobook.png"
            onAdd={() => addBookToPersonalLibrary("673bba82fcfb061b2ae19138")}
          />
          <BookCard
            id="673bba82fcfb061b2ae19138"
            title="Book Title 2"
            author="Author 2"
            year={2023}
            thumbnail="/images/nobook.png"
            onAdd={() => alert("Added Book 2")}
          />
          <BookCard
            id="673bba82fcfb061b2ae19138"
            title="Book Title 3"
            author="Author 3"
            year={2025}
            thumbnail="/images/nobook.png"
            onAdd={() => alert("Added Book 3")}
          />
          <BookCard
            id="673bba82fcfb061b2ae19138"
            title="Book Title 4"
            author="Author 4"
            year={2022}
            thumbnail="/images/nobook.png"
            onAdd={() => alert("Added Book 4")}
          />
        </div>
      </section>

      <section className="library container">
        <div className="library-content">
          <h2>Manage Your Library</h2>
          <p>
            Not big on group chats? No problem. Start your own collection, track
            your reading journey, and jot down your thoughts at your own pace.
          </p>
        </div>
        <div className="library-img">
          <img src="../public/images/videoplaceholder.png" alt="Video" />
        </div>
        <button className="section-button">Begin Your Library</button>
      </section>
      <section className="clubs container">
        <div className="book-club-content">
          <h2>Join a Book Club and Share Your Thoughts with Others</h2>
          <p>
            Big on people? join them to make your own collection together, read
            together and engage in discussion.
          </p>
        </div>
        <div className="book-club-img">
          <img src="../public/images/videoplaceholder.png" alt="Video" />
        </div>
        <button className="section-button">Join a Book Club!</button>
      </section>
    </div>
  );
};

export default HomePage;
