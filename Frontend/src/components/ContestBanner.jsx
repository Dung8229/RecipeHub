import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContestBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
          <img src="https://placehold.co/1200x500" alt="Contest Image" className="w-full h-auto" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end items-start p-8">
              <h1 className="text-4xl font-bold text-white mb-2">Cooking Competition</h1>
              <p className="text-lg text-white mb-4">Join the Tasty Cooking Challenge and compete for $1,000</p>
              <button 
                className="bg-primary hover:bg-primaryHover text-white font-bold py-2 px-4 rounded-full"
                onClick={() => navigate('/competitions/open')}
              >Learn More</button>
          </div>
      </div>
    </div>
  );
};

export default ContestBanner;