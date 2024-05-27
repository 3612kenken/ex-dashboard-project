import { Link } from 'react-router-dom';
import styles from './Links.module.css';
import Icon from '@mui/material/Icon';
function Links({ links, style }) {
  return (
    <div className={styles['menu-icon-container']}>
      {links.map((linkItem, index) => (
        <Link key={index} to={linkItem.link}>
          <div className={styles['css-jhjqlk']}>
            <div className={styles['menu-icon']}>
              <Icon>{linkItem.icon}</Icon>
            </div>
            <div>
              <span className={styles['menu-text']}>{linkItem.text}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Links;
