class AudioPlayer {
  constructor() {
    this.audio = null;
    this.currentTrack = null;
  }

  play(trackUrl) {
    this.stop();

    this.audio = new Audio(trackUrl);
    this.currentTrack = trackUrl;
    
    this.audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });

    return this.audio;
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
      this.currentTrack = null;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  isPlaying() {
    return this.audio && !this.audio.paused;
  }
}

export const audioPlayer = new AudioPlayer();
