import React, { useState } from 'react';
import './SpinWheel.css';

interface SpinWheelProps {
  onClose: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

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
    { points: 100, color: '#FFD700' } // Tiny golden slice
  ];

  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Random spins between 5-8 full rotations plus random angle
    const spins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomAngle;

    setRotation(totalRotation);

    // Calculate which segment we landed on
    setTimeout(() => {
      // The pointer is at the top (0 degrees), so we need to calculate from there
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle) % totalSegments;
      
      setResult(segments[segmentIndex].points);
      setIsSpinning(false);
    }, 5000);
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
              cursor: isSpinning ? 'default' : 'pointer'
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
            
            {/* Center circle */}
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
          disabled={isSpinning}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
        </button>
      </div>
    </div>
  );
};

export default SpinWheel;