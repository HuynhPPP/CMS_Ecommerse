import { Routes, Route } from 'react-router-dom';
import { Home, Products, ProductDetail, Contact, Cart } from '../pages';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/products' element={<Products />} />
      <Route path='/products/:id' element={<ProductDetail />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/cart' element={<Cart />} />
    </Routes>
  );
};

export default AppRoutes;
