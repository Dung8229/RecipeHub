import React from 'react';
import Navbar from '../components/admin_components/Navbar';
import RecipeList from '../components/admin_components/RecipeList';

function AdminManageRecipePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <RecipeList />
      </main>
    </div>
  );
}

export default AdminManageRecipePage;
