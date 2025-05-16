import React from 'react';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();

  // الدالة لازم تكون async عشان نقدر نستعمل await
  const handleSubmit = async (event) => {
    event.preventDefault(); // منع الريفريش الافتراضي

    const email = event.target.email.value;
    const password = event.target.password.value;
    const type = localStorage.getItem("type");  // جلب النوع من localStorage
    const endpoint = "http://localhost:3000/api/auth/login"; // رابط الـ API
   /* const query = "email=" + email + "&password=" + password  + "&type=" + type; // بناء الـ query string
    const url = endpoint + "?" + query; // بناء الرابط النهائي

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //body: JSON.stringify({ type, email, password }),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        if (type === "customer") {
          // التوجيه إلى لوحة التحكم الخاصة بالكستمر
          window.location.href = "/CustomerDashboard";
        } else if (type === "salon") {
          const salonData = data.data;

          if (!salonData.address || !salonData.workingHours) {
            navigate("/SaloninfoForm");
          } else {
            navigate("/SalonDashboard");
          }
        }
      } else {
        alert(data.message);  // في حال كان هناك خطأ في تسجيل الدخول
      }
    })
    .catch(err => console.error("Error:", err));
  };*/
  const query = `email=${email}&password=${password}&type=${type}`;
  const url = `${endpoint}?${query}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // مافي body هون — لأن السيرفر بيقرأ من query
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      if (type === "salon") {
        const salonData = data.salonInfo;

        if (!salonData || !salonData.address || !salonData.workingHours) {
          navigate("/SaloninfoForm");
        } else {
          navigate("/SalonDashboard");
        }
      } else if (type === "customer") {
        navigate("/CustomerDashboard");
      }
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong!");
  }
};

  return (
    <div style={{ textAlign: 'center', marginTop: '200px', marginRight: 'auto', marginLeft: 'auto', border: '1px solid #e8b923', padding: '20px', width: '300px', borderRadius: '5px', alignContent: 'center', boxShadow: '0 0 10px #bc9c3c' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Sign In</h1>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input type="text" name="email" required style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input type="password" name="password" required style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }} />
        </div>

        <button className="signin" type="submit" style={{ width: '100%', padding: '10px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign In</button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>New User? <a href="/SignUp" style={{ textDecoration: 'none' }}>Sign Up</a></p>
    </div>
  );
};

export default SignIn;
