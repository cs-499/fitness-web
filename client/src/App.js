<<<<<<< HEAD
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
import Contact from './components/ss_contact/contact';
import LiveWorkout from './components/ss_liveworkout/liveworkout';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
=======
// Import necessary libraries and components
import React from 'react'; // React library for creating components
import './App.css'; // Global CSS file for the app
import Landing from './components/ss_landing/landing'; // Landing page component
import Homepage from './components/ss_homepage/homepage'; // Homepage component
import Register from './components/ss_register/register'; // Registration page component
import Survey from './components/ss_survey/survey'; // Survey page component
import WorkoutPlan from './components/ss_workoutplan/workoutplan'; // Workout plan page component
import Journal from './components/ss_journal/journal'; // Journal page component
import MealPlan from './components/ss_mealplan/mealplan'; // Meal plan page component
import MealGenerator from './components/ss_mealgenerator/mealgenerator'; // Meal generator page component
import Recipe from './components/ss_recipe/recipe'; // Recipe details page component
import Contact from './components/ss_contact/contact'; // Contact page component
import LiveWorkout from './components/ss_liveworkout/liveworkout'; // Live workout page component
>>>>>>> main

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router for handling routes

function App() {
    return (
      // Wrapper div with a gradient background to style the entire app
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', minHeight: '100vh' }}>
        <div className="App">
<<<<<<< HEAD

  
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/liveworkout" element={<LiveWorkout />} />
      </Routes>
    </BrowserRouter>
            </div>
            </div>
  );
=======
          {/* BrowserRouter to enable routing */}
          <BrowserRouter>
            <Routes>
              {/* Define application routes */}
              <Route path="/" element={<Landing />} /> {/* Landing page route */}
              <Route path="/homepage" element={<Homepage />} /> {/* Homepage route */}
              <Route path="/register" element={<Register />} /> {/* Registration page route */}
              <Route path="/survey" element={<Survey />} /> {/* Survey page route */}
              <Route path="/journal" element={<Journal />} /> {/* Journal page route */}
              <Route path="/workoutplan" element={<WorkoutPlan />} /> {/* Workout plan page route */}
              <Route path="/mealplan" element={<MealPlan />} /> {/* Meal plan page route */}
              <Route path="/mealgenerator" element={<MealGenerator />} /> {/* Meal generator page route */}
              <Route path="/recipe/:id" element={<Recipe />} /> {/* Recipe details page route with dynamic parameter */}
              <Route path="/contact" element={<Contact />} /> {/* Contact page route */}
              <Route path="/liveworkout" element={<LiveWorkout />} /> {/* Live workout page route */}
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    );
>>>>>>> main
}

export default App; // Export the App component for rendering in the application entry point
