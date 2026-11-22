import { input } from './input.js';
import { ROOMS } from './levels.js';
import { Player } from './player.js';
import { GuardManager } from './guards.js';
import { CameraManager } from './cameras.js';
import { AlarmSystem } from './alarm.js';
import { renderGame, SCREEN_TITLE, SCREEN_PLAY, SCREEN_CAUGHT, SCREEN_WIN } from './render.js';
import { toggleMute, playCaughtSting, playWinFanfare } from './audio.js';
import { stageShot } from './shots.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.player = new Player(120, 380);
    this.guards = new GuardManager();
    this.cameras = new CameraManager();
    this.alarmSystem = new AlarmSystem();
    this.currentLevelIndex = 0;
    this.screenState = SCREEN_TITLE;
    this.paused = false;

    const urlParams = new URLSearchParams(window.location.search);
    const shot = urlParams.get('shot');
    if (shot) {
      stageShot(shot, this);
    }

    let lastTime = performance.now();
    const loop = (time) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      this.update(dt);
      this.render();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  reset() {
    this.player.reset();
    this.guards.reset();
    this.alarmSystem.reset();
    this.currentLevelIndex = 0;
    this.screenState = SCREEN_TITLE;
  }

  update(dt) {
    if (input.mutePressed) {
      input.mutePressed = false;
      toggleMute();
    }
    if (input.restartPressed) {
      input.restartPressed = false;
      this.reset();
      this.screenState = SCREEN_PLAY;
    }
    if (input.pausePressed) {
      input.pausePressed = false;
      if (this.screenState === SCREEN_PLAY) {
        this.paused = !this.paused;
      }
    }

    if (this.screenState === SCREEN_TITLE) {
      if (input.actionPressed) {
        input.actionPressed = false;
        this.screenState = SCREEN_PLAY;
      }
      return;
    }

    if (this.screenState === SCREEN_CAUGHT || this.screenState === SCREEN_WIN) {
      if (input.restartPressed || input.actionPressed) {
        input.restartPressed = false;
        input.actionPressed = false;
        this.reset();
        this.screenState = SCREEN_PLAY;
      }
      return;
    }

    if (this.paused) return;

    const currentLevel = ROOMS[this.player.room];
    this.player.update(input, currentLevel, dt);

    const guardSpotted = this.guards.update(this.player, currentLevel, dt, this.player.droppedCookies);
    const cameraSpotted = this.cameras.update(this.player, currentLevel, dt);

    const isSpotted = guardSpotted || cameraSpotted;
    const caught = this.alarmSystem.update(isSpotted, dt);

    if (caught) {
      this.screenState = SCREEN_CAUGHT;
      playCaughtSting();
    }

    if (this.player.room === 0 && this.player.hasDiamond) {
      const scooter = currentLevel.scooter;
      const dist = Math.hypot(this.player.x - (scooter.x + scooter.width/2), this.player.y - (scooter.y + scooter.height/2));
      if (dist < 40) {
        this.screenState = SCREEN_WIN;
        playWinFanfare();
      }
    }
  }

  render() {
    const currentLevel = ROOMS[this.player.room];
    renderGame(this.ctx, this.canvas, null, this.player, currentLevel, this.guards, this.cameras, this.alarmSystem, this.screenState);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
