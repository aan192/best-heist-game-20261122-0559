export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_CAUGHT = 'caught';
export const SCREEN_WIN = 'win';

export function renderGame(ctx, canvas, state, player, level, guards, cameras, alarmSystem, screenState) {
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (screenState === SCREEN_TITLE) {
    renderTitleScreen(ctx, canvas);
    return;
  }

  if (screenState === SCREEN_CAUGHT) {
    renderCaughtScreen(ctx, canvas, player);
    return;
  }

  if (screenState === SCREEN_WIN) {
    renderWinScreen(ctx, canvas, player);
    return;
  }

  // --- PLAY / HEIST RENDER ---
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(level.bounds.x, level.bounds.y, level.bounds.width, level.bounds.height);
  
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let x = level.bounds.x; x < level.bounds.x + level.bounds.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, level.bounds.y); ctx.lineTo(x, level.bounds.y + level.bounds.height); ctx.stroke();
  }
  for (let y = level.bounds.y; y < level.bounds.y + level.bounds.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(level.bounds.x, y); ctx.lineTo(level.bounds.x + level.bounds.width, y); ctx.stroke();
  }

  ctx.fillStyle = '#374151';
  for (const w of level.walls) {
    ctx.fillRect(w.x, w.y, w.width, w.height);
  }

  for (const door of level.doors) {
    ctx.fillStyle = '#10b981';
    ctx.fillRect(door.x, door.y, door.width, door.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.fillText('🚪', door.x + 4, door.y + 25);
  }

  if (level.id === 0) {
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(level.scooter.x, level.scooter.y, level.scooter.width, level.scooter.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.fillText('🛵 Scooter', level.scooter.x - 10, level.scooter.y - 8);
  }

  ctx.fillStyle = '#6b7280';
  for (const p of level.pillars) {
    ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.strokeStyle = '#4b5563';
    ctx.strokeRect(p.x, p.y, p.width, p.height);
  }

  for (const item of level.loot) {
    if (item.collected) continue;
    if (item.type === 'painting') {
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(item.x, item.y, item.width, item.height);
      ctx.strokeStyle = '#4c1d95';
      ctx.strokeRect(item.x, item.y, item.width, item.height);
    } else if (item.type === 'gold') {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.type === 'diamond') {
      const cx = item.x + item.width/2;
      const cy = item.y + item.height/2;
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(cx - item.width/2 - 6, cy + 4, item.width + 12, 16);
      ctx.fillStyle = '#374151';
      ctx.fillRect(cx - item.width/2 - 10, cy + 18, item.width + 20, 5);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(cx, cy - item.height/2);
      ctx.lineTo(cx + item.width/2, cy);
      ctx.lineTo(cx, cy + item.height/2);
      ctx.lineTo(cx - item.width/2, cy);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.stroke();
    }
  }

  for (const cookie of player.droppedCookies) {
    if (cookie.room === level.id) {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(cookie.x, cookie.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cookie.x - 3, cookie.y - 3, 2, 2);
      ctx.fillRect(cookie.x + 1, cookie.y + 1, 2, 2);
    }
  }

  for (const c of cameras.cameras) {
    if (c.room !== level.id) continue;
    ctx.fillStyle = c.spotted ? 'rgba(239, 68, 68, 0.35)' : 'rgba(6, 182, 212, 0.25)';
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.arc(c.x, c.y, c.range, c.angle - c.fov/2, c.angle + c.fov/2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0e7490';
    ctx.fillRect(c.x - 8, c.y - 8, 16, 16);
  }

  for (const g of guards.guards) {
    if (g.room !== level.id) continue;
    ctx.fillStyle = g.spotted ? 'rgba(239, 68, 68, 0.45)' : 'rgba(234, 179, 8, 0.3)';
    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.arc(g.x, g.y, g.range, g.angle - g.fov/2, g.angle + g.fov/2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = g.spotted ? '#dc2626' : '#d97706';
    ctx.beginPath();
    ctx.arc(g.x, g.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.fillText('👮', g.x - 7, g.y + 4);
  }

  if (player.room === level.id) {
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.arc(player.x, player.y - player.radius + 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.fillRect(player.x + 8, player.y, 8, 10);

    ctx.fillStyle = '#ffffff';
    ctx.font = '11px sans-serif';
    ctx.fillText('👵', player.x - 7, player.y + 4);
  }

  renderHUD(ctx, canvas, player, level, alarmSystem);
}

function renderHUD(ctx, canvas, player, level, alarmSystem) {
  ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
  ctx.fillRect(0, 0, canvas.width, 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`ROOM: ${level.name.toUpperCase()}`, 20, 30);
  ctx.fillText(`LOOT: $${player.lootValue.toLocaleString()}`, 250, 30);
  ctx.fillText(`DIAMOND: ${player.hasDiamond ? '💎 SECURED' : '❌ NEEDED'}`, 480, 30);
  ctx.fillText(`COOKIES: ${'🍪'.repeat(player.cookiesLeft)}`, 700, 30);

  ctx.fillStyle = '#4b5563';
  ctx.fillRect(850, 15, 140, 20);
  const fillWidth = (alarmSystem.value / 100) * 140;
  ctx.fillStyle = alarmSystem.value > 50 ? '#ef4444' : '#eab308';
  ctx.fillRect(850, 15, fillWidth, 20);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(850, 15, 140, 20);
  ctx.fillStyle = '#ffffff';
  ctx.font = '11px sans-serif';
  ctx.fillText(`ALARM: ${Math.round(alarmSystem.value)}%`, 860, 30);
}

function renderTitleScreen(ctx, canvas) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GETAWAY GRANNY', canvas.width / 2, 200);

  ctx.fillStyle = '#f472b6';
  ctx.font = '24px sans-serif';
  ctx.fillText('The Museum of Moonlight Heist', canvas.width / 2, 250);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px sans-serif';
  ctx.fillText('Steal the Moonlight Diamond & escape to your mobility scooter!', canvas.width / 2, 340);
  ctx.fillText('Controls: Arrow Keys / WASD to Move | C to Toss Cookie', canvas.width / 2, 380);
  ctx.fillText('P: Pause | M: Mute | R: Restart', canvas.width / 2, 420);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('PRESS SPACE OR ENTER TO START HEIST', canvas.width / 2, 520);
  ctx.textAlign = 'left';
}

function renderCaughtScreen(ctx, canvas, player) {
  ctx.fillStyle = 'rgba(127, 29, 29, 0.9)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BUSTED! ALARM TRIGGERED', canvas.width / 2, 250);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Grandma got caught by the museum security!`, canvas.width / 2, 330);
  ctx.fillText(`Final Loot Collected: $${player.lootValue.toLocaleString()}`, canvas.width / 2, 380);
  ctx.fillText('Press R to Restart Heist', canvas.width / 2, 460);
  ctx.textAlign = 'left';
}

function renderWinScreen(ctx, canvas, player) {
  ctx.fillStyle = 'rgba(6, 78, 59, 0.95)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HEIST SUCCESSFUL! 💎🛵', canvas.width / 2, 220);

  ctx.fillStyle = '#ffffff';
  ctx.font = '24px sans-serif';
  ctx.fillText(`The Moonlight Diamond is safely in the handbag!`, canvas.width / 2, 300);
  ctx.fillText(`Total Heist Payout: $${player.lootValue.toLocaleString()}`, canvas.width / 2, 360);
  ctx.fillText('Grandma zipped away on her mobility scooter into the night.', canvas.width / 2, 420);
  ctx.fillText('Press R to Play Again', canvas.width / 2, 500);
  ctx.textAlign = 'left';
}
