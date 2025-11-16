import React, { useState } from "react";
import SoundGenerator from "./SoundGenerator.tsx";
import SessionAudioCard from "./SessionAudioCard.tsx";

interface GeneratedSound {
  id: string;
  prompt: string;
  audioUrl: string;
  createdAt: Date;
  isPlaying: boolean;
}

interface SoundGeneratorUIProps {
  onGenerate?: () => void;
  onShufflePrompt?: () => void;
  onChangeDuration?: (duration: number) => void;
  onChangeModel?: () => void;
  onFullscreen?: () => void;
}

const initialSavedSounds: GeneratedSound[] = (() => {
  const now = Date.now();
  return [
    {
      id: "1",
      prompt: "Peaceful rain with distant thunder",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      createdAt: new Date(now - 3600000),
      isPlaying: false,
    },
    {
      id: "2",
      prompt: "Upbeat lo-fi hip hop beats",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      createdAt: new Date(now - 7200000),
      isPlaying: false,
    },
    {
      id: "3",
      prompt: "Ocean waves at sunset",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      createdAt: new Date(now - 10800000),
      isPlaying: false,
    },
  ];
})();

const SoundModal: React.FC<SoundGeneratorUIProps> = ({
  onGenerate,
  onShufflePrompt,
  onChangeDuration,
  onChangeModel,
  onFullscreen,
}) => {
  const [activeTab, setActiveTab] = useState<"generate" | "mySounds">(
    "generate"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [savedSounds, setSavedSounds] = useState<GeneratedSound[]>(initialSavedSounds);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );

  return (
    <div className={`container ${isCollapsed ? "collapsed" : ""}`}>
      {/* Tabs - only show when not collapsed */}
      {!isCollapsed && (
        <div className="tabs">
          <button
            className={`tab ${activeTab === "generate" ? "tabActive" : ""}`}
            onClick={() => setActiveTab("generate")}
          >
            Generate
          </button>
          <button
            className={`tab ${activeTab === "mySounds" ? "tabActive" : ""}`}
            onClick={() => setActiveTab("mySounds")}
          >
            My Sounds
          </button>
        </div>
      )}

      {!isCollapsed && (
        <div className="mainContent">
          {activeTab === "generate" ? (
            <div className="generateContent">
              <div className="mt-12 w-full">
                <SoundGenerator />
              </div>
            </div>
          ) : (
            <div className="mySoundsContent">
              <div className="soundsGrid">
                <SessionAudioCard
                  image="/images/sound_icons/rain.svg"
                  name="Rainy Day"
                  description="A calming soundscape mirroring a rainy day."
                  notes_amt={25}
                  audio="/audio/rainnoise.mp3"
                />

                <SessionAudioCard
                  image='/images/sound_icons/brown_noise.png'
                  name='Brown Noise'
                  description='A smooth tone to tune out the background noise.'
                  notes_amt={25}
                  audio='/audio/brownnoise.mp3'
                />

                <SessionAudioCard
                  image='/images/sound_icons/water.svg'
                  name='River Flow'
                  description='Liquid smooth sounds to go with the flow.'
                  notes_amt={25}
                  audio='/audio/rivernoise.mp3'
                />

                <SessionAudioCard
                  image='/images/sound_icons/gong.svg'
                  name='Soundbath'
                  description='A therapeutic sequence of regal gongs.'
                  notes_amt={25}
                  audio='/audio/soundbathnoise.mp3'
                />

                {/* <SessionAudioCard
                  image='/images/sound_icons/sound-waves.svg'
                  name='White Noise'
                  description='A tone that washes over and blocks out distractions.'
                  notes_amt={25}
                  audio='/audio/whitenoise.mp3'
                /> */}
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={`bottomControls ${
          isCollapsed ? "collapsedBottomControls" : ""
        }`}
      >
        {!isCollapsed && activeTab === "generate" && (
          <div className="leftControls"></div>
        )}

        <div className="rightControls">
          <button className="iconButton" onClick={onShufflePrompt}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M1.00024 22.0959C1.54933 21.9321 2.05506 21.648 2.48073 21.2644C2.9064 20.8808 3.24134 20.4072 3.46124 19.8781C3.79991 20.6681 4.37881 21.3313 5.11577 21.7737C5.85272 22.216 6.71029 22.415 7.56674 22.3424C8.42312 22.4145 9.28046 22.2151 10.0171 21.7725C10.7538 21.3298 11.3323 20.6664 11.6706 19.8764C12.0092 20.6661 12.5878 21.3292 13.3244 21.7715C14.0611 22.2138 14.9183 22.413 15.7745 22.3407C16.6309 22.4134 17.4885 22.2144 18.2254 21.772C18.9624 21.3297 19.5413 20.6664 19.88 19.8764C20.1 20.4058 20.4352 20.8794 20.8612 21.263C21.2872 21.6467 21.7932 21.9306 22.3426 22.0943M1.00024 15.5294C1.5478 15.3624 2.052 15.0773 2.47725 14.694C2.90249 14.3108 3.2384 13.8389 3.46124 13.3116C4.14796 14.915 5.92553 15.7759 7.56674 15.7759C10.8492 15.7759 13.3118 13.3116 13.3118 10.8506C13.3135 7.5665 11.6706 4.28407 7.56674 5.92529C7.83946 4.28243 9.53489 1 14.1332 1C18.7316 1 21.5212 4.28407 22.341 5.92529"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="iconButton"
            onClick={() => onChangeDuration?.(30)}
            title="Change duration"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M25.6665 10.5001V8.16675H24.4998V5.83341H23.3332V4.66675H22.1665V3.50008H19.8332V2.33341H17.4998V1.16675H10.4998V2.33341H8.1665V3.50008H5.83317V4.66675H4.6665V5.83341H3.49984V8.16675H2.33317V10.5001H1.1665V17.5001H2.33317V19.8334H3.49984V22.1667H4.6665V23.3334H5.83317V24.5001H8.1665V25.6667H10.4998V26.8334H17.4998V25.6667H19.8332V24.5001H22.1665V23.3334H23.3332V22.1667H24.4998V19.8334H25.6665V17.5001H26.8332V10.5001H25.6665ZM24.4998 17.5001H23.3332V19.8334H22.1665V22.1667H19.8332V23.3334H17.4998V24.5001H10.4998V23.3334H8.1665V22.1667H5.83317V19.8334H4.6665V17.5001H3.49984V10.5001H4.6665V8.16675H5.83317V5.83341H8.1665V4.66675H10.4998V3.50008H17.4998V4.66675H19.8332V5.83341H22.1665V8.16675H23.3332V10.5001H24.4998V17.5001Z"
                fill="black"
              />
              <path
                d="M18.6668 17.4999V18.6666H17.5002V19.8333H16.3335V18.6666H15.1668V17.4999H14.0002V16.3333H12.8335V5.83325H15.1668V15.1666H16.3335V16.3333H17.5002V17.4999H18.6668Z"
                fill="black"
              />
            </svg>
          </button>
          <button
            className="iconButton"
            onClick={onFullscreen}
            title="Fullscreen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M0 21.75V15.7083H2.41667V19.3333H6.04167V21.75H0ZM15.7083 21.75V19.3333H19.3333V15.7083H21.75V21.75H15.7083ZM0 6.04167V0H6.04167V2.41667H2.41667V6.04167H0ZM19.3333 6.04167V2.41667H15.7083V0H21.75V6.04167H19.3333Z"
                fill="black"
              />
            </svg>
          </button>
          <button
            className="iconButton"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? "▼" : "▲"}
          </button>
        </div>
      </div>

      <style>{`
        .container {
          width: 50%;
          max-width: 600px;
          height: 500px;
          background: linear-gradient(135deg, #5b9ab8 0%, #4a8ca8 100%);
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: absolute;
          bottom: 24px;
          left: 50%; 
          transform: translateX(-50%);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: height 0.3s ease, bottom 0.3s ease; 
        }

        .container.collapsed {
          height: 110px;
        }
        
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tab {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 16px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
        }

        .tabActive {
          background: rgba(255, 255, 255, 0.25) !important;
          color: white !important;
        }

        .mainContent {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          animation: fadeIn 0.3s ease;
        }

        .generateContent {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mySoundsContent {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 8px;
        }

        .emptyState {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: white;
        }

        .soundsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
          padding: 8px;
        }

        .bottomControls {
          display: flex;
          justify-content: space-between;
          align-items: right;
          padding: 8px 16px; 
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 100px; 
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
          justify-content: flex-end;
        }
        
        .collapsedBottomControls {
          justify-content: flex-end;
        }

        .leftControls {
          display: flex;
          gap: 12px;
          animation: fadeIn 0.3s ease;
        }

        .generateButton {
          padding: 10px 24px; 
          background: rgba(255, 255, 255, 0.25);
          border: none;
          border-radius: 100px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .generateButton:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: translateY(-2px);
        }

        .generateButton:active {
          transform: translateY(0);
        }

        .rightControls {
          display: flex;
          gap: 8px;
        }

        .iconButton {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 100px; 
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-size: 20px;
        }
        
        .iconButton svg {
          width: 24px;
          height: 24px;
          display: block; 
        }

        .iconButton:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .iconButton:active {
          transform: scale(0.98);
          color: #264a57ff;
        }

        @media (max-width: 768px) {
          .container {
            width: calc(100% - 48px); 
            left: 24px; 
            transform: none;
            bottom: 24px; 
            max-width: none; 
          }
          
          .bottomControls {
            width: calc(100% - 48px); 
            left: 50%;
            transform: translateX(-50%);
          }

          .collapsedBottomControls {
            justify-content: flex-end; 
          }

          .soundsGrid {
            grid-template-columns: 1fr;
          }

          .rightControls {
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default SoundModal;