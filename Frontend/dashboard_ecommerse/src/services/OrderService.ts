import axios from 'axios';

const API_URL = 'http://localhost:8386/api/orders';

const OrderService = {
  // Lấy danh sách tất cả đơn hàng (Cần API này ở backend)
  getAllOrders: async () => {
    // Lưu ý: Hiện tại backend chưa có getAllOrders, tôi sẽ cần bổ sung
    const res = await axios.get(`${API_URL}`);
    return res.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id: number) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id: number, status: string) => {
    const res = await axios.patch(`${API_URL}/${id}`, { status });
    return res.data;
  },
};

export default OrderService;
