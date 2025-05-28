// src/components/ui/ElectionTimer.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ElectionTimer = ({ startTime, endTime, status }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [timerLabel, setTimerLabel] = useState('');
  
  useEffect(() => {
    let intervalId = null;
    
    const calculateTimeRemaining = () => {
      const now = Date.now();
      
      // If election hasn't started yet
      if (now < startTime) {
        setTimerLabel('Starts in');
        const difference = startTime - now;
        updateRemainingTime(difference);
      }
      // If election is ongoing
      else if (now >= startTime && now < endTime) {
        setTimerLabel('Ends in');
        const difference = endTime - now;
        updateRemainingTime(difference);
      }
      // If election has ended
      else if (now >= endTime) {
        setTimerLabel('Ended');
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(intervalId);
      }
    };
    
    const updateRemainingTime = (difference) => {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    calculateTimeRemaining();
    intervalId = setInterval(calculateTimeRemaining, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, endTime]);
  
  // Special case for paused elections
  if (status === 'Paused') {
    return (
      <div className="bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full">
        Election Paused
      </div>
    );
  }
  
  return (
    <div className="text-center">
      <div className="text-sm text-gray-500 mb-1">{timerLabel}</div>
      <div className="flex space-x-2 text-center">
        <div className="bg-indigo-100 px-2 py-1 rounded-md">
          <span className="text-lg font-semibold text-indigo-800">{timeRemaining.days}</span>
          <span className="text-xs text-indigo-600 block">Days</span>
        </div>
        <div className="bg-indigo-100 px-2 py-1 rounded-md">
          <span className="text-lg font-semibold text-indigo-800">{timeRemaining.hours}</span>
          <span className="text-xs text-indigo-600 block">Hrs</span>
        </div>
        <div className="bg-indigo-100 px-2 py-1 rounded-md">
          <span className="text-lg font-semibold text-indigo-800">{timeRemaining.minutes}</span>
          <span className="text-xs text-indigo-600 block">Min</span>
        </div>
        <div className="bg-indigo-100 px-2 py-1 rounded-md">
          <span className="text-lg font-semibold text-indigo-800">{timeRemaining.seconds}</span>
          <span className="text-xs text-indigo-600 block">Sec</span>
        </div>
      </div>
    </div>
  );
};

ElectionTimer.propTypes = {
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  status: PropTypes.string
};

export default ElectionTimer;