import React, { useState, useRef } from "react";

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const SOUND_MODEL_ID: string = "eleven_text_to_sound_v2";

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [audioURL, setAudioURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
    if (audioRef.current) {
      audioRef.current.pause();
    }
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

        let errorMessage = `API error ${response.status}: ${response.statusText}.`;

        try {
          const errorJson = JSON.parse(errorBody);
          if (errorJson.detail) {
            errorMessage =
              errorJson.detail.message || JSON.stringify(errorJson.detail);
          }
        } catch {
          throw new Error(errorMessage);
        }
      }

      const audioBuffer: ArrayBuffer = await response.arrayBuffer();

      const audioBlob: Blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const url: string = URL.createObjectURL(audioBlob);
      setAudioURL(url);
    } catch (err) {
      const error = err as Error;
      console.error("ElevenLabs API Error:", error);
      setError(
        `Failed to generate sound: ${
          error.message || "Check console for details."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      generateSound();
    }
  };

  // Toggles playback of the audio element
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => {
          console.error("Error attempting to play audio:", e);
          setError(
            "Playback failed. Please ensure your browser allows media playback without a user gesture."
          );
        });
      }

      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <div className="flex gap-2 items-end">
        <input
          type="text"
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. White Noise or Calm Ocean"
          disabled={isLoading}
          className="grow px-4 py-3 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white shadow-sm"
        />
        <button
          onClick={generateSound}
          disabled={isLoading || !prompt.trim() || !ELEVENLABS_API_KEY}
          className={`hover:cursor-pointer w-auto py-3 px-4 rounded-lg font-semibold transition duration-200 shadow-md ${
            isLoading || !prompt.trim() || !ELEVENLABS_API_KEY
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Audio...
            </span>
          ) : (
            "Generate Sound"
          )}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          Error: {error}
        </p>
      )}

      {audioURL && (
        <div className="flex items-center space-x-4 w-full mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-inner">
          {/* Custom Play/Pause Button - Hides the time display */}
          <button
            onClick={togglePlayPause}
            className="hover:cursor-pointer p-3 bg-[#478094] text-white rounded-full hover:bg-[#1C4857] transition duration-150 shadow-lg shrink-0"
          >
            {isPlaying ? (
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="6" height="16" x="4" y="4" />
                <rect width="6" height="16" x="14" y="4" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <p className="font-semibold text-gray-700 text-sm">
            {isPlaying
              ? `Now Playing: "${prompt}"`
              : `Ready to Play: "${prompt}"`}
          </p>

          {/* Hidden Audio Element - No 'controls' attribute */}
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

export default App;
