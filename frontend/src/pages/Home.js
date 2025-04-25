import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  // hook من react-router-dom بستخدمه للتنقل بين الصفحات
  const navigate = useNavigate();

  // دالة بتتنفذ لما المستخدم يضغط زر Customer
  const handleCustomerClick = () => {
    // تخزين قيمة النوع (customer) في localStorage حتى نستخدمها بالصفحات الثانية
    localStorage.setItem("type", "customer");
    // توجيه المستخدم لصفحة تسجيل الدخول/التسجيل
    navigate('/SignInUp');
  };

  // دالة بتتنفذ لما المستخدم يضغط زر Beauty Center
  const handleBeautyCenterClick = () => {
    // تخزين قيمة النوع (salon) في localStorage
    localStorage.setItem("type", "salon");
    // توجيه المستخدم لصفحة تسجيل الدخول/التسجيل
    navigate('/SignInUp');
  };

  // واجهة الصفحة الرئيسية فيها 3 أزرار
  return (
    <>
      {/* زر خاص بالـ Customer */}
      <button onClick={handleCustomerClick} className='customer-button'>
        customer
      </button>

      {/* زر خاص بالـ Beauty Center */}
      <button onClick={handleBeautyCenterClick} className='beautyCenter-button'>
        BeautyCenter
      </button>

      {/* زر للتصفح بدون تسجيل دخول */}
      <button className='browsWithoutSignIn-button'>
        Browsing without Sign In
      </button>
    </>
  );
}

export default Home;