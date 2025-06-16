// components/Topbar.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Topbar.css';
import logo from '../assets/logo.jpg';

const Topbar = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
      setTime(now);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <img src={logo} alt="App Logo" className="logo" />
      <div className="time-display">IST: {time}</div>
    </div>
  );
};

export default Topbar;
