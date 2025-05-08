import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you! Reach out to us for any inquiries about our beauty services in Jordan.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-method">
            <h3>Call Us</h3>
            <p>+962 6 123 4567</p>
          </div>

          <div className="contact-method">
            <h3>Email</h3>
            <p>info@jordanbeauty.com</p>
          </div>

          <div className="contact-method">
            <h3>Visit Us</h3>
            <p>Al-Jabal Al-Ma'ali, Amman, Jordan</p>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send a Message</h2>
          
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Enter your name" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                rows="5" 
                placeholder="Write your message here"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;