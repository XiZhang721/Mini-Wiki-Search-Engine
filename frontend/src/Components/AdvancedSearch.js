import React, { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, IconButton, Box, Paper, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import './AdvancedSearch.css'

function AdvancedSearchPage() {
  const navigate = useNavigate();
  const [searchTerms, setSearchTerms] = useState([{ type: 'phrase', value: '', proximity: 1 }]);
  const [booleanType, setBooleanType] = useState('AND');

  const handleAddSearchTerm = () => {
    if (searchTerms.length < 5) {
      setSearchTerms([...searchTerms, { type: 'phrase', value: '', proximity: 1 }]);
    }
  };

  const handleSearchTermChange = (index, key, value) => {
    const updatedTerms = [...searchTerms];
    updatedTerms[index][key] = value;
    setSearchTerms(updatedTerms);
  };

  const handleRemoveSearchTerm = (index) => {
    const updatedTerms = [...searchTerms];
    updatedTerms.splice(index, 1);
    setSearchTerms(updatedTerms);
  };


  const constructQueryString = (searchTerms, booleanType) => {
    const formattedTerms = searchTerms.map(term => {
      const { type, value } = term;
      const proximity = type === 'phrase' ? 0 : term.proximity;
      const filteredValue =value.replace(/-/g, " ").replace(/[^a-zA-Z0-9 ]/g, "");
      return `${filteredValue}-${type}-${proximity}`;
    });
  
    const termsString = encodeURIComponent(formattedTerms.join('@'));
    const queryString = `/advanced/search?query=${termsString}&booltype=${booleanType}`;
    return queryString;
  };

  const handleSearch = () => {
    const query = constructQueryString(searchTerms, booleanType)
    console.log(query)
    navigate('/results',  { state: { searchTerm: "", searchQuery: query } } );
  };

  return (
    <Box style={{display:"flex", justifyContent:"flex-end",backgroundColor:'#FFF', height:'100vh', flexDirection:"row"}}>
      <Box style = {{width:"70%" ,backgroundColor:'#E9E5D6', height :'100%', alignItems:'stretch'}}>
        <Button onClick={handleAddSearchTerm} variant="contained" color="primary" style={{ marginBottom: 20, marginTop: 20, marginLeft:"2.25%"}}>
          Add Search Term
        </Button>

        <Paper style={{ padding: 20, marginBottom: 20, backgroundColor:  "#FFF" , marginLeft:"2.25%",marginRight:"2.25%", alignItems: 'stretch'}}>
          <FormControl fullWidth style={{ marginBottom: 20 }}>
            <InputLabel id="boolean-type-select-label" style={{ color: '#000' }}>Boolean Search Type</InputLabel>
            <Select
              labelId="boolean-type-select-label"
              id="boolean-type-select"
              value={booleanType}
              onChange={(e) => setBooleanType(e.target.value)}
              style={{ width: '20%', color: 'black', backgroundColor: '#FFF' }}
            >
              <MenuItem value="AND">AND</MenuItem>
              <MenuItem value="OR">OR</MenuItem>
            </Select>
          </FormControl>

          {searchTerms.map((term, index) => (
            <Paper key={index} style={{ padding: 10, display: 'flex', alignItems: 'center', marginBottom: 5, backgroundColor: '#FFFFFF', marginTop:10,marginRight: "2.25%"}}>
              <FormControl style={{ width: '13%', marginRight: '15px' }}>
                <InputLabel id={`search-type-select-label-${index}`} style={{ color: '#000' }}>Type</InputLabel>
                <Select
                  labelId={`search-type-select-label-${index}`}
                  id={`search-type-select-${index}`}
                  value={term.type}
                  onChange={(e) => handleSearchTermChange(index, 'type', e.target.value)}
                  style={{ color: 'black' }}
                >
                  <MenuItem value="phrase">Phrase</MenuItem>
                  <MenuItem value="proximity">Proximity</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search Term"
                variant="outlined"
                value={term.value}
                onChange={(e) => handleSearchTermChange(index, 'value', e.target.value)}
                style={{ flexGrow: 1, marginRight: '0%', backgroundColor: 'white' }}
              />
              {term.type === 'proximity' && (
                <TextField
                  label="Distance"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                  variant="outlined"
                  value={term.proximity}
                  onChange={(e) => handleSearchTermChange(index, 'proximity', parseInt(e.target.value, 10))}
                  style={{ width: '10%', marginLeft: '1%',marginRight: '0%', backgroundColor: 'white' }}
                />
              )}
              <IconButton onClick={() => handleRemoveSearchTerm(index)} style={{ color: 'black' }}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Paper>

        <Box style={{display:"flex", justifyContent: "flex-end"}}>
          <Button onClick={handleSearch} variant="contained" color="primary" style={{ marginRight: 10, marginBottom: 20}}>
            Search
          </Button>
          <Button onClick={() => navigate('/')} variant="contained" style={{  marginBottom: 20, backgroundColor: "#F0F0F0", marginRight: "2.25%"}}> 
            Back
          </Button>
        </Box>
      </Box>

      <Box style={{ backgroundColor: '#333', color: 'white', padding: 20, width: '30%'}}>
        <Typography variant="body1" style={{ marginBottom: '16px' }}>
          SEARCH TIPS for Advanced Search:
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '16px' }}>

          You can have up to five search boxes by clicking the button "ADD SEARCH TERM".
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '16px' }}>
        

          You can choose how to connect these queries, either by AND or OR. 
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '16px' }}>
          
          Then you can choose the search types for each box, such as phrase search and proximity search. 
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '16px' }}>

          For proximity search, you can set the distance number for proximity between 1 and 10. 


        </Typography>


      </Box>
    </Box>
  );
}

export default AdvancedSearchPage;

