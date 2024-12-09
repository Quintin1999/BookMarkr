import React, { useState, FormEvent } from "react";

const TaskForm = ({ bookId }: { bookId: string }) => {
  const [taskName, setTaskName] = useState<string>("");

  async function createTaskForPersonalBook(event: FormEvent): Promise<void> {
    event.preventDefault();

    try {
      // Retrieve JWT token
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("You must be logged in to create tasks.");
        return;
      }

      if (!bookId || !taskName.trim()) {
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
        body: JSON.stringify({ bookId, taskName }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Task created successfully!");
        setTaskName(""); // Clear the form
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
    <form onSubmit={createTaskForPersonalBook}>
      <h3>Create a Task</h3>
      <input
        id="personalTaskDescription"
        value={taskName}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() !== "") {
            setTaskName(value);
          } else {
            setTaskName("");
          }
        }}
        placeholder="Enter Task Name"
        required
      />
      <button type="submit" disabled={!taskName.trim()}>
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
