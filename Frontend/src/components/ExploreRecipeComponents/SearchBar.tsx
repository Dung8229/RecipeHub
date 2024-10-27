import React, { useEffect, useState } from 'react';

interface SearchBarProps {
  selectedItems: string[];
  onRemoveItem: (item: string) => void;
  onSearch: (searchTerm: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ selectedItems, onRemoveItem, onSearch, onInputChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Cập nhật giá trị searchTerm
    onInputChange(e); // Gọi hàm từ props để cập nhật searchTerm

  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text" 
          onChange={onInputChange}
          className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#f5f2f0] text-[#8a7060] placeholder-[#8a7060] focus:outline-none"
          placeholder="Search recipes, ingredients..."
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bg-[#ff8c00] text-white px-2 py-1 rounded-lg"
        >
          Search
        </button>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-[#8a7060]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </form>
      <div className="flex flex-wrap mt-2">
        {selectedItems.map((item, index) => (
          <div key={index} className="flex items-center bg-[#f5f2f0] rounded-full px-3 py-1 mr-2 mb-2">
            <span className="text-sm text-[#8a7060]">{item}</span>
            <button onClick={() => onRemoveItem(item)} className="ml-2 text-[#ff8c00]">
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;



