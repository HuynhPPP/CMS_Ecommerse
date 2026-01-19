import Header from './components/Header';
import BannerSection from './components/BannerSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className='app'>
      <Header />

      <main className='main-content'>
        {/* Banner Section */}
        <BannerSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
