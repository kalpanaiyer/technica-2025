import React from 'react';
import './Badges.css';

interface BadgeProps {
  image: string;
}

const Badges: React.FC<BadgeProps> = ({ image }: BadgeProps) => {
  return (
    <div>
      <img src={image} alt="Badge" className='badge' />
    </div>
  );
};

export default Badges;