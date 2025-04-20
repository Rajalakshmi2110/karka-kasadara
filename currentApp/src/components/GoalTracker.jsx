import React, { useState } from "react";
import GoalCard from "./GoalCard";

export default function GoalTracker() {
  const [goals, setGoals] = useState([]);

  const addGoal = () => {
    setGoals([...goals, { id: goals.length + 1, text: "", completed: false }]);
  };

  const updateGoal = (id, newText, completed) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, text: newText, completed } : goal
      )
    );
  };

  const removeGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="tracker">
      <h2>🎯 Goal Tracker</h2>
      <button onClick={addGoal}>➕ Add Goal</button>
      <div className="cards">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            updateGoal={updateGoal}
            removeGoal={removeGoal}
          />
        ))}
      </div>
    </div>
  );
}
