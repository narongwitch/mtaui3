import './App.css';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';



import LineLoginPage from "./LineLoginPage";
import MainSr from "./MainSr";
import SearchSr from "./SearchSr";
import MyMapComponent from "./MyMapComponent";
import UserLocationMap from "./UserLocationMap";

function App() {
  return (
    <Router>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Typography variant="h3" align="center">
        </Typography>



        
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LineLoginPage />} />
          <Route path="/mainsr" element={<MainSr />} />
          <Route path="/searchsr" element={<SearchSr />} />
          <Route path="/map" element={<MyMapComponent />} />
          <Route path="/mylocation" element={<UserLocationMap />} />
          
        </Routes>
      </Container>
    </Router>
  );
}


export default App;
