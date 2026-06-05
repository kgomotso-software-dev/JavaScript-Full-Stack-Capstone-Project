import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './RegisterPage.css'; 
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn, setUserName } = useAppContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`${urlConfig.backendUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (Array.isArray(errorData.errors)) {
                    setError(errorData.errors.map(err => err.msg).join(", "));
                } else {
                    setError(errorData.message || "Failed to register");
                }
                return;
            } else {
                // Handle successful registration
                const json = await response.json();
                if (json.authtoken) {
                    sessionStorage.setItem("auth-token", json.authtoken);
                    // Optionally set user information in context
                    sessionStorage.setItem("name", firstName);
                    sessionStorage.setItem("email", email);
                    setIsLoggedIn(true);
                    setUserName(firstName);
                    navigate("/app");
                }
                if(json.error) {
                    setError(json.error);
                }
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setError("An error occurred while registering. Please try again.");
        }
    }
    
    return (
        <div className="container mt-5">
            {error ? <div className="alert alert-danger">{error}</div> : ""}
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-6">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                        <form onSubmit={handleRegister}>
                            <div className="mb-4">
                                <label htmlFor="firstName" className="form-label"> FirstName</label><br/>
                                <input id="firstName" type="text" className="form-control" placeholder="Enter your firstName (min 2 characters)" value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="lastName" className="form-label"> LastName</label><br/>
                                <input id="lastName" type="text" className="form-control" placeholder="Enter your lastName (min 2 characters)" value={lastName} 
                                onChange={(e) => setLastName(e.target.value) } required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label"> Email</label><br/>
                                <input id="email" type="email" className="form-control" placeholder="Enter your email" value={email} 
                                onChange={(e) => setEmail(e.target.value) } required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label"> Password</label><br/>
                                <input id="password" type="password" className="form-control" placeholder="Enter your password (min 6 characters)" value={password} 
                                onChange={(e) => setPassword(e.target.value) } required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
                        </form>
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
