import React from 'react';
import ContestBanner from '../components/ContestBanner';
import RecipeSection from '../components/RecipeSection';
function HomePage() {
  return (
    <div>
      <main className=''>
        <ContestBanner />
        <RecipeSection title= "Trending Recipes" />
        <RecipeSection title= "Most Popular Recipes" />
      </main>
    </div>
  );
}

export default HomePage;
