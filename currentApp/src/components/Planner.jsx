import React, { useState } from "react";
import TaskItem from "./TaskItem";

function Planner({ setStreak }) {
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    const taskText = prompt("Enter study task:");
    if (taskText) {
      setTasks([...tasks, { text: taskText, completed: false }]);
    }
  };

  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    setStreak((prev) => prev + 1);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="planner">
      <h2>📅 Monthly Study Planner</h2>
      <button onClick={addTask} className="add-btn">
        + Add Task
      </button>
      <ul>
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            toggleCompletion={() => toggleCompletion(index)}
            removeTask={() => removeTask(index)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Planner;
