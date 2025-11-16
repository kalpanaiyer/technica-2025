import AudioCard from '../../components/AudioCards/AudioCard';
import EnvironCard from '../../components/EnvCards/EnvironCard';
import PurchasePrompt from '../../components/PurchasePrompt';
import SpinWheel from '../../components/SpinWheel/SpinWheel';
import './Store.css';
import { useState, useEffect } from 'react';
import { auth } from '../../../firebase';
import { getUserNotes, addNotesToUser } from '../../services/NotesService';
import { getUserPurchases, addPurchaseForUser } from '../../services/PurchaseService';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/NavBar/NavBar';

interface SelectedItem {
  name: string;
  price: number;
}

interface SoundContentProps {
  onPurchaseClick: (name: string, price: number) => void;
  purchasedItems: string[];
}
interface EnvironmentContentProps {
  onPurchaseClick: (name: string, price: number) => void;
  purchasedItems: string[];
}

function SoundContent({ onPurchaseClick, purchasedItems }: SoundContentProps) {
  return (
    <div className='flex gap-5 flex-wrap'>
      <AudioCard 
        image='/images/sound_icons/rain.svg'
        name='Rainy Day'
        description='A calming soundscape mirroring a rainy day.'
        notes_amt={25}
        audio='/audio/rainnoise.mp3'
        purchased={purchasedItems.includes('Rainy Day') || false}
        onPurchaseClick={onPurchaseClick}
      />

      <AudioCard
        image='/images/sound_icons/brown_noise.png'
        name='Brown Noise'
        description='A smooth tone to tune out the background noise.'
        notes_amt={25}
        audio='/audio/brownnoise.mp3'
        purchased={purchasedItems.includes('Brown Noise') || false}
        onPurchaseClick={onPurchaseClick}
      />

      <AudioCard
        image='/images/sound_icons/water.svg'
        name='River Flow'
        description='Liquid smooth sounds to go with the flow.'
        notes_amt={25}
        audio='/audio/rivernoise.mp3'
        purchased={purchasedItems.includes('River Flow') || false}
        onPurchaseClick={onPurchaseClick}
      />

      <AudioCard
        image='/images/sound_icons/gong.svg'
        name='Soundbath'
        description='A therapeutic sequence of regal gongs.'
        notes_amt={25}
        audio='/audio/soundbathnoise.mp3'
        purchased={purchasedItems.includes('Soundbath') || false}
        onPurchaseClick={onPurchaseClick}
      />

      <AudioCard
        image='/images/sound_icons/sound-waves.svg'
        name='White Noise'
        description='A tone that washes over and blocks out distractions.'
        notes_amt={25}
        audio='/audio/whitenoise.mp3'
        purchased={purchasedItems.includes('White Noise') || false}
        onPurchaseClick={onPurchaseClick}
      />
    </div>
  );
};

function EnvironmentContent({ onPurchaseClick, purchasedItems }: EnvironmentContentProps) {
  return (
    <div className='flex gap-5'>
      <EnvironCard 
        image='/images/env_icons/rainforest.png'
        name='Rainforest'
        description='Calming wildlife with rain and nature.'
        notes_amt={50}
        purchased={purchasedItems.includes('Rainforest') || false}
        onPurchaseClick={onPurchaseClick}
      />

      <EnvironCard
        image='/images/env_icons/coffee.png'
        name='Cafe'
        description='Friendly and cozy ambience of a local cafe.'
        notes_amt={50}
        purchased={purchasedItems.includes('Cafe') || false}
        onPurchaseClick={onPurchaseClick}
      />
    </div>
  );
};

const Store: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        getUserPurchases(user.uid)
          .then((items) => setPurchasedItems(items))
          .catch((err) => console.error('Error loading purchases:', err));
      } else {
        setPurchasedItems([]);
      }
    });
    return () => unsub();
  }, []);

  const handlePurchaseClick = (name: string, price: number) => {
    setSelectedItem({ name, price });
  };

  const handleSpinWheelClick = async () => {
    const user = auth.currentUser;
    if (!user?.uid) {
      alert('You must be signed in to spin the wheel.');
      return;
    }

    try {
      const current = await getUserNotes(user.uid);
      if (current < 10) {
        alert('Not enough Notes! You need 10 notes to spin the wheel.');
        return;
      }

      // Just show the wheel - deduction happens when user clicks spin
      setShowSpinWheel(true);
    } catch (err) {
      console.error('Failed to start spin wheel:', err);
      alert('Failed to start spin wheel. Please try again.');
    }
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;
    const user = auth.currentUser;
    if (!user?.uid) {
      alert('You must be signed in to make purchases.');
      return;
    }

    try {
      const current = await getUserNotes(user.uid);
      if (current < selectedItem.price) {
        alert('Not enough Notes to purchase this item.');
        return;
      }

      // Deduct notes by adding a negative amount
      const newTotal = await addNotesToUser(user.uid, -selectedItem.price);

      console.log('Purchase successful, new total:', newTotal);
      // persist purchase in Firestore and update local state
      try {
        await addPurchaseForUser(user.uid, selectedItem.name);
        setPurchasedItems((prev) => Array.from(new Set([...prev, selectedItem.name])));
      } catch (err) {
        console.error('Failed to persist purchase:', err);
      }

      setSelectedItem(null);
      alert('Purchase successful!');
    } catch (err) {
      console.error('Purchase failed', err);
      alert('Purchase failed. Please try again.');
    } finally {
      // finished
    }
  };

  const handleCancel = () => {
    setSelectedItem(null);
  };

  const handleNotesAdded = () => {
    // Refresh the navbar notes count
    if ((window as any).refreshNavbarNotes) {
      (window as any).refreshNavbarNotes();
    }
  };
  
  return (
    <>
      <Navbar />

      <div className='store-page p-10'>
        <div className='mb-10'>
          <div className='flex justify-between items-start mb-6'>
            <div>
              <h1 className='text-[64px]'>STORE</h1>
              <p className='text-[#696969] text-[40px]'>Use your notes to purchase new sounds or environments!</p>
            </div>
            
            <button
              onClick={handleSpinWheelClick}
              className='bg-white text-black font-bold text-[20px] px-15 py-10 rounded-[15px] hover:opacity-90 transition-opacity shadow-lg border-4 border-[#5D608A] whitespace-nowrap'
            >
              Spin Wheel for Notes! <br/>
              <span className='text-[16px]'>(15 Notes to play)</span>
            </button>
          </div>
        </div>

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
          {activeTab === 'tab1' && (
            <EnvironmentContent onPurchaseClick={handlePurchaseClick} purchasedItems={purchasedItems} />
          )}
          {activeTab === 'tab2' && (
            <SoundContent onPurchaseClick={handlePurchaseClick} purchasedItems={purchasedItems} />
          )}
        </div>

        <PurchasePrompt
          isOpen={selectedItem !== null}
          itemName={selectedItem?.name || ''}
          itemPrice={selectedItem?.price || 0}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        {showSpinWheel && (
          <SpinWheel 
            onClose={() => setShowSpinWheel(false)}
            onNotesAdded={handleNotesAdded}
          />
        )}
        
      </div>
    </>
  );
};

export default Store;