import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import SearchPage from './Components/Search'
import ResultsPage from'./Components/Results'
import AdvancedSearchPage from "./Components/AdvancedSearch";
import Login from './Authorization/Login';
import Signup from './Authorization/Signup';
import { UserAuthContextProvider } from './UserAuthContext';

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <UserAuthContextProvider>
            <Router>
              <div>
                <Routes>
                  <Route path="/" element={<SearchPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/advanced" element = {<AdvancedSearchPage/>}/>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>

              </div>

            </Router>
            
          </UserAuthContextProvider>

        </Col>
      </Row>

    </Container>
    
    
  );
}





export default App;