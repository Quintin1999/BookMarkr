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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [addingCommentTaskId, setAddingCommentTaskId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState<string>("");


  useEffect(() => {
    const fetchBookAndTasks = async () => {
      try {
        const token = await getAuthToken();

        const bookResponse = await fetch(`http://localhost:3000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!bookResponse.ok) {
          throw new Error("Failed to fetch book details");
        }

        const bookData = await bookResponse.json();
        setBook(bookData);

        const bookTaskResponse = await fetch(`http://localhost:3000/api/tasks/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!bookTaskResponse.ok) {
          throw new Error("Failed to fetch tasks for this book");
        }

        const bookTasks: Task[] = await bookTaskResponse.json();

        const userTaskResponse = await fetch(`http://localhost:3000/api/tasks/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userTaskResponse.ok) {
          throw new Error("Failed to fetch tasks for the user");
        }

        const userTasks: Task[] = await userTaskResponse.json();

        const commonTasks = bookTasks.filter((bookTask) =>
          userTasks.some((userTask) => userTask._id === bookTask._id)
        );

        setTasks(commonTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndTasks();

  }, [id]);

  useEffect(() => {
    if (tasks.length > 0) {
      fetchComments();
    }
  }, [tasks]);

  const fetchComments = async () => {
    try {
      const token = await getAuthToken();

      const commentRequests = tasks.map((task) =>
        fetch(`http://localhost:3000/api/comments/task/${task._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch comments for task ${task._id}`);
          }
          return response.json();
        })
      );

      const commentsArray = await Promise.all(commentRequests);

      const commentsByTask = tasks.reduce((acc, task, index) => {
        acc[task._id] = commentsArray[index];
        return acc;
      }, {} as { [taskId: string]: Comment[] });

      setComments(commentsByTask);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const token = await getAuthToken();

      const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const updatedComment = await response.json();
      setComments((prev) => {
        const updatedComments = { ...prev };
        Object.keys(updatedComments).forEach((taskId) => {
          updatedComments[taskId] = updatedComments[taskId].map((comment) =>
            comment._id === commentId ? { ...comment, content: updatedComment.comment.content } : comment
          );
        });
        return updatedComments;
      });
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  const addComment = async (taskId: string) => {
    try {
      const token = await getAuthToken();
  
      const response = await fetch(`http://localhost:3000/api/comments/task/${taskId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newCommentContent }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
  
      const newComment = await response.json();
  
      setComments((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), newComment],
      }));
  
      setAddingCommentTaskId(null); // Close the input field
      setNewCommentContent(""); // Clear the input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  

  return (
    <div className="personal-book-page">
      <main className="content">
        <section className="left-column">
          <div className="book-cover">
            {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
          </div>
          <h2>{book.title}</h2>
          <p>By: {book.authors.join(", ")}</p>
          <p>Publication Year: {book.year}</p>
          <p>Date Added: {new Date(book.dateAdded).toLocaleDateString()}</p>
        </section>

        <section className="right-column">
          <div className="book-description">{book.description}</div>

          <div className="task-creation">
            <h3>Create a Task</h3>
            <form onSubmit={createTaskForPersonalBook}>
              <input
                type="hidden"
                id="personalBookSelect"
                value={book._id}
                readOnly
              />
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
            <button onClick={() => setAddingCommentTaskId(task._id)}>Add Comment</button>
          </p>
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
          <ul>
            {comments[task._id]?.map((comment) => (
              <li key={comment._id}>
                <p>
                  <strong>{comment.userId.username}:</strong> {comment.content}
                </p>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  ) : (
    <p>No tasks created for this book yet.</p>
  )}
</div>

        </section>
      </main>
    </div>
  );
};

export default PersonalBook;
