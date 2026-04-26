import styles from './styles.module.scss';
import cls from 'classnames';
import { RiArrowDownWideLine } from 'react-icons/ri';
import { TfiLayoutLineSolid } from 'react-icons/tfi';

function AccordionMenu({ titleMenu, contentAccordion, onClick, isSelected }) {
  const { container, title, activeTitle, contentMenu, isVisibility } = styles;

  const handleToggle = () => {
    onClick();
  };

  return (
    <div className={container}>
      <div
        className={cls(title, {
          [activeTitle]: isSelected,
        })}
        onClick={handleToggle}
      >
        {titleMenu}
        {isSelected ? (
          <TfiLayoutLineSolid style={{ fontSize: '20px', color: '#999' }} />
        ) : (
          <span style={{ fontSize: '20px', color: '#999' }}>+</span>
        )}
      </div>

      <div className={cls(contentMenu, { [isVisibility]: isSelected })}>
        {contentAccordion}
      </div>
    </div>
  );
}

export default AccordionMenu;
