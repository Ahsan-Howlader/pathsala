export type AmbientType = 'none' | 'rain' | 'cafe' | 'nature' | 'whitenoise';

// Web Audio API Sound Synthesizer (Zero external dependencies)
class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private natureInterval: NodeJS.Timeout | null = null;
  private currentVolume = 0.5;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(freq = 600, duration = 0.15, type: OscillatorType = 'sine') {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  playSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.07, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  playBell() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    } catch {
      // Ignore
    }
  }

  setAmbientVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.currentVolume * 0.08, this.ctx.currentTime);
    }
  }

  // Synthesize bird chirp for Nature ambient
  private playBirdChirp() {
    try {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const baseFreq = 2200 + Math.random() * 800;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.16);

      const birdVol = this.currentVolume * 0.04;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(birdVol, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }

  startAmbient(type: AmbientType, volume = this.currentVolume) {
    this.stopAmbient();
    if (type === 'none') return;

    this.currentVolume = volume;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        if (type === 'rain') {
          // Continuous rain sound (pink + brownish noise)
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else if (type === 'cafe') {
          // Warm coffee shop murmur ambience
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.04 * white) / 1.04;
          lastOut = data[i];
          data[i] *= 2.2;
        } else if (type === 'nature') {
          // Soft breeze / wind rustling
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.012 * white) / 1.012;
          lastOut = data[i];
          data[i] *= 2.8;
        } else {
          // White noise
          data[i] = (Math.random() * 2 - 1) * 0.15;
        }
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Add mild filter for warmth
      const filter = this.ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      } else if (type === 'cafe') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        filter.Q.setValueAtTime(0.7, this.ctx.currentTime);
      } else if (type === 'nature') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, this.ctx.currentTime);
      } else {
        filter.type = 'allpass';
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.currentVolume * 0.06, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();

      this.ambientSource = noise;
      this.ambientGain = gain;

      // If nature mode, trigger periodic soft bird calls
      if (type === 'nature') {
        this.playBirdChirp();
        this.natureInterval = setInterval(() => {
          if (Math.random() > 0.3) {
            this.playBirdChirp();
          }
        }, 3200);
      }
    } catch {
      // Ignore
    }
  }

  stopAmbient() {
    try {
      if (this.natureInterval) {
        clearInterval(this.natureInterval);
        this.natureInterval = null;
      }
      if (this.ambientSource) {
        (this.ambientSource as AudioBufferSourceNode).stop();
        this.ambientSource.disconnect();
        this.ambientSource = null;
      }
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new SoundManager();
