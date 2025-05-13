import React from "react";
import "../styles/PlannerGrid.css";

const DayCard = ({ day, value, onChange }) => {
  return (
    <div className="day-card">
      <h3>Day {day}</h3>
      <textarea
        className="input-box"
        rows="2"
        value={value}
        onChange={onChange}
        placeholder="Enter study topics..."
      />
    </div>
  );
};

export default DayCard;
