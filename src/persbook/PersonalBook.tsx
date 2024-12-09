import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuthToken } from "../scripts";
import { Book, Task, Comment as CommentType } from "../types/types";
import Comment from "../components/comment/Comment";
import TaskForm from "../components/taskForm/TaskForm";
import styles from "./personalBook.module.css";
import { jwtDecode } from "jwt-decode";

const PersonalBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Record<string, CommentType[]>>({});
  const [newComment, setNewComment] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getAuthToken();
        if (token) {
          const decodedToken: { id: string } = jwtDecode(token);
          setCurrentUserId(decodedToken.id);
        }

        const bookData = await fetchWithAuth(
          `http://localhost:3000/api/books/${id}`
        );
        setBook(bookData);

        const tasksData = await fetchWithAuth(
          `http://localhost:3000/api/tasks/book/${id}`
        );
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchCommentsForTask = async (taskId: string) => {
    try {
      const taskComments = await fetchWithAuth(
        `http://localhost:3000/api/tasks/${taskId}/comments`
      );
      setComments((prev) => ({ ...prev, [taskId]: taskComments }));
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
    }
  };

  const addComment = async (taskId: string, content: string) => {
    try {
      await fetchWithAuth(`http://localhost:3000/api/comments/`, {
        method: "POST",
        body: JSON.stringify({
          taskId,
          bookId: book?._id,
          content,
        }),
      });
      await fetchCommentsForTask(taskId); // Refresh comments
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const refreshTasks = async () => {
    try {
      const tasksData = await fetchWithAuth(
        `http://localhost:3000/api/tasks/book/${id}`
      );
      setTasks(tasksData);
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <main className="container">
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
          <p>{book.description}</p>

          <TaskForm bookId={book._id} onTaskAdded={refreshTasks} />

          <div className={styles.taskSection}>
            <h3>Tasks</h3>
            {tasks.length > 0 ? (
              <ul>
                {tasks.map((task) => (
                  <li key={task._id}>
                    <div className={styles.task}>
                      <p className={styles.taskDescription}>
                        {task.description}
                      </p>
                      <p className={styles.taskStatus}>{task.status}</p>
                      <button onClick={() => fetchCommentsForTask(task._id)}>
                        View Comments
                      </button>
                    </div>

                    <div className={styles.addComment}>
                      <input
                        placeholder="Add a comment"
                        value={newComment} // Controlled input
                        onChange={(e) => setNewComment(e.target.value)} // Update state
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newComment.trim()) {
                            addComment(task._id, newComment.trim());
                            setNewComment(""); // Clear input
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newComment.trim()) {
                            addComment(task._id, newComment.trim());
                            setNewComment(""); // Clear input
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <ul>
                      {comments[task._id]?.length ? (
                        <>
                          <p>{comments[task._id].length} comment(s) found:</p>
                          <ul>
                            {comments[task._id].map((comment) => (
                              <li key={comment._id}>
                                <Comment
                                  content={comment.content}
                                  userId={comment.userId}
                                />
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks available for this book.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default PersonalBook;
