import React from 'react';

interface BadgeProps {
  image: string;
}

const Badges: React.FC<BadgeProps> = ({ image }: BadgeProps) => {
  return (
    <div>
      <img src={image} alt="Badge" className='w-20 h-20' />
    </div>
  );
};

export default Badges;