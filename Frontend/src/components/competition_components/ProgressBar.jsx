import React, { useEffect, useRef, useState } from 'react';

const ProgressBar = ({ startDate, winnerSelectionStart, endDate }) => {
  const currentDate = new Date();

  // Tính toán số ngày tổng, còn lại, và tiến độ
  const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const timeLeft = Math.max(0, Math.ceil((new Date(endDate) - currentDate) / (1000 * 60 * 60 * 24)));
  const progressPercentage =
  currentDate < new Date(startDate)
    ? 0
    : Math.min(100, ((totalDays - timeLeft) / totalDays) * 100);

  // Xác định trạng thái hiện tại
  let status = '';
  if (currentDate < new Date(startDate)) {
    status = 'Not started yet';
  } else if (currentDate < new Date(winnerSelectionStart)) {
    status = `${timeLeft} days Left`;
  } else if (currentDate < new Date(endDate)) {
    status = 'Winner selection in progress';
  } else {
    status = 'Competition has ended';
  }

  return (
    <div className="w-full p-4 mx-auto">
      <p className="text-lg font-bold mb-2">Progress</p>

      {/* Hiển thị ngày bắt đầu và kết thúc */}
      <div className="flex justify-between text-xs mb-1">
        <span>{new Date(startDate).toLocaleDateString()}</span>
        <span>{new Date(endDate).toLocaleDateString()}</span>
      </div>

      {/* Hiển thị thanh tiến trình */}
      <div className="relative bg-gray-200 rounded-full h-2">
        <div
          className={`bg-primary h-full rounded-full`}
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Mốc ngày Winner Selection Start */}
        {winnerSelectionStart && (
          <div
            className="absolute bottom-[-20px] text-xs text-black"
            style={{
              left: `${Math.min(
                100,
                ((new Date(winnerSelectionStart) - new Date(startDate)) / (new Date(endDate) - new Date(startDate))) * 100
              )}%`,
              transform: 'translateX(-50%)', // Căn ngang mốc về giữa
            }}
            title={`Winner Selection Phase`}
          >
            {new Date(winnerSelectionStart).toLocaleDateString()}
          </div>
        )}

        {/* Hiển thị mốc với dấu chỉ */}
        {startDate && (
          <div
            className="absolute top-[-4px] bg-green-500 rounded-full h-4 w-4 border border-white"
            style={{
              left: `${Math.min(
                100,
                ((new Date(startDate) - new Date(startDate)) / (new Date(endDate) - new Date(startDate))) * 100
              )}%`,
            }}
            title={`Competition Starts!`}
          />
        )}

        {winnerSelectionStart && (
          <div
            className="absolute top-[-4px] -translate-x-1/2 bg-red-500 rounded-full h-4 w-4 border border-white"
            style={{
              left: `${Math.min(
                100,
                ((new Date(winnerSelectionStart) - new Date(startDate)) / (new Date(endDate) - new Date(startDate))) * 100
              )}%`,
            }}
            title={`Winner Selection Phase`}
          />
        )}

        {endDate && (
          <div
            className="absolute top-[-4px] -translate-x-3/4 bg-blue-500 rounded-full h-4 w-4 border border-white"
            style={{
              left: `${Math.min(
                100,
                ((new Date(endDate) - new Date(startDate)) / (new Date(endDate) - new Date(startDate))) * 100
              )}%`,
            }}
            title={`Winner Announcement`}
          />
        )}
      </div>

      {/* Hiển thị trạng thái */}
      <p className="mt-2 text-red-500">{status}</p>
    </div>
  );
};

export default ProgressBar;
