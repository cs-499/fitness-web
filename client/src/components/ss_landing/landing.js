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

          const data = await response.text();

          if (response.ok) {
              alert(`Welcome back, ${username}!`);
              navigate('/homepage');
          } else {
              alert(data);
          }
      } catch (error) {
          console.error('Error:', error);
          alert('Error during login.');
      }
  };

  // Rendering
  return (
      <div>
        {/* Log in Box */}
        <div className='authcontainer'>
            <h1 className='authText'>Log In</h1>
  
            {/* Username Input */}
            <p className='authhelp'>Username:</p>
            <input id='username' type='text' placeholder='Username' className='authbox' required />

            {/* Password Input */}
            <p className='authhelp'>Password:</p>
            <input id='password' type='password' placeholder='Password' className='authbox' required />

            {/* Log in & Create Account buttons */}
            <div className='button'>
                <button className='authbutton' onClick={logIn}>Log In</button>
            </div>
            <div className='button'>
                <button className='authbutton' onClick={createAcc}>Create Account</button>
            </div>
        </div>

        {/* Particle System */}
        <ParticleSys />
      </div>
  );
};

export default Landing;
