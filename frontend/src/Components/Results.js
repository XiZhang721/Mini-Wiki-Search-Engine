import React, { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';
import { Box, Grid, TextField, IconButton, FormControl, NativeSelect, InputLabel } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import logo from '../logo.png'
import axios from 'axios';




function UsingFetch() {
    const [hits, setHits] = useState([]);
    const [content, setContent] = useState('');
    const [hitCounts, setHitCounts] = useState("5");
    const [choice, setChoice] = useState("ranked");
    const [aiAns, setAIAns] = useState("... :)");
    const [results, setResults] = useState([]);
    const [retrievedData, setRetrievedData] = useState([]);
    const userId = localStorage.getItem('userId');
    const isLoggedIn = userId ? true : false;
   

    const Text_Box = ({ id, title, content }) => {
        const [expanded, setExpanded] = useState(false);
      
        const handleBoxClick = (id, title) => {

          const userName = isLoggedIn? userId : ""
          
          const url = `https://backend-dot-ttds-412917.nw.r.appspot.com/update?id=${id}&username=${userName}`
          const updateClick = async () => {
            try {
              console.log('Sending request to:', url);
              const response = await axios.get(url);
              console.log(response)
            } catch (error) {
              console.error('Error:', error);
            }
          };
          
          if(!expanded){
            updateClick();
          }
          setExpanded(!expanded);
          
        };
      
        return (
          <div className="boxes" onClick={handleBoxClick}>
            <div className="title">{title}</div>
            {expanded ? (
              <div className="content" style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
            ) : (
              <div className="content-preview">{content.slice(0, 100)}...</div>
            )}
          </div>
        );
      };

      

    let { state } = useLocation();
    let searchTerm = state["searchTerm"]
    let query = state["searchQuery"];
    const url = `https://backend-dot-ttds-412917.nw.r.appspot.com${query}`;
    
    const testObject = 
    '[{"id": "12345","title": "test title 1","value": "test value 1"},{"id": "54321","title": "test title 2","value": "test value 2"}]';

    //const retrieved_data = JSON.parse(testObject);
    //console.log(retrieved_data);

    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log('Sending request to:', url);
          const response = await axios.get(url);
          setRetrievedData(response.data)
          console.log('Response:',response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      fetchData();
    }, [query]);



    return (
      <Grid className='resultsPage' style={{ minHeight: "100vh" }}>
        <a href={window.location.origin}>
                <img src={logo} alt="Logo" className="logo_2" />
        </a>
        
        {/* remind user current search phrase */}
        <form className='form_2' autoComplete="off">
            <p style={{ marginBottom: '14px', fontSize: "20px" }}>
              Current searching query:
            </p>
            <TextField
                id="search-bar2"
                placeholder={"Search"}
                value={searchTerm}
                style={{ width: "100%" }}
                variant="outlined"
            />
        </form>
        <div className="spacer"></div> {/* Add space between form and boxes */}
        
        <div className="box-container" style={{paddingBottom: '20px', maxHeight: '550px', overflowY: 'auto'}}>
          {retrievedData.map(item => (
                <Text_Box id={item.id} title={item.title} content={item.value}   />
            ))}
            
        </div>

      </Grid>
      
    );
  }

export default UsingFetch;
