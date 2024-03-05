import React, { useState } from "react";
import { Grid, IconButton, TextField, Button, Chip, Typography, Box } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

function SearchPage() {
  let navigate = useNavigate();
  const [content, setContent] = useState('');

  // Simulated user authentication status
  const isLoggedIn = true; // Adjust based on your authentication logic

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

  return (
    <Grid
      container
      justify="center"
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
      <Grid container justify="center" spacing={1} style={{ marginTop: 10 }}>
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
    </Grid>
  );
}

export default SearchPage;