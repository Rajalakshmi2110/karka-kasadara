import React, { useState } from "react";
import DayCard from "./DayCard";

const totalDays = 31;

const PlannerGrid = () => {
  const [planner, setPlanner] = useState(Array(totalDays).fill(""));

  const handleInputChange = (index, value) => {
    const newPlanner = [...planner];
    newPlanner[index] = value;
    setPlanner(newPlanner);
  };

  return (
    <div className="planner-grid">
      {Array.from({ length: totalDays }, (_, index) => (
        <DayCard
          key={index}
          day={index + 1} // Numbering days from 1 to 31
          value={planner[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      ))}
    </div>
  );
};

export default PlannerGrid;
