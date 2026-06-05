import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});
  const {setUserName} = useAppContext();
  const [changed, setChanged] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const email = sessionStorage.getItem("email");
      const name=sessionStorage.getItem("name");
      if (name && email) {
        const storedUserDetails = {
          name: name,
          email: email
        };
        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);
      }
    } catch (error) {
      setError("Failed to fetch user details");
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setChanged("");
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      if (!authtoken || !email) {
        navigate("/app/login");
        return;
      }
      const response = await fetch(`${urlConfig.backendUrl}/auth/update`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authtoken}`
          },
          body: JSON.stringify({
              firstName: updatedDetails.name,
              email: email
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
      }
      // Update the user details in session storage
      sessionStorage.setItem("name", updatedDetails.name);
      setUserName(updatedDetails.name);
      setUserDetails(updatedDetails);
      setEditMode(false);
      // Display success message to the user
      setChanged("Name Changed Successfully!");
      setTimeout(() => {
        setChanged("");
        navigate("/");
      }, 1000);
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  return (
  <div className="profile-container">
    {error && <div className="alert alert-danger">{error}</div>}
    {editMode ? (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" name="email" value={userDetails.email} disabled />
      </label>
      <label>
        Name
        <input type="text" name="name" value={updatedDetails.name} onChange={handleInputChange} />
      </label>
      <button type="submit">Save</button>
    </form>
    ) : (
      <div className="profile-details">
        <h1>Hi, {userDetails.name}</h1>
        <p><b>Email:</b> {userDetails.email}</p>
        <button onClick={handleEdit}>Edit</button>
        <span style={{color:'green',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{changed}</span>
      </div>
    )}
  </div>
  );
}; 

export default Profile;
