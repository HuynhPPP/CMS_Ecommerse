import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import styles from './styles.module.scss';

function LoadingTextCommon() {
  const { rotate } = styles;
  return <AiOutlineLoading3Quarters className={rotate} />;
}

export default LoadingTextCommon;
