import React, { useState, useEffect } from "react";
import TaskTracker from "../components/TaskTracker";
import GoalTracker from "../components/GoalTracker";

export default function Goal() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [taskCompletionTime, setTaskCompletionTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const completeTask = () => {
    setTaskCompletionTime(new Date().toLocaleString());
  };

  return (
    <div className="container">
      <h1>Task & Goal Tracker</h1>
      <div className="datetime">
        <p>{currentTime.toLocaleDateString()}</p>
        <p>{currentTime.toLocaleTimeString()}</p>
      </div>
      <div className="trackers">
        <TaskTracker onComplete={completeTask} />
        <GoalTracker />
      </div>
      {taskCompletionTime && (
        <div className="completion-time">
          <p>Task Completed on: {taskCompletionTime}</p>
        </div>
      )}
    </div>
  );
}
