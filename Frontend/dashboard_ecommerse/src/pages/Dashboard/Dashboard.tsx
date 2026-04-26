import { useContext } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Typography, Space, Button } from 'antd';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ThemeContext } from '../../contexts/ThemeContext';
import styles from './Dashboard.module.css';

const { Title, Text } = Typography;

// Dữ liệu mẫu (Đã Việt hóa)
const revenueData = [
  { name: 'Th.1', revenue: 4000, orders: 240 },
  { name: 'Th.2', revenue: 3000, orders: 198 },
  { name: 'Th.3', revenue: 2000, orders: 150 },
  { name: 'Th.4', revenue: 2780, orders: 208 },
  { name: 'Th.5', revenue: 1890, orders: 180 },
  { name: 'Th.6', revenue: 2390, orders: 250 },
  { name: 'Th.7', revenue: 3490, orders: 310 },
];

const categoryData = [
  { name: 'Điện tử', value: 400 },
  { name: 'Thời trang', value: 300 },
  { name: 'Đồ gia dụng', value: 300 },
  { name: 'Làm đẹp', value: 200 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'];

const recentOrders = [
  {
    key: '1',
    id: '#ORD-7732',
    customer: 'Nguyễn Văn A',
    product: 'iPhone 15 Pro',
    amount: '24.990.000₫',
    status: 'Đã giao',
    date: '2024-03-20',
  },
  {
    key: '2',
    id: '#ORD-7731',
    customer: 'Trần Thị B',
    product: 'MacBook Air M3',
    amount: '32.490.000₫',
    status: 'Đang xử lý',
    date: '2024-03-19',
  },
  {
    key: '3',
    id: '#ORD-7730',
    customer: 'Lê Văn C',
    product: 'AirPods Max',
    amount: '13.500.000₫',
    status: 'Đang giao',
    date: '2024-03-19',
  },
];

const Dashboard = () => {
  const { isDark } = useContext(ThemeContext);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text strong style={{ color: isDark ? '#f8fafc' : '#1e293b' }}>{text}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (text: string) => <Text style={{ color: isDark ? '#cbd5e1' : '#475569' }}>{text}</Text>,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (text: string) => <Text style={{ color: isDark ? '#cbd5e1' : '#475569' }}>{text}</Text>,
    },
    {
      title: 'Giá trị',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => <span style={{ fontWeight: 600, color: isDark ? '#818cf8' : '#4f46e5' }}>{amount}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'Đã giao') color = 'green';
        if (status === 'Đang xử lý') color = 'orange';
        return <Tag color={color} style={{ borderRadius: '6px' }}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const chartTextColor = isDark ? '#94a3b8' : '#64748b';
  const chartGridColor = isDark ? '#334155' : '#f1f5f9';

  return (
    <div className={`${styles.dashboardContainer} ${isDark ? styles.dark : ''}`}>
      <header style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: isDark ? '#fff' : '#000' }}>Tổng quan Dashboard</Title>
        <Text type="secondary" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Chào mừng bạn trở lại, đây là tình hình kinh doanh của cửa hàng hôm nay.</Text>
      </header>

      {/* Thẻ Thống kê */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.iconWrapper} style={{ background: isDark ? 'rgba(79, 70, 229, 0.1)' : '#e0e7ff' }}>
              <DollarSign size={24} color="#6366f1" />
            </div>
            <Statistic 
              title={<span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Tổng Doanh thu</span>}
              value={128430000} 
              suffix="₫"
              valueStyle={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}
            />
            <div className={`${styles.trend} ${styles.trendUp} ${isDark ? styles.dark : ''}`}>
              <ArrowUpRight size={14} /> 12.5% so với tháng trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.iconWrapper} style={{ background: isDark ? 'rgba(217, 119, 6, 0.1)' : '#fef3c7' }}>
              <ShoppingBag size={24} color="#f59e0b" />
            </div>
            <Statistic 
              title={<span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Tổng Đơn hàng</span>}
              value={1240} 
              valueStyle={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}
            />
            <div className={`${styles.trend} ${styles.trendUp} ${isDark ? styles.dark : ''}`}>
              <ArrowUpRight size={14} /> 8.2% so với tháng trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.iconWrapper} style={{ background: isDark ? 'rgba(22, 163, 74, 0.1)' : '#dcfce7' }}>
              <Users size={24} color="#10b981" />
            </div>
            <Statistic 
              title={<span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Tổng Khách hàng</span>}
              value={4820} 
              valueStyle={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}
            />
            <div className={`${styles.trend} ${styles.trendUp} ${isDark ? styles.dark : ''}`}>
              <ArrowUpRight size={14} /> 5.4% so với tháng trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.iconWrapper} style={{ background: isDark ? 'rgba(220, 38, 38, 0.1)' : '#fee2e2' }}>
              <TrendingUp size={24} color="#ef4444" />
            </div>
            <Statistic 
              title={<span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Tỷ lệ Chuyển đổi</span>}
              value={3.24} 
              precision={2}
              suffix="%"
              valueStyle={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}
            />
            <div className={`${styles.trend} ${styles.trendDown} ${isDark ? styles.dark : ''}`}>
              <ArrowDownRight size={14} /> 1.2% so với tháng trước
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Biểu đồ Doanh thu */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space style={{ color: isDark ? '#fff' : '#000' }}>
                <DollarSign size={18} />
                <span>Tăng trưởng Doanh thu</span>
              </Space>
            } 
            className={`${styles.chartContainer} ${isDark ? styles.dark : ''}`}
            extra={<Tag icon={<Calendar size={12} />} color="blue">7 Tháng gần nhất</Tag>}
          >
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: chartTextColor, fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: chartTextColor, fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1f1f1f' : '#fff',
                      borderRadius: '12px', 
                      border: isDark ? '1px solid #303030' : 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      color: isDark ? '#fff' : '#000'
                    }} 
                    itemStyle={{ color: isDark ? '#fff' : '#000' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Biểu đồ Tròn theo Danh mục */}
        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ color: isDark ? '#fff' : '#000' }}>Doanh số theo Danh mục</span>}
            className={`${styles.chartContainer} ${isDark ? styles.dark : ''}`}
          >
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1f1f1f' : '#fff',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #303030' : 'none',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 20 }}>
                {categoryData.map((item, index) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Space>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[index] }} />
                      <Text style={{ color: isDark ? '#cbd5e1' : '#64748b' }}>{item.name}</Text>
                    </Space>
                    <Text strong style={{ color: isDark ? '#f8fafc' : '#1e293b' }}>{item.value}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Bảng Đơn hàng Gần đây */}
        <Col xs={24}>
          <Card 
            title={
              <Space style={{ color: isDark ? '#fff' : '#000' }}>
                <Package size={18} />
                <span>Đơn hàng Gần đây</span>
              </Space>
            } 
            className={`${styles.chartContainer} ${isDark ? styles.dark : ''}`}
            styles={{ body: { padding: '0 24px' } }}
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <Table 
              columns={columns} 
              dataSource={recentOrders} 
              pagination={false}
              rowClassName={() => (isDark ? 'dark-row' : '')}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
