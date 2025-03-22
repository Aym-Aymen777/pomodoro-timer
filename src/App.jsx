import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // State variables
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // time in seconds
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Format time as mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle break length decrement
  const handleBreakDecrement = () => {
    if (!isRunning && breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  // Handle break length increment
  const handleBreakIncrement = () => {
    if (!isRunning && breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  // Handle session length decrement
  const handleSessionDecrement = () => {
    if (!isRunning && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (isSession) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  // Handle session length increment
  const handleSessionIncrement = () => {
    if (!isRunning && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (isSession) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  // Handle start/stop
  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  // Handle reset
  const handleReset = () => {
    // Stop the timer
    clearInterval(intervalRef.current);
    setIsRunning(false);
    
    // Reset values
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    setIsSession(true);
    
    // Stop and rewind audio
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  };

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft === 0) {
            // Play the beep sound
            audioRef.current.play();
            
            // Switch between session and break
            const newIsSession = !isSession;
            setIsSession(newIsSession);
            setTimerLabel(newIsSession ? 'Session' : 'Break');
            
            // Set the new time
            return newIsSession ? sessionLength * 60 : breakLength * 60;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Cleanup interval on unmount or when isRunning changes
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isSession, sessionLength, breakLength]);

  return (
    <div className="container">
      <h1>25 + 5 Clock</h1>
      
      <div className="length-control">
        <div className="length-control-wrapper">
          <h4 id="break-label">Break Length</h4>
          <div className="length-control-panel">
            <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
            <span id="break-length" className="length-value">{breakLength}</span>
            <button id="break-increment" onClick={handleBreakIncrement}>+</button>
          </div>
        </div>
        
        <div className="length-control-wrapper">
          <h4 id="session-label">Session Length</h4>
          <div className="length-control-panel">
            <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
            <span id="session-length" className="length-value">{sessionLength}</span>
            <button id="session-increment" onClick={handleSessionIncrement}>+</button>
          </div>
        </div>
      </div>
      
      <div className="timer">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left" className="timer-display">{formatTime(timeLeft)}</div>
        <div className="timer-control">
          <button id="start_stop" onClick={handleStartStop}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button id="reset" onClick={handleReset}>Reset</button>
        </div>
      </div>
      
      <audio 
        id="beep" 
        ref={audioRef}
        preload="auto" 
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
      
      <div className="credits">
        Designed and Coded by CAymen
      </div>
    </div>
  );
}

export default App;