import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // استيراد useLocation
import './Header.css';
import StyleHiveLogo from '../images/StyleHiveLogo3.png'; // تأكد من المسار الصحيح للصورة

function Header() {
    const location = useLocation(); // الحصول على المسار الحالي
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate(); // For the back button

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // إظهار Logo فقط إذا كنا في صفحة Home
    const isHomePage = location.pathname === "/";
    const isSignInUpPage = location.pathname === "/SignInUp";
    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <ul className="nav-list">
                {/* Logo يظهر فقط في Home */}
                {isHomePage && <img src={StyleHiveLogo} alt="Logo" className="Logo" />}   
                {isSignInUpPage && <img src={StyleHiveLogo} alt="Logo" className="Logo" />}  
                <li className="nav-item"><Link to="/">HOME</Link></li>
                <li className="nav-item"><Link to="/help">HELP</Link></li>
                <li className="nav-item"><Link to="/about">ABOUT</Link></li>
                <li className="nav-item"><Link to="/contact">CONTACT</Link></li>
            </ul>
        </nav>
    );
}

export default Header;
