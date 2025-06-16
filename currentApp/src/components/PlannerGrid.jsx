import React, { useState } from "react";
import DayCard from "./DayCard";
import "../styles/PlannerGrid.css";

const totalDays = 31;

const PlannerGrid = () => {
  const [planner, setPlanner] = useState(Array(totalDays).fill(""));

  const handleInputChange = (index, value) => {
    const newPlanner = [...planner];
    newPlanner[index] = value;
    setPlanner(newPlanner);
  };

  return (
    <div className="planner-grid-wrapper">
      <div className="planner-grid">
        {Array.from({ length: totalDays }, (_, index) => (
          <DayCard
            key={index}
            day={index + 1}
            value={planner[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlannerGrid;