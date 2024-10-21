import React from 'react';
import './App.css';
import Landing from './components/ss_landing/landing';
import Homepage from './components/ss_homepage/homepage';
import Register from './components/ss_register/register';
import Survey from './components/ss_survey/survey';
import WorkoutPlan from './components/ss_workoutplan/workoutplan';
import Recipes from './components/ss_recipes/recipes';
import MealPlan from './components/ss_mealplan/mealplan';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/workoutplan" element={<WorkoutPlan />} />
        <Route path="/mealplan" element={<MealPlan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;