import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getAuthToken } from "../scripts";
import { Book, Task, Comment as CommentType } from "../types/types";
import Comment from "../components/comment/Comment";
import TaskForm from "../components/taskForm/taskForm";
import styles from "./personalBook.module.css";

const PersonalBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Record<string, CommentType[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState<
    Record<string, boolean>
  >({});
  const [addingCommentTaskId, setAddingCommentTaskId] = useState<string | null>(
    null
  );
  const [newCommentContent, setNewCommentContent] = useState<string>("");

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
        const [bookData, tasksData] = await Promise.all([
          fetchWithAuth(`http://localhost:3000/api/books/${id}`),
          fetchWithAuth(`http://localhost:3000/api/tasks/book/${id}`),
        ]);
        setBook(bookData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching book and tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndTasks();
  }, [id]);

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

  useEffect(() => {
    tasks.forEach((task) => fetchCommentsForTask(task._id));
  }, [tasks]);

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
            {tasks.length > 0 ? (
              <ul>
                {tasks.map((task) => (
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
