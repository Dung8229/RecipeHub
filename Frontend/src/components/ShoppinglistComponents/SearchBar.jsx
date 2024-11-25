import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onAddIngredient }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // Logic tìm kiếm nguyên liệu từ API hoặc danh sách cục bộ
    // Ví dụ: gọi API để tìm kiếm nguyên liệu
    // Sau khi tìm kiếm, gọi onAddIngredient với nguyên liệu được chọn
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search for an ingredient"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 pl-4 rounded-l-lg border border-black"
      />
      <button
        onClick={handleSearch}
        className="absolute right-0 top-0 h-full px-4 bg-[#ff8c00] rounded-r-lg border border-black flex items-center justify-center"
      >
        <FaSearch className="text-white" />
      </button>
    </div>
  );
};

export default SearchBar; 