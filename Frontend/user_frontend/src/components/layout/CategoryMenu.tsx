import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services';
import type { Category } from '../../types';
import '../../styles/layout/CategoryMenu.css';

const CategoryMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoryTree = await categoryService.getCategoryTree();
      setCategories(categoryTree);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Không thể tải danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Get all children from all categories for right column
  const allChildren = categories.flatMap((category) => category.children || []);

  return (
    <div className='category-menu'>
      <button className='category-menu-trigger'>Toàn bộ danh mục</button>

      <div className='category-dropdown'>
        {loading ? (
          <div className='category-loading'>Đang tải danh mục...</div>
        ) : error ? (
          <div className='category-error'>{error}</div>
        ) : categories.length === 0 ? (
          <div className='category-empty'>Không có danh mục nào</div>
        ) : (
          <div className='category-dropdown-inner'>
            {/* Left Column - Parent Categories */}
            <div className='category-column category-column-left'>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className='category-parent-link'
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Right Column - All Children */}
            <div className='category-column category-column-right'>
              {allChildren.length > 0 ? (
                allChildren.map((child) => (
                  <Link
                    key={child.id}
                    to={`/products?category=${child.id}`}
                    className='category-child-link'
                  >
                    {child.name}
                  </Link>
                ))
              ) : (
                <div className='category-empty-children'>
                  Không có danh mục con
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMenu;
