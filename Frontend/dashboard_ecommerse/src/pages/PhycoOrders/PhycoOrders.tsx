import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import AppFilter from '../../components/common/AppFilter';
import { Button, message, Modal, Select } from 'antd';
import TablePhycoOrders from './TablePhycoOrders';
import ModalPhycoOrders from './Modal';
import PhycoOrderService from '../../services/PhycoOrderService';
import type { PhycoOrder, PhycoOrderQuery } from './Type';
import { useDebounce } from '../../hooks/useDebounce';
import './PhycoOrders.css';

const { Option } = Select;

const PhycoOrdersFilters = [
  {
    type: 'input' as const,
    name: 'search',
    label: 'Tìm kiếm',
    placeholder: 'Mã đơn, email...',
  },
  {
    type: 'select' as const,
    name: 'status',
    label: 'Trạng thái',
    placeholder: 'Tất cả trạng thái',
    options: [
      { label: 'Tất cả', value: '' },
      { label: 'Chờ xác nhận', value: 'PENDING' },
      { label: 'Đã xác nhận', value: 'CONFIRMED' },
      { label: 'Đang xử lý', value: 'PROCESSING' },
      { label: 'Đang giao', value: 'SHIPPED' },
      { label: 'Đã giao', value: 'DELIVERED' },
      { label: 'Đã hủy', value: 'CANCELLED' },
    ],
  },
];

const PhycoOrders = () => {
  const { isDark } = useContext(ThemeContext);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PhycoOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<PhycoOrderQuery>({
    search: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [orders, setOrders] = useState<PhycoOrder[]>([]);
  const debouncedSearch = useDebounce(query.search, 400);

  const handleGetValueFilter = (valueFilter: any) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: valueFilter?.search || '',
      status: valueFilter?.status || '',
    }));
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await PhycoOrderService.getOrders(query);

      const ordersData = Array.isArray(res.data) ? res.data : [];
      setOrders(ordersData);

      setQuery((prev) => ({
        ...prev,
        page: res.meta?.page ?? prev.page,
        limit: res.meta?.limit ?? prev.limit,
        meta: res.meta,
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      message.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleModal = () => {
    setOpenModal(!openModal);
    if (openModal) {
      setSelectedOrder(null);
    }
  };

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize,
    }));
  };

  const handleDetailOrder = async (id: number) => {
    try {
      const order = await PhycoOrderService.getOrderById(id);
      setSelectedOrder(order);
      setOpenModal(true);
    } catch (error) {
      message.error('Không thể tải chi tiết đơn hàng');
    }
  };

  const handleStatusChange = (order: PhycoOrder) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  useEffect(() => {
    fetchOrders();
  }, [query.limit, query.page, debouncedSearch, query.status]);

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        background: isDark ? '#262626' : '#fff',
        boxShadow: isDark
          ? '0 2px 8px rgba(0, 0, 0, 0.6)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className='flex items-center justify-between mb-10'>
        <AppFilter
          filters={PhycoOrdersFilters}
          onChange={handleGetValueFilter}
        />

        <Button type='primary' onClick={fetchOrders} loading={isLoading}>
          Làm mới
        </Button>
      </div>

      <TablePhycoOrders
        loading={isLoading}
        page={query.page ?? 1}
        pageSize={query.limit ?? 10}
        total={query?.meta?.total ?? 0}
        orders={orders}
        onPageChange={handleChangePageSizeTable}
        onDetail={handleDetailOrder}
        onStatusChange={handleStatusChange}
      />

      <ModalPhycoOrders
        open={openModal}
        onClose={handleToggleModal}
        onSuccess={() => {
          fetchOrders();
        }}
        order={selectedOrder}
      />
    </div>
  );
};

export default PhycoOrders;
