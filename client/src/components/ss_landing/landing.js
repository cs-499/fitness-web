import React from 'react';
import '../../App.css';
import './landing.css';
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
          const response = await fetch('http://localhost:5000/login', {
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
              navigate(data.firstTimeLogin ? '/survey' : '/homepage');
          } else {
              alert(data.message);
          }        
      } catch (error) {
          console.error(error);
      }
  };

  return (
      <div>
        <div className='authcontainer'>
            <h1 className='authText'>Sign In</h1>
            <p className='authhelp'>Username:</p>
            <input id='username' type='text' placeholder='Username' className='authbox' required />
            <p className='authhelp'>Password:</p>
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
