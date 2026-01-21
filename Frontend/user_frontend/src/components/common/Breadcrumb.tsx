import type { BreadcrumbItem } from '../../types';
import '../../styles/components/Breadcrumb.css';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className='breadcrumb' aria-label='Breadcrumb'>
      <ol className='breadcrumb-list'>
        {items.map((item, index) => (
          <li key={index} className='breadcrumb-item'>
            {item.href ? (
              <a href={item.href} className='breadcrumb-link'>
                {item.label}
              </a>
            ) : (
              <span className='breadcrumb-current'>{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className='breadcrumb-separator' aria-hidden='true'>
                &gt;
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
