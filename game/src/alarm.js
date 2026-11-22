import { playAlarmTick } from './audio.js';

export class AlarmSystem {
  constructor() {
    this.value = 0;
    this.tickTimer = 0;
    this.frozen = false;
  }

  update(spotted, dt) {
    if (this.frozen) return false;
    if (spotted) {
      this.value = Math.min(100, this.value + 35 * dt);
      this.tickTimer += dt;
      if (this.tickTimer > 0.3) {
        this.tickTimer = 0;
        playAlarmTick(250 + (this.value / 100) * 350);
      }
    } else {
      this.value = Math.max(0, this.value - 20 * dt);
      this.tickTimer = 0;
    }
    return this.value >= 100;
  }

  reset() {
    this.value = 0;
    this.tickTimer = 0;
    this.frozen = false;
  }
}
