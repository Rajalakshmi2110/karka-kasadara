import React from "react";
import PlannerGrid from "../components/PlannerGrid";
import "../styles/PlannerGrid.css";

export default function Schedule() {
  return (
    <div className="schedule-page">
      <h1 className="title">Exam Study Planner</h1>
      <PlannerGrid />
    </div>
  );
}