import React from 'react';
import './App.css';
import Landing from './components/ss_landing/landing';
import Homepage from './components/ss_homepage/homepage';
import Register from './components/ss_register/register';
import Survey from './components/ss_survey/survey';
import WorkoutPlan from './components/ss_workoutplan/workoutplan';
import Journal from './components/ss_journal/journal';
import MealPlan from './components/ss_mealplan/mealplan';
import AiMealSearch from './components/ss_ai-mealsearch/ai-mealsearch';
import CustomMealSearch from './components/ss_custom-mealsearch/custom-mealsearch';
import Recipe from './components/ss_recipe/recipe'; // Corrected filename
import Contact from './components/ss_contact/contact';
import LiveWorkout from './components/ss_liveworkout/liveworkout';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  
    return (
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', minHeight: '100vh' }}>
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
        <Route path="/ai-mealsearch" element={<AiMealSearch />} />
        <Route path="/custom-mealsearch" element={<CustomMealSearch />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/liveworkout" element={<LiveWorkout />} />
      </Routes>
    </BrowserRouter>
            </div>
            </div>
  );
}

export default App;
