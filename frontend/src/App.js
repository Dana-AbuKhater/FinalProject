import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Header from './component/Header';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Help from './pages/Help';
import About from './pages/About';
import SignInUp from './pages/SignInUp';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SalonInfoForm from './pages/SalonInfoForm';
import AddServiceForm from './pages/AddServiceForm';
import ServicesList from './pages/ServicesList';
import UpdateServiceStatus from './pages/UpdateServiceStatus';
import Customer from './pages/Customer';
import CustomerAppointment from './pages/CustomerAppointment';
import SalonDashboard from './pages/SalonDashboard';
import SalonDetails from './pages/SalonDetails'; // استيراد صفحة تفاصيل الصالون
import ManageServices from './pages/ManageServices';
import EditService from './pages/EditService';
function App() {
  return (<>

    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/SignInUp" element={<SignInUp />} />
        <Route path="/SignIn" element={<SignIn />} /> {/* تعريف مسار Sign In */}
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/SalonInfoForm" element={<SalonInfoForm />} />
        <Route path="/Customer" element={<Customer />} />
        <Route path="/CustomerAppointment" element={<CustomerAppointment />} />
        <Route path="/SalonDashboard" element={<SalonDashboard />} />
        <Route path="/SalonDetails" element={<SalonDetails />} /> {/* تعريف مسار تفاصيل الصالون مع باراميتر id */}
        {/* يمكن استخدام :id في الرابط لتمرير معرف الصالون */}Ks
        <Route path="/AddServiceForm" element={<AddServiceForm setServices={(services) => {
          // تحديث الخدمات في SalonInfoForm
          localStorage.setItem('services', JSON.stringify(services));
        }} />} />
        <Route path="/ServicesList" element={<ServicesList />} />
        <Route path="/UpdateServiceStatus" element={<UpdateServiceStatus />}></Route>
        <Route path="/manage-services" element={<ManageServices />} />
        <Route path="/edit-service/:id" element={<EditService />} />

      </Routes>
    </Router>

  </>

  );
}

export default App;