import React from 'react';
import './SignIn.css';

const SignIn = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.username.value;
    const password = event.target.password.value;
    const type = localStorage.getItem("type");  // هنا بنجيب النوع

    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, email, password }),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        if (type === "customer") {
          window.location.href = "/CustomerDashboard";
        } else {
          window.location.href = "/SalonDashboard";
        }
      } else {
        alert(data.message);
      }
    })
    .catch(err => console.error("Error:", err));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '200px', marginRight: 'auto', marginLeft: 'auto', border: '1px solid #e8b923', padding: '20px', width: '300px', borderRadius: '5px', alignContent: 'center', boxShadow: '0 0 10px #bc9c3c' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Sign In</h1>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>User Name:</label>
          <input type="text" name="username" required style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }} />
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