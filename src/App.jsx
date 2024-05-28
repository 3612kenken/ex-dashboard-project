import EnrollmentPage from './pages/EnrollmentPage';
import ProgramOfferingPage from './pages/ProgramOfferingPage';
import MainMenu from './pages/MainMenu';
import { Container } from '@mui/material';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';

import './App.css';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Container className='container' maxWidth='xl'>
          <Routes>
            <Route path='/' element={<MainMenu />} />
            <Route path='/offerings' element={<ProgramOfferingPage />} />
            <Route path='/enrollment' element={<EnrollmentPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
