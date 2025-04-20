import React, { useState } from "react";

export default function GoalCard({ goal, updateGoal, removeGoal }) {
  const [text, setText] = useState(goal.text);

  const handleCompletion = () => {
    updateGoal(goal.id, text, !goal.completed);
  };

  return (
    <div className={`card ${goal.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={goal.completed}
        onChange={handleCompletion}
      />
      <textarea
        placeholder="Enter Goal..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={goal.completed}
      ></textarea>
      <button className="remove" onClick={() => removeGoal(goal.id)}>
        ❌
      </button>
    </div>
  );
}
