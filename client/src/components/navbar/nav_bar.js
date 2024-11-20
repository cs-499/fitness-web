import React from "react";
import './nav_bar.css';

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("account_nav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("account_nav").style.width = "0";
    
} 

function handleLogout(event) {
    event.preventDefault(); // Prevents the default link behavior
    closeNav(); // Only closes the app on "Logout"
    // Add any additional logout logic here
}

const NavBar = () => {

    return(
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <ul className="navbar_ul">
                <li className="homeNav">
                    <a href="/homepage">
                        <div className="nav_icons">
                            <i className="fa-solid fa-house"></i>
                        </div>
                        Home
                    </a>
                </li>
                <li className="wplanNav">
                    <a href="/workoutplan">
                        <div className="nav_icons">
                            <i className="fa-solid fa-dumbbell"></i>
                        </div>
                        Workout Plan
                    </a>
                </li>
                <li className="mplanNav">
                    <a href="/mealplan">
                        <div className="nav_icons">
                            <i className="fa-solid fa-utensils"></i>
                        </div>
                        Meal Plan
                    </a>
                </li>
                <li className="recipesNav">
                    <a href="/journal">
                        <div className="nav_icons">
                            <i className="fa-solid fa-book"></i>
                        </div>
                        Journal
                    </a>
                </li>
                <li className="accountNav">
                    <a href="javascript:void(0)" onClick={openNav}>
                        <div className="nav_icons">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        Account
                    </a>
                </li>
            </ul>






            <div id="account_nav" className="sidenav">
                <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
                <a href="/about">About</a>
                <a href="/services">Services</a>
                <a href="/clients">Clients</a>
                <a href="/contact">Contact</a>
                <a href="/" onClick={handleLogout}>Logout</a>
            </div>

        </>
    );
}

export default NavBar