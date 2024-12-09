import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { createTaskForPersonalBook } from "../scripts";
import { getAuthToken } from "../scripts";

interface Book {
  _id: string;
  title: string;
  authors: string[];
  year: number;
  description: string;
  thumbnail?: string;
  dateAdded: string;
}

import { Book } from "../types/types";


interface Task {
  _id: string;
  description: string;
  status: string;
}

interface Comment {
  _id: string;
  taskId: string;
  content: string;
  userId: {
    _id: string;
    username: string;
  };
}

const PersonalBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<{ [taskId: string]: Comment[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [taskId: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [addingCommentTaskId, setAddingCommentTaskId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState<string>("");

  useEffect(() => {
    const fetchBookAndTasks = async () => {
      try {
        const token = await getAuthToken();

        // Fetch book details
        const bookResponse = await fetch(`http://localhost:3000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!bookResponse.ok) throw new Error("Failed to fetch book details");

        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch tasks for the specific book
        const tasksResponse = await fetch(`http://localhost:3000/api/tasks/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks for this book");

        const tasksData: Task[] = await tasksResponse.json();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndTasks();
  }, [id]);

  const fetchCommentsForTask = async (taskId: string) => {
    try {
      setLoadingComments((prev) => ({ ...prev, [taskId]: true }));

      const token = await getAuthToken();
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch comments for the task");

      const taskComments: Comment[] = await response.json();
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
    <div className="personal-book-page">
      <main className="content">
        <section className="left-column">
          <div className="book-cover">
            {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
          </div>
          <h2>{book.title}</h2>

          <p>By: {book.authors.join(", ")}</p>

          <p>By: {book.author?.join(", ") || "Unknown Author"}</p>{" "}
          {/* Updated here */}
          
          <p>Publication Year: {book.year}</p>
          {book.dateAdded ? (
            <p>Date Added: {new Date(book.dateAdded).toLocaleDateString()}</p>
          ) : (
            <></>
          )}
        </section>

        <section className="right-column">
          <div className="book-description">{book.description}</div>

          <div className="task-creation">
            <h3>Create a Task</h3>
            <form onSubmit={createTaskForPersonalBook}>
              <textarea
                id="personalTaskDescription"
                placeholder="Enter task description"
                required
              />
              <button type="submit">Create Task</button>
            </form>
          </div>

          <div className="tasks-section">
            <h3>Tasks</h3>
            {tasks.length > 0 ? (
              <ul>
                {tasks.map((task) => (
                  <li key={task._id}>
                    <p>
                      {task.description} - <strong>{task.status}</strong>
                      <button onClick={() => fetchCommentsForTask(task._id)}>View Comments</button>
                      <button onClick={() => setAddingCommentTaskId(task._id)}>Add Comment</button>
                    </p>

                    {loadingComments[task._id] ? (
                      <p>Loading comments...</p>
                    ) : (
                      <ul>
                        {comments[task._id]?.length > 0 ? (
                          comments[task._id].map((comment) => (
                            <li key={comment._id}>
                              <p>
                                <strong>{comment.userId.username}:</strong> {comment.content}
                              </p>
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
                        <button onClick={() => addComment(task._id)}>Submit</button>
                        <button onClick={() => setAddingCommentTaskId(null)}>Cancel</button>
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
      </main>
    </div>
  );
};

export default PersonalBook;
