import React from 'react';
import '../../App.css';
import './landing.css';
import logo from '../images/logo white.svg';
import ParticleSys from '../particles/particle_sys'; 
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  document.title = 'ShapeShifter';
  const navigate = useNavigate();
  
  const createAcc = () => {
      navigate('/register');
  };

  const logIn = async () => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch(`${process.env.REACT_APP_API_HOST}/login`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                  username,
                  password,
              }),
          });

          const data = await response.json();

          if (response.ok) {
              localStorage.setItem('userId', data.userId);
              localStorage.setItem('token', data.token);
              localStorage.setItem('isUserLoggedIn', true)
              localStorage.setItem('username', data.username);
              navigate(data.firstTimeLogin || !data.surveyCompleted ? '/survey' : '/homepage');
          } else {
              alert(data.message);
          }        
      } catch (error) {
          console.error(error);
      }
  };

  return (
      <div className='wrapper'>
        <div className='shapeShifter'>
            <img className='logo' src={logo}/>
            <h2 className='logoText'>ShapeShifter</h2>
        </div>
        
        <div className='authcontainer'>
            <h1 className='authText'>Sign In</h1>
            <p className='authhelp'>‎ </p> {/*Leave as is, I don't want to fix padding*/}
            <input id='username' type='text' placeholder='Username' className='authbox' required />
            <p className='authhelp'>‎ </p> {/*Leave as is, I don't want to fix padding*/}
            <input id='password' type='password' placeholder='Password' className='authbox' required />
            <div className='button'>
                <button className='authbutton' onClick={logIn}>Login</button>
            </div>
            <div className='button'>
                <button className='authbutton' onClick={createAcc}>Create Account</button>
            </div>
        </div>

        <ParticleSys />
      </div>
  );
};

export default Landing;
