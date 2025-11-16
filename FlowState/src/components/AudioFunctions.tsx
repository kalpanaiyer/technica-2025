interface AudioInstance {
  audioBuffer: AudioBuffer | null;
  sourceNode: AudioBufferSourceNode | null;
  isPlaying: boolean;
  pausedAt: number;
  startedAt: number;
}

let audioContext: AudioContext | null = null;
const audioInstances = new Map<string, AudioInstance>();

export async function loadAudio(audioPath: string) {
  // Create audio context if it doesn't exist
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioContextClass();
  }

  // Check if already loaded
  if (audioInstances.has(audioPath)) {
    return;
  }

  try {
    // Fetch and decode audio file
    const response = await fetch(audioPath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Store instance for this audio file
    audioInstances.set(audioPath, {
      audioBuffer,
      sourceNode: null,
      isPlaying: false,
      pausedAt: 0,
      startedAt: 0,
    });
  } catch (error) {
    console.error('Error loading audio:', error);
    throw error;
  }
}

export function togglePlayPause(audioPath: string) {
  if (!audioContext) {
    console.error('Audio context not initialized');
    return false;
  }

  const instance = audioInstances.get(audioPath);
  if (!instance || !instance.audioBuffer) {
    console.error('Audio not loaded yet');
    return false;
  }

  if (instance.isPlaying) {
    pause(audioPath);
  } else {
    play(audioPath);
  }

  return instance.isPlaying;
}

function play(audioPath: string) {
  if (!audioContext) return;

  const instance = audioInstances.get(audioPath);
  if (!instance || !instance.audioBuffer) return;

  // Create a new source node
  instance.sourceNode = audioContext.createBufferSource();
  instance.sourceNode.buffer = instance.audioBuffer;
  instance.sourceNode.loop = true;
  instance.sourceNode.connect(audioContext.destination);

  // Calculate offset for resume
  const offset = instance.pausedAt % instance.audioBuffer.duration;
  instance.sourceNode.start(0, offset);

  instance.startedAt = audioContext.currentTime - offset;
  instance.isPlaying = true;
}

function pause(audioPath: string) {
  if (!audioContext) return;

  const instance = audioInstances.get(audioPath);
  if (!instance || !instance.sourceNode) return;

  // Calculate where we paused
  instance.pausedAt = audioContext.currentTime - instance.startedAt;

  instance.sourceNode.stop();
  instance.sourceNode.disconnect();
  instance.sourceNode = null;
  instance.isPlaying = false;
}

export function stop(audioPath: string) {
  const instance = audioInstances.get(audioPath);
  if (!instance) return;

  if (instance.sourceNode) {
    instance.sourceNode.stop();
    instance.sourceNode.disconnect();
    instance.sourceNode = null;
  }
  instance.isPlaying = false;
  instance.pausedAt = 0;
  instance.startedAt = 0;
}

export function getIsPlaying(audioPath: string) {
  const instance = audioInstances.get(audioPath);
  return instance ? instance.isPlaying : false;
}