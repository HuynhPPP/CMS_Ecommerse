import InputCommon from '@components/InputCommon/InputCommon';
import styles from './styles.module.scss';
import Button from '@components/Button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { ToastContext } from '@/contexts/ToastProvider';
import { register, login, getInfo } from '@/apis/authService';
import Cookies from 'js-cookie';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { StoreContext } from '@/contexts/StoreProvider';

function Login() {
  const { container, title, boxRememberMe, lostPassword } = styles;
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useContext(ToastContext);
  const { setIsOpen, handleGetListProductsCart } = useContext(SideBarContext);
  const { setUserId } = useContext(StoreContext);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      cfmpassword: '',
    },
    validationSchema: Yup.object({
      username: isRegister ? Yup.string().required('Vui lòng nhập tên người dùng') : Yup.string(),
      email: Yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email!'),
      password: Yup.string()
        .min(6, 'Mật khẩu phải từ 6 ký tự trở lên')
        .required('Vui lòng nhập mật khẩu'),
      cfmpassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Mật khẩu xác nhận không khớp'
      ),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      if (isRegister) {
        register(values)
          .then((res) => {
            setIsLoading(false);
            toast.success(res.message || 'Đăng ký thành công!');
            setIsRegister(false);
          })
          .catch((err) => {
            setIsLoading(false);
            toast.error(err.response?.data?.message || 'Đăng ký thất bại');
          });
      } else {
        login({ email: values.email, password: values.password })
          .then((res) => {
            setIsLoading(false);
            const { user, token } = res;

            // Lưu thông tin vào Cookies và Store
            Cookies.set('token', token);
            Cookies.set('userId', user.id);
            setUserId(user.id);

            toast.success('Đăng nhập thành công!');
            setIsOpen(false); // Đóng sidebar
            handleGetListProductsCart(user.id, 'cart'); // Cập nhật giỏ hàng
          })
          .catch((err) => {
            setIsLoading(false);
            toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
          });
      }
    },
  });

  const handleToggle = () => {
    setIsRegister(!isRegister);
    formik.resetForm();
  };

  return (
    <div className={container}>
      <div className={title}>{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</div>

      <form onSubmit={formik.handleSubmit}>
        {isRegister && (
          <InputCommon
            id='username'
            label='Tên người dùng'
            type='text'
            isRequired
            formik={formik}
          />
        )}
        <InputCommon
          id='email'
          label='Email'
          type='text'
          isRequired
          formik={formik}
        />

        <InputCommon
          id='password'
          label='Mật khẩu'
          type='password'
          isRequired
          formik={formik}
        />

        {isRegister && (
          <InputCommon
            id='cfmpassword'
            label='Xác nhận mật khẩu'
            type='password'
            isRequired
            formik={formik}
          />
        )}

        {!isRegister && (
          <div className={boxRememberMe}>
            <input type='checkbox' />
            <span>Ghi nhớ đăng nhập</span>
          </div>
        )}

        <Button
          content={
            isLoading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'
          }
          type='submit'
        />
      </form>
      <Button
        content={
          isRegister ? 'Bạn đã có tài khoản?' : "Chưa có tài khoản?"
        }
        type='submit'
        isPrimary={false}
        style={{ marginTop: '10px' }}
        onClick={handleToggle}
      />

      {!isRegister && <div className={lostPassword}>Quên mật khẩu ?</div>}
    </div>
  );
}

export default Login;
