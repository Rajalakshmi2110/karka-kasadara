import React, { useState } from "react";
import "../styles/TaskCard.css";

export default function TaskCard({ task, updateTask, removeTask }) {
  const [text, setText] = useState(task.text);

  const handleCompletion = () => {
    updateTask(task.id, text, !task.completed);
  };

  return (
    <div className={`card ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleCompletion}
      />
      <textarea
        placeholder="Enter Task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={task.completed}
      ></textarea>
      <button className="remove" onClick={() => removeTask(task.id)}>
        ❌
      </button>
    </div>
  );
}
