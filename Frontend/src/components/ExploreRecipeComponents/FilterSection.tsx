import React, { useState } from 'react';

interface FilterSectionProps {
  title: string;
  items: string[];
  selectedValue: string;
  filterType: string;
  onSelectItem: (filterType: string, value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  items,
  selectedValue,
  filterType,
  onSelectItem
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc items dựa trên searchTerm
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hiển thị 6 items đầu tiên hoặc tất cả nếu showAll = true
  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        {items.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-orange-500 text-sm hover:text-orange-600"
          >
            {showAll ? 'Show less' : 'Show more...'}
          </button>
        )}
      </div>

      {/* Thanh tìm kiếm cho bộ lọc */}
      <input
        type="text"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="flex flex-wrap gap-2">
        {displayedItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectItem(filterType, item)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedValue === item 
                ? 'bg-[#ff8c00] text-white' 
                : 'bg-[#f5f2f0] text-[#181311] hover:bg-[#ff8c00] hover:text-white'
              }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;

