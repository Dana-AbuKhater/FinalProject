import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignInUp.css';

function SignInUp() {
  const navigate = useNavigate();
  const location = useLocation(); // الحصول على الـ location
  const [userType, setUserType] = useState('');

  // التحقق من نوع المستخدم عند تحميل الصفحة
  useEffect(() => {
    if (location.state && location.state.userType) {
      setUserType(location.state.userType); // تعيين نوع المستخدم من الـ state
    }
    /**  else {
      alert('من فضلك اختر نوع المستخدم أولًا');
      navigate('/'); // إذا لم يتم تحديد نوع المستخدم، الرجوع للصفحة الرئيسية
    }*/
  }, [location.state, navigate]);

  // الانتقال إلى صفحة تسجيل الدخول
  const handleSignInClick = () => {
    navigate('/SignIn', { state: { userType } }); // تمرير نوع المستخدم مع الـ navigation
  };

  // الانتقال إلى صفحة التسجيل
  const handleSignUpClick = () => {
    navigate('/SignUp', { state: { userType } }); // تمرير نوع المستخدم مع الـ navigation
  };
  const handleSalonInfoForm = () => {
    navigate('/SalonInfoForm', { state: { userType } }); // تمرير نوع المستخدم مع الـ navigation
  };
  return (
    <div>
      {/* زر لتسجيل الدخول */}
      <button onClick={handleSignInClick} className='SignIn-button'>
        Sign In      
      </button>
      {/* زر لإنشاء حساب جديد */}
      <button onClick={handleSignUpClick} className='SignUp-button'>
        Sign Up      
      </button>
      <button onClick={handleSalonInfoForm} className='SalonInfoForm-button'>
        SalonInfoForm    
      </button>
    </div>
  );
}

export default SignInUp;
