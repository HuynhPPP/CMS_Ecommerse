import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services';
import type { Product } from '../../types';
import '../../styles/components/SearchBar.css';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setLoading(true);
        const response = await productService.searchProducts(query, {
          limit: 5,
        });
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (product: Product) => {
    navigate(`/products/${product.id}`);
    setIsOpen(false);
    setShowSuggestions(false);
    setQuery('');
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  return (
    <div className='search-bar' ref={searchRef}>
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            className='btn-icon search-toggle'
            onClick={() => setIsOpen(true)}
            aria-label='Tìm kiếm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AiOutlineSearch size={22} />
          </motion.button>
        ) : (
          <motion.div
            className='search-expanded'
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSearch} className='search-form'>
              <AiOutlineSearch className='search-icon' size={18} />
              <input
                ref={inputRef}
                type='text'
                className='search-input'
                placeholder='Tìm kiếm sản phẩm...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type='button'
                  className='search-clear'
                  onClick={() => {
                    setQuery('');
                    setShowSuggestions(false);
                  }}
                >
                  <AiOutlineClose size={16} />
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  className='search-suggestions'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {loading ? (
                    <div className='suggestion-loading'>Đang tìm kiếm...</div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {suggestions.map((product) => (
                        <div
                          key={product.id}
                          className='suggestion-item'
                          onClick={() => handleSuggestionClick(product)}
                        >
                          <img
                            src={
                              product.featuredImageUrl ||
                              'https://via.placeholder.com/40'
                            }
                            alt={product.name}
                            className='suggestion-image'
                          />
                          <div className='suggestion-info'>
                            <div className='suggestion-name'>
                              {product.name}
                            </div>
                            <div className='suggestion-price'>
                              {(
                                product.salePrice ||
                                product.price ||
                                0
                              ).toLocaleString('vi-VN')}
                              ₫
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        className='suggestion-view-all'
                        onClick={handleViewAllResults}
                      >
                        Xem tất cả kết quả cho "{query}"
                      </button>
                    </>
                  ) : (
                    <div className='suggestion-empty'>
                      Không tìm thấy sản phẩm
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
