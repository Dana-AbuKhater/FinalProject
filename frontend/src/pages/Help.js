import { useState } from "react";
import "./Help.css"; // استدعاء ملف التصميم

const faqData = [
  // Customer FAQs
  {
    role: "customer",
    question: "How can I book an appointment?",
    answer:
      "Go to the salons page, choose a salon, click “Book Appointment,” and select your preferred date and time.",
  },
  {
    role: "customer",
    question: "Can I cancel my appointment after booking it?",
    answer:
      "Yes, you can cancel your appointment from the “My Appointments” page up to 24 hours before the scheduled time.",
  },
  {
    role: "customer",
    question: "Why can’t I see any salons in my area?",
    answer:
      "Make sure your location services are enabled or use the manual search to select your city.",
  },
  {
    role: "customer",
    question: "Do I need an account to book an appointment?",
    answer:
      "Yes, you need to sign up and log in to book and manage your appointments.",
  },
  {
    role: "customer",
    question: "I didn’t receive a confirmation notification. What should I do?",
    answer:
      "Check your notification settings or look in your spam/junk folder. You can also check your booking status on the “My Appointments” page.",
  },

  // Salon FAQs
  {
    role: "salon",
    question: "How do I add my services and prices?",
    answer:
      "After logging in, go to your dashboard and click “Manage Services” to add or edit your offerings.",
  },
  {
    role: "salon",
    question: "Can I reject a booking request from a customer?",
    answer:
      "Yes, you can decline bookings directly from your dashboard. The customer will be notified instantly.",
  },
  {
    role: "salon",
    question: "How do I upload images of my salon?",
    answer:
      "Go to “Salon Settings” and upload photos that showcase your services or the space.",
  },
  {
    role: "salon",
    question: "Why are my services not showing up in the search results?",
    answer:
      "Make sure your salon profile is active and you’ve correctly selected your city and services in your profile settings.",
  },
  {
    role: "salon",
    question: "Can I edit my working hours?",
    answer:
      "Yes, you can update your business hours at any time from the “Salon Settings” section.",
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-container">
      <h1 className="help-title">FAQ - Help Center</h1>
      {faqData.map((item, index) => (
        <div
          key={index}
          className="faq-item"
          onClick={() => toggleAnswer(index)}
        >
          <div className="faq-question">
            {item.question}
            <span className="faq-toggle-sign">
              {openIndex === index ? "−" : "+"}
            </span>
          </div>
          {openIndex === index && (
            <div className="faq-answer">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Help;
