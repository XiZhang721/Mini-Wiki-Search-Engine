import React, { useState } from "react";
import { Grid, IconButton, TextField, Button, Chip, Typography, Box } from '@material-ui/core';
import { SearchOutlined, AccountCircleOutlined } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import LogoutIcon from '@mui/icons-material/Logout';

function SearchPage() {
  let navigate = useNavigate();
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId');
  const isLoggedIn = userId ? true : false;

  // Placeholder data for quick searches. Adjust as needed or fetch from server.
  const quickSearchTerms = ["Quick Search 1", "Quick Search 2", "Quick Search 3"].slice(0, 6); // Example with fewer than 6

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    navigate('./results', { state: { searchTerm: content } });
  };

  const navigateToAdvancedSearch = () => {
    navigate('./advanced');
  };

  const handleQuickSearch = (term) => {
    navigate('./results', { state: { searchTerm: term } });
  };

  const handleLoginClick = () => {
    navigate('./login'); 
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('userId');
    navigate('/'); 
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      className='searchPage'
      style={{ minHeight: "100vh" }}
    >
      <div style={{ textAlign: "center" }}>
        <a href={window.location.origin}>
          <img src={logo} alt="Logo" className="logo" />
        </a>
      </div>
      <Grid item xs={12} style={{ width: '60%' }}>
        <form className='form' onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            id="search-bar"
            placeholder="Search"
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ width: '100%', marginBottom: 10 ,background: '#FFF'}}
            InputProps={{
              endAdornment: (
                <IconButton type="submit">
                  <SearchOutlined />
                </IconButton>
              ),
            }}
            variant="outlined"
          />
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button onClick={navigateToAdvancedSearch}>
              Advanced Search
            </Button>
          </Box>
        </form>
      </Grid>
      <Typography variant="h6" style={{ marginTop: 20 }}>
        {isLoggedIn ? "Based on your search history:" : "Popular searching terms:"}
      </Typography>
      <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
        {quickSearchTerms.map((term, index) => (
          <Grid item key={index}>
            <Chip
              label={term}
              onClick={() => handleQuickSearch(term)}
              variant="outlined"
              style = {{background: '#FFF'}}
            />
          </Grid>
        ))}
      </Grid>
      {!isLoggedIn && (
        <div style={{ position: 'fixed', top: 20, left: 20 }}>
          <IconButton onClick={handleLoginClick}>
            <AccountCircleOutlined fontSize="large" />
          </IconButton>
        </div>
      )}
      {isLoggedIn && (
        <div style={{ position: 'fixed', top: 20, left: 20 }}>
          <IconButton onClick={handleLogoutClick}>
            <LogoutIcon fontSize="large" />
          </IconButton>
        </div>
      )}
    </Grid>
  );
}

export default SearchPage;