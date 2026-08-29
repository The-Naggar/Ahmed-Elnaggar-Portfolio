// ══════════════════════════════════════════════════════════════
// 🔊 SHISH WINDOW AUDIO MANAGER
// ══════════════════════════════════════════════════════════════

class ShishSoundManager {
  private openAudio: HTMLAudioElement | null = null;
  private closeAudio: HTMLAudioElement | null = null;
  private initialized = false;

  private init() {
    if (this.initialized || typeof window === "undefined") return;
    try {
      this.openAudio = new Audio("/sounds/shish_open.mp3");
      this.openAudio.volume = 0.45;
      this.openAudio.preload = "auto";

      this.closeAudio = new Audio("/sounds/shish_open.mp3");
      this.closeAudio.volume = 0.45;
      this.closeAudio.preload = "auto";
      this.initialized = true;
    } catch {
      // Audio not supported or blocked
    }
  }

  playOpen() {
    this.init();
    if (!this.openAudio) return;
    try {
      if (this.closeAudio) {
        this.closeAudio.pause();
        this.closeAudio.currentTime = 0;
      }
      this.openAudio.currentTime = 0;
      const promise = this.openAudio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Autoplay policy prevented playback until user interaction
        });
      }
    } catch {
      // Suppress audio playback exceptions
    }
  }

  playClose() {
    this.init();
    if (!this.closeAudio) return;
    try {
      if (this.openAudio) {
        this.openAudio.pause();
        this.openAudio.currentTime = 0;
      }
      this.closeAudio.currentTime = 0;
      const promise = this.closeAudio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Autoplay policy prevented playback until user interaction
        });
      }
    } catch {
      // Suppress audio playback exceptions
    }
  }
}

export const shishSound = new ShishSoundManager();
