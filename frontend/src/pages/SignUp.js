/**import React from 'react';
import './SignUp.css';

const SignUp = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const username = event.target.username.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const type = localStorage.getItem("type"); // تحديد نوع المستخدم (صالون أو كستمر)

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    const body = JSON.stringify({ type, email, username, phone, password })
    console.log(body)
    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      query: JSON.stringify({ type, email, username, phone, password }),
    })
      .then(res => {
        console.log("Response : ", res)
        return res.json()
      })
      .then(data => {
        console.log("Data : ", data);
        if (data.success) {
          alert("Account created successfully!");
          window.location.href = "/SignIn";
        } else {
          // alert(data.message);
          console.log("Data")
        }
      })
      .catch(err => {
        console.log("Test test")
        // console.error("Error:", err)
      });

    // تحقق إذا كان نوع المستخدم هو صالون أو كستمر
    if (type === 'salon') {
      // تحقق من سكيما الصالون
      fetch("http://localhost:3000/api/salon/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        query: JSON.stringify({ type, email, username, phone, password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("Salon account created successfully!");
            window.location.href = "/SignIn";
          } else {
            alert(data.message);
          }
        })
        .catch(err => console.error("Error:", err));
    } else if (type === 'customer') {
      // تحقق من سكيما الكستمر
      fetch("http://localhost:3000/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        query: JSON.stringify({ type, email, username, phone, password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("Customer account created successfully!");
            window.location.href = "/SignIn";
          } else {
            alert(data.message);
          }
        })
        .catch(err => console.error("Error:", err));
    } else {
      alert("Please select a valid user type (Salon or Customer).");
    }
    
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '150px', marginRight: 'auto', marginLeft: 'auto', border: '1px solid #e8b923', padding: '20px', width: '300px', borderRadius: '5px', alignContent: 'center', boxShadow: '0 0 10px #bc9c3c' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input type="email" name="email" required style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input type="text" name="username" required style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number:</label>
          <input type="tel" name="phone" required style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input type="password" name="password" required style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" required style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }} />
        </div>

        <button className="signup" type="submit" style={{ width: '100%', padding: '10px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign Up</button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>Already have an account? <a href="/SignIn" style={{ textDecoration: 'none' }}>Sign In</a></p>
    </div>
  );
};

export default SignUp;**/

import React from 'react';
import './SignUp.css';

const SignUp = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const username = event.target.username.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const type = localStorage.getItem("type"); // Get user type (salon or customer)

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    // Determine the appropriate endpoint based on user type
    const endpoint = "http://localhost:3000/api/auth/register";
    let query = "?type=" + type + "&email=" + email + "&username=" + username + "&phone=" + phone + "&password=" + password;
    const url = endpoint + query;
    if (!type || (type !== 'salon' && type !== 'customer')) {
      alert("Please select a valid user type (Salon or Customer).");
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // query: JSON.stringify({ type, email, username, phone, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`${type === 'salon' ? 'Salon' : 'Customer'} account created successfully!`);
          window.location.href = "/SalonInfoForm";
        } else {
          alert(data.message || "Registration failed");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("An error occurred during registration");
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
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            required
            style={{ width: '100%', padding: '8px', borderColor: '#e8b923' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Confirm Password:</label>
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
          style={{
            width: '100%',
            padding: '10px',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Up
        </button>
        
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Already have an account? <a href="/SignIn" style={{ textDecoration: 'none' }}>Sign In</a>
      </p>
    </div>
  );
};

export default SignUp;