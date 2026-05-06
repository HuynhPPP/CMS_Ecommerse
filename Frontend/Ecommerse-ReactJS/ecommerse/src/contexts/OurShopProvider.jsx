import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getProducts, searchProductsByELK } from '@/apis/productsService';
import { ToastContext } from './ToastProvider';

export const OurShopContext = createContext();

export const OurShopProvider = ({ children }) => {
  const { toast } = useContext(ToastContext);

  const sortOptions = [
    { label: 'Default sorting', value: '0' },
    { label: 'Sort by latest', value: 'latest' },
    { label: 'Sort by price: low to high', value: 'price_asc' },
    { label: 'Sort by price: high to low', value: 'price_desc' },
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

  // Hàm xử lý chung để lấy dữ liệu (Tự động chọn API phù hợp)
  const fetchData = async (isMore = false) => {
    const currentPage = isMore ? page + 1 : 1;
    const limit = showId === 'all' ? 100 : parseInt(showId);
    
    // Nếu sortId là giá hoặc latest -> Dùng ELK. Ngược lại dùng API gốc.
    const useELK = ['latest', 'price_asc', 'price_desc'].includes(sortId);

    try {
      let res;
      if (useELK) {
        res = await searchProductsByELK({
          sort: sortId,
          page: currentPage,
          limit: limit
        });
        // Map dữ liệu từ ELK (results, total)
        const newProducts = res.results || [];
        setProducts(prev => isMore ? [...prev, ...newProducts] : newProducts);
        setTotal(res.total || 0);
      } else {
        res = await getProducts({
          sortType: sortId,
          page: currentPage,
          limit: limit
        });
        // Map dữ liệu từ API gốc (data, meta.total)
        const newProducts = res.data || [];
        setProducts(prev => isMore ? [...prev, ...newProducts] : newProducts);
        setTotal(res.meta?.total || 0);
      }
      
      if (isMore) setPage(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products.');
    }
  };

  const handleLoadMore = () => {
    setIsLoadMore(true);
    fetchData(true).finally(() => setIsLoadMore(false));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData(false).finally(() => setIsLoading(false));
  }, [sortId, showId]);

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
    sortId,
    showId,
  };

  return (
    <OurShopContext.Provider value={values}>{children}</OurShopContext.Provider>
  );
};
