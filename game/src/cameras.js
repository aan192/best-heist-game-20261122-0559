export class CameraManager {
  constructor() {
    this.cameras = [
      { room: 0, x: 512, y: 70, angle: Math.PI / 2, minAngle: Math.PI / 4, maxAngle: (3 * Math.PI) / 4, speed: 0.8, range: 160, fov: Math.PI / 3 },
      { room: 1, x: 200, y: 70, angle: Math.PI / 2, minAngle: Math.PI / 6, maxAngle: (5 * Math.PI) / 6, speed: 1.0, range: 170, fov: Math.PI / 3 },
      { room: 1, x: 824, y: 70, angle: Math.PI / 2, minAngle: Math.PI / 6, maxAngle: (5 * Math.PI) / 6, speed: 1.0, range: 170, fov: Math.PI / 3 },
      { room: 2, x: 512, y: 70, angle: Math.PI / 2, minAngle: 0.1, maxAngle: Math.PI - 0.1, speed: 1.2, range: 200, fov: Math.PI / 2.5 }
    ];
  }

  update(player, level, dt) {
    let spottedAny = false;

    for (const c of this.cameras) {
      if (c.room !== player.room) continue;

      c.angle += c.speed * dt;
      if (c.angle > c.maxAngle || c.angle < c.minAngle) {
        c.speed = -c.speed;
        c.angle = Math.max(c.minAngle, Math.min(c.maxAngle, c.angle));
      }

      if (this.checkCameraVision(c, player, level)) {
        c.spotted = true;
        spottedAny = true;
      } else {
        c.spotted = false;
      }
    }

    return spottedAny;
  }

  checkCameraVision(c, player, level) {
    const dist = Math.hypot(player.x - c.x, player.y - c.y);
    if (dist > c.range) return false;

    const angleToPlayer = Math.atan2(player.y - c.y, player.x - c.x);
    let angleDiff = angleToPlayer - c.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    if (Math.abs(angleDiff) > c.fov / 2) return false;

    const steps = 20;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const rx = c.x + (player.x - c.x) * t;
      const ry = c.y + (player.y - c.y) * t;
      for (const w of level.walls) {
        if (rx >= w.x && rx <= w.x + w.width && ry >= w.y && ry <= w.y + w.height) return false;
      }
      for (const p of level.pillars) {
        if (rx >= p.x && rx <= p.x + p.width && ry >= p.y && ry <= p.y + p.height) return false;
      }
    }
    return true;
  }
}
