import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../UserAuthContext";
import { Grid } from '@material-ui/core';

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
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      className='searchPage'
      style={{ minHeight: "100vh" }}>
      
      <div className="p-4 box" style={{ fontSize: '1.5rem'}}>
        <h2 className="mb-3">User Signup</h2>
        
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
            <Button variant="primary" type="Submit">
              Sign up
            </Button>
          </div>
        </Form>


        <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/Login">Log In</Link>
        </div>

      </div>

      </Grid>
    
      
      


   
  );
};

export default Signup;