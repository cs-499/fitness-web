//ShapeShifter_Landing
//This is the initial landing page - where you log in
//if no account then you create one and it will lead to the survey
import React from 'react';
import '../../App.css'
import './landing.css'
import ParticleSys from '../particles/particle_sys'; 
import Homepage from '../ss_homepage/homepage';
//import { NavLink, Link } from 'react-router-dom';

//function call from log in
//did it this way in case we need to add more logic to the click later
function logIn(){
  window.location = "../ss_homepage/homepage.js";
}

//function call from create_account
function createAcc(){
  window.location = "../ss_register/register.js";
}


const Landing = () => {
  document.title = 'ShapeShifter'

  //rendering
  return (
      <div>
        {/*Log in Box*/}
        <div className='authcontainer'>
            <h1 className='authText'>Log In</h1>
  
            {/*Email Input*/}
            <p className='authhelp'>Email:</p>
            <div>
                <input id='email' type='email' placeholder='Email' className='authbox'></input>
            </div>

            {/*Password Input*/}
            <p className='authhelp'>Password:</p>
            <div>
                <input id='password' type='password' placeholder='Password' className='authbox'></input>
            </div>

            {/*Remember & Forgot Password*/}
            <div>
              <input type='checkbox' id = "rem_pass" value = "true"></input>
              <label for="rem_pass">Remember Password?</label>

              <a target='_blank' href='https://www.merriam-webster.com/dictionary/unlucky'>Forgot Password?</a>
            </div>

            {/*Log in & Create Account buttons*/}
            <div className='button'>
                <button className='authbutton' onClick={logIn}>Log In</button>
            </div>
            <div className='button'>
                <button className='authbutton' onClick={createAcc}>Create Account</button>
            </div>
        </div>

        {/*Particle System*/}
        <ParticleSys />

        <Homepage />

      </div>
    

    

    
  );

}

export default Landing;