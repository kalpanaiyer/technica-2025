import React, { useState, useRef } from "react";

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const SOUND_MODEL_ID = "eleven_text_to_sound_v2";

export interface SoundItem {
  name: string;
  description: string;
  audio: string;
  image?: string;
  isUserGenerated: boolean;
}

interface SoundGeneratorProps {
  onGenerated?: (audioURL: string, prompt: string) => void;
}

const SoundGenerator: React.FC<SoundGeneratorProps> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [audioURL, setAudioURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [mySounds, setMySounds] = useState<SoundItem[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const generateSound = async () => {
    if (!prompt.trim()) return;

    if (!ELEVENLABS_API_KEY) {
      setError(
        "Please set your ELEVENLABS_API_KEY to enable sound generation."
      );
      return;
    }

    setIsLoading(true);
    if (audioRef.current) audioRef.current.pause();
    setAudioURL("");
    setError("");
    setIsPlaying(false);

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/sound-generation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: prompt,
            model_id: SOUND_MODEL_ID,
            duration_seconds: 30,
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("ElevenLabs Error Details:", errorBody);
        throw new Error(
          `API error ${response.status}: ${response.statusText}`
        );
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      // Notify parent
      onGenerated?.(url, prompt);

      const newSound: SoundItem = {
        name: prompt,
        description: `Generated sound for "${prompt}"`,
        audio: url,
        isUserGenerated: true,
      };
      setMySounds((prev) => [newSound, ...prev]);
    } catch (err) {
      const errorObj = err as Error;
      console.error("ElevenLabs API Error:", errorObj);
      setError(
        `Failed to generate sound: ${errorObj.message || "Check console for details."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") generateSound();
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => {
          console.error("Playback error:", e);
          setError(
            "Playback failed. Ensure your browser allows audio playback."
          );
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const saveSound = () => {
    if (!audioURL.trim()) return;

    const newSound: SoundItem = {
      name: prompt,
      description: `Generated sound for "${prompt}"`,
      audio: audioURL,
      image: "/images/sound_icons/generated_sound.svg",
    };

    setMySounds((prev) => [newSound, ...prev]);
    onGenerated?.(audioURL, prompt);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. White Noise or Calm Ocean"
          disabled={isLoading}
          className="grow px-4 py-3 border border-blue-300 rounded-full focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white shadow-sm"
        />
        <button
          onClick={generateSound}
          disabled={isLoading || !prompt.trim() || !ELEVENLABS_API_KEY}
          className={`hover:cursor-pointer w-auto py-3 px-4 rounded-full font-semibold transition duration-200 shadow-md ${
            isLoading || !prompt.trim() || !ELEVENLABS_API_KEY
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isLoading ? "Generating..." : "Generate Sound"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </p>
      )}

      {audioURL && (
        <div className="flex items-center space-x-4 w-full mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-inner">
          <button
            onClick={togglePlayPause}
            className="p-3 bg-[#478094] text-white rounded-full hover:bg-[#1C4857] transition duration-150 shadow-lg shrink-0"
          >
            {isPlaying ? (
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect width="6" height="16" x="4" y="4" />
                <rect width="6" height="16" x="14" y="4" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <button
            onClick={saveSound}
            className="p-3 bg-[#F4CAE0] text-white rounded-full hover:bg-[#D7B9D5] transition duration-150 shadow-lg shrink-0"
            title="Save Sound"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>

          <p className="font-semibold text-gray-700 text-sm">
            {isPlaying ? `Now Playing: "${prompt}"` : `"${prompt}" is ready for you! Take a listen!`}
          </p>

          <audio
            ref={audioRef}
            src={audioURL}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SoundGenerator;
