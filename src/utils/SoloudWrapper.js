/* global SoLoud */
class SoloudWrapper {
  constructor() {
    this.soloud = null;
    this.currentSound = null;
  }

  async init() {
    try {
      // Load SoLoud script
      await this.loadScript('/soloud.js');
      
      // Initialize SoLoud
      this.soloud = new SoLoud();
      this.soloud.init();
      
      console.log('SoLoud initialized successfully');
    } catch (error) {
      console.error('Error initializing SoLoud:', error);
      throw error;
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadSound(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.currentSound = this.soloud.loadMem(arrayBuffer);
      return this.currentSound;
    } catch (error) {
      console.error('Error loading sound:', error);
      throw error;
    }
  }

  play() {
    if (this.currentSound) {
      const handle = this.soloud.play(this.currentSound);
      return handle;
    }
    return null;
  }

  stop(handle) {
    if (handle !== null) {
      this.soloud.stop(handle);
    }
  }

  setVolume(handle, volume) {
    if (handle !== null) {
      this.soloud.setVolume(handle, volume);
    }
  }

  setPitch(handle, pitch) {
    if (handle !== null) {
      this.soloud.setPitch(handle, pitch);
    }
  }

  cleanup() {
    if (this.soloud) {
      this.soloud.deinit();
      this.soloud = null;
    }
  }
}

export { SoloudWrapper }; 