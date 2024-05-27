import styles from './MainMenu.module.css';
import Links from '../components/Links';

function MainMenu() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Executive Dashboard</h1>
      <div>
        <h3 className={styles['sub-title']}>Instruction Services</h3>
        <div>
          <Links
            links={[
              { link: '/home', icon: 'books', text: 'Program Offerings' },
              {
                link: '/about',
                icon: 'show_chart',
                text: ' Enrollment Profile',
              },
              // add more links as needed
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
