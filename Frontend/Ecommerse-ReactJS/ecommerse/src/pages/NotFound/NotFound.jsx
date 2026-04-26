import { useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import Button from '@components/Button/Button';
import styles from './styles.module.scss';

function NotFound() {
  const {
    container,
    errorContent,
    errorIcon,
    errorCode,
    errorTitle,
    errorDescription,
    errorActions,
    btnSecondary,
  } = styles;

  const navigate = useNavigate();

  return (
    <div>
      <MyHeader />
      <div className={container}>
        <MainLayout>
          <div className={errorContent}>
            <div className={errorIcon}>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M12 2L2 7L12 12L22 7L12 2Z'
                  fill='currentColor'
                  opacity='0.3'
                />
                <path
                  d='M2 17L12 22L22 17V7L12 12L2 7V17Z'
                  fill='currentColor'
                />
                <path
                  d='M12 12V22'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>

            <h1 className={errorCode}>404</h1>
            <h2 className={errorTitle}>Page Not Found</h2>
            <p className={errorDescription}>
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>

            <div className={errorActions}>
              <Button content='Go to Home' onClick={() => navigate('/')} />
              <button className={btnSecondary} onClick={() => navigate(-1)}>
                Go Back
              </button>
            </div>
          </div>
        </MainLayout>
      </div>
      <MyFooter />
    </div>
  );
}

export default NotFound;
