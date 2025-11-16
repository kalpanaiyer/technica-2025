import React from 'react';
import './NotesButton.css';

interface NotesButtonProps {
  count: number;
  onRefresh?: () => void;
}

const NotesButton: React.FC<NotesButtonProps> = ({ count, onRefresh }) => {
  return (
    <button className="notes-button" onClick={onRefresh}>
      <span className="notes-icon">🎵</span>
      <span className="notes-text">{count} Notes</span>
    </button>
  );
};

export default NotesButton;