import React, { useEffect, useState } from "react"


import { useLocation } from 'react-router-dom';
import { Box, Grid, TextField, IconButton, FormControl, NativeSelect, InputLabel } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import logo from '../logo.png'

function UsingFetch() {
    const [hits, setHits] = useState([]);
    const [content, setContent] = useState('');
    const [hitCounts, setHitCounts] = useState("5");
    const [choice, setChoice] = useState("ranked");
    const [aiAns, setAIAns] = useState("... :)");

    const handleHitCount = (event) => {
      setHitCounts(event.target.value);
    };

    const handleChoice = (event) => {
      setChoice(event.target.value);
    };

    let { state } = useLocation();
    let query = content;
    if (state) {
        query = state["searchTerm"];
    }

    const fetchData = (event) => {
      if (event) {
          setHits([]);
          event.preventDefault();
          query = document.getElementById("search-bar2").value;
      }
      fetch("http://192.168.0.25:8000/search/?query=$".replace("$", query.trim())
          + "&hitcount=$".replace("$", hitCounts)
          + "&choice=$".replace("$", choice))
          .then(response => {
              return response.json()
          })
          .then(data => {
              setHits(data["0"])
          })

      setAIAns("")
      fetch("http://192.168.0.25:8000/search/?query=$".replace("$", query.trim())
          + "&hitcount=$".replace("$", hitCounts)
          + "&choice=$".replace("$", choice)
          + "&question=T" // USE AI
      )
          .then(response => {
              return response.json()
          })
          .then(data => {
              setAIAns(data["0"][0]["description"])
          })
      return false;
  }




    return (
      <Grid className='resultsPage' style={{ minHeight: "100vh" }}>
        <a href={window.location.origin}>
                <img src={logo} alt="Logo" className="logo_2" />
        </a>
        
            <form className='form_2' onSubmit={fetchData} autoComplete="off">
                <TextField
                    id="search-bar2"
                    placeholder={"Search"}
                    value={content}
                    onInput={e => setContent(e.target.value)}
                    style={{ width: "100%" }}
                    InputProps={{
                        endAdornment: (
                            <IconButton type="submit">
                                <SearchOutlined />
                            </IconButton>
                        ),
                    }}
                    variant="outlined"
                />
            </form>

            <div className='dropdown' >
                <FormControl style={{ m: 1, width: "250px" }}>
                    <InputLabel>Index Choice</InputLabel>
                    <NativeSelect
                        defaultValue={"ranked"}
                        value={choice}
                        onChange={handleChoice}
                    >
                        <option value={"ranked"}>Ranked IR</option>
                        <option value={"vector"}>Vector Search</option>
                        {/* <option value={"rankedbeta"}>BETA Ranked IR</option>
                        <option value={"boolean"}>Boolean Search</option>
                        <option value={"question"}>AI Question Answering</option> */}
                    </NativeSelect>
                </FormControl>
                <FormControl style={{ m: 1, width: "100px" }}>
                    <InputLabel>Hit Counts</InputLabel>
                    <NativeSelect
                        defaultValue={5}
                        value={hitCounts}
                        onChange={handleHitCount}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </NativeSelect>
                </FormControl>
            </div>

      </Grid>
      
    );
  }

export default UsingFetch;
