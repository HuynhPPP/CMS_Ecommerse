import axiosInstance from '../utils/axiosInstance';

const OrderService = {
  // Lấy danh sách tất cả đơn hàng (Dùng cho Admin)
  getAllOrders: async () => {
    const res = await axiosInstance.get('/orders');
    return res.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id: number) => {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data;
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id: number, status: string) => {
    const res = await axiosInstance.patch(`/orders/${id}`, { status });
    return res.data;
  },
};

export default OrderService;
