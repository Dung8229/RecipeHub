import React from 'react';

interface FilterSectionProps {
  title: string;
  items: string[];
  onSelectItem: (filterType: string, value: string) => void; // Mong đợi hai tham số
}

interface FilterSectionProps {
  title: string;
  items: string[];
  onSelectItem: (filterType: string, value: string) => void;
}

interface FilterSectionProps {
  title: string;
  items: string[];
  onSelectItem: (filterType: string, value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, items, onSelectItem }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelectItem(item, item)}
          className="px-4 py-2 bg-[#f5f2f0] rounded-full text-sm font-medium text-[#181311] hover:bg-[#ff8c00] hover:text-white transition-colors"
        >
          {item}
        </button>
      ))}
    </div>
  </div>
);

export default FilterSection;

