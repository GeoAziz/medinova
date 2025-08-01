import { useEffect } from 'react';
import { Howl } from 'howler';

const hum = new Howl({
  src: ['/sounds/ambient-hum.mp3'],
  loop: true,
  volume: 0.18,
});
const swoosh = new Howl({
  src: ['/sounds/swoosh.mp3'],
  volume: 0.4,
});
const click = new Howl({
  src: ['/sounds/engage.mp3'],
  volume: 0.5,
});

export function useSplashSounds(play: boolean) {
  useEffect(() => {
    if (play) {
      hum.play();
    } else {
      hum.stop();
    }
    return () => { hum.stop(); };
  }, [play]);
  return {
    playSwoosh: () => swoosh.play(),
    playClick: () => click.play(),
  };
}
