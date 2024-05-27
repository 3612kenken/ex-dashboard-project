import EnrollmentPage from './pages/EnrollmentPage';
import { Container } from '@mui/material';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import MainMenu from './pages/MainMenu';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Container className='container' axWidth='sm'>
          <Routes>
            <Route path='/' element={<MainMenu />} />
            <Route path='/enrollment' element={<EnrollmentPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
