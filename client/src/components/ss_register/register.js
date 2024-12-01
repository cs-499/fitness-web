import React, { useState } from 'react';
import '../../App.css';
import ParticleSys from '../particles/particle_sys'; 
import './register.css';
import logo from '../images/logo white.svg';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent page refresh

        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/register`, {
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
                alert('Registration successful! You can now log in.');
                // Redirect to the landing page
                window.location.href = '/';
            } else {
                alert(data);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error during registration.');
        }
    };

    return (
        <div>
            <div className='shapeShifter'>
                <img className='logo' src={logo}/>
                <h2 className='logoText'>ShapeShifter</h2>
            </div>
            
            <div className='authcontainer'>
                <h1 className='authText'>Sign Up</h1>
                <form onSubmit={handleRegister}>
                    <p className='authhelp'>Username:</p>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Enter Username'
                        className='authbox'
                        required
                    />
                    <p className='authhelp'>Password:</p>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter Password'
                        className='authbox'
                        required
                    />
                    <div className='button'>
                        <button type='submit' className='authbutton'>Register</button>
                    </div>
                </form>
            </div>
        </div>
        
    );
};

//This is to wrap the particles seperatly so they don't refresh when you type something
const Wrapper = () => {
    return (
        <><Register /><ParticleSys /></>
    )
}

export default Wrapper;
