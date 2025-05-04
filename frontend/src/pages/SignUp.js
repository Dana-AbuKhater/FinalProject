import React, { useState } from 'react';
import './SignUp.css';
import axios from 'axios';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    setLoading(true);
    setError(null);

    // استخراج القيم من النموذج
    const email = event.target.email.value;
    const username = event.target.username.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const type = localStorage.getItem("type"); // قراءة نوع المستخدم من localStorage

    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين!");
      setLoading(false);
      return;
    }

    // تحديد endpoint الخاص بالتسجيل
    const endpoint = "http://localhost:3000/api/auth/register";

    // التحقق من صحة نوع المستخدم
    if (!type || (type !== 'salon' && type !== 'customer')) {
      setError("الرجاء تحديد نوع مستخدم صالح (صالون أو عميل).");
      setLoading(false);
      return;
    }

    // إرسال البيانات باستخدام axios بطريقة POST (لا تغيير هنا لأننا عدلنا الباك إند)
    axios.post(endpoint, {
      type: type,
      email: email,
      username: username,
      phone: phone,
      password: password
    })
      .then(response => {
        setLoading(false);
        // التحقق من حالة الاستجابة
        if (response.status === 200 || response.status === 201) {
          const data = response.data;

          // التحقق مما إذا كانت العملية نجحت
          if (data.success) {
            alert(`تم إنشاء حساب ${type === 'salon' ? 'الصالون' : 'العميل'} بنجاح!`);
            window.location.href = "/SignIn"; // تحويل المستخدم لصفحة تسجيل الدخول
          } else {
            setError(data.message || "فشل التسجيل");
          }
        } else {
          setError("استجابة غير متوقعة من الخادم.");
        }
      })
      .catch(error => {
        setLoading(false);
        // التعامل مع الخطأ بشكل أكثر تفصيلاً
        console.error("Error:", error);
        if (error.response) {
          // الخادم استجاب برمز حالة خارج نطاق 2xx
          setError(error.response.data.message || "حدث خطأ أثناء التسجيل");
        } else if (error.request) {
          // لم يستجب الخادم
          setError("لا يمكن الوصول إلى الخادم. تأكد من تشغيل الخادم.");
        } else {
          // حدث خطأ آخر
          setError("حدث خطأ أثناء التسجيل");
        }
      });
  };

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '150px',
      marginRight: 'auto',
      marginLeft: 'auto',
      border: '1px solid #e8b923',
      padding: '20px',
      width: '300px',
      borderRadius: '5px',
      alignContent: 'center',
      boxShadow: '0 0 10px #bc9c3c'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>إنشاء حساب جديد</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>البريد الإلكتروني:</label>
          <input
            type="email"
            name="email"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>اسم المستخدم:</label>
          <input
            type="text"
            name="username"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>رقم الهاتف:</label>
          <input
            type="tel"
            name="phone"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>كلمة المرور:</label>
          <input
            type="password"
            name="password"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>تأكيد كلمة المرور:</label>
          <input
            type="password"
            name="confirmPassword"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <button
          className="signup"
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'جارٍ التسجيل...' : 'إنشاء حساب'}
        </button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        لديك حساب بالفعل؟ <a href="/SignIn" style={{ textDecoration: 'none' }}>تسجيل الدخول</a>
      </p>
    </div>
  );
};

export default SignUp;