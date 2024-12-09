import { useState, FormEvent } from "react";
import styles from "./taskForm.module.css";

const TaskForm = ({ bookId }: { bookId: string }) => {
  const [description, setDescription] = useState<string>("");

  async function createTaskForPersonalBook(event: FormEvent): Promise<void> {
    event.preventDefault();

    try {
      // Retrieve JWT token
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("You must be logged in to create tasks.");
        return;
      }

      if (!bookId || !description.trim()) {
        alert("Book ID and description are required.");
        return;
      }

      // API request
      const response = await fetch("http://localhost:3000/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, description }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Task created successfully!");
        setDescription(""); // Clear the form
      } else {
        console.error("Error creating task:", result.message);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating personal task:", error);
      alert("Error creating personal task.");
    }
  }

  return (
    <form onSubmit={createTaskForPersonalBook} className={styles.taskForm}>
      <h3>Create a Task</h3>
      <input
        id="personalTaskDescription"
        value={description}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() !== "") {
            setDescription(value);
          } else {
            setDescription("");
          }
        }}
        placeholder="Enter Task Name"
        required
      />
      <button
        type="submit"
        disabled={!description.trim()}
        className={styles.submitButton}
      >
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
