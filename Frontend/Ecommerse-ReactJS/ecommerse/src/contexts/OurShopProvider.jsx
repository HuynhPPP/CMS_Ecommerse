import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getProducts } from '@/apis/productsService';
import { ToastContext } from './ToastProvider';

export const OurShopContext = createContext();

export const OurShopProvider = ({ children }) => {
  const { toast } = useContext(ToastContext);

  const sortOptions = [
    { label: 'Default sorting', value: '0' },
    { label: 'Sort by popularity', value: '1' },
    { label: 'Sort by average rating', value: '2' },
    { label: 'Sort by latest', value: '3' },
    { label: 'Sort by price: low to high', value: '4' },
    { label: 'Sort by price: high to low', value: '5' },
  ];

  const showOptions = [
    { label: '8', value: '8' },
    { label: '12', value: '12' },
    { label: 'All', value: 'all' },
  ];

  const [sortId, setSortId] = useState('0');
  const [showId, setShowId] = useState('8');
  const [isShowGrid, setIsShowGrid] = useState(true);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handleLoadMore = () => {
    const query = {
      sortType: sortId,
      page: +page + 1,
      limit: showId,
    };
    setIsLoadMore(true);
    getProducts(query)
      .then((res) => {
        setProducts((prev) => {
          return [...prev, ...res.contents];
        });
        setPage(+res.page);
        setTotal(res.total);
        setIsLoadMore(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadMore(false);

        // Show appropriate error message
        if (err.isTimeout) {
          toast.error('Request timeout. Please try again!');
        } else if (err.isNetworkError) {
          toast.error('Network error. Please check your internet connection!');
        } else {
          toast.error('Failed to load more products. Please try again!');
        }
      });
  };

  const values = {
    sortOptions,
    showOptions,
    setSortId,
    setShowId,
    setIsShowGrid,
    products,
    isShowGrid,
    isLoading,
    isLoadMore,
    handleLoadMore,
    total,
  };

  useEffect(() => {
    const query = {
      sortType: sortId,
      page: 1,
      limit: showId,
    };
    setIsLoading(true);

    // TODO: Remove this setTimeout after testing skeleton loader
    // Delay the entire fetch to see skeleton for 3 seconds
    setTimeout(() => {
      getProducts(query)
        .then((res) => {
          setProducts(res.contents);
          setTotal(res.total);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);

          // Show appropriate error message
          if (err.isTimeout) {
            toast.error('Request timeout. Please try again!');
          } else if (err.isNetworkError) {
            toast.error(
              'Network error. Please check your internet connection!'
            );
          } else {
            toast.error('Failed to load products. Please try again!');
          }
        });
    });
  }, [sortId, showId]);

  return (
    <OurShopContext.Provider value={values}>{children}</OurShopContext.Provider>
  );
};
