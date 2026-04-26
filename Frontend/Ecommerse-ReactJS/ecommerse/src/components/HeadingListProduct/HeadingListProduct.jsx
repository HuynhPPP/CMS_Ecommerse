import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import CountdownTimer from '@components/CountDownTimer/CountDownTimer';
import CountDownBanner from '@components/CountDownBanner/CountDownBanner';
import ProductItem from '@components/ProductItem/ProductItem';
import ProductItemSkeleton from '@components/skeletons/ProductItemSkeleton/ProductItemSkeleton';

function HeadingListProduct({ data, isLoading = false }) {
  const { container, containerItem } = styles;

  return (
    <MainLayout>
      <div className={container}>
        <CountDownBanner />
        <div className={containerItem}>
          {isLoading ? (
            // Show 2 skeleton loaders while loading
            <>
              <ProductItemSkeleton isShowGrid={true} isHomePage={true} />
              <ProductItemSkeleton isShowGrid={true} isHomePage={true} />
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
      </div>
    </MainLayout>
  );
}

export default HeadingListProduct;
