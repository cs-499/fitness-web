import React from 'react';
import './App.css';
import Landing from './components/ss_landing/landing';
import Homepage from './components/ss_homepage/homepage';
import Register from './components/ss_register/register';
import Survey from './components/ss_survey/survey';
import WorkoutPlan from './components/ss_workoutplan/workoutplan';
import Journal from './components/ss_journal/journal';
import MealPlan from './components/ss_mealplan/mealplan';
import BasicSearch from './components/ss_basicsearch/basicsearch';
import BasicGenerator from './components/ss_basicgenerator/basicgenerator';
import AdvancedSearch from './components/ss_advancedsearch/advancedsearch';
import Recipe from './components/ss_recipe/recipe';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  
    return (
      <div style={{minHeight: '100vh' }}>
        <div className="App">

  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/workoutplan" element={<WorkoutPlan />} />
        <Route path="/mealplan" element={<MealPlan />} />
        <Route path="/basicsearch" element={<BasicSearch />} />
        <Route path="/basicgenerator" element={<BasicGenerator />} />
        <Route path="/advancedsearch" element={<AdvancedSearch />} />
        <Route path="/recipe/:id" element={<Recipe />} />
      </Routes>
    </BrowserRouter>
            </div>
            </div>
  );
}

export default App;