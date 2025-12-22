import { useState } from 'react';
import AppModal from '../../components/common/AppModal';
import AppFilter from '../../components/common/AppFilter';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = () => {
    setIsOpen(!isOpen);
  };

  const handleGetValueFilter = (valueFilter: any) => {
    console.log(valueFilter);
  };

  return (
    <div>
      <AppModal
        open={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        bg='black'
      >
        <p>Modal content</p>
      </AppModal>
    </div>
  );
};

export default Dashboard;
