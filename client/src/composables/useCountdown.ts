import { ref, onUnmounted } from 'vue';

export function useCountdown(initialSeconds = 60) {
  const countdown = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  function start() {
    countdown.value = initialSeconds;
    stop();

    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) stop();
    }, 1000);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  onUnmounted(stop);

  return { countdown, start, stop, isRunning: () => countdown.value > 0 };
}
