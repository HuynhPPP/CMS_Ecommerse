import { useEffect } from 'react';
import { getDetailOrder } from '@/apis/oderService';
import { useLocation } from 'react-router-dom';

function Oders() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const id = params.get('id');
  const totalAmount = params.get('totalAmount');
  const qrCodeImage = `https://qr.sepay.vn/img?acc=96247BQDS3&bank=BIDV&amount=${totalAmount}&des=${id}`;

  const handleGetDetailOrder = async () => {
    try {
      const response = await getDetailOrder(id);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetDetailOrder();
  }, []);

  return (
    <>
      <div>
        <img src={qrCodeImage} alt='qrCodeImage' />
      </div>
    </>
  );
}

export default Oders;
