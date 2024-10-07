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
const NavBar = () => {

    return(
        <>
            <ul className="navbar_ul">
                <li className="homeNav"><a href="/homepage">Home</a></li>
                <li className="journalNav"><a href="/">Journal</a></li>
                <li className="wplanNav"><a href="/">Workout Plan</a></li>
                <li className="mplanNav"><a href="/">Meal Plan</a></li>
                <li className="recipiesNav"><a href="/">Recipies</a></li>
                <li className="accountNav"><a href="javascript:void(0)" onClick={openNav}>Account</a></li>
            </ul>

            <div id="account_nav" className="sidenav">
                <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
                <a href="/">About</a>
                <a href="/">Services</a>
                <a href="/">Clients</a>
                <a href="/">Contact</a>
            </div>
        </>
    );
}

export default NavBar