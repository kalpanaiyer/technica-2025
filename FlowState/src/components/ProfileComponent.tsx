import React from 'react';
import './ProfileComponent.css';
import { useNavigate } from 'react-router-dom';

interface ProfileComponentProps {
  name?: string;
  email?: string;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ 
  name = "Guest", 
  email = "guest@email.com" 
}) => {
  const navigate = useNavigate();
  const sounds = 10;
  const environments = 10;
  const streak = 21;
  const level = 12;

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <button className="edit-button" onClick={handleEditClick}>
          <img src="/pencil.svg" alt="Edit" />
        </button>
      </div>
      
      <div className="profile-avatar">
        <div className="avatar-circle"></div>
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
          <p className="stat-value">{sounds}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Environments</p>
          <p className="stat-value">{environments}</p>
        </div>
      </div>
      
      <div className="profile-streak">
        <p className="streak-label">Your Streak</p>
        <p className="streak-value">{streak} days</p>
      </div>
    </div>
  );
};

export default ProfileComponent;