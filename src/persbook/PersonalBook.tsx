import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getAuthToken } from "../scripts";
import { Book, Task, Comment as CommentType } from "../types/types";
import Comment from "../components/comment/Comment";
import styles from "./personalBook.module.css";
import TaskForm from "../components/taskForm/TaskForm";
import { jwtDecode } from "jwt-decode";

const PersonalBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Record<string, CommentType[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [addingCommentTaskId, setAddingCommentTaskId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
    const fetchBookAndTasks = async () => {
      try {
        const token = await getAuthToken();
        if (token) {
          try {
            const decodedToken: { id: string } = jwtDecode(token);
            setCurrentUserId(decodedToken.id); // Correctly set user ID
            console.log("Decoded user ID:", decodedToken.id);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        } else {
          console.error("No token found");
        }

        // Fetch book details
        const bookResponse = await fetch(`http://localhost:3000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!bookResponse.ok) throw new Error("Failed to fetch book details");

        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch tasks for the specific book
        const tasksResponse = await fetch(
          `http://localhost:3000/api/tasks/book/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks for this book");

        const tasksData: Task[] = await tasksResponse.json();
        setTasks(tasksData); // Set all tasks initially
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndTasks();
  }, [id]);

  // Filter tasks by `currentUserId` when both tasks and currentUserId are available
  const filteredTasks = React.useMemo(() => {
    if (!currentUserId) return [];
    return tasks.filter((task) => task.createdBy === currentUserId);
  }, [tasks, currentUserId]);

  useEffect(() => {
    filteredTasks.forEach((task) => fetchCommentsForTask(task._id));
  }, [filteredTasks]);

  const fetchCommentsForTask = async (taskId: string) => {
    try {
      setLoadingComments((prev) => ({ ...prev, [taskId]: true }));
      const taskComments = await fetchWithAuth(
        `http://localhost:3000/api/tasks/${taskId}/comments`
      );
      setComments((prev) => ({ ...prev, [taskId]: taskComments }));
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
    } finally {
      setLoadingComments((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const addComment = async (taskId: string) => {
    try {
      await fetchWithAuth(`http://localhost:3000/api/comments/`, {
        method: "POST",
        body: JSON.stringify({
          taskId,
          bookId: book?._id,
          content: newCommentContent,
        }),
      });
      setNewCommentContent("");
      setAddingCommentTaskId(null);
      fetchCommentsForTask(taskId); // Refresh comments for the task
    } catch (error) {
      console.error("Error adding comment:", error);
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

          <TaskForm bookId={book._id} />

          <div className={styles.taskSection}>
            <h3>Tasks</h3>
            {filteredTasks.length > 0 ? (
              <ul>
                {filteredTasks.map((task) => (
                  <li key={task._id}>
                    <div className={styles.task}>
                      <p>
                        {task.description} - <strong>{task.status}</strong>
                      </p>
                      <button onClick={() => setAddingCommentTaskId(task._id)}>
                        Add Comment
                      </button>
                    </div>

                    {loadingComments[task._id] ? (
                      <p>Loading comments...</p>
                    ) : (
                      <ul>
                        {comments[task._id]?.length ? (
                          comments[task._id].map((comment) => (
                            <li key={comment._id}>
                              <Comment
                                content={comment.content}
                                userId={comment.userId}
                              />
                            </li>
                          ))
                        ) : (
                          <p>No comments yet.</p>
                        )}
                      </ul>
                    )}

                    {addingCommentTaskId === task._id && (
                      <div className="add-comment-section">
                        <textarea
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          placeholder="Enter your comment"
                        />
                        <button onClick={() => addComment(task._id)}>
                          Submit
                        </button>
                        <button onClick={() => setAddingCommentTaskId(null)}>
                          Cancel
                        </button>
                      </div>
                    )}
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
