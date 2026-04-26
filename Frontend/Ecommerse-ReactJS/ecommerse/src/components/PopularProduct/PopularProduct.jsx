import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import ProductItem from '@components/ProductItem/ProductItem';
import ProductItemSkeleton from '@components/skeletons/ProductItemSkeleton/ProductItemSkeleton';

function PopularProduct({ data, isLoading = false }) {
  const { container, containerItem } = styles;

  return (
    <MainLayout>
      <div className={container}>
        {isLoading ? (
          // Show 8 skeleton loaders while loading (matching typical product count)
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductItemSkeleton
                key={index}
                isShowGrid={true}
                isHomePage={true}
              />
            ))}
          </>
        ) : (
          // Show actual products when loaded
          data.map((item) => {
            const firstColor = item.colors?.[0];
            const images = firstColor?.images || [];
            const variants = firstColor?.variants || [];
            
            return (
              <ProductItem
                key={item.id}
                src={images[0]?.imageUrl}
                prevSrc={images[1]?.imageUrl || images[0]?.imageUrl}
                name={item.name}
                price={variants[0]?.price}
                details={item}
              />
            );
          })
        )}
      </div>
    </MainLayout>
  );
}

export default PopularProduct;
