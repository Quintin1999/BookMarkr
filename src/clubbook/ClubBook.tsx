import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuthToken } from "../scripts";
import { Book } from "../types/types";
import { Task } from "../types/types";
import TaskForm from "../components/taskForm/TaskForm";
import styles from "./clubBook.module.css";

const ClubBook: React.FC = () => {
  const { bookId, clubId } = useParams<{ bookId: string; clubId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClubBookData = async () => {
    try {
      if (!clubId || !bookId) {
        console.error("Missing clubId or bookId");
        return;
      }

      const token = await getAuthToken();

      // Fetch book details
      const bookResponse = await fetch(
        `http://localhost:3000/api/books/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!bookResponse.ok) throw new Error("Failed to fetch book details");

      const bookData = await bookResponse.json();
      setBook(bookData);

      // Fetch tasks for the club and book
      const tasksResponse = await fetch(
        `http://localhost:3000/api/clubs/${clubId}/books/${bookId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!tasksResponse.ok)
        throw new Error("Failed to fetch tasks for this book");

      const tasksData: Task[] = await tasksResponse.json();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubBookData();
  }, [bookId, clubId]);

  if (!clubId || !bookId) return <p>Invalid URL parameters.</p>;
  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found.</p>;

  const currentTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="container">
      <div className={styles.bookGrid}>
        <section className={styles.bookInformation}>
          {book.thumbnail && (
            <img
              src={book.thumbnail}
              alt={book.title}
              className={styles.bookCover}
            />
          )}
          <h2>{book.title}</h2>
          <p>By: {book.author?.join(", ") || "Unknown Author"}</p>
          <p>Publication Year: {book.year || "Unknown"}</p>
          {book.dateAdded && (
            <p>Date Added: {new Date(book.dateAdded).toLocaleDateString()}</p>
          )}
        </section>

        <section className={styles.rightColumn}>
          <TaskForm bookId={bookId} onTaskAdded={fetchClubBookData} />
          <div>
            <h2>Current Tasks</h2>
            {currentTasks.length > 0 ? (
              <ul>
                {currentTasks.map((task) => (
                  <li key={task._id}>
                    <p>
                      {task.description} - <strong>{task.status}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No current tasks.</p>
            )}
          </div>

          <div>
            <h2>Completed Tasks</h2>
            {completedTasks.length > 0 ? (
              <ul>
                {completedTasks.map((task) => (
                  <li key={task._id}>
                    <p>
                      {task.description} - <strong>{task.status}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No completed tasks.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClubBook;
