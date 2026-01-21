import { useState } from 'react';
import { Breadcrumb, SideBanners } from '../../components';
import type { BreadcrumbItem } from '../../types';
import {
  AiOutlineEnvironment,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import '../../styles/pages/Contact.css';

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'TRANG CHỦ', href: '/' },
  { label: 'LIÊN HỆ' },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
      setFormData({ name: '', email: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className='contact-page'>
      <SideBanners>
        <div className='container'>
          <Breadcrumb items={BREADCRUMB_ITEMS} />

          <h1 className='contact-title'>LIÊN HỆ</h1>

          {/* Contact Info Section */}
          <div className='contact-info-section'>
            <div className='contact-info-item'>
              <AiOutlineEnvironment className='contact-info-icon' />
              <div className='contact-info-text'>
                <strong>Địa chỉ công ty:</strong>
                <p>
                  Số 46, Đường 5, KDC Vạn Phúc, P. Hiệp Bình Phước, Thành phố
                  Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam
                </p>
              </div>
            </div>

            <div className='contact-info-item'>
              <AiOutlineMail className='contact-info-icon' />
              <div className='contact-info-text'>
                <strong>Email:</strong>
                <p>saigonradio1108@gmail.com</p>
              </div>
            </div>

            <div className='contact-info-item'>
              <AiOutlinePhone className='contact-info-icon' />
              <div className='contact-info-text'>
                <strong>Điện thoại:</strong>
                <p>0899.179.178</p>
              </div>
            </div>

            <div className='contact-info-item'>
              <AiOutlineClockCircle className='contact-info-icon' />
              <div className='contact-info-text'>
                <strong>Giờ làm việc:</strong>
                <p>Thứ 2 - Thứ 7: 8:30 - 18:00</p>
              </div>
            </div>
          </div>

          {/* Main Content: Form + Map */}
          <div className='contact-content'>
            {/* Contact Form */}
            <div className='contact-form-container'>
              <form onSubmit={handleSubmit} className='contact-form'>
                <div className='form-group'>
                  <label htmlFor='name'>Tên của bạn</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    placeholder='Tên của bạn'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='email'>Email</label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Nhập email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='message'>Vấn đề</label>
                  <textarea
                    id='message'
                    name='message'
                    placeholder='Nhập vấn đề của bạn'
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type='submit'
                  className='btn-submit'
                  disabled={submitting}
                >
                  {submitting ? 'ĐANG GỬI...' : 'GỬI LIÊN HỆ'}
                </button>
              </form>
            </div>

            {/* Google Map */}
            <div className='contact-map-container'>
              <div className='map-wrapper'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3918.5893124062495!2d106.70566137576157!3d10.84270778931013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zU-G7kSA0NiwgxJDGsOG7nW5nIDUsIEtEQyBW4bqhbiBQaMO6YywgUC4gSGnhu4dwIELDrG5oIFBoxrDhu5tjLCBUaOG7pyDEkOG7qWMsIFRQLkhDTQ!5e0!3m2!1sen!2s!4v1768896483878!5m2!1sen!2s'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title='Google Maps - Radio Shop Location'
                />
              </div>
            </div>
          </div>
        </div>
      </SideBanners>
    </div>
  );
};

export default Contact;
