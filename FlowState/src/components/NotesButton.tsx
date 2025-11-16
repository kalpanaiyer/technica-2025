import React from 'react';
import './NotesButton.css';

interface NotesButtonProps {
  count: number;
}

const NotesButton: React.FC<NotesButtonProps> = ({ count }) => {
  return (
    <button className="notes-button">
      <span className="notes-icon">🎵</span>
      <span className="notes-text">{count} Notes</span>
    </button>
  );
};

export default NotesButton;