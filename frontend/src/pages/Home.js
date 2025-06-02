import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // دالة بتتنفذ لما المستخدم يضغط زر Customer
  const handleCustomerClick = () => {
    localStorage.setItem("type", "customer"); // تخزين قيمة النوع في localStorage
    navigate('/SignInUp'); // توجيه المستخدم لصفحة التسجيل أو تسجيل الدخول
  };

  // دالة بتتنفذ لما المستخدم يضغط زر Beauty Center
  const handleBeautyCenterClick = () => {
    localStorage.setItem("type", "salon"); // تخزين قيمة النوع في localStorage
    navigate('/SignInUp'); // توجيه المستخدم لصفحة التسجيل أو تسجيل الدخول
  };

  return (
    <>
      <button onClick={handleCustomerClick} className='customer-button'>
        customer
      </button>
      <button onClick={handleBeautyCenterClick} className='beautyCenter-button'>
        BeautyCenter
      </button>

    </>
  );
}

export default Home;
