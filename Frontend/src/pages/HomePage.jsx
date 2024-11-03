import React from 'react';
import Header from '../components/Header';
import ContestBanner from '../components/ContestBanner';
import RecipeSection from '../components/RecipeSection';
import Footer from '../components/Footer';
function HomePage() {
  return (
    <div>
      <Header />
      <main className='pt-32'>
        <ContestBanner />
        <RecipeSection title= "Trending Recipes" />
        <RecipeSection title= "Most Popular Recipes" />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
