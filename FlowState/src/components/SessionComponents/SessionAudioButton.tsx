import { useState, useEffect } from 'react';
import { loadAudio, togglePlayPause, getIsPlaying } from '.././AudioCards/AudioFunctions'

interface AudioButtonProps {
  audioPath: string;
}

export default function SessionAudioButton({ audioPath }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAudio(audioPath)
      .then(() => {
        setIsLoading(false);
        console.log(`Audio loaded: ${audioPath}`);
      })
      .catch((error) => {
        console.error('Failed to load audio:', error);
        setIsLoading(false);
      });
  }, [audioPath]);

  const handleClick = () => {
    togglePlayPause(audioPath);
    setIsPlaying(getIsPlaying(audioPath));
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className='hover:cursor-pointer text-[#5D608A] text-xl'
    >
      {isLoading ? 'Loading...' : isPlaying ? '⏸Playing...' : '▶ Play'}
    </button>
  );
}