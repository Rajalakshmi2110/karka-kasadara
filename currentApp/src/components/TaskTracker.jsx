import React, { useState } from "react";
import TaskCard from "./TaskCard";
import "../styles/TaskTracker.css";

export default function TaskTracker() {
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    setTasks([...tasks, { id: tasks.length + 1, text: "", completed: false }]);
  };

  const updateTask = (id, newText, completed) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText, completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="tracker">
      <h2>📋 Task Tracker</h2>
      <button onClick={addTask} className="add-task-btn">➕ Add Task</button>
      <div className="cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            updateTask={updateTask}
            removeTask={removeTask}
          />
        ))}
      </div>
    </div>
  );
}
