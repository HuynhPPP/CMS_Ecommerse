import { Link } from 'react-router-dom';
import '../../styles/components/BrandShowcase.css';

// Placeholder brand data - will be replaced with real data later
const BRANDS = [
  { id: 1, name: 'DOPPELEHRZ', slug: 'doppelehrz' },
  { id: 2, name: 'PHYCO Việt Nam', slug: 'phyco' },
  { id: 3, name: 'Kinder Optima', slug: 'kinder-optima' },
  { id: 4, name: 'Bách Hóa Online', slug: 'bach-hoa-online' },
  { id: 5, name: 'Visio', slug: 'visio' },
  { id: 6, name: 'Omega 3', slug: 'omega-3' },
];

const BrandShowcase = () => {
  return (
    <section className='brand-showcase'>
      <div className='container'>
        <div className='brand-showcase-header'>
          <h2 className='brand-showcase-title'>Thương Hiệu Uy Tín</h2>
          <p className='brand-showcase-subtitle'>
            Đối tác chính thức của các thương hiệu hàng đầu
          </p>
        </div>

        <div className='brand-grid'>
          {BRANDS.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brand=${brand.slug}`}
              className='brand-item'
            >
              <div className='brand-logo-wrapper'>
                {/* Placeholder logo - will be replaced with actual images */}
                <div className='brand-logo-placeholder'>
                  <span className='brand-initial'>{brand.name.charAt(0)}</span>
                </div>
                <p className='brand-name'>{brand.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
