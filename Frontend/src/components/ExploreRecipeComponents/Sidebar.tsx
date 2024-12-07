import React, { useState, useEffect } from 'react';
import FilterSection from './FilterSection';
import SearchBar from './SearchBar';
import axios from 'axios';

interface SidebarProps {
  filters: {
    category: string;
    ingredient: string;
    cookingTime: string;
    // difficulty: string;
    searchTerm: string;
    sortBy: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (value: string) => void;
  onSearch: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  sortOptions: Array<{ value: string; label: string; }>;
}

interface FilterData {
  categories: string[];
  ingredients: string[];
  // difficulties: string[];
  cookingTimes: { label: string; value: string; }[];
}

const defaultFilters = {
  category: '',
  ingredient: '',
  cookingTime: '',
  // difficulty: '',
  searchTerm: '',
  sortBy: 'newest'
};

const Sidebar: React.FC<SidebarProps> = ({ 
  filters = defaultFilters, // Thêm giá trị mặc định cho filters
  onFilterChange, 
  onSortChange,
  onSearch, 
  onInputChange,
  searchTerm,
  sortOptions 
}) => {
  const [filterData, setFilterData] = useState<FilterData>({
    categories: [],
    ingredients: [],
    // difficulties: [],
    cookingTimes: []
  });

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/recipes/filter-data');
        setFilterData(response.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  return (
    <aside className="w-full md:w-1/4 mb-6 md:mb-0">
      <div className="sticky top-4">
        <SearchBar 
          searchTerm={searchTerm}
          onInputChange={onInputChange}
          onSearch={onSearch}
        />

        {/* Sort Options */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Sort By</h3>
          <select 
            value={filters.sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <FilterSection
          title="Categories"
          items={filterData.categories}
          selectedValue={filters.category}
          filterType="category"
          onSelectItem={onFilterChange}
        />

        <FilterSection
          title="Ingredients"
          items={filterData.ingredients}
          selectedValue={filters.ingredient}
          filterType="ingredient"
          onSelectItem={onFilterChange}
        />

        {/* <FilterSection
          // title="Difficulty"
          items={filterData.difficulties}
          selectedValue={filters.difficulty}
          filterType="difficulty"
          onSelectItem={onFilterChange}
        /> */}

        <FilterSection
          title="Cooking Time"
          items={filterData.cookingTimes.map(ct => ct.label)}
          selectedValue={filters.cookingTime ? 
            filterData.cookingTimes.find(ct => ct.value === filters.cookingTime)?.label || '' 
            : ''}
          filterType="cookingTime"
          onSelectItem={(_, label) => {
            const timeOption = filterData.cookingTimes.find(ct => ct.label === label);
            if (timeOption) {
              onFilterChange('cookingTime', timeOption.value);
            }
          }}
        />
      </div>
    </aside>
  );
};

export default Sidebar;