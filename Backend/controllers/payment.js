const prisma = require('../lib/prisma');

const paymentController = {
  // Xử lý Webhook từ SePay hoặc dịch vụ tương tự
  handleSePayWebhook: async (req, res) => {
    try {
      // SePay thường gửi dữ liệu trong body
      // Cấu trúc mẫu: { content: "123", amount: 50000, ... }
      // 'content' thường chứa nội dung chuyển khoản (chính là orderId của chúng ta)
      const { content, amount } = req.body;

      if (!content) {
        return res.status(400).json({ message: 'Thiếu nội dung chuyển khoản' });
      }

      // 1. Tìm đơn hàng dựa trên nội dung chuyển khoản (OrderId)
      const orderId = parseInt(content.replace(/[^0-9]/g, '')); // Loại bỏ ký tự lạ nếu có
      
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        console.error(`Không tìm thấy đơn hàng ID: ${orderId}`);
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      // 2. Kiểm tra số tiền (tùy chọn)
      if (parseFloat(amount) < order.totalAmount) {
        console.warn(`Số tiền thanh toán (${amount}) nhỏ hơn giá trị đơn hàng (${order.totalAmount})`);
        // Có thể ghi log hoặc xử lý tùy nghiệp vụ
      }

      // 3. Cập nhật trạng thái đơn hàng sang SUCCESS
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'SUCCESS' },
      });

      console.log(`Đã cập nhật trạng thái đơn hàng ${orderId} thành SUCCESS qua Webhook`);

      return res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
      console.error('Lỗi xử lý Webhook thanh toán:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = paymentController;
