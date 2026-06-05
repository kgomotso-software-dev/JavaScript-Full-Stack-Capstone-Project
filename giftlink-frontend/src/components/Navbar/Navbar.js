import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');
        if (authTokenFromSession) {
            setIsLoggedIn(true);
            if (nameFromSession) setUserName(nameFromSession);
        } else {
            setIsLoggedIn(false);
        }
    },[]);

    const handleLogout=()=>{
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        navigate("/app");
    }
    const handleUpdate = () => {
        navigate("/app/profile");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">GiftLink</a>
            <div className={`collapse navbar-collapse mobile-navigation-drawer ${isOpen ? 'show' : ''}`} id="navbarMenu">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/home.html">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app">Gifts</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app/search">Search</a>
                    </li>
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <button className="nav-link active" onClick={handleUpdate}>Welcome, {userName}</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link login-btn" onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <a className="nav-link login-btn" href="/app/login">Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/app/register">Register</a>
                            </li>
                        </>
                    )}
                    
                </ul>
            </div>
            <button className="navbar-toggler" type="button" data-bs-target="#navbarMenu" onClick={toggleNavbar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
        </nav>
    );
}
