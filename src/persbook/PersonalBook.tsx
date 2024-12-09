import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { createTaskForPersonalBook } from "../scripts";
import { getAuthToken } from "../scripts";

import { Book, Task, Comment as CommentType } from "../types/types";
import Comment from "../components/comment/comment";

import styles from "./personalBook.module.css";
import TaskForm from "../components/taskForm/taskForm";

const PersonalBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<{ [taskId: string]: CommentType[] }>(
    {}
  );
  const [loadingComments, setLoadingComments] = useState<{
    [taskId: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(true);
  const [addingCommentTaskId, setAddingCommentTaskId] = useState<string | null>(
    null
  );
  const [newCommentContent, setNewCommentContent] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser=async()=>{
    const token= await getAuthToken();
    if(token){
      const decodedToken:{userId:string}=jwtDecode(token);
      setCurrentUserId(decodedToken.userId)
    }
  }
    const fetchBookAndTasks = async () => {
      try {
        const token = await getAuthToken();
    
        // Fetch book details
        const bookResponse = await fetch(
          `http://localhost:3000/api/books/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
        if (!tasksResponse.ok)
          throw new Error("Failed to fetch tasks for this book");

        const tasksData: Task[] = await tasksResponse.json();
    
        // Filter tasks based on the current user's ID
        const userTasks = tasksData.filter((task) => task.createdBy === currentUserId);
    
        setTasks(userTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentUser();
    fetchBookAndTasks();
  }, [id]);

  const fetchCommentsForTask = async (taskId: string) => {
    try {
      setLoadingComments((prev) => ({ ...prev, [taskId]: true }));

      const token = await getAuthToken();
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok)
        throw new Error("Failed to fetch comments for the task");

      const taskComments: CommentType[] = await response.json();
      setComments((prev) => ({ ...prev, [taskId]: taskComments }));
    } catch (error) {
      console.error("Error fetching comments for task:", error);
    } finally {
      setLoadingComments((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const addComment = async (taskId: string) => {
    try {
      const token = await getAuthToken();

      const response = await fetch(`http://localhost:3000/api/comments/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          bookId: book?._id,
          content: newCommentContent,
        }),
      });
      if (!response.ok) throw new Error("Failed to add comment");

      // Re-fetch comments for the task
      await fetchCommentsForTask(taskId);

      setAddingCommentTaskId(null);
      setNewCommentContent("");
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

          {/* Updated here */}
          <p>Publication Year: {book.year || "Unknown"}</p>
          {book.dateAdded ? (
            <p>Date Added: {new Date(book.dateAdded).toLocaleDateString()}</p>
          ) : (
            <></>
          )}
        </section>

        <section className="right-column">
          <div className="book-description">{book.description}</div>

          <TaskForm bookId={book._id} />

          <div className="tasks-section">
            <h3>Tasks</h3>
            {tasks.length > 0 ? (
              <ul>
                {tasks.map((task) => (
                  <li key={task._id}>
                    <div>
                      <p>
                        {task.description} - <strong>{task.status}</strong>
                      </p>
                      <button onClick={() => fetchCommentsForTask(task._id)}>
                        View Comments
                      </button>
                      <button onClick={() => setAddingCommentTaskId(task._id)}>
                        Add Comment
                      </button>
                    </div>

                    {loadingComments[task._id] ? (
                      <p>Loading comments...</p>
                    ) : (
                      <ul>
                        {comments[task._id]?.length > 0 ? (
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
