import React from "react";

function BadgeSystem({ streak }) {
  let badge = "🏅 New Learner";

  if (streak >= 5) badge = "🔥 5-Day Streak";
  if (streak >= 10) badge = "🚀 Fast Thinker";
  if (streak >= 20) badge = "📚 Subject Expert";
  if (streak >= 30) badge = "🏆 Month Warrior";

  return (
    <div className="badges">
      <h2>Your Badge: {badge}</h2>
    </div>
  );
}

export default BadgeSystem;
