import React from "react";
import Sidebar from "../components/Sidebar";

function Home() {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="content">
        <h1>Welcome to the Virtual Study Room</h1>
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
}

export default Home;
