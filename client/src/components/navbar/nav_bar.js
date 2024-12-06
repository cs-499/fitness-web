// Import necessary libraries and components
import React from "react"; // React library for creating components
import './nav_bar.css'; // CSS file specific to the navigation bar
import { useNavigate } from "react-router-dom"; // React Router hook for navigation

// Function to open the side navigation menu
function openNav() {
    document.getElementById("account_nav").style.width = "250px"; // Set the width of the navigation menu to 250px
}

// Function to close the side navigation menu
function closeNav() {
    document.getElementById("account_nav").style.width = "0"; // Set the width of the navigation menu to 0px
}

// Function to handle logout functionality
async function handleLogout(event) {
    event.preventDefault(); // Prevent the default behavior of the link
    closeNav(); // Close the side navigation menu after clicking "Logout"

    const username = localStorage.getItem('userId'); // Retrieve the username from localStorage

    try {
        // Send a POST request to the logout endpoint
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/logout`, {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Specify the content type
            },
            body: new URLSearchParams({ username }), // Encode the username in the request body
        });

        // Clear user authentication data from localStorage
        localStorage.setItem('isUserLoggedIn', false);
        localStorage.removeItem('token'); // Remove the authentication token
    } catch (error) {
        console.error(error); // Log any errors to the console
    }
}

// Navigation bar component
const NavBar = () => {
    const navigate = useNavigate(); // Hook for navigation

    // Function to navigate to the landing page after logout
    const logout = () => {
        navigate('/'); // Redirect to the landing page
    };

    // Render the navigation bar
    return (
        <>
            {/* Link to load Font Awesome icons */}
            <link 
                rel="stylesheet" 
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" 
                integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" 
                crossOrigin="anonymous" 
                referrerPolicy="no-referrer" 
            />
            {/* Main navigation menu */}
            <ul className="navbar_ul">
                {/* Home navigation item */}
                <li className="homeNav">
                    <a href="/homepage">
                        <div className="nav_icons">
                            <i className="fa-solid fa-house"></i> {/* Home icon */}
                        </div>
                        Home
                    </a>
                </li>
                {/* Workout Plan navigation item */}
                <li className="wplanNav">
                    <a href="/workoutplan">
                        <div className="nav_icons">
                            <i className="fa-solid fa-dumbbell"></i> {/* Dumbbell icon */}
                        </div>
                        Workout Plan
                    </a>
                </li>
                {/* Meal Plan navigation item */}
                <li className="mplanNav">
                    <a href="/mealplan">
                        <div className="nav_icons">
                            <i className="fa-solid fa-utensils"></i> {/* Utensils icon */}
                        </div>
                        Meal Plan
                    </a>
                </li>
                {/* Journal navigation item */}
                <li className="recipesNav">
                    <a href="/journal">
                        <div className="nav_icons">
                            <i className="fa-solid fa-book"></i> {/* Book icon */}
                        </div>
                        Journal
                    </a>
                </li>
                {/* Account navigation item */}
                <li className="accountNav">
                    <a href="#" onClick={(e) => { e.preventDefault(); openNav(); }}>
                        <div className="nav_icons">
                            <i className="fa-solid fa-user"></i> {/* User icon */}
                        </div>
                        Account
                    </a>
                </li>
            </ul>

            {/* Side navigation menu for account options */}
            <div id="account_nav" className="sidenav">
                {/* Display the logged-in username */}
                <h1 className="sidenav_username">{localStorage.getItem('username')}</h1> 
                {/* Close button for the side navigation */}
                <a href="#" className="closebtn" onClick={(e) => { e.preventDefault(); closeNav(); }}>&times;</a> 
                {/* Logout link */}
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(e); logout(); }}>Logout</a> 
            </div>
        </>
    );
}

export default NavBar; // Export the component for use in other parts of the application
