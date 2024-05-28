import { Link } from 'react-router-dom';
import styles from './Links.module.css';
import Icon from '@mui/material/Icon';
function Links({ links }) {
  return (
    <div className={styles['menu-icon-container']}>
      {links.map((linkItem, index) => (
        <>
          <div className={styles['css-jhjqlk']}>
            <Link key={index} to={linkItem.link}>
              <div
                className={`${styles['menu-icon']} ${styles[linkItem.style]}`}
              >
                <Icon fontSize='large'>{linkItem.icon}</Icon>
              </div>
            </Link>
            <div>
              <p className={styles['menu-text']}> {linkItem.text}</p>
            </div>
          </div>
        </>
      ))}
    </div>
  );
}

export default Links;
