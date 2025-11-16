import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ProfileComponent from '../components/ProfileComponent';
import Badges from '../components/Badges';
import Inventory from '../components/Inventory';
import './Profile.css';
import Navbar from '../components/NavBar';

const Profile: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || 'User');
        setUserEmail(user.email || '');
      } else {
        setUserName('Guest');
        setUserEmail('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar></Navbar>
    <div className="profile-page">
      <div className="profile-layout">
        <div className="left-section">
          <h1 className="page-title">PROFILE</h1>
          <Badges />
          <Inventory />
        </div>
        
        <div className="right-section">
          <ProfileComponent 
            name={userName} 
            email={userEmail} 
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;