import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onInputChange, 
  onSearch 
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text" 
          value={searchTerm}
          onChange={onInputChange}
          className="w-full h-12 pl-10 pr-20 rounded-xl bg-[#f5f2f0] text-[#8a7060] placeholder-[#8a7060] focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Search recipes, ingredients..."
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bg-[#ff8c00] text-white px-4 py-1.5 rounded-lg hover:bg-[#e67e00] transition-colors"
        >
          Search
        </button>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 absolute left-3 top-3.5 text-[#8a7060]" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
            clipRule="evenodd" 
          />
        </svg>
      </form>
    </div>
  );
};

export default SearchBar;