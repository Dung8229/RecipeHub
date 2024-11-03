import React, { useState, useEffect } from 'react';
import FilterSection from './FilterSection';
import SearchBar from './SearchBar';
import axios from 'axios';

interface SidebarProps {
  onFilterChange: (filterType: string, value: string) => void;
  onSearch: (data: any) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
}

interface FilterData {
  categories: string[];
  ingredients: string[];
  difficulties: string[];
  cookingTimes: { label: string; value: string }[];
}

interface ImportMetaEnv {
  VITE_API_URL: string;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, onSearch, onInputChange }) => {
  const [filterData, setFilterData] = useState<FilterData>({
    categories: [],
    ingredients: [],
    difficulties: [],
    cookingTimes: []
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Thêm state cho searchTerm

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await axios.get('/api/recipes/filter-data'); // Đảm bảo URL này đúng
        setFilterData(response.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    onSearch(selectedItems); // Gọi onSearch với selectedItems khi chúng thay đổi
  }, [selectedItems]); // Theo dõi selectedItems
  useEffect(() => {
    onSearch(searchTerm); // Gọi onSearch với searchTerm khi nó thay đổi
  }, [searchTerm]); // Theo dõi searchTerm

  const handleSelectItem = (item: string) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems(prev => [...prev, item]);
      if (filterData.categories.includes(item)) {
        onFilterChange('category', item);
      } else if (filterData.ingredients.includes(item)) {
        onFilterChange('ingredient', item);
      } else if (filterData.difficulties.includes(item)) {
        onFilterChange('difficulty', item);
      } else {
        const selectedTime = filterData.cookingTimes.find(ct => ct.label === item);
        if (selectedTime) {
          onFilterChange('cookingTime', selectedTime.value);
        }
      }
    }
  };

  const handleRemoveItem = (item: string) => {
    setSelectedItems(prev => prev.filter(i => i !== item));
    if (filterData.categories.includes(item)) {
      onFilterChange('category', '');
    } else if (filterData.ingredients.includes(item)) {
      onFilterChange('ingredient', '');
    } else if (filterData.difficulties.includes(item)) {
      onFilterChange('difficulty', '');
    } else {
      onFilterChange('cookingTime', '');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes/search`, { 
        params: { searchTerm } 
      });
      // Cập nhật danh sách món ăn ở component cha
      onSearch(response.data); // Gọi onSearch với kết quả tìm kiếm
    } catch (error) {
      console.error('Lỗi khi tìm kiếm công thức:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Cập nhật giá trị searchTerm
    onInputChange(e); // Gọi hàm từ props để cập nhật searchTerm
  };

  return (
    <aside className="w-1/4 pr-6">
      <SearchBar 
        selectedItems={selectedItems} 
        onRemoveItem={handleRemoveItem} 
        onSearch={handleSearch}
        onInputChange={handleInputChange} // Đảm bảo rằng prop này được truyền đúng
        searchTerm={searchTerm}
      />
      <FilterSection
        title="Categories"
        items={filterData.categories}
        onSelectItem={handleSelectItem}
      />
      <FilterSection
        title="Ingredients"
        items={filterData.ingredients}
        onSelectItem={handleSelectItem}
      />
      <FilterSection
        title="Difficulty"
        items={filterData.difficulties}
        onSelectItem={handleSelectItem}
      />
      <FilterSection
        title="Cooking Time"
        items={filterData.cookingTimes.map(ct => ct.label)}
        onSelectItem={handleSelectItem}
      />
    </aside>
  );
};

export default Sidebar;
