import React from "react";
import './nav_bar.css';
import {useNavigate } from "react-router-dom";


/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("account_nav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("account_nav").style.width = "0";
} 

async function handleLogout(event) {
    event.preventDefault(); // Prevents the default link behavior
    closeNav(); // Only closes the app on "Logout"

    const username = localStorage.getItem('userId')

    try {
        await fetch(`${process.env.REACT_APP_API_HOST}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username
            }),
        });


        localStorage.setItem('isUserLoggedIn', false);
        localStorage.removeItem('token');
    } catch (error) {
        console.error(error);
    }
};


const NavBar = () => {
    const navigate = useNavigate();
    const logout = () => {
        navigate('/');
    }
    return(
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
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
                    <a href="#" onClick={(e) => { e.preventDefault(); openNav(); }}>
                        <div className="nav_icons">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        Account
                    </a>
                </li>
            </ul>

            <div id="account_nav" className="sidenav">
                <h1 className="sidenav_username" href="#" >{localStorage.getItem('username')}</h1>
                <a href="#" className="closebtn" onClick={(e) => { e.preventDefault(); closeNav(); }}>&times;</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(e); logout();}}>Logout</a>
            </div>
        </>
    );
}

export default NavBar;