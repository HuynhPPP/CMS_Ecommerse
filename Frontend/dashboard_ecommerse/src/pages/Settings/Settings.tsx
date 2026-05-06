import { useContext, useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Space, Button, Form, Input, DatePicker, message, Divider } from 'antd';
import {
  Settings as SettingsIcon,
  Globe,
  MessageCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getSettings, updateSettings, type Settings as SettingsType } from '../../services/SettingService';

const { Title, Text } = Typography;

const Settings = () => {
  const { isDark } = useContext(ThemeContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsType | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
      form.setFieldsValue({
        ...data,
        countdownDate: data.countdownDate ? dayjs(data.countdownDate) : null,
      });
    } catch (error) {
      console.error('Lỗi khi tải cấu hình:', error);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formattedData = {
        ...values,
        countdownDate: values.countdownDate ? values.countdownDate.toISOString() : null,
      };
      await updateSettings(formattedData);
      message.success('Cập nhật cấu hình thành công!');
      fetchSettings();
    } catch (error) {
      message.error('Lỗi khi cập nhật cấu hình');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <header style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: isDark ? '#fff' : '#000' }}>Cấu hình Website</Title>
        <Text type="secondary" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Quản lý thông tin cơ bản, countdown và liên kết mạng xã hội của cửa hàng.</Text>
      </header>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card
            title={
              <Space style={{ color: isDark ? '#fff' : '#000' }}>
                <SettingsIcon size={18} />
                <span>Thông tin chi tiết</span>
              </Space>
            }
            style={{
              background: isDark ? '#262626' : '#fff',
              border: isDark ? '1px solid #303030' : '1px solid #f0f0f0'
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={settings || {}}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Divider><Space><Globe size={16} /> Chung</Space></Divider>
                  <Form.Item label="URL Logo" name="logoUrl">
                    <Input placeholder="https://example.com/logo.png" />
                  </Form.Item>
                  <Form.Item label="Thời gian Countdown" name="countdownDate">
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Divider><Space><MessageCircle size={16} /> Liên hệ</Space></Divider>
                  <Form.Item label="Địa chỉ" name={['contactInfo', 'address']}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Email" name={['contactInfo', 'email']}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" name={['contactInfo', 'phone']}>
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Divider>Mạng xã hội</Divider>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Facebook" name={['socialLinks', 'facebook']}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Instagram" name={['socialLinks', 'instagram']}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Twitter" name={['socialLinks', 'twitter']}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ background: '#6366f1' }}>
                  Lưu cấu hình
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
