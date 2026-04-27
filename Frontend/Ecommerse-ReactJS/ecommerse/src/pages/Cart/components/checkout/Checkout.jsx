import InputCustom from '@components/InputCommonForm/InputCustom';
import { useForm } from 'react-hook-form';
import styles from './styles.module.scss';
import cls from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import RightBody from '@/pages/Cart/components/checkout/RightBody';
import { createOrder } from '@/apis/oderService';
import { useNavigate } from 'react-router-dom';
import { StepperContext } from '@/contexts/StepperProvider';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { ToastContext } from '@/contexts/ToastProvider';
import Cookies from 'js-cookie';

import { getProvinces, getWardsByProvince } from '@/apis/addressService';

function Checkout() {
  const dataOption = [
    { value: '1', label: 'option1' },
    { value: '2', label: 'option2' },
    { value: '3', label: 'option3' },
  ];

  const {
    container,
    leftBody,
    rightBody,
    row,
    row2Column,
    title,
    coupon,
    line,
  } = styles;

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();
  const { setCurrentStep } = useContext(StepperContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const formRef = useRef();

  console.log(formRef);

  const handleExternalSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const { setIsOpen, setType, handleGetListProductsCart, listProductCart } =
    useContext(SideBarContext);
  const { toast } = useContext(ToastContext);
  const userId = Cookies.get('userId');

  const onSubmit = async (formData) => {
    if (!listProductCart || listProductCart.length === 0) {
      toast.error('Giỏ hàng trống!');
      return;
    }

    const totalAmount = listProductCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const selectedCity = cities.find((c) => c.value === formData.city)?.label;
    const selectedWard = districts.find((d) => d.value === formData.state)?.label;

    const orderPayload = {
      userId: parseInt(userId),
      totalAmount: totalAmount,
      items: listProductCart.map((item) => ({
        productVariantId: item.productVariantId || item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      ...formData,
      country: 'Việt Nam', // Mặc định quốc gia là Việt Nam
      city: selectedCity || formData.city, // Lưu tên tỉnh thành thay vì mã code
      state: selectedWard || formData.state, // Lưu tên phường xã thay vì mã code
      zipCode: '00000', // Giá trị mặc định cho zipCode (vì trường này bắt buộc trong DB)
    };

    try {
      const res = await createOrder(orderPayload);
      
      if (!res.order?.id) {
        throw new Error('Không nhận được mã đơn hàng từ hệ thống!');
      }

      if (formData.paymentMethod === 'QRCODE') {
        setCurrentStep(3);
        navigate(`/cart?id=${res.order.id}&totalAmount=${res.order.totalAmount}`);
      } else {
        // Trường hợp COD
        toast.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ xác nhận đơn hàng của bạn sớm nhất.');
        handleGetListProductsCart(userId, 'cart'); // Làm mới giỏ hàng
        navigate('/order'); // Chuyển về trang danh sách đơn hàng
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại!');
    }
  };

  useEffect(() => {
    getProvinces().then((res) => {
      setCities(
        res.map((p) => ({
          label: p.fullName,
          value: p.code,
        }))
      );
    });
  }, []);

  const cityValue = watch('city');

  useEffect(() => {
    if (!cityValue) {
      setDistricts([]);
      return;
    }
    getWardsByProvince(cityValue).then((res) => {
      setDistricts(
        res.map((w) => ({
          label: w.fullName,
          value: w.code,
        }))
      );
    });
  }, [cityValue]);

  return (
    <div className={container}>
      <div className={leftBody}>
        <p className={coupon}>
          Have a coupon? <span>Click here to enter your code</span>
        </p>

        <p className={title}>Billing Details</p>

        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={cls(row, row2Column)}>
            <InputCustom
              label={'Tên'}
              type={'text'}
              isRequired={true}
              placeholder={'Nhập tên của bạn'}
              register={register('firstName', {
                required: true,
                maxLength: 25,
              })}
              isError={errors.firstName}
            />
            <InputCustom
              label={'Họ'}
              type={'text'}
              isRequired={true}
              placeholder={'Nhập họ của bạn'}
              register={register('lastName', {
                required: true,
                maxLength: 25,
              })}
              isError={errors.lastName}
            />
          </div>


          <div className={row}>
            <InputCustom
              label={'Địa chỉ nhà'}
              type={'text'}
              isRequired={true}
              placeholder={'Số nhà, tên đường...'}
              register={register('street', {
                required: true,
              })}
              isError={errors.street}
            />
          </div>


          <div className={row}>
            <InputCustom
              label={'Tỉnh / Thành phố'}
              type={'select'}
              isRequired={true}
              dataOption={cities}
              register={register('city', {
                required: true,
              })}
              isError={errors.city}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Phường / Xã'}
              type={'select'}
              isRequired={true}
              placeholder={'Chọn phường xã'}
              dataOption={districts}
              register={register('state', {
                required: true,
              })}
              isError={errors.state}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Số điện thoại'}
              type={'text'}
              isRequired={true}
              placeholder={'Số điện thoại liên hệ'}
              register={register('phone', {
                required: true,
              })}
              isError={errors.phone}
            />
          </div>


          <div className={row}>
            <InputCustom
              label={'Địa chỉ Email'}
              type={'email'}
              isRequired={true}
              placeholder={'Địa chỉ email nhận thông báo'}
              register={register('email', {
                required: true,
              })}
              isError={errors.email}
            />
          </div>

        </form>
      </div>

      <RightBody 
        handleExternalSubmit={handleExternalSubmit} 
        register={register}
        errors={errors}
      />
    </div>
  );
}

export default Checkout;
