export class GuardManager {
  constructor() {
    this.guards = [
      {
        room: 0,
        x: 400, y: 250,
        waypoints: [{x: 300, y: 150}, {x: 700, y: 150}, {x: 700, y: 600}, {x: 300, y: 600}],
        wpIndex: 0,
        speed: 1.5,
        angle: 0,
        fov: Math.PI / 3,
        range: 170,
        state: 'patrol',
        inspectTimer: 0,
        inspectTarget: null,
      },
      {
        room: 1,
        x: 500, y: 350,
        waypoints: [{x: 200, y: 120}, {x: 800, y: 120}, {x: 800, y: 600}, {x: 200, y: 600}],
        wpIndex: 0,
        speed: 1.8,
        angle: 0,
        fov: Math.PI / 3,
        range: 180,
        state: 'patrol',
        inspectTimer: 0,
        inspectTarget: null,
      },
      {
        room: 2,
        x: 500, y: 150,
        waypoints: [{x: 200, y: 100}, {x: 800, y: 100}, {x: 800, y: 650}, {x: 200, y: 650}],
        wpIndex: 0,
        speed: 2.0,
        angle: 0,
        fov: Math.PI / 2.5,
        range: 200,
        state: 'patrol',
        inspectTimer: 0,
        inspectTarget: null,
      }
    ];
  }

  update(player, level, dt, droppedCookies) {
    let spottedAny = false;

    for (const g of this.guards) {
      if (g.room !== player.room) continue;

      let nearestCookie = null;
      let minCookieDist = 150;
      for (const cookie of droppedCookies) {
        if (cookie.room === g.room) {
          const d = Math.hypot(cookie.x - g.x, cookie.y - g.y);
          if (d < minCookieDist) {
            minCookieDist = d;
            nearestCookie = cookie;
          }
        }
      }

      if (nearestCookie && g.state !== 'inspect') {
        g.state = 'inspect';
        g.inspectTarget = { x: nearestCookie.x, y: nearestCookie.y };
        g.inspectTimer = 3.0;
      }

      if (g.state === 'inspect') {
        g.inspectTimer -= dt;
        const dx = g.inspectTarget.x - g.x;
        const dy = g.inspectTarget.y - g.y;
        g.angle = Math.atan2(dy, dx);
        if (Math.hypot(dx, dy) > 10) {
          g.x += Math.cos(g.angle) * g.speed * dt * 60;
          g.y += Math.sin(g.angle) * g.speed * dt * 60;
        }
        if (g.inspectTimer <= 0 || !nearestCookie) {
          g.state = 'patrol';
        }
      } else {
        const targetWp = g.waypoints[g.wpIndex];
        const dx = targetWp.x - g.x;
        const dy = targetWp.y - g.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 10) {
          g.wpIndex = (g.wpIndex + 1) % g.waypoints.length;
        } else {
          const targetAngle = Math.atan2(dy, dx);
          g.angle = targetAngle;
          g.x += Math.cos(g.angle) * g.speed * dt * 60;
          g.y += Math.sin(g.angle) * g.speed * dt * 60;
        }
      }

      const inCone = this.checkVisionCone(g, player, level);
      if (inCone) {
        g.spotted = true;
        spottedAny = true;
      } else {
        g.spotted = false;
      }
    }

    return spottedAny;
  }

  checkVisionCone(g, player, level) {
    const dist = Math.hypot(player.x - g.x, player.y - g.y);
    if (dist > g.range) return false;

    const angleToPlayer = Math.atan2(player.y - g.y, player.x - g.x);
    let angleDiff = angleToPlayer - g.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    if (Math.abs(angleDiff) > g.fov / 2) return false;

    return this.hasLineOfSight(g.x, g.y, player.x, player.y, level);
  }

  hasLineOfSight(x1, y1, x2, y2, level) {
    const steps = 20;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const rx = x1 + (x2 - x1) * t;
      const ry = y1 + (y2 - y1) * t;

      for (const w of level.walls) {
        if (rx >= w.x && rx <= w.x + w.width && ry >= w.y && ry <= w.y + w.height) return false;
      }
      for (const p of level.pillars) {
        if (rx >= p.x && rx <= p.x + p.width && ry >= p.y && ry <= p.y + p.height) return false;
      }
    }
    return true;
  }

  reset() {
    this.guards[0].x = 400; this.guards[0].y = 250; this.guards[0].state = 'patrol';
    this.guards[1].x = 500; this.guards[1].y = 350; this.guards[1].state = 'patrol';
    this.guards[2].x = 500; this.guards[2].y = 150; this.guards[2].state = 'patrol';
  }
}
