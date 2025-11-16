import React, { useState, useEffect } from 'react';
import { auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addNotesToUser, getUserNotes } from '../../services/NotesService';
import ProfileComponent from '../../components/ProfileComponent/ProfileComponent';
import Badges from '../../components/Badges';
import Inventory from '../../components/Inventory';
import './Profile.css';
import Navbar from '../../components/NavBar/NavBar';
import SpinWheel from '../../components/SpinWheel/SpinWheel';

const Profile: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showWheel, setShowWheel] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || 'User');
        setUserEmail(user.email || '');
        const notes = await getUserNotes(user.uid);
        setCurrentNotes(notes);
      } else {
        setUserName('Guest');
        setUserEmail('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNotes = async (amount: number) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const newTotal = await addNotesToUser(user.uid, amount);
        setCurrentNotes(newTotal);
        // Refresh navbar notes
        if ((window as any).refreshNavbarNotes) {
          (window as any).refreshNavbarNotes();
        }
        alert(`Added ${amount} notes! New total: ${newTotal}`);
      } catch (error) {
        console.error('Detailed error:', error);
        alert(`Error adding notes: ${error}`);
      }
    }
  };

  const handleRefreshNotes = async () => {
    const user = auth.currentUser;
    if (user) {
      const notes = await getUserNotes(user.uid);
      setCurrentNotes(notes);
      // Also refresh navbar
      if ((window as any).refreshNavbarNotes) {
        (window as any).refreshNavbarNotes();
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-page">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar></Navbar>
      <div className="profile-page">
        <div className="profile-layout">
          <div className="left-section">
            <h1 className="page-title">PROFILE</h1>
            
            <div className="badges-container">
              <h3>Your Badges</h3>
              <div className='badges-list'>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
                <Badges image='/images/env_icons/coffee.png'/>
              </div>
            </div>

            <div className="inventory-container">
              <h3>Inventory</h3>
              <Inventory />
            </div>
            
          </div>
          
          <div className="right-section">
            <ProfileComponent 
              name={userName} 
              email={userEmail} 
            />
          </div>
        </div>
      </div>
      {showWheel && (
        <SpinWheel 
          onClose={() => setShowWheel(false)} 
          onNotesAdded={handleRefreshNotes}
        />
      )}
    </>
  );
};

export default Profile;