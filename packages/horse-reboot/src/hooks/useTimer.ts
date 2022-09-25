import { ref, computed } from 'vue';

export const useTimer = (seconds: number) => {
  const remainSeconds = ref<number>(seconds);

  const remainTime = computed<string>(() => {
    const minute = Math.floor(remainSeconds.value / 60);
    const second = Math.round(remainSeconds.value % 60);
    return `${minute.toFixed(0)}분 ${second.toFixed(0).padStart(2, '0')}초`;
  });

  const timer = ref<any>();

  const stop = () => {
    clearInterval(timer.value);
  };

  const init = () => {
    stop();
    remainSeconds.value = seconds;
    timer.value = undefined;
  };

  const tick = (s?: number) => {
    if (remainSeconds.value > 0) {
      remainSeconds.value -= s || 1;
    } else {
      init();
    }
  };

  const start = () => {
    timer.value = setInterval(tick, 1000);
  };

  return {
    remainSeconds,
    remainTime,
    timer,
    stop,
    init,
    tick,
    start,
  };
};
