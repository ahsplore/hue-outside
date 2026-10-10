import confetti from 'canvas-confetti';

/**
 * Play a gentle nature chime using Web Audio API (zero external asset dependencies).
 */
export function playChime(enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 major chord

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.9);
    });
  } catch (e) {
    // Audio may be blocked by autoplay policies until user interacts
    console.debug('Audio playback note:', e);
  }
}

/**
 * Trigger full-screen celebratory confetti with palette-themed colors
 */
export function triggerCelebrationConfetti(dailyHex?: string) {
  const colors = [
    dailyHex || '#2D5A40',
    '#2D5A40', // Forest green
    '#4A7A5B', // Moss
    '#E8A838', // Sunflower gold
    '#D46944', // Terracotta
    '#6BA4C8'  // Sky blue
  ];

  // Center burst
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.65 },
    colors
  });

  // Left & right cannons
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors
    });
  }, 200);
}
