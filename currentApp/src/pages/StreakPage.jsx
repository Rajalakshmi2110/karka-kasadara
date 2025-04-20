import React, { useState } from "react";
import Header from "../components/Header";
import Planner from "../components/Planner";
import BadgeSystem from "../components/BadgeSystem";
import "../styles/StreakPage.css";
function StreakPage() {
  const [streak, setStreak] = useState(0);

  return (
    <div className="streak-container">
      <Header />
      <Planner setStreak={setStreak} />
      <BadgeSystem streak={streak} />
    </div>
  );
}

export default StreakPage;
