import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from './components/layout';
import { CartSidebar } from './components/cart';
import { WishlistSidebar } from './components/wishlist';
import { AppRoutes } from './routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className='app'>
        <Header />
        <main className='main-content'>
          <AppRoutes />
        </main>
        <Footer />
        <CartSidebar />
        <WishlistSidebar />
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
