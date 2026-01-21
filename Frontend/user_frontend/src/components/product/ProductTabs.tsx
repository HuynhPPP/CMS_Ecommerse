import { useState } from 'react';
import '../../styles/components/ProductTabs.css';

interface ProductTabsProps {
  description: string;
  reviews: React.ReactNode;
}

const ProductTabs = ({ description, reviews }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>(
    'description'
  );

  // Sanitize description to remove dangerous scripts but keep basic formatting
  const sanitizeDescription = (html: string): string => {
    if (!html) return 'Chưa có mô tả';

    // Remove script tags and event handlers
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '')
      .replace(/javascript:/gi, '');

    return sanitized;
  };

  return (
    <div className='product-tabs'>
      <div className='product-tabs__header'>
        <button
          className={`product-tabs__tab ${activeTab === 'description' ? 'product-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Mô Tả
        </button>
        <button
          className={`product-tabs__tab ${activeTab === 'reviews' ? 'product-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Đánh Giá
        </button>
      </div>

      <div className='product-tabs__content'>
        {activeTab === 'description' && (
          <div
            className='product-tabs__description'
            dangerouslySetInnerHTML={{
              __html: sanitizeDescription(description),
            }}
          />
        )}

        {activeTab === 'reviews' && (
          <div className='product-tabs__reviews'>{reviews}</div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
