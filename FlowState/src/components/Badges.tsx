import React, { useState } from 'react';

interface BadgeData {
  id: string;
  image: string;
  name: string;
  description: string;
  earned: boolean;
}

const Badges: React.FC = () => {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const badges: BadgeData[] = [
    {
      id: 'first-session',
      image: '/images/env_icons/coffee.png',
      name: 'First Steps',
      description: 'Completed your first focus session',
      earned: true
    },
    {
      id: 'week-streak',
      image: '/images/env_icons/warrior.png',
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      earned: true
    },
    {
      id: 'hour-master',
      image: '/images/env_icons/hourglass.png',
      name: 'Hour Master',
      description: 'Completed 1 hour of focused work',
      earned: false
    },
    {
      id: 'early-bird',
      image: '/images/env_icons/bird.png',
      name: 'Early Bird',
      description: 'Started a session before 7 AM',
      earned: false
    },
    {
      id: 'night-owl',
      image: '/images/env_icons/owl.png',
      name: 'Night Owl',
      description: 'Completed a session after 10 PM',
      earned: true
    },
    {
      id: 'marathon',
      image: '/images/env_icons/run.png',
      name: 'Marathon Runner',
      description: 'Completed 10 hours of focused work',
      earned: false
    },
  ];

  return (
    <div className="p-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredBadge(badge.id)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                badge.earned
                  ? 'bg-gradient-to-br from-[#ADA7C9] to-[#5D608A] shadow-lg hover:scale-110'
                  : 'bg-gray-300 opacity-50 grayscale'
              }`}
            >
              <img
                src={badge.image}
                alt={badge.name}
                className="w-16 h-16 object-contain"
              />
            </div>

            {/* Tooltip */}
            {hoveredBadge === badge.id && (
              <div className="absolute top-[-80px] left-1/2 transform -translate-x-1/2 z-10 bg-white border-2 border-[#5D608A] rounded-lg p-3 shadow-xl w-48 pointer-events-none">
                <div className="text-center">
                  <h3 className="font-bold text-[#5D608A] text-[16px] mb-1">
                    {badge.name}
                  </h3>
                  <p className="text-[#696969] text-[12px]">
                    {badge.description}
                  </p>
                  {!badge.earned && (
                    <p className="text-red-500 text-[10px] mt-1 font-semibold">
                      Not earned yet
                    </p>
                  )}
                </div>
                {/* Arrow pointing down */}
                <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#5D608A]"></div>
              </div>
            )}

            <p
              className={`mt-2 text-center text-[14px] font-semibold ${
                badge.earned ? 'text-[#5D608A]' : 'text-gray-400'
              }`}
            >
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;