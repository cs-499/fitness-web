//ShapeShifter_Landing
//This is the initial landing page - where you log in
//if no account then you create one and it will lead to the survey

import '../../App.css'
import './landing.css'
import ParticleSys from '../particles/particle_sys'; 
export default function Landing() {
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
                <button className='authbutton'>Log In</button>
            </div>
            <div className='button'>
                <button className='authbutton'>Create Account</button>
            </div>
        </div>

        {/*Particle System*/}
        <ParticleSys />

      </div>
    

    

    
  );

}