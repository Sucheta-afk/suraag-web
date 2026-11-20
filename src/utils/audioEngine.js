// Web Audio API synthesizer tuned for Indian Classical, Semi-Classical & Fusion music (Tanpura drone, Sitar meend, Bansuri breath, Tabla rhythm)

class SoundLinkAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTrackId = null;
    this.gainNode = null;
    this.timerId = null;
    this.activeNodes = [];
    this.audioElement = null;
    this.isSynthetic = true;
    this.onEndedCallback = null;
    this.playbackTime = 0;
    this.playbackDuration = 35; // 35-sec preview
    this.intervalId = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 0.45;
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(vol) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, vol));
    }
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, vol));
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

    this.isPlaying = false;
    this.playbackTime = 0;
  }

  playTrack(track, onProgress, onEnded) {
    this.stop();
    this.initContext();
    this.currentTrackId = track.id;
    this.onEndedCallback = onEnded;

    if (track.fileUrl) {
      // Custom uploaded file audio
      this.isSynthetic = false;
      if (!this.audioElement) {
        this.audioElement = new Audio();
      }
      this.audioElement.src = track.fileUrl;
      this.audioElement.play().catch(e => console.warn('Audio play error', e));
      this.isPlaying = true;

      this.audioElement.ontimeupdate = () => {
        if (onProgress) {
          onProgress(this.audioElement.currentTime, this.audioElement.duration || 35);
        }
      };

      this.audioElement.onended = () => {
        this.isPlaying = false;
        if (this.onEndedCallback) this.onEndedCallback();
      };
      return;
    }

    // Procedural Indian Classical & Fusion Synth
    this.isSynthetic = true;
    this.isPlaying = true;
    this.playbackDuration = track.durationSec || 35;
    this.playbackTime = 0;

    const startTime = this.audioCtx.currentTime;
    this.scheduleIndianMusic(track.genre || 'Hindustani Classical', track.key || 'C#', startTime);

    this.intervalId = setInterval(() => {
      this.playbackTime += 0.25;
      if (onProgress) {
        onProgress(this.playbackTime, this.playbackDuration);
      }
      if (this.playbackTime >= this.playbackDuration) {
        this.stop();
        if (this.onEndedCallback) this.onEndedCallback();
      }
    }, 250);
  }

  scheduleIndianMusic(genre, keyStr, startTime) {
    const ctx = this.audioCtx;
    const baseFreq = 138.59; // C#3 (Traditional Indian Classical Sa)
    const fifthFreq = baseFreq * 1.5; // Pa (G#3)
    const octaveSa = baseFreq * 2; // High Sa (C#4)

    // 1. TANPURA DRONE (Plucking 4 strings: Pa - Sa - Sa - Kharaj Sa)
    const tanpuraStrings = [fifthFreq, octaveSa, octaveSa, baseFreq];
    const totalBars = 9;
    const barDuration = 4.0; // 4 seconds per cycle

    for (let bar = 0; bar < totalBars; bar++) {
      const cycleStart = startTime + bar * barDuration;

      tanpuraStrings.forEach((freq, idx) => {
        const pluckTime = cycleStart + idx * 0.95;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // Warm acoustic string resonance
        osc.frequency.setValueAtTime(freq, pluckTime);

        // Gentle overtone shimmer
        gain.gain.setValueAtTime(0.0001, pluckTime);
        gain.gain.exponentialRampToValueAtTime(0.09, pluckTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, pluckTime + 2.8);

        osc.connect(gain);
        gain.connect(this.gainNode);

        osc.start(pluckTime);
        osc.stop(pluckTime + 3.0);
        this.activeNodes.push(osc);
      });
    }

    // 2. RAGA MELODY (Sitar / Bansuri Meend Slides)
    // Raag Yaman notes relative to Sa (C#):
    // Sa (1.0), Re (1.125), Ga (1.25), Tivra Ma (1.406), Pa (1.5), Dha (1.687), Ni (1.875), High Sa (2.0)
    const yamanRatios = [1.0, 1.125, 1.25, 1.406, 1.5, 1.687, 1.875, 2.0];
    const melodyPhrases = [
      [0.89, 1.125, 1.25, 1.406, 1.5], // Ni Re Ga Ma Pa
      [1.406, 1.687, 1.875, 2.0, 1.875], // Ma Dha Ni Sa' Ni
      [1.687, 1.5, 1.406, 1.25, 1.125], // Dha Pa Ma Ga Re
      [1.125, 1.25, 1.125, 1.0, 1.0]     // Re Ga Re Sa Sa
    ];

    melodyPhrases.forEach((phrase, pIdx) => {
      const phraseStart = startTime + 1.5 + pIdx * 7.5;
      
      phrase.forEach((ratio, noteIdx) => {
        const noteTime = phraseStart + noteIdx * 1.35;
        const noteFreq = baseFreq * ratio * 2; // Octave 4

        const melOsc = ctx.createOscillator();
        const melGain = ctx.createGain();

        // Breathy Bansuri / Expressive Sitar timbre
        melOsc.type = genre.toLowerCase().includes('sitar') ? 'sawtooth' : 'sine';
        
        // Meend (pitch glissando / slide up into note)
        melOsc.frequency.setValueAtTime(noteFreq * 0.96, noteTime);
        melOsc.frequency.exponentialRampToValueAtTime(noteFreq, noteTime + 0.18);

        melGain.gain.setValueAtTime(0.001, noteTime);
        melGain.gain.exponentialRampToValueAtTime(0.08, noteTime + 0.12);
        melGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.25);

        melOsc.connect(melGain);
        melGain.connect(this.gainNode);

        melOsc.start(noteTime);
        melOsc.stop(noteTime + 1.3);
        this.activeNodes.push(melOsc);
      });
    });

    // 3. TABLA PERCUSSION (Keherwa / Teentaal beat: Bayah bass + Dayah chime)
    const beatUnit = 0.55; // ~108 BPM
    const totalBeats = Math.floor(this.playbackDuration / beatUnit);

    for (let b = 2; b < totalBeats; b++) {
      const beatTime = startTime + b * beatUnit;
      const isSam = b % 8 === 0; // Sam (downbeat of 8-beat Keherwa)
      const isKhali = b % 8 === 4; // Khali (open sound without bass)

      // Bayah (Deep pitch-bending bass drum - "Ge" or "Dha")
      if (!isKhali && (b % 2 === 0 || isSam)) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sine';

        // Classic Tabla Bayah pitch drop
        bassOsc.frequency.setValueAtTime(90, beatTime);
        bassOsc.frequency.exponentialRampToValueAtTime(62, beatTime + 0.22);

        bassGain.gain.setValueAtTime(isSam ? 0.22 : 0.14, beatTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.28);

        bassOsc.connect(bassGain);
        bassGain.connect(this.gainNode);

        bassOsc.start(beatTime);
        bassOsc.stop(beatTime + 0.3);
        this.activeNodes.push(bassOsc);
      }

      // Dayah (Crisp treble stroke - "Tin" or "Na")
      const trebleOsc = ctx.createOscillator();
      const trebleGain = ctx.createGain();
      trebleOsc.type = 'triangle';
      trebleOsc.frequency.setValueAtTime(octaveSa, beatTime);

      trebleGain.gain.setValueAtTime(0.04, beatTime);
      trebleGain.gain.exponentialRampToValueAtTime(0.0001, beatTime + 0.08);

      trebleOsc.connect(trebleGain);
      trebleGain.connect(this.gainNode);

      trebleOsc.start(beatTime);
      trebleOsc.stop(beatTime + 0.09);
      this.activeNodes.push(trebleOsc);
    }
  }
}

export const audioEngine = new SoundLinkAudioEngine();
