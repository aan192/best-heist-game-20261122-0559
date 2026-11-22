import { CONFIG } from './config.js';
import { playLootChime, playCookieDrop } from './audio.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.room = 0;
    this.lootValue = 0;
    this.lootWeight = 0;
    this.hasDiamond = false;
    this.cookiesLeft = 3;
    this.droppedCookies = [];
  }

  update(input, level, dt) {
    let dx = 0;
    let dy = 0;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    const speed = CONFIG.baseSpeed / (1 + this.lootWeight * 0.08);
    const nx = this.x + dx * speed;
    const ny = this.y + dy * speed;

    if (!this.checkCollision(nx, this.y, level)) this.x = nx;
    if (!this.checkCollision(this.x, ny, level)) this.y = ny;

    if (input.cookiePressed) {
      input.cookiePressed = false;
      if (this.cookiesLeft > 0) {
        this.cookiesLeft--;
        this.droppedCookies.push({ room: this.room, x: this.x, y: this.y, timer: 3.0 });
        playCookieDrop();
      }
    }

    for (let i = this.droppedCookies.length - 1; i >= 0; i--) {
      this.droppedCookies[i].timer -= dt;
      if (this.droppedCookies[i].timer <= 0) {
        this.droppedCookies.splice(i, 1);
      }
    }

    for (const item of level.loot) {
      if (!item.collected) {
        const cx = item.x + item.width / 2;
        const cy = item.y + item.height / 2;
        const dist = Math.hypot(this.x - cx, this.y - cy);
        if (dist < this.radius + Math.max(item.width, item.height) / 2) {
          item.collected = true;
          this.lootValue += item.value;
          if (item.type === 'diamond') {
            this.hasDiamond = true;
          } else {
            this.lootWeight++;
          }
          playLootChime();
        }
      }
    }

    for (const door of level.doors) {
      if (
        this.x + this.radius > door.x &&
        this.x - this.radius < door.x + door.width &&
        this.y + this.radius > door.y &&
        this.y - this.radius < door.y + door.height
      ) {
        this.room = door.targetRoom;
        this.x = door.targetX;
        this.y = door.targetY;
        break;
      }
    }
  }

  checkCollision(x, y, level) {
    const b = level.bounds;
    if (x - this.radius < b.x || x + this.radius > b.x + b.width ||
        y - this.radius < b.y || y + this.radius > b.y + b.height) {
      return true;
    }
    for (const w of level.walls) {
      if (x + this.radius > w.x && x - this.radius < w.x + w.width &&
          y + this.radius > w.y && y - this.radius < w.y + w.height) {
        return true;
      }
    }
    for (const p of level.pillars) {
      if (x + this.radius > p.x && x - this.radius < p.x + p.width &&
          y + this.radius > p.y && y - this.radius < p.y + p.height) {
        return true;
      }
    }
    return false;
  }

  reset() {
    this.x = 120;
    this.y = 380;
    this.room = 0;
    this.lootValue = 0;
    this.lootWeight = 0;
    this.hasDiamond = false;
    this.cookiesLeft = 3;
    this.droppedCookies = [];
  }
}
