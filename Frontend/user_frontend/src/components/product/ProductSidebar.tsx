import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import type { FilterState, PriceRange } from '../../types';
import '../../styles/components/ProductSidebar.css';

interface Category {
  id: number;
  name: string;
  count: number;
}

interface ProductSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: Category[];
  priceRange: PriceRange;
  tags: string[];
}

const ProductSidebar = ({
  filters,
  onFilterChange,
  categories,
  priceRange,
  tags,
}: ProductSidebarProps) => {
  const [minPrice, setMinPrice] = useState(filters.priceRange.min);
  const [maxPrice, setMaxPrice] = useState(filters.priceRange.max);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryToggle = (categoryId: number) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = () => {
    onFilterChange({
      ...filters,
      priceRange: { min: minPrice, max: maxPrice },
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFilterChange({ ...filters, tags: newTags });
  };

  return (
    <aside className='product-sidebar'>
      {/* Search */}
      <div className='sidebar-section'>
        <h3 className='sidebar-title'>Tìm sản phẩm</h3>
        <div className='search-box'>
          <input
            type='text'
            placeholder='Tìm sản phẩm...'
            value={filters.search}
            onChange={handleSearchChange}
            className='search-input'
          />
          <AiOutlineSearch className='search-icon' size={18} />
        </div>
      </div>

      {/* Categories */}
      <div className='sidebar-section'>
        <h3 className='sidebar-title'>Loại sản phẩm</h3>
        <ul className='category-list'>
          {categories.map((category) => (
            <li key={category.id} className='category-item'>
              <label className='category-label'>
                <input
                  type='checkbox'
                  checked={filters.categories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className='category-checkbox'
                />
                <span className='category-name'>{category.name}</span>
                <span className='category-count'>{category.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className='sidebar-section'>
        <h3 className='sidebar-title'>Giá</h3>
        <div className='price-range'>
          <div className='price-inputs'>
            <input
              type='number'
              placeholder='Min'
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className='price-input'
              min={priceRange.min}
              max={priceRange.max}
            />
            <span className='price-separator'>-</span>
            <input
              type='number'
              placeholder='Max'
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className='price-input'
              min={priceRange.min}
              max={priceRange.max}
            />
          </div>
          <button onClick={handlePriceChange} className='price-apply-btn'>
            Áp dụng
          </button>
          <div className='price-display'>
            Giá: {minPrice.toLocaleString('vi-VN')}đ -{' '}
            {maxPrice.toLocaleString('vi-VN')}đ
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className='sidebar-section'>
        <h3 className='sidebar-title'>Thẻ sản phẩm</h3>
        <div className='tag-list'>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`tag-btn ${filters.tags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;
