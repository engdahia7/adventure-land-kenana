// Procedural Egyptian Ambient Sound & SFX Engine using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  private isPlayingAmbient: boolean = false;
  private currentTrack: string = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx ? this.ctx.currentTime : 0);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play subtle stone click / item pickup SFX
  public playClickSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // Play mystical discovery chime
  public playDiscoverySFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Egyptian oriental triad: D4 (293.66), F#4 (369.99), A4 (440), D5 (587.33)
      const freqs = [293.66, 369.99, 440, 587.33];
      freqs.forEach((freq, idx) => {
        const noteOsc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.1);

        noteGain.gain.setValueAtTime(0.001, now + idx * 0.1);
        noteGain.gain.linearRampToValueAtTime(0.18, now + idx * 0.1 + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 1.2);

        noteOsc.connect(noteGain);
        noteGain.connect(this.ctx!.destination);

        noteOsc.start(now + idx * 0.1);
        noteOsc.stop(now + idx * 0.1 + 1.3);
      });
    } catch {
      // ignore
    }
  }

  // Play puzzle solved triumph fanfare
  public playTriumphSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Egyptian Hijaz scale triumph notes
      const notes = [293.66, 311.13, 369.99, 392.00, 440.00, 466.16, 554.37, 587.33];
      notes.forEach((freq, idx) => {
        const noteOsc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.12);

        noteGain.gain.setValueAtTime(0.001, now + idx * 0.12);
        noteGain.gain.linearRampToValueAtTime(0.22, now + idx * 0.12 + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.9);

        noteOsc.connect(noteGain);
        noteGain.connect(this.ctx!.destination);

        noteOsc.start(now + idx * 0.12);
        noteOsc.stop(now + idx * 0.12 + 1.0);
      });
    } catch {
      // ignore
    }
  }

  // Play dialogue tone
  public playDialogueChirp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.random() * 80, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // ignore
    }
  }

  // Play ambient background music & sounds
  public playLocationAmbient(locationType: string) {
    if (this.currentTrack === locationType && this.isPlayingAmbient) return;
    this.stopAmbient();
    this.initContext();
    if (!this.ctx) return;

    this.currentTrack = locationType;
    this.isPlayingAmbient = true;

    try {
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, now);
      this.ambientGain.connect(this.ctx.destination);

      // Low drone (deep ancient resonance)
      const droneOsc = this.ctx.createOscillator();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(110, now); // A2 drone

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.4, now);
      droneOsc.connect(droneGain);
      droneGain.connect(this.ambientGain);
      droneOsc.start(now);
      this.ambientOscillators.push(droneOsc);

      // Second harmonic overtone (Egyptian fifth - E3)
      const overtoneOsc = this.ctx.createOscillator();
      overtoneOsc.type = 'sine';
      overtoneOsc.frequency.setValueAtTime(164.81, now); // E3

      const overtoneGain = this.ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.2, now);
      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(this.ambientGain);
      overtoneOsc.start(now);
      this.ambientOscillators.push(overtoneOsc);

      // Wind or water noise texture
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.05;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(locationType === 'nile' ? 400 : 250, now);
      filter.Q.setValueAtTime(3, now);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      whiteNoise.start(now);
      this.ambientNoiseSource = whiteNoise;
    } catch {
      // ignore
    }
  }

  // Play exciting daily cliffhanger sound
  public playCliffhangerSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Low suspense rumble + rising dramatic mystery chords
      const lowOsc = this.ctx.createOscillator();
      const lowGain = this.ctx.createGain();
      lowOsc.type = 'sawtooth';
      lowOsc.frequency.setValueAtTime(55, now);
      lowOsc.frequency.linearRampToValueAtTime(73.42, now + 1.8);
      lowGain.gain.setValueAtTime(0.25, now);
      lowGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      lowOsc.connect(lowGain);
      lowGain.connect(this.ctx.destination);
      lowOsc.start(now);
      lowOsc.stop(now + 2.6);

      // Mystery notes (minor suspense interval: D4, Eb4, G4, Bb4, C#5)
      const mysteryNotes = [293.66, 311.13, 392.00, 466.16, 554.37];
      mysteryNotes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.3 + idx * 0.25);
        gain.gain.setValueAtTime(0.001, now + 0.3 + idx * 0.25);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.3 + idx * 0.25 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + idx * 0.25 + 1.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + 0.3 + idx * 0.25);
        osc.stop(now + 0.3 + idx * 0.25 + 1.5);
      });
    } catch {
      // ignore
    }
  }

  // Play stage progress completion chime
  public playStageCompleteSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392.00, 523.25, 659.25]; // G4, C5, E5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.65);
      });
    } catch {
      // ignore
    }
  }

  // Play intense adrenaline heartbeat (lub-dub)
  public playHeartbeatSFX(speedMultiplier: number = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // First thump (lub) - low frequency punch
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(38, now + 0.12);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Second thump (dub) - slightly higher and sharper
      const dubDelay = Math.max(0.12, 0.18 / speedMultiplier);
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(75, now + dubDelay);
      osc2.frequency.exponentialRampToValueAtTime(42, now + dubDelay + 0.1);
      gain2.gain.setValueAtTime(0.3, now + dubDelay);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + dubDelay + 0.13);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + dubDelay);
      osc2.stop(now + dubDelay + 0.14);
    } catch {
      // ignore
    }
  }

  // Play sudden trap trigger / intense warning alarm sting
  public playTrapWarningSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High dissonant siren chord: Eb5, E5, Bb5 (classic suspense dissonance)
      const freqs = [622.25, 659.25, 932.33];
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, now + 0.4);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      });
    } catch {
      // ignore
    }
  }

  // Play crumbling stone / collapsing ceiling rubble noise
  public playStoneCrumbleSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Low sub rumble
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(40, now);
      subOsc.frequency.linearRampToValueAtTime(25, now + 0.8);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.95);

      // Noise crackle for breaking masonry
      const bufferSize = this.ctx.sampleRate * 0.6;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch {
      // ignore
    }
  }

  // Play adrenaline success punch
  public playActionSuccessSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [329.63, 415.3, 493.88, 659.25]; // E major heroic impact
      chords.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);
        gain.gain.setValueAtTime(0.2, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Play action failure / hit impact
  public playActionFailureSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore
    }
  }

  // Play realistic shortwave radio static & tuning whistle based on clarity (0.0 to 1.0)
  public playRadioStaticSweep(clarity: number = 0.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // White/pink noise buffer
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - clarity * 0.85);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(800 + (1 - clarity) * 1200, now);
      bandpass.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      const vol = (1 - clarity * 0.75) * 0.22;
      noiseGain.gain.setValueAtTime(vol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // Heterodyne tuning squeal when off frequency
      if (clarity < 0.85) {
        const squeal = this.ctx.createOscillator();
        const squealGain = this.ctx.createGain();
        squeal.type = 'sine';
        const startFreq = 1200 + Math.random() * 800;
        squeal.frequency.setValueAtTime(startFreq, now);
        squeal.frequency.exponentialRampToValueAtTime(startFreq * 0.7, now + 0.14);
        squealGain.gain.setValueAtTime(0.08 * (1 - clarity), now);
        squealGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        squeal.connect(squealGain);
        squealGain.connect(this.ctx.destination);
        squeal.start(now);
        squeal.stop(now + 0.15);
      }
    } catch {
      // ignore
    }
  }

  // Play crisp Morse code transmission burst
  public playMorseBurst() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const beeps = [0, 0.08, 0.2, 0.28, 0.44]; // dit-dit-dah-dit-dah
      beeps.forEach((startOffset, i) => {
        const dur = (i % 2 === 0) ? 0.05 : 0.11;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now + startOffset);
        gain.gain.setValueAtTime(0.18, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + dur);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + dur + 0.01);
      });
    } catch {
      // ignore
    }
  }

  // Play dramatic high-threat pursuit siren / emergency smuggler horn
  public playPursuitAlertSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High dramatic alarm horn
      const horn1 = this.ctx.createOscillator();
      const horn2 = this.ctx.createOscillator();
      const hornGain = this.ctx.createGain();

      horn1.type = 'sawtooth';
      horn2.type = 'square';
      horn1.frequency.setValueAtTime(440, now);
      horn1.frequency.linearRampToValueAtTime(880, now + 0.35);
      horn1.frequency.linearRampToValueAtTime(440, now + 0.7);

      horn2.frequency.setValueAtTime(444, now);
      horn2.frequency.linearRampToValueAtTime(888, now + 0.35);
      horn2.frequency.linearRampToValueAtTime(444, now + 0.7);

      hornGain.gain.setValueAtTime(0.25, now);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      horn1.connect(hornGain);
      horn2.connect(hornGain);
      hornGain.connect(this.ctx.destination);

      horn1.start(now);
      horn2.start(now);
      horn1.stop(now + 0.88);
      horn2.stop(now + 0.88);

      // Heavy sub-drop impact
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(110, now);
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.6);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.7);
    } catch {
      // ignore
    }
  }

  // Safe tumbler metal click
  public playSafeClickSFX(isSweetSpot: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isSweetSpot ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(isSweetSpot ? 980 : 420, now);
      osc.frequency.exponentialRampToValueAtTime(isSweetSpot ? 1400 : 150, now + 0.06);
      gain.gain.setValueAtTime(isSweetSpot ? 0.35 : 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  // Safe heavy bolt open
  public playSafeUnlockSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [0, 0.12, 0.28].forEach((time, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(250 - idx * 50, now + time);
        gain.gain.setValueAtTime(0.3, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + time);
        osc.stop(now + time + 0.16);
      });
    } catch {}
  }

  // UV light electrical buzz
  public playUVHumSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  // Chemical reagent sizzle
  public playChemicalReagentSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(4.0, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Ancient mummy curse whisper / toxic gas hiss
  public playCurseWhisperSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.5);
      osc.frequency.linearRampToValueAtTime(60, now + 1.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    } catch {}
  }

  // Steam locomotive train wheels & whistle
  public playTrainSteamWhistleSFX() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc2.frequency.setValueAtTime(739.99, now); // F#5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.95);
      osc2.stop(now + 0.95);
    } catch {}
  }

  public stopAmbient() {
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.ambientOscillators = [];

    if (this.ambientNoiseSource) {
      try {
        this.ambientNoiseSource.stop();
        this.ambientNoiseSource.disconnect();
      } catch {}
      this.ambientNoiseSource = null;
    }

    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {}
      this.ambientGain = null;
    }

    this.isPlayingAmbient = false;
  }
}

export const soundManager = new SoundManager();
