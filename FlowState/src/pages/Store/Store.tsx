import AudioCard from '../../components/AudioCards/AudioCard';
import EnvironCard from '../../components/EnvCards/EnvironCard';
import PurchasePrompt from '../../components/PurchasePrompt';
import './Store.css';
import { useState } from 'react';
import Navbar from '../../components/NavBar/NavBar';

interface SelectedItem {
  name: string;
  price: number;
}

interface SoundContentProps {
  onPurchaseClick: (name: string, price: number) => void;
}
interface EnvironmentContentProps {
  onPurchaseClick: (name: string, price: number) => void;
}

function SoundContent({ onPurchaseClick }: SoundContentProps) {
  return (
    <div className='flex gap-5 flex-wrap'>
      <AudioCard 
        image='/images/sound_icons/rain.svg'
        name='Rainy Day'
        description='A calming soundscape mirroring a rainy day.'
        notes_amt={25}
        audio='/audio/rainnoise.mp3'
        purchased={true}
        onPurchaseClick={onPurchaseClick}
      />

      <AudioCard
        image='/images/sound_icons/brown_noise.png'
        name='Brown Noise'
        description='A smooth tone to tune out the background noise.'
        notes_amt={25}
        audio='/audio/brownnoise.mp3'
        purchased={true}
        onPurchaseClick={onPurchaseClick}
      />

      <AudioCard
        image='/images/sound_icons/water.svg'
        name='River Flow'
        description='Liquid smooth sounds to go with the flow.'
        notes_amt={25}
        audio='/audio/rivernoise.mp3'
        purchased={false}
        onPurchaseClick={onPurchaseClick}
      />

      <AudioCard
        image='/images/sound_icons/gong.svg'
        name='Soundbath'
        description='A therapeutic sequence of regal gongs.'
        notes_amt={25}
        audio='/audio/soundbathnoise.mp3'
        purchased={false}
        onPurchaseClick={onPurchaseClick}
      />

      <AudioCard
        image='/images/sound_icons/sound-waves.svg'
        name='White Noise'
        description='A tone that washes over and blocks out distractions.'
        notes_amt={25}
        audio='/audio/whitenoise.mp3'
        purchased={false}
        onPurchaseClick={onPurchaseClick}
      />
    </div>
  );
};

function EnvironmentContent({ onPurchaseClick }: EnvironmentContentProps) {
  return (
    <div className='flex gap-5'>
      <EnvironCard 
        image='/images/env_icons/rainforest.png'
        name='Rainforest'
        description='Calming wildlife with rain and nature.'
        notes_amt={50}
        purchased={false}
        onPurchaseClick={onPurchaseClick}
      />

      <EnvironCard
        image='/images/env_icons/coffee.png'
        name='Cafe'
        description='Friendly and cozy ambience of a local cafe.'
        notes_amt={50}
        purchased={true}
        onPurchaseClick={onPurchaseClick}
      />
    </div>
  );
};

const Store: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const handlePurchaseClick = (name: string, price: number) => {
    setSelectedItem({ name, price });
  };

  const handleConfirm = () => {
    console.log('Purchased:', selectedItem);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setSelectedItem(null);
  };
  
  return (
    <>
      <Navbar />

      <div className='store-page p-10'>
        <h1 className='text-[64px]'>STORE</h1>
        <p className='text-[#696969] text-[40px] mb-10'>Use your notes to purchase new sounds or environments!</p>

        <div className="flex gap-5">
          <button
            onClick={() => setActiveTab('tab1')}
            className={`rounded-[15px] w-[198px] h-[39px] font-[Pixelify_Sans] text-[24px] mb-5 hover:cursor-pointer ${
              activeTab === 'tab1'
                ? 'bg-white text-[#ADA7C9]'
                : 'bg-[#ADA7C9] text-white'
            }`}
          >
            Environments
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={`rounded-[15px] w-[198px] h-[39px] font-[Pixelify_Sans] text-[24px] mb-5 hover:cursor-pointer ${
              activeTab === 'tab2'
                ? 'bg-white text-[#ADA7C9]'
                : 'bg-[#ADA7C9] text-white'
            }`}
          >
            Sounds
          </button>
        </div>

        <div>
          {activeTab === 'tab1' && <EnvironmentContent onPurchaseClick={handlePurchaseClick}/>}
          {activeTab === 'tab2' && <SoundContent onPurchaseClick={handlePurchaseClick} />}
        </div>

        <PurchasePrompt
          isOpen={selectedItem !== null}
          itemName={selectedItem?.name || ''}
          itemPrice={selectedItem?.price || 0}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        
      </div>
    </>
  );
};

export default Store;