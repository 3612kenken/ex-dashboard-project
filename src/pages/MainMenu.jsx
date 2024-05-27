import styles from './MainMenu.module.css';
import Links from '../components/Links';

function MainMenu() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Executive Dashboard</h1>
      <div>
        <div>
          <h3 className={styles['sub-title']}>Instruction Services</h3>
          <div>
            <Links
              links={[
                {
                  link: '/offerings',
                  icon: 'books',
                  text: 'Program Offerings',
                },
                {
                  link: '/enrollment',
                  icon: 'show_chart',
                  text: ' Enrollment Profile',
                },
                {
                  link: '/graduates',
                  icon: 'school',
                  text: 'Graduates Profile',
                },
                {
                  link: '/licensure',
                  icon: 'note',
                  text: ' Licensure Examination Profile',
                },
                {
                  link: '/accreditation',
                  icon: 'workspace_premium',
                  text: 'Accreditation Level Profile',
                },
                {
                  link: '/faculty',
                  icon: 'cast_for_education',
                  text: 'Faculty Profile',
                },
                {
                  link: '/scholarship',
                  icon: 'account_balance',
                  text: 'Scholarship Programs',
                },

                // add more links as needed
              ]}
            />
          </div>
          <div>
            <h3 className={styles['sub-title']}>
              Research Development Services
            </h3>
            <div>
              <Links
                links={[
                  {
                    link: '/home',
                    icon: 'biotech',
                    text: ' Research Projects',
                  },
                  {
                    link: '/enrollment',
                    icon: 'article',
                    text: ' Publications',
                  },
                  {
                    link: '/graduates',
                    icon: 'copyright',
                    text: 'Copyrights',
                  },
                  {
                    link: '/licensure',
                    icon: 'token',
                    text: ' Patents',
                  },

                  // add more links as needed
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
