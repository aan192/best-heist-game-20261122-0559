let audioCtx = null;
let muted = false;

export function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function playBeep(freq, type, duration, gainVal = 0.1) {
  if (muted || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

export function playLootChime() {
  initAudio();
  playBeep(523.25, 'sine', 0.15, 0.15);
  setTimeout(() => playBeep(659.25, 'sine', 0.2, 0.15), 100);
  setTimeout(() => playBeep(783.99, 'sine', 0.3, 0.15), 200);
}

export function playAlarmTick(pitch = 300) {
  initAudio();
  playBeep(pitch, 'sawtooth', 0.08, 0.08);
}

export function playCaughtSting() {
  initAudio();
  playBeep(150, 'sawtooth', 0.4, 0.2);
  setTimeout(() => playBeep(100, 'sawtooth', 0.6, 0.25), 200);
}

export function playCookieDrop() {
  initAudio();
  playBeep(220, 'triangle', 0.1, 0.15);
}

export function playWinFanfare() {
  initAudio();
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((n, idx) => {
    setTimeout(() => playBeep(n, 'triangle', 0.25, 0.2), idx * 120);
  });
}
