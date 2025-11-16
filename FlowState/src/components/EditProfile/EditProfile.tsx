import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged, updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/NavBar';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async (user: any) => {
      if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
        
        // Try to load photo from Firestore first
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().photoURL) {
            setPhotoURL(userDoc.data().photoURL);
            setPhotoPreview(userDoc.data().photoURL);
          } else if (user.photoURL) {
            setPhotoURL(user.photoURL);
            setPhotoPreview(user.photoURL);
          }
        } catch (err) {
          console.error('Error loading photo:', err);
          if (user.photoURL) {
            setPhotoURL(user.photoURL);
            setPhotoPreview(user.photoURL);
          }
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, loadUserData);
    return () => unsubscribe();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 1MB for Firestore)
      if (file.size > 1 * 1024 * 1024) {
        setError('Image size must be less than 1MB');
        return;
      }

      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const convertPhotoToBase64 = async (): Promise<string> => {
    if (!photoFile) return photoURL;

    setUploadingPhoto(true);
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(photoFile);
      });
    } catch (err) {
      console.error('Photo conversion error:', err);
      throw new Error('Failed to process photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const savePhotoToFirestore = async (userId: string, photoDataURL: string) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        photoURL: photoDataURL,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('Error saving to Firestore:', err);
      throw new Error('Failed to save photo');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = auth.currentUser;
    if (!user) {
      setError('No user logged in');
      return;
    }

    // Check if email is being changed
    if (email !== user.email) {
      setShowPasswordPrompt(true);
      return;
    }

    // If only name or photo is being changed
    setLoading(true);
    try {
      let newPhotoURL = photoURL;

      // Convert and save photo if a new one is selected
      if (photoFile) {
        newPhotoURL = await convertPhotoToBase64();
        await savePhotoToFirestore(user.uid, newPhotoURL);
      }

      // Update profile (only name, not photo in Firebase Auth)
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

        let newPhotoURL = photoURL;

        // Convert and save photo if a new one is selected
        if (photoFile) {
          newPhotoURL = await convertPhotoToBase64();
          await savePhotoToFirestore(user.uid, newPhotoURL);
        }

        // Update profile (only name, not photo in Firebase Auth)
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
                <div className="avatar-circle-large">
                  {photoPreview && (
                    <img 
                      src={photoPreview} 
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
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <button 
                  className="change-photo-button" 
                  type="button"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? 'Processing...' : 'Change Photo'}
                </button>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  Max size: 1MB
                </p>
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
                    disabled={loading || uploadingPhoto}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={loading || uploadingPhoto}
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