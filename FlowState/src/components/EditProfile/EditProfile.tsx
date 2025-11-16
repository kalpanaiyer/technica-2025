import React, { useState, useEffect } from 'react';
import { auth } from '../../../firebase';
import { onAuthStateChanged, updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/NavBar';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = auth.currentUser;
    if (!user) return;

    // Check if email is being changed
    if (email !== user.email) {
      setShowPasswordPrompt(true);
      return;
    }

    // If only name is being changed
    setLoading(true);
    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err: unknown) {
      console.error('Update error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (user && user.email) {
        // Re-authenticate the user
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        // Update display name
        if (name !== user.displayName) {
          await updateProfile(user, { displayName: name });
        }

        // Update email
        await updateEmail(user, email);

        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (err: unknown) {
      console.error('Update error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleCancelPassword = () => {
    setShowPasswordPrompt(false);
    setPassword('');
    setError('');
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile-page">
        <h1 className="page-title">EDIT PROFILE</h1>
        
        <div className="edit-profile-container">
          {!showPasswordPrompt ? (
            <>
              <div className="profile-avatar-section">
                <div className="avatar-circle-large"></div>
                <button className="change-photo-button" type="button">Change Photo</button>
              </div>

              <form onSubmit={handleSave} className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <form onSubmit={handleConfirmEmailChange} className="edit-form">
              <div className="password-prompt">
                <h3>Confirm Your Password</h3>
                <p>Please enter your password to change your email address.</p>
              </div>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelPassword}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default EditProfile;