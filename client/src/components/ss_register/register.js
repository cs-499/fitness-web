import React, { useState } from 'react'; 
import '../../App.css'; 
import ParticleSys from '../particles/particle_sys'; 
import './register.css'; 
import logo from '../images/logo white.svg'; 

const Register = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');

    // Handle the registration form submission
    const handleRegister = async (event) => {
        event.preventDefault(); 

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
                        type='text' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder='Enter Username' 
                        className='authbox' 
                        required 
                    />
                    <p className='authhelp'>Password:</p> {/* Label for password input */}
                    <input
                        type='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder='Enter Password'
                        className='authbox' 
                        required 
                    />
                    <div className='button'> {/* Button container */}
                        <button type='submit' className='authbutton'>Register</button> {/* Submit button */}
                    </div>
                </form>
            </div>
        </div>
    );
};

const Wrapper = () => {
    return (
        <>
            <Register /> {/* Registration form */}
            <ParticleSys /> {/* Particle background system */}
        </>
    );
};

export default Wrapper;
