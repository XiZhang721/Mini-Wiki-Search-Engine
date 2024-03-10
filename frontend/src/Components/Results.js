import React, { useEffect, useState } from "react"


import { useLocation } from 'react-router-dom';
import { Box, Grid, TextField, IconButton, FormControl, NativeSelect, InputLabel } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import logo from '../logo.png'
import axios from 'axios';
const userId = localStorage.getItem('userId');
const isLoggedIn = userId ? true : false;

function UsingFetch() {
    const [hits, setHits] = useState([]);
    const [content, setContent] = useState('');
    const [hitCounts, setHitCounts] = useState("5");
    const [choice, setChoice] = useState("ranked");
    const [aiAns, setAIAns] = useState("... :)");
    const [results, setResults] = useState([]);
   

    const handleChoice = (event) => {
      setChoice(event.target.value);
    };

    const Text_Box = ({ title, content }) => {
        const [expanded, setExpanded] = useState(false);
      
        const toggleContent = () => {
          setExpanded(!expanded);
        };
      
        return (
          <div className="boxes" onClick={toggleContent}>
            <div className="title">{title}</div>
            {expanded ? (
              <div className="content">{content}</div>
            ) : (
              <div className="content-preview">{content.slice(0, 100)}...</div>
            )}
          </div>
        );
      };

    let { state } = useLocation();
    let searchTerm = state["searchTerm"]
    let query = state["searchQuery"];
    const url = `http://localhost:33311${query}`;
    
    const testObject = 
    '[{"id": "12345","title": "test title 1","value": "test value 1"},{"id": "54321","title": "test title 2","value": "test value 2"}]';

    const retrieved_data = JSON.parse(testObject);
    console.log(retrieved_data);



    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log('Sending request to:', url);
          const response = await axios.get(url);
          console.log('Response:', response.data);
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


        <div className="box-container">
            <Text_Box title="Box Title" 
                content="This is the very long content of the box. It will be truncated, and if the user clicks the box, it will display the entire content. Example's third studio album, Playing in the Shadows, was released in 
                September 2011 and topped the charts with two number one singles, Changed ufiarfhjileuhflaiweuhflaiweuhflaiewuhflaiewuhflaieuwhflaiuewhfaiuwehfaiweuhfiweuhflewhfliweuhfaiweufhaiweuhf
                " 
                />

            <Text_Box title="Box Title" 
                content="This is the very long content of the box. It will be truncated, and if the user clicks the box, it will display the entire content. Example's third studio album, Playing in the Shadows, was released in 
                September 2011 and topped the charts with two number one singles, Changed ufiarfhjileuhflaiweuhflaiweuhflaiewuhflaiewuhflaieuwhflaiuewhfaiuwehfaiweuhfiweuhflewhfliweuhfaiweufhaiweuhf
                " 
                />


            <Text_Box title="Box Title" 
                content="This is the very long content of the box. It will be truncated, and if the user clicks the box, it will display the entire content. Example's third studio album, Playing in the Shadows, was released in 
                September 2011 and topped the charts with two number one singles, Changed ufiarfhjileuhflaiweuhflaiweuhflaiewuhflaiewuhflaieuwhflaiuewhfaiuwehfaiweuhfiweuhflewhfliweuhfaiweufhaiweuhf
                " 
                />

            <Text_Box title="Box Title" 
                content="This is the very long content of the box. It will be truncated, and if the user clicks the box, it will display the entire content. Example's third studio album, Playing in the Shadows, was released in 
                September 2011 and topped the charts with two number one singles, Changed ufiarfhjileuhflaiweuhflaiweuhflaiewuhflaiewuhflaieuwhflaiuewhfaiuwehfaiweuhfiweuhflewhfliweuhfaiweufhaiweuhf
                " 
                />

            <Text_Box title="Box Title" 
                content="This is the very long content of the box. It will be truncated, and if the user clicks the box, it will display the entire content. Example's third studio album, Playing in the Shadows, was released in 
                September 2011 and topped the charts with two number one singles, Changed ufiarfhjileuhflaiweuhflaiweuhflaiewuhflaiewuhflaieuwhflaiuewhfaiuwehfaiweuhfiweuhflewhfliweuhfaiweufhaiweuhf
                " 
                />




        </div>

       

        

        

        

      </Grid>
      
    );
  }

export default UsingFetch;
