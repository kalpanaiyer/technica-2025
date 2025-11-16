import React from 'react';
import { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { getUserPurchases } from '../services/PurchaseService';
import EnvironInvenCard from './EnvCards/EnvironInvenCard';
import AudioInvenCard from './AudioCards/AudioInvenCard';

const ALL_SOUNDS = [
  { id: 'Rainy Day', image: '/images/sound_icons/rain.svg', name: 'Rainy Day' },
  { id: 'Brown Noise', image: '/images/sound_icons/brown_noise.png', name: 'Brown Noise' },
  { id: 'River Flow', image: '/images/sound_icons/water.svg', name: 'River Flow' },
  { id: 'Soundbath', image: '/images/sound_icons/gong.svg', name: 'Soundbath' },
  { id: 'White Noise', image: '/images/sound_icons/sound-waves.svg', name: 'White Noise' },
];

const ALL_ENVIRONMENTS = [
  { id: 'Rainforest', image: '/images/rainforest_bg.jpg', name: 'Rainforest' },
  { id: 'Cafe', image: '/images/cafe_bg.gif', name: 'Cafe' },
];

function SoundContent({ purchasedItems }: { purchasedItems: string[] }) {
  const purchasedSounds = ALL_SOUNDS.filter(sound => purchasedItems.includes(sound.id));

  if (purchasedSounds.length === 0) {
    return <div className="text-gray-500 text-xl">No sounds purchased yet</div>;
  }

  return (
    <div className='flex gap-5 flex-wrap'>
      {purchasedSounds.map(sound => (
        <AudioInvenCard
          key={sound.id}
          image={sound.image}
          name={sound.name}
        />
      ))}
    </div>
  );
}

function EnvironmentContent({ purchasedItems }: { purchasedItems: string[] }) {
  const purchasedEnvs = ALL_ENVIRONMENTS.filter(env => purchasedItems.includes(env.id));

  return (
    <div className='flex gap-5 flex-wrap'>
      {/* Default environment - always shown */}
      <EnvironInvenCard
        image='/images/underwater.png'
        name='Under the Sea'
      />
      
      {/* Purchased environments */}
      {purchasedEnvs.map(env => (
        <EnvironInvenCard
          key={env.id}
          image={env.image}
          name={env.name}
        />
      ))}
    </div>
  );
}

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('No user logged in');
      setLoading(false);
      return;
    }

    try {
      const purchases = await getUserPurchases(userId);
      setPurchasedItems(purchases);
    } catch (err) {
      console.error('Error loading purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div>
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
        {activeTab === 'tab1' && <EnvironmentContent purchasedItems={purchasedItems} />}
        {activeTab === 'tab2' && <SoundContent purchasedItems={purchasedItems} />}
      </div>
    </div>
  );
};

export default Inventory;