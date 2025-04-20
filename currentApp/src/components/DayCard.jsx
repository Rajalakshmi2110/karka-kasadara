import React from "react";

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
