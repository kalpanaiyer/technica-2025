import React from 'react';

interface EnvironInvenCardProps {
  image?: string;
  name?: string;
}

const EnvironInvenCard: React.FC<EnvironInvenCardProps> = ({ image, name }: EnvironInvenCardProps) => {
  // avoid setting state during render to prevent infinite re-renders
  const exists = Boolean(image && name);

  const style: React.CSSProperties | undefined = exists && image
    ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <div
      className={`rounded-[18px] w-60 h-24 flex justify-center items-center text-white font-[Pixelify_Sans] text-[20px]
        ${exists ? '' : 'bg-[#F0F8FF]'}`}
      style={style}
    >
      {exists ? name : ''}
    </div>
  );
};

export default EnvironInvenCard;