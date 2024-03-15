import React, { useEffect, useState } from "react";
import { Grid, IconButton, TextField, Button, Chip, Typography, Box, Paper } from '@material-ui/core';
import { SearchOutlined, AccountCircleOutlined } from '@material-ui/icons';
import { json, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

function SearchPage() {
  let navigate = useNavigate();
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId');
  const isLoggedIn = userId ? true : false;

  // Placeholder data for quick searches. Adjust as needed or fetch from server.
  const [quickSearchTerms, setQuickSearchTerms] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const filteredQuery = content.replace(/-/g, " ").replace(/[^a-zA-Z0-9 ]/g, "");
    const query = `/search?query=${filteredQuery}`
    navigate('./results', { state: { searchTerm: content, searchQuery: query } });
  };

  const navigateToAdvancedSearch = () => {
    navigate('./advanced');
  };

  const handleQuickSearch = (term) => {
    const filteredQuery = term.replace(/[^a-zA-Z0-9 ]/g, "");
    const query = `/search?query=${filteredQuery}`;
    navigate('./results', { state: { searchTerm: term, searchQuery: query } });
  };

  const handleLoginClick = () => {
    navigate('./login'); 
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('userId');
    navigate('/'); 
  };



  const [suggestedWord, setSuggestedWord] = useState('');
  const [querySuggestions, setQuerySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setContent(value);

    if (value.endsWith(" ")) {
      fetchNextWordSuggestion();
      fetchSuggestions(value);
    } else {
      setSuggestedWord('');
    }
  };

  const fetchNextWordSuggestion = () => {
    const words = content.trim().split(" ");
    const lastWord = words[words.length - 1];
    const url = `https://ttds.myddns.me/next?curr=${lastWord}`;
    const fetchData = async () => {
      try {
        console.log('Sending request to:', url);
        const response = await axios.get(url);
        const jsonObj = response.data;
        const next = jsonObj.next;
        return next;
      } catch (error) {
        console.error('Error:', error);
        return '';
      }
    }
    fetchData().then(next => {
      setSuggestedWord(next);
    });
    
  };

  const handleAddSuggestion = () => {
    setContent(content + suggestedWord);
    setSuggestedWord('')
    fetchNextWordSuggestion()
  };

  const fetchSuggestions = (input) => {
    const url = `https://ttds.myddns.me/suggest?query=${content}`;
    const fetchData = async () => {
      try {
        console.log('Sending request to:', url);
        const response = await axios.get(url);
        console.log('Received:', response.data)
        return response.data;
      } catch (error) {
        console.error('Error:', error);
        return [];
      }
    }

    if (input.length > 1) {
      fetchData().then(next => {
        setQuerySuggestions(next);
      });
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setContent(suggestion);
    setShowSuggestions(false);
    setSuggestedWord('')
    clearTimeout(blurTimeoutId);
    setBlurTimeoutId(null);
    setIsFocused(false);
  };
  const [isFocused, setIsFocused] = useState(false);
  const [blurTimeoutId, setBlurTimeoutId] = useState(null);

  const handleFocus = () => {
    if (blurTimeoutId) {
      clearTimeout(blurTimeoutId);
      setBlurTimeoutId(null);
    }
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    const id = setTimeout(() => {
      setIsFocused(false);
    }, 200);
    setBlurTimeoutId(id);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = isLoggedIn ? userId.replace(/\./g, '-') : "server";
        const url = `https://ttds.myddns.me/recommend?username=${encodeURIComponent(id)}`;
        console.log('Sending request to:', url);
        const response = await axios.get(url);
        setQuickSearchTerms(response.data);
        console.log('Response:',response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  },[]);

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

        <Typography variant="h6" style={{ marginTop: 10 , padding:10, height: '30px'}}>
          { suggestedWord ? "Word suggestion: ": <div style={{ height: '30px', width: '100%' }}></div>}
          {suggestedWord && (
            <Button onClick={handleAddSuggestion} style={{ marginLeft: 10, color: 'grey', textTransform: 'none', padding: '0px 10px', fontSize: '1.25rem'}}>
              {suggestedWord}
            </Button>
          )}
        </Typography>

      <Grid item xs={12} style={{width: '60%' }}>
        <form className='form' onSubmit={handleSubmit} autoComplete="false" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          id="search-bar"
          placeholder="Search"
          value={content}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ width: '100%', marginBottom: 10, paddingRight: '0'}}
          InputProps={{
            endAdornment: (
              <IconButton type="submit">
                <SearchOutlined />
              </IconButton>
            ),
          }}
          variant="outlined"
        />
        {showSuggestions && isFocused && (
          <Paper style={{ 
            position: 'absolute', 
            marginTop: '56px',
            width: '59.5%',
            zIndex: 1,
          }}>
          {querySuggestions.map((suggestion, index) => (
          <Box key={index} onClick={() => handleSuggestionClick(suggestion.query)} style={{ 
            cursor: 'pointer', 
            padding: 10, 
            textAlign: 'left',
          }}>
            {suggestion.query}
          </Box>
          ))}
          </Paper>
        )}
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
              label={term.query}
              onClick={() => handleQuickSearch(term.query)}
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
        <div style={{ position: 'fixed', top: 20, left: 20 , display: 'flex', alignItems: 'center'}}>
          <p style={{ marginRight: '10px', fontSize : '20px'}}>Hi User: {userId} !</p >
          <IconButton onClick={handleLogoutClick}>
            <LogoutIcon fontSize="large" />
          </IconButton>
        </div>
      )}
    </Grid>
  );
}

export default SearchPage;