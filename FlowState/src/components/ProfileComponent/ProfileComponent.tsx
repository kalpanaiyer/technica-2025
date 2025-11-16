import React, { useState, useEffect } from 'react';
import './ProfileComponent.css';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../firebase.ts';
import { doc, getDoc } from 'firebase/firestore';
import { getUserPurchases } from '../../services/PurchaseService';

interface ProfileComponentProps {
  name?: string;
  email?: string;
}

const ALL_SOUNDS = ['Rainy Day', 'Brown Noise', 'River Flow', 'Soundbath', 'White Noise'];
const ALL_ENVIRONMENTS = ['Rainforest', 'Cafe'];

const ProfileComponent: React.FC<ProfileComponentProps> = ({ 
  name = "Guest", 
  email = "guest@email.com" 
}) => {
  const navigate = useNavigate();
  const [photoURL, setPhotoURL] = useState<string>('');
  const [soundsCount, setSoundsCount] = useState<number>(0);
  const [environmentsCount, setEnvironmentsCount] = useState<number>(1); // Start at 1 for default "Under the Sea"

  useEffect(() => {
    const loadUserData = async (user: any) => {
      if (user) {
        // Try to load photo from Firestore first
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().photoURL) {
            setPhotoURL(userDoc.data().photoURL);
          } else if (user.photoURL) {
            setPhotoURL(user.photoURL);
          }
        } catch (err) {
          console.error('Error loading photo:', err);
          if (user.photoURL) {
            setPhotoURL(user.photoURL);
          }
        }

        // Load purchases and count items
        try {
          const purchases = await getUserPurchases(user.uid);
          
          // Count sounds
          const purchasedSounds = purchases.filter(item => ALL_SOUNDS.includes(item));
          setSoundsCount(purchasedSounds.length);
          
          // Count environments (add 1 for default "Under the Sea")
          const purchasedEnvironments = purchases.filter(item => ALL_ENVIRONMENTS.includes(item));
          setEnvironmentsCount(purchasedEnvironments.length + 1);
        } catch (err) {
          console.error('Error loading purchases:', err);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, loadUserData);
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

  const streak = 21;
  const level = 12;

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <button className="edit-button" onClick={handleEditClick}>
          <img src="/images/pencil.svg" alt="Edit" />
        </button>
      </div>
      
      <div className="profile-avatar">
        <div className="avatar-circle">
          {photoURL && (
            <img 
              src={photoURL} 
              alt="Profile" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '50%'
              }} 
            />
          )}
        </div>
      </div>
      
      <h2 className="profile-name">{name}</h2>
      <p className="profile-email">{email}</p>
      
      <div className="profile-level">
        <span>Lv. {level}</span>
        <div className="level-bar">
          <div className="level-progress" style={{ width: '60%' }}></div>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-box">
          <p className="stat-label">Sounds</p>
          <p className="stat-value">{soundsCount}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Environments</p>
          <p className="stat-value">{environmentsCount}</p>
        </div>
      </div>
      
      <div className="profile-streak">
        <p className="streak-label">Your Streak</p>
        <p className="streak-value">{streak} days</p>
      </div>

      <button onClick={handleSignOut} type="button" className='flex justify-self-center border rounded-full bg-[#F4CAE080]/50 px-8 py-1 mt-5 text-[1.25rem] hover:cursor-pointer shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
        Sign Out
      </button>
    </div>
  );
};

export default ProfileComponent;