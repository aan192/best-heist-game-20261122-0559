export const input = {
  up: false,
  down: false,
  left: false,
  right: false,
  cookiePressed: false,
  pausePressed: false,
  mutePressed: false,
  restartPressed: false,
  actionPressed: false,
};

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
  if (e.code === 'ArrowUp' || e.code === 'KeyW') input.up = true;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') input.down = true;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = true;
  if (e.code === 'KeyC') input.cookiePressed = true;
  if (e.code === 'KeyP') input.pausePressed = true;
  if (e.code === 'KeyM') input.mutePressed = true;
  if (e.code === 'KeyR') input.restartPressed = true;
  if (e.code === 'Space' || e.code === 'Enter') input.actionPressed = true;
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp' || e.code === 'KeyW') input.up = false;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') input.down = false;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') input.right = false;
});
