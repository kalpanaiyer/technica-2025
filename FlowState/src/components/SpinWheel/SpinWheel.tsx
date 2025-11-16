import React, { useState } from 'react';
import { auth } from '../../../firebase';
import { addNotesToUser, getUserNotes } from '../../services/NotesService';
import './SpinWheel.css';

interface SpinWheelProps {
  onClose: () => void;
  onNotesAdded?: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onClose, onNotesAdded }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const segments = [
    { points: 5, color: '#E8D5F2' },
    { points: 10, color: '#F4CAE0' },
    { points: 15, color: '#E8D5F2' },
    { points: 5, color: '#F4CAE0' },
    { points: 20, color: '#E8D5F2' },
    { points: 10, color: '#F4CAE0' },
    { points: 5, color: '#E8D5F2' },
    { points: 15, color: '#F4CAE0' },
    { points: 10, color: '#E8D5F2' },
    { points: 5, color: '#F4CAE0' },
    { points: 25, color: '#E8D5F2' },
    { points: 100, color: '#FFD700' }
  ];

  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  const spinWheel = async () => {
    if (isSpinning || hasSpun) return;

    const user = auth.currentUser;
    if (!user) {
      alert('You must be signed in to spin the wheel.');
      return;
    }

    try {
      // Check if user has enough notes
      const currentNotes = await getUserNotes(user.uid);
      if (currentNotes < 10) {
        alert('Not enough Notes! You need 10 notes to spin the wheel.');
        return;
      }

      await addNotesToUser(user.uid, -15);
      
      // Refresh navbar to show deduction
      if ((window as any).refreshNavbarNotes) {
        (window as any).refreshNavbarNotes();
      }

      setIsSpinning(true);
      setHasSpun(true);
      setResult(null);

      const spins = 5 + Math.random() * 3;
      const randomAngle = Math.random() * 360;
      const totalRotation = rotation + (spins * 360) + randomAngle;

      setRotation(totalRotation);

      setTimeout(async () => {
        const normalizedAngle = (360 - (totalRotation % 360)) % 360;
        const segmentIndex = Math.floor(normalizedAngle / segmentAngle) % totalSegments;
        const wonPoints = segments[segmentIndex].points;
        
        setResult(wonPoints);
        
        // Add won points to user's account
        try {
          await addNotesToUser(user.uid, wonPoints);
          if (onNotesAdded) {
            onNotesAdded();
          }
          // Refresh navbar again to show winnings
          if ((window as any).refreshNavbarNotes) {
            (window as any).refreshNavbarNotes();
          }
        } catch (error) {
          console.error('Error adding notes:', error);
          alert('Error adding notes to your account');
        }
        
        setIsSpinning(false);
      }, 5000);
    } catch (error) {
      console.error('Error spinning wheel:', error);
      alert('Failed to spin wheel. Please try again.');
      setIsSpinning(false);
    }
  };

  return (
    <div className="spin-wheel-overlay">
      <div className="spin-wheel-modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        
        <h2 className="wheel-title">
          Congratulations on leveling up! Spin the wheel below for your REWARDS!
        </h2>

        <div className="wheel-container">
          <div className="wheel-pointer"></div>
          
          <svg
            className="wheel-svg"
            viewBox="0 0 400 400"
            onClick={spinWheel}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              cursor: isSpinning || hasSpun ? 'default' : 'pointer'
            }}
          >
            {segments.map((segment, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = startAngle + segmentAngle;
              
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (endAngle - 90) * (Math.PI / 180);
              
              const x1 = 200 + 190 * Math.cos(startRad);
              const y1 = 200 + 190 * Math.sin(startRad);
              const x2 = 200 + 190 * Math.cos(endRad);
              const y2 = 200 + 190 * Math.sin(endRad);
              
              const largeArc = segmentAngle > 180 ? 1 : 0;
              
              const pathData = `M 200 200 L ${x1} ${y1} A 190 190 0 ${largeArc} 1 ${x2} ${y2} Z`;
              
              const textAngle = startAngle + segmentAngle / 2;
              const textRad = (textAngle - 90) * (Math.PI / 180);
              const textX = 200 + 130 * Math.cos(textRad);
              const textY = 200 + 130 * Math.sin(textRad);
              
              return (
                <g key={index}>
                  <path
                    d={pathData}
                    fill={segment.color}
                    stroke="#5D608A"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#333"
                    fontSize="20"
                    fontWeight="700"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {segment.points}
                  </text>
                </g>
              );
            })}
            
            <circle cx="200" cy="200" r="35" fill="#5D608A" />
            <text
              x="200"
              y="200"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="14"
              fontWeight="700"
            >
              SPIN
            </text>
          </svg>
        </div>

        {result !== null && (
          <div className="result-message">
            🎉 You won {result} notes! 🎉
          </div>
        )}

        <button
          className="spin-button"
          onClick={spinWheel}
          disabled={isSpinning || hasSpun}
        >
          {isSpinning ? 'SPINNING...' : hasSpun ? 'SPUN!' : 'SPIN THE WHEEL'}
        </button>
      </div>
    </div>
  );
};

export default SpinWheel;