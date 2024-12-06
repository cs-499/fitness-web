// Import necessary libraries and components
import React, { useState } from 'react'; // React library and useState hook for managing state
import '../../App.css'; // Global CSS file
import ParticleSys from '../particles/particle_sys'; // Particle system for background animation
import './register.css'; // CSS file specific to the registration component
import logo from '../images/logo white.svg'; // Logo image for the registration page

// Registration component
const Register = () => {
    // State variables to track username and password inputs
    const [username, setUsername] = useState(''); // Username state
    const [password, setPassword] = useState(''); // Password state

    // Handle the registration form submission
    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior (page refresh)

        try {
            // Send a POST request to the backend API for registration
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/register`, {
                method: 'POST', // HTTP method
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Specify the content type
                },
                body: new URLSearchParams({ // Encode the username and password into URL-encoded format
                    username,
                    password,
                }),
            });

            const data = await response.text(); // Parse the response as text

            if (response.ok) {
                // If the registration is successful, show an alert and redirect to the landing page
                alert('Registration successful! You can now log in.');
                window.location.href = '/'; // Redirect to the home page
            } else {
                // If the response is not successful, show the error message returned by the server
                alert(data);
            }
        } catch (error) {
            console.error('Error:', error); // Log any errors in the console
            alert('Error during registration.'); // Show a generic error message
        }
    };

    // Render the registration form
    return (
        <div>
            {/* Logo and branding */}
            <div className='shapeShifter'>
                <img className='logo' src={logo} alt="ShapeShifter Logo" /> {/* Logo image */}
                <h2 className='logoText'>ShapeShifter</h2> {/* App title */}
            </div>
            
            {/* Authentication container */}
            <div className='authcontainer'>
                <h1 className='authText'>Sign Up</h1> {/* Header text */}
                <form onSubmit={handleRegister}> {/* Form submission handler */}
                    <p className='authhelp'>Username:</p> {/* Label for username input */}
                    <input
                        type='text' // Input type
                        value={username} // Bind value to username state
                        onChange={(e) => setUsername(e.target.value)} // Update username state on input
                        placeholder='Enter Username' // Placeholder text
                        className='authbox' // CSS class for styling
                        required // Make the field mandatory
                    />
                    <p className='authhelp'>Password:</p> {/* Label for password input */}
                    <input
                        type='password' // Input type
                        value={password} // Bind value to password state
                        onChange={(e) => setPassword(e.target.value)} // Update password state on input
                        placeholder='Enter Password' // Placeholder text
                        className='authbox' // CSS class for styling
                        required // Make the field mandatory
                    />
                    <div className='button'> {/* Button container */}
                        <button type='submit' className='authbutton'>Register</button> {/* Submit button */}
                    </div>
                </form>
            </div>
        </div>
    );
};

// Wrapper component to include particles without refreshing them on typing
const Wrapper = () => {
    return (
        <>
            <Register /> {/* Registration form */}
            <ParticleSys /> {/* Particle background system */}
        </>
    );
};

export default Wrapper; // Export the wrapper component for use in other parts of the application
