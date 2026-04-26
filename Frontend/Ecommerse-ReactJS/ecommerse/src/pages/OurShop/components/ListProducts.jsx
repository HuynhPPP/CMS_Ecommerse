import MainLayout from '@components/Layout/Layout';
import { useContext } from 'react';
import { OurShopContext } from '@/contexts/OurShopProvider';
import ProductItem from '@components/ProductItem/ProductItem';
import styles from '../styles.module.scss';
import Button from '@components/Button/Button';
import LoadingTextCommon from '@components/LoadingTextCommon/LoadingTextCommon';
import ProductItemSkeleton from '@components/skeletons/ProductItemSkeleton/ProductItemSkeleton';

function ListProducts() {
  const { containerProduct, sectionListProduct } = styles;
  const {
    products,
    isShowGrid,
    isLoading,
    handleLoadMore,
    total,
    isLoadMore,
    showId,
  } = useContext(OurShopContext);

  // Calculate skeleton count based on showId
  const getSkeletonCount = () => {
    if (showId === 'all') return 8; // Default to 8 for 'all'
    return parseInt(showId) || 8;
  };

  return (
    <div className={sectionListProduct}>
      <MainLayout>
        {isLoading ? (
          <div className={isShowGrid ? containerProduct : ''}>
            {Array.from({ length: getSkeletonCount() }).map((_, index) => (
              <ProductItemSkeleton
                key={index}
                isShowGrid={isShowGrid}
                isHomePage={false}
              />
            ))}
          </div>
        ) : (
          <>
            <div className={isShowGrid ? containerProduct : ''}>
              {products.map((item) => (
                <ProductItem
                  key={item._id}
                  src={item.images[0]}
                  prevSrc={item.images[1]}
                  name={item.name}
                  price={item.price}
                  details={item}
                  isHomePage={false}
                />
              ))}
            </div>
            {total > products.length && (
              <div
                style={{
                  width: '180px',
                  margin: '50px auto',
                }}
              >
                <Button
                  content={
                    isLoadMore ? <LoadingTextCommon /> : 'LOAD MORE PRODUCTS'
                  }
                  isPrimary={false}
                  onClick={handleLoadMore}
                />
              </div>
            )}
          </>
        )}
      </MainLayout>
    </div>
  );
}

export default ListProducts;
