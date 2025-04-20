import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import "../styles/Clock.css"; // Import styles

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmSet, setAlarmSet] = useState(false);

  // Timer States
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Stopwatch States
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  // Pomodoro States
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAlarm = () => {
    const now = new Date();
    const alarm = new Date(now.toDateString() + " " + alarmTime);
    const diff = differenceInSeconds(alarm, now);

    if (diff > 0) {
      setTimeout(() => {
        alert("⏰ Alarm! Time's up!");
      }, diff * 1000);
      setAlarmSet(true);
    } else {
      alert("Please set a future time.");
    }
  };

  // Timer Functions
  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      alert("⏳ Timer Finished!");
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const startTimer = () => {
    if (timerMinutes === 0 && timerSeconds === 0) {
      alert("Set a time first!");
      return;
    }
    setTimeLeft(timerMinutes * 60 + timerSeconds);
    setTimerRunning(true);
    setTimerActive(true);
  };

  const pauseTimer = () => setTimerRunning(false);
  const resumeTimer = () => setTimerRunning(true);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(0);
    setTimerActive(false);
  };

  // Stopwatch Functions
  useEffect(() => {
    let interval;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const startStopwatch = () => setStopwatchRunning(true);
  const pauseStopwatch = () => setStopwatchRunning(false);
  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
  };

  // Pomodoro Functions
  useEffect(() => {
    let interval;
    if (pomodoroRunning && pomodoroTimeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTimeLeft === 0 && pomodoroRunning) {
      alert("🎯 Pomodoro session complete! Take a break.");
      setPomodoroRunning(false);
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroTimeLeft]);

  const startPomodoro = () => setPomodoroRunning(true);
  const pausePomodoro = () => setPomodoroRunning(false);
  const resetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroTimeLeft(25 * 60);
  };

  return (
    <div className="clock-page">
      {/* Live Clock at the Top */}
      <div className="clock-header">
        <h2>{time.toLocaleTimeString()}</h2>
      </div>

      {/* Sections Container */}
      <div className="clock-sections">
        {/* Alarm Section */}
        <section className="clock-section">
          <h3>Alarm</h3>
          <input
            type="time"
            onChange={(e) => setAlarmTime(e.target.value)}
            className="alarm-input"
          />
          <button onClick={checkAlarm} className="section-btn">
            Set Alarm
          </button>
          {alarmSet && <p>Alarm set for {alarmTime} ⏰</p>}
        </section>

        {/* Timer Section */}
        <section className="clock-section">
          <h3>Timer</h3>
          {!timerActive ? (
            <>
              <input
                type="number"
                placeholder="Minutes"
                onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                className="timer-input"
              />
              <input
                type="number"
                placeholder="Seconds"
                onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                className="timer-input"
              />
              <button onClick={startTimer} className="section-btn">
                Start Timer
              </button>
            </>
          ) : (
            <>
              <h2>
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
                {timeLeft % 60}
              </h2>
              {!timerRunning ? (
                <button onClick={resumeTimer} className="section-btn">
                  Resume
                </button>
              ) : (
                <button onClick={pauseTimer} className="section-btn">
                  Pause
                </button>
              )}
              <button onClick={resetTimer} className="section-btn">
                Reset
              </button>
            </>
          )}
        </section>

        {/* Stopwatch Section */}
        <section className="clock-section">
          <h3>Stopwatch</h3>
          <h2>
            {Math.floor(stopwatchTime / 60)}:{stopwatchTime % 60 < 10 ? "0" : ""}
            {stopwatchTime % 60}
          </h2>
          {!stopwatchRunning ? (
            <button onClick={startStopwatch} className="section-btn">
              Start
            </button>
          ) : (
            <button onClick={pauseStopwatch} className="section-btn">
              Pause
            </button>
          )}
          <button onClick={resetStopwatch} className="section-btn">
            Reset
          </button>
        </section>

        {/* Pomodoro Section */}
        <section className="clock-section">
          <h3>Pomodoro</h3>
          <h2>
            {Math.floor(pomodoroTimeLeft / 60)}:{pomodoroTimeLeft % 60 < 10 ? "0" : ""}
            {pomodoroTimeLeft % 60}
          </h2>
          {!pomodoroRunning ? (
            <button onClick={startPomodoro} className="section-btn">
              Start
            </button>
          ) : (
            <button onClick={pausePomodoro} className="section-btn">
              Pause
            </button>
          )}
          <button onClick={resetPomodoro} className="section-btn">
            Reset
          </button>
        </section>
      </div>
    </div>
  );
}
