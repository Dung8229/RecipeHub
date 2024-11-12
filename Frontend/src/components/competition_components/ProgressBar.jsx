import React, { useEffect, useRef, useState } from 'react';

const ProgressBar = ({ startDate, endDate }) => {
  const progressBarRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Ngắt observer sau khi chạy animation
        }
      },
      {
        threshold: 1, // Kích hoạt khi 50% của phần tử nằm trong viewport
      }
    );

    if (progressBarRef.current) {
      observer.observe(progressBarRef.current);
    }

    return () => {
      if (progressBarRef.current) {
        observer.unobserve(progressBarRef.current);
      }
    };
  }, []);

  // Tính tổng số ngày giữa startDate và endDate
  const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const timeLeft = Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  
  // Tính phần trăm tiến độ
  const progressPercentage = Math.min(100,((totalDays - timeLeft) / totalDays) * 100);

  return (
    <div className="w-full p-4 max-w-6xl mx-auto">
      <p className="text-lg font-bold mb-2">Progress</p>
      <div className="flex justify-between text-xs mb-1">
        <span>{new Date(startDate).toLocaleDateString()}</span>
        <span>{new Date(endDate).toLocaleDateString()}</span>
      </div>
      <div className="bg-gray-200 rounded-full h-2">
        <div 
          ref={progressBarRef}
          className={`bg-primary h-full rounded-full animate-pulse ${isVisible ? 'animate-progress' : ''}`}
          style={{ width: isVisible ? `${progressPercentage}%` : '0%' }}
        />
      </div>
      <p className="mt-2 text-red-500">{timeLeft == 0 ? 'Competition has ended' : `${timeLeft} days Left`}</p>
    </div>
  );
}

export default ProgressBar;
