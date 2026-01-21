import { Routes, Route } from 'react-router-dom';
import { Home, Products, ProductDetail, Contact } from '../pages';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/products' element={<Products />} />
      <Route path='/products/:id' element={<ProductDetail />} />
      <Route path='/contact' element={<Contact />} />
    </Routes>
  );
};

export default AppRoutes;
