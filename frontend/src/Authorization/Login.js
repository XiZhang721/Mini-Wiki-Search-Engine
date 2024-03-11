import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../UserAuthContext";
import { Grid } from '@material-ui/core';
import { IconButton, TextField, Chip, Typography, Box, Paper } from '@material-ui/core';
import LogoutIcon from '@mui/icons-material/Logout'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      localStorage.setItem('userId', email);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogoutClick = () => {
    navigate('/'); 
  };

  return (
    <Grid
  container
  justify="center"
  alignItems="center"
  direction="column"
  className='searchPage'
  style={{ minHeight: "100vh" }}>
  
  <div className="loginForm" style={{ fontSize: '1.4rem', textAlign: 'center' }}>
    <h2 className="mb-3">User Login</h2>

    {error && <Alert variant="danger">{error}</Alert>}

    <Form onSubmit={handleSubmit}>
      
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
          style={{ fontSize: '1.2rem', padding: '10px' }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ fontSize: '1.2rem', padding: '10px' }}
        />
      </Form.Group>

      <div className="d-grid gap-2">
        <Button variant="primary" type="Submit" className="custom-login-button">
          Log In
        </Button>
      </div>
    </Form>

    <div className="spacer"></div> {/* Add space between form and boxes */}
    

    <div className="mt-3 text-center">
      Don't have an account? <Link to="/signup">Sign up</Link>
    </div>

  </div>

  <div style={{ position: 'fixed', top: 20, left: 20 , display: 'flex'}}>
          
          <IconButton onClick={handleLogoutClick}>
            <LogoutIcon fontSize="large" />
          </IconButton>
      </div>
</Grid>

    
      
      
    
  );
};

export default Login;