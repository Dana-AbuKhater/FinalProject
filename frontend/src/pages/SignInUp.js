import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInUp.css';
function SignInUp() {
  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate('/SignIn'); // الانتقال إلى صفحة Sign In
  };
  const handleSignUpClick = () => {
    navigate('/SignUp'); // الانتقال إلى صفحة Sign Up
  };
  const salonprofail = () => {  
    navigate('/SalonInfoForm'); // الانتقال إلى صفحة Sign Up
  };
  return (
    <div>
      <button onClick={handleSignInClick} className='SignIn-button'>Sign In</button>
      <button onClick={handleSignUpClick} className='SignUp-button'>Sign Up</button>
      <button onClick={salonprofail}> salon profail</button>
    </div>
  );
}
export default SignInUp;