import React, { useState, useEffect } from 'react';
import ContestBanner from '../components/ContestBanner';
import RecipeSection from '../components/RecipeSection';
import { Link } from 'react-router-dom';
function HomePage() {
  const contestBanners = [
    {
      backgroundImage: '/heroes_banner/1.png',
      title: 'Cooking Competition',
      description: 'Join the Tasty Cooking Challenge and compete for $1,000',
      link: '/competitions/open',
    },
    {
      backgroundImage: '/heroes_banner/2.png',
      title: 'Cooking Competition',
      description: 'Join the Delicious Cooking Contest and win amazing prizes',
      link: '/competitions/open',
    },
    {
      backgroundImage: '/heroes_banner/3.png',
      title: 'Cooking Competition',
      description: 'Participate in the Ultimate Cooking Battle and earn rewards',
      link: '/competitions/open',
    },
  ];

  // State to track the current banner index
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    // Set an interval to change the banner every 5 seconds
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % contestBanners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [contestBanners.length]);

  return (
    <div>
      <main className=''>
        <ContestBanner 
          backgroundImage={contestBanners[currentBannerIndex].backgroundImage}
          title={contestBanners[currentBannerIndex].title}
          description={contestBanners[currentBannerIndex].description}
          link={contestBanners[currentBannerIndex].link}/>
        <RecipeSection title= "Trending Recipes" type="trending"/>
        <RecipeSection title= "Most Recent Recipes" type="latest"/>
        <div className="text-center mt-6">
          <Link
            to="/recipes/search"
            className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            View More
          </Link>
        </div>
      </main>
    </div>  
  );
}

export default HomePage;
