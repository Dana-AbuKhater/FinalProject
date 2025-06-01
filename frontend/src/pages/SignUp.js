import React from 'react';
import './SignUp.css';
import { CodeSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
const SignUp = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const username = event.target.username.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    //const type = localStorage.getItem("type"); // Get user type (salon or customer)

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const type = localStorage.getItem("type"); // تأكد أن 'type' يتم تخزينها في localStorage بشكل صحيح (مثلاً من صفحة SignInUp)

    if (!type || (type !== 'salon' && type !== 'customer')) {
      alert("Please select a valid user type (Salon or Customer).");
      return;
    }
    const url = "http://localhost:3000/api/auth/register"; // هذا هو مسار التسجيل الصحيح


    const requestBody = {
      type,
      email,
      username, // استخدم 'name' هنا لأنه يطابق الـ userSchema في الباك إند
      phone, // أبقيها string الآن، وسنرى إذا كان الباك إند يحتاج parseInt
      password,
    };

    console.log("Sending request body:", requestBody); // للمساعدة في التصحيح

    //console.log("Body:", body);
    /* let query = "?type=" + type + "&email=" + email + "&username=" + username + "&phone=" + phone + "&password=" + password;
     console.log("Query:", query);
     const url = endpoint + query;*/
    /*if (!type || (type !== 'salon' && type !== 'customer')) {
      alert("Please select a valid user type (Salon or Customer).");
      return;
    }*/

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody), // <-- هنا يتم إرسال البيانات بشكل صحيح في الـ body
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`${type === 'salon' ? 'Salon' : 'Customer'} account created successfully!`);
          console.log("Type:", type);
          if (type === 'salon') {
            //localStorage
            localStorage.setItem("userLoggedIn", true)
            localStorage.setItem("token", data.token);
            localStorage.setItem("salonId", data.salon.id);
            localStorage.getItem("salonName", data.salon.username);
            localStorage.getItem("salonEmail", data.salon.email);
            localStorage.getItem("salonPhone", data.salon.phone);
            localStorage.setItem("id",data.salon.salon_id)
            
            window.location.href = "./SalonInfoForm";
          }
          else if (type === 'customer') {
            window.location.href = "/Customer";
          }
        } else {
          console.log("Error:", data);
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
      <div className="back-button">
        <Link to="/SignInUp">
          <button className="back-button">←</button>
        </Link>
      </div>
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