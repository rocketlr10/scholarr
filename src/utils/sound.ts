// Web Audio API Audio Synthesizer for Scholar Focus Timer & Alerts

let audioCtx: AudioContext | null = null;
let ambientSource: AudioBufferSourceNode | null = null;
let ambientGainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Gentle 3-note harmonic triad chime (E5, G#5, B5)
    const freqs = [659.25, 830.61, 987.77];
    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, now + index * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 1.6);
    });
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

export function playTickSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch (err) {
    console.warn('Audio tick error:', err);
  }
}

export function startAmbientSound(type: 'rain' | 'white_noise') {
  try {
    stopAmbientSound();
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = buffer;
    ambientSource.loop = true;

    const filter = ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 800;
    } else {
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 0.5;
    }

    ambientGainNode = ctx.createGain();
    ambientGainNode.gain.setValueAtTime(0.08, ctx.currentTime);

    ambientSource.connect(filter);
    filter.connect(ambientGainNode);
    ambientGainNode.connect(ctx.destination);

    ambientSource.start();
  } catch (err) {
    console.warn('Ambient audio start error:', err);
  }
}

export function stopAmbientSound() {
  if (ambientSource) {
    try {
      ambientSource.stop();
      ambientSource.disconnect();
    } catch {
      // ignore
    }
    ambientSource = null;
  }
}
