import React from 'react';

interface AudioInvenCardProps {
  image?: string;
  name?: string;
}

const AudioInvenCard: React.FC<AudioInvenCardProps> = ({ image, name }: AudioInvenCardProps) => {
  // avoid setting state during render to prevent infinite re-renders
  const exists = Boolean(image && name);

  return (
    <div
      className={`p-2 justify-center gap-5 rounded-[18px] w-60 h-24 flex items-center text-white font-[Pixelify_Sans] text-[20px] relative overflow-hidden
      ${exists ? 'bg-[#F4CAE080]' : 'bg-[#F0F8FF]'}`}
    >
    <img src={image} alt='Sound Background' className=''/>
    <p className='text-black'>{exists ? name : ''}</p>
    </div>
  );
};

export default AudioInvenCard;