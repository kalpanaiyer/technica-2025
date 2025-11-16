import React from 'react';

interface EnvironInvenCardProps {
  image?: string;
  name?: string;
}

const EnvironInvenCard: React.FC<EnvironInvenCardProps> = ({ image, name }: EnvironInvenCardProps) => {
  // avoid setting state during render to prevent infinite re-renders
  const exists = Boolean(image && name);

  return (
    <div
      className={`rounded-[18px] w-60 h-24 flex justify-center items-center text-white font-[Pixelify_Sans] text-[20px] relative overflow-hidden
      ${exists ? '' : 'bg-[#F0F8FF]'}`}
    >
      {/* Blurred background layer */}
    {exists && image && (
      <div
        className="absolute inset-0 brightness-70 rounded-[18px]" // or blur-md, blur-lg
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    )}
    
    {/* Text layer (sharp) */}
    <span className="relative z-10">{exists ? name : ''}</span>
    </div>
  );
};

export default EnvironInvenCard;