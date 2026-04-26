import InputCustom from '@components/InputCommonForm/InputCustom';
import { useForm } from 'react-hook-form';
import styles from './styles.module.scss';
import cls from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import RightBody from '@/pages/Cart/components/checkout/RightBody';
import { creatOrder } from '@/apis/oderService';
import { useNavigate } from 'react-router-dom';
import { StepperContext } from '@/contexts/StepperProvider';

const CN_BASE = 'https://countriesnow.space/api/v0.1';

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

  const onSubmit = async (data) => {
    try {
      const res = await creatOrder(data);
      setCurrentStep(3);
      navigate(
        `/cart?id=${res.data.data._id}&totalAmount=${res.data.data.totalAmount}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios.get(`${CN_BASE}/countries/iso`).then((res) =>
      setCountries(
        res.data.data.map((c) => {
          return {
            value: c.name,
            label: c.name,
          };
        })
      )
    );
  }, []);

  useEffect(() => {
    if (!watch('country')) return;
    console.log(watch('country'));

    if (watch('country') === 'Vietnam' && !localStorage.getItem('listCities')) {
      axios.get('https://provinces.open-api.vn/api/?depth=2').then((res) => {
        localStorage.setItem('listCities', JSON.stringify(res.data));
      });
    }

    console.log(JSON.parse(localStorage.getItem('listCities')));

    if (localStorage.getItem('listCities')) {
      const data = JSON.parse(localStorage.getItem('listCities'));
      setCities(
        data.map((item) => {
          return {
            label: item.name,
            value: item.codename,
          };
        })
      );
    }
  }, [watch('country')]);

  useEffect(() => {
    if (!watch('cities')) return;
    console.log(watch('cities'));

    if (localStorage.getItem('listCities')) {
      const data = JSON.parse(localStorage.getItem('listCities'));
      setDistricts(
        data
          .find((item) => item.codename === watch('cities'))
          .districts.map((item) => {
            return {
              label: item.name,
              value: item.codename,
            };
          })
      );
    }
  }, [watch('cities')]);

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
              label={'First Name'}
              type={'text'}
              isRequired={true}
              placeholder={'Enter your first name'}
              register={register('firstName', {
                required: true,
                maxLength: 25,
              })}
              isError={errors.firstName}
            />
            <InputCustom
              label={'Last Name'}
              type={'text'}
              isRequired={true}
              placeholder={'Enter your last name'}
              register={register('lastName', {
                required: true,
                maxLength: 25,
              })}
              isError={errors.lastName}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Company name (optional)'}
              type={'text'}
              placeholder={'Company name'}
              register={register('companyName')}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Country / Region'}
              type={'select'}
              isRequired={true}
              dataOption={countries}
              register={register('country', {
                required: true,
              })}
              isError={errors.country}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Street address'}
              type={'text'}
              isRequired={true}
              placeholder={'Home number and street name'}
              register={register('street', {
                required: true,
              })}
              isError={errors.street}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'apartment'}
              isShowLabel={false}
              type={'text'}
              placeholder={'Apartment, suite, etc. (optional)'}
              register={register('apartment')}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Town / City'}
              type={'select'}
              isRequired={true}
              dataOption={cities}
              register={register('cities', {
                required: true,
              })}
              isError={errors.cities}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Sate'}
              type={'select'}
              isRequired={true}
              placeholder={'California'}
              dataOption={districts}
              register={register('state', {
                required: true,
              })}
              isError={errors.state}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Phone'}
              type={'text'}
              isRequired={true}
              placeholder={'Phone number'}
              register={register('phone', {
                required: true,
              })}
              isError={errors.phone}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'ZIP code'}
              type={'text'}
              isRequired={true}
              placeholder={''}
              register={register('zipCode', {
                required: true,
              })}
              isError={errors.zipCode}
            />
          </div>

          <div className={row}>
            <InputCustom
              label={'Email address'}
              type={'email'}
              isRequired={true}
              placeholder={'Email address'}
              register={register('email', {
                required: true,
              })}
              isError={errors.email}
            />
          </div>
        </form>
      </div>

      <RightBody handleExternalSubmit={handleExternalSubmit} />
    </div>
  );
}

export default Checkout;
