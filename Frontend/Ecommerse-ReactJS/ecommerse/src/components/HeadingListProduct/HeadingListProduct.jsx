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
            data.map((item) => {
              // Lấy ảnh từ màu sắc đầu tiên
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
      </div>
    </MainLayout>
  );
}

export default HeadingListProduct;
