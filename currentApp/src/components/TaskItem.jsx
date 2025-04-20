import React from "react";
import "../styles/Taskitem.css";

function TaskItem({ task, toggleCompletion, removeTask }) {
  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <span onClick={toggleCompletion}>{task.text}</span>
      <button onClick={removeTask} className="remove-btn">
        ❌
      </button>
    </li>
  );
}

export default TaskItem;
