// Import necessary libraries and components
import React from 'react'; // React library for creating components
import '../../App.css'; // Global CSS file
import './landing.css'; // CSS specific to the landing page
import logo from '../images/logo white.svg'; // Logo image for the landing page
import ParticleSys from '../particles/particle_sys'; // Particle system for background effects
import { useNavigate } from 'react-router-dom'; // React Router hook for programmatic navigation

const Landing = () => {
  document.title = 'ShapeShifter'; // Set the document title for the browser tab
  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate to the registration page
  const createAcc = () => {
      navigate('/register'); // Redirect to the registration page
  };

  // Function to handle the login process
  const logIn = async () => {
      const username = document.getElementById('username').value; // Get the username from the input field
      const password = document.getElementById('password').value; // Get the password from the input field

      try {
          // Send a POST request to the login endpoint
          const response = await fetch(`${process.env.REACT_APP_API_HOST}/login`, {
              method: 'POST', // HTTP method
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded', // Specify the content type
              },
              body: new URLSearchParams({ // Encode the username and password into URL-encoded format
                  username,
                  password,
              }),
          });

          const data = await response.json(); // Parse the response as JSON

          if (response.ok) {
              // If login is successful, store user data in localStorage
              localStorage.setItem('userId', data.userId); // Store user ID
              localStorage.setItem('token', data.token); // Store authentication token
              localStorage.setItem('isUserLoggedIn', true); // Mark the user as logged in
              localStorage.setItem('username', data.username); // Store the username

              // Navigate to the survey page if it's the user's first login or the survey is incomplete
              navigate(data.firstTimeLogin || !data.surveyCompleted ? '/survey' : '/homepage'); 
          } else {
              // If the login fails, display an error message
              alert(data.message);
          }        
      } catch (error) {
          console.error(error); // Log any errors in the console
      }
  };

  // Render the landing page
  return (
      <div className='wrapper'>
        {/* Logo and branding */}
        <div className='shapeShifter'>
            <img className='logo' src={logo} alt="ShapeShifter Logo" /> {/* Logo image */}
            <h2 className='logoText'>ShapeShifter</h2> {/* App title */}
        </div>
        
        {/* Authentication container */}
        <div className='authcontainer'>
            <h1 className='authText'>Sign In</h1> {/* Header text */}
            <p className='authhelp'>‎ </p> {/* Placeholder for spacing, not to be fixed */}
            <input id='username' type='text' placeholder='Username' className='authbox' required /> {/* Username input */}
            <p className='authhelp'>‎ </p> {/* Placeholder for spacing, not to be fixed */}
            <input id='password' type='password' placeholder='Password' className='authbox' required /> {/* Password input */}
            <div className='button'> {/* Login button */}
                <button className='authbutton' onClick={logIn}>Login</button>
            </div>
            <div className='button'> {/* Create account button */}
                <button className='authbutton' onClick={createAcc}>Create Account</button>
            </div>
        </div>

        {/* Background particle system */}
        <ParticleSys />
      </div>
  );
};

export default Landing; // Export the component for use in other parts of the application
