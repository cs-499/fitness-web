import React from 'react';
import './App.css';
import Landing from './components/ss_landing/landing';
import Homepage from './components/ss_homepage/homepage';
import Register from './components/ss_register/register';
//import Survey from './components/ss_survey/survey';
//import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Landing></Landing>} />
        <Route path = "/homepage" element = {<Homepage></Homepage>} />
        <Route path = "/register" element = {<Register></Register>} />
      </Routes>
    </BrowserRouter>

    /*<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/
  );
}

export default App;
