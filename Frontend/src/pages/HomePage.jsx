import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ContestBanner from '../components/ContestBanner';
import RecipeSection from '../components/RecipeSection';
import Footer from '../components/Footer';

function HomePage() {
  const contestBanners = [
    {
      backgroundImage: 'http://localhost:3002/uploads/1733325761896-184013875.png',
      title: 'Cooking Competition',
      description: 'Join the Tasty Cooking Challenge and compete for $1,000',
      link: '/competitions/open',
    },
    {
      backgroundImage: 'http://localhost:3002/uploads/1733326615279-915184868.png',
      title: 'Cooking Competition',
      description: 'Join the Delicious Cooking Contest and win amazing prizes',
      link: '/competitions/open',
    },
    {
      backgroundImage: 'http://localhost:3002/uploads/1733326623467-738577660.png',
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
      <Header />
      <main className=' px-40 py-5 flex flex-col items-center justify-center min-h-screen pt-32'>

        {/* Only render the current banner */}
        <ContestBanner
          backgroundImage={contestBanners[currentBannerIndex].backgroundImage}
          title={contestBanners[currentBannerIndex].title}
          description={contestBanners[currentBannerIndex].description}
          link={contestBanners[currentBannerIndex].link}
        />

        <RecipeSection title="Trending Recipes" type="trending" />
        <RecipeSection title="Lastest Recipes" type="latest" />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
