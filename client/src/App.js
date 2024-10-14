import React from 'react';
import './App.css';
import Landing from './components/ss_landing/landing';
import Homepage from './components/ss_homepage/homepage';
import Register from './components/ss_register/register';
import SurveyMeal from './components/ss_surveymeal/surveymeal';
import SurveyWorkout from './components/ss_surveyworkout/surveyworkout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/register" element={<Register />} /> {/* Register route */}
        <Route path="/surveymeal" element={<SurveyMeal />} />
        <Route path="/surveyworkout" element={<SurveyWorkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;