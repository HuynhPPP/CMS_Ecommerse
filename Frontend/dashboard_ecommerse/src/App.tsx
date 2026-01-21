import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Categories from './pages/Categories/Categories';
import PhycoCategories from './pages/PhycoCategories/PhycoCategories';
import PhycoProducts from './pages/PhycoProducts/PhycoProducts';
import PhycoOrders from './pages/PhycoOrders';
import PhycoCoupons from './pages/PhycoCoupons';
import Users from './pages/Users/Users';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='products' element={<Products />} />
            <Route path='category' element={<Categories />} />
            <Route path='phyco-categories' element={<PhycoCategories />} />
            <Route path='phyco-products' element={<PhycoProducts />} />
            <Route path='phyco-orders' element={<PhycoOrders />} />
            <Route path='phyco-coupons' element={<PhycoCoupons />} />
            <Route path='users' element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
