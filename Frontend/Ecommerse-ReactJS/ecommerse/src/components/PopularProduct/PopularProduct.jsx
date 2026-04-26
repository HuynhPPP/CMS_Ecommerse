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
          data.map((item) => (
            <ProductItem
              key={item._id}
              src={item.images[0]}
              prevSrc={item.images[1]}
              name={item.name}
              price={item.price}
              details={item}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}

export default PopularProduct;
