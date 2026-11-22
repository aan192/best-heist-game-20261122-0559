import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN } from './render.js';

export function stageShot(name, gameInstance) {
  gameInstance.reset();
  if (name === 'start') {
    gameInstance.screenState = SCREEN_TITLE;
    return { screen: SCREEN_TITLE, best: 0 };
  } else if (name === 'play') {
    gameInstance.screenState = SCREEN_PLAY;
    gameInstance.player.room = 0;
    gameInstance.player.x = 450;
    gameInstance.player.y = 380;
    gameInstance.alarmSystem.value = 45;
    gameInstance.alarmSystem.frozen = true;
    return { screen: SCREEN_PLAY, best: 0 };
  } else if (name === 'end') {
    gameInstance.screenState = SCREEN_WIN;
    gameInstance.player.lootValue = 35000;
    return { screen: SCREEN_WIN, best: 35000 };
  }
  return { screen: SCREEN_TITLE, best: 0 };
}
