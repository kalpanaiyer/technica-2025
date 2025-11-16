import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserNotes } from '../../services/NotesService.tsx';
import './Navbar.css';
import logo from '/images/logos/testlogo.png';
import NotesButton from '../NotesButton/NotesButton.tsx';
import dashboardIcon from '/images/menu/dashboardicon.svg';
import notesIcon from '/images/menu/notesshopicon.svg';
import profileIcon from '/images/menu/profileicon.svg';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notesCount, setNotesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const notes = await getUserNotes(user.uid);
        setNotesCount(notes);
      } else {
        setNotesCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to refresh notes count
  const refreshNotes = async () => {
    const user = auth.currentUser;
    if (user) {
      const notes = await getUserNotes(user.uid);
      setNotesCount(notes);
    }
  };

  // Expose refresh function globally
  useEffect(() => {
    (window as any).refreshNavbarNotes = refreshNotes;
    return () => {
      delete (window as any).refreshNavbarNotes;
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const activePath = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img 
            src={logo} 
            alt="Flowstate Logo" 
            className="navbar-logo" 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
        
        <div className="navbar-right">
          <NotesButton count={notesCount} onRefresh={refreshNotes} />
          <button className="menu-button" onClick={toggleMenu}>
            <div className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
        </div>
        
        <div className="menu-items">
          <button onClick={() => handleNavigation('/dashboard')}
            className={`menu-item ${activePath === '/dashboard' ? 'active' : ''}`}>
                <img src={dashboardIcon} className="menu-icon" alt="Dashboard" />
                <span>Dashboard</span>
            </button>

            <button className={`menu-item ${activePath === '/store' ? 'active' : ''}`} onClick={() => handleNavigation('/store')}>
                <img src={notesIcon} className="menu-icon" alt="store" />
                <span>Notes Shop</span>
            </button>

            <button className={`menu-item ${activePath === '/profile' ? 'active' : ''}`} onClick={() => handleNavigation('/profile')}>
                <img src={profileIcon} className="menu-icon" alt="Profile" />
                <span>Profile</span>
            </button>

        </div>
      </div>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={toggleMenu}></div>
      )}
    </>
  );
};

export default Navbar;