import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../UserAuthContext";
import { Grid } from '@material-ui/core';
import { IconButton, TextField, Chip, Typography, Box, Paper } from '@material-ui/core';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      try {
        const sanitizedEmail = email.replace(/\./g, '-');
        const url = `https://ttds.myddns.me/register?username=${encodeURIComponent(sanitizedEmail)}`;
        console.log('Sending request to:', url);
        const response = await axios.get(url);
        console.log(response);
      } catch (regError) {
        // Handle registration errors here
        console.error('Registration error:', regError);
        setError(regError.response.data.message); // Assuming the error message is in the response's data
        // Don't navigate to "/login" if registration failed
        return;
      }
      navigate("/login");
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
    <h2 className="mb-3">User Sign Up</h2>

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
          Sign Up
        </Button>
      </div>
    </Form>

    <div className="spacer"></div> {/* Add space between form and boxes */}
    

    <div className="mt-3 text-center">
    Already have an account? <Link to="/Login">Log In</Link>
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

export default Signup;