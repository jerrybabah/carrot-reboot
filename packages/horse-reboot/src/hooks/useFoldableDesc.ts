import { ref, computed, onMounted } from 'vue';
import { chevronDown, chevronUp } from 'ionicons/icons';

export function useFoldableDesc(lineHeight = 20) {
  const descLineHeight = lineHeight;

  const descriptionTemp = ref<any>(null);

  const descOriginHeight = ref(0); // WARN: onMounted 안에서만 값을 변경할 것

  const is3LineExceeded = computed<boolean>(() => descOriginHeight.value > descLineHeight * 3);

  const isDescFolded = ref(true);

  const chevron = computed<string>(() => (isDescFolded.value ? chevronDown : chevronUp));

  onMounted(() => {
    let refreshCount = 0;

    const refreshInterval = setInterval(() => {
      if (descOriginHeight.value > 0 || refreshCount >= 25) {
        clearInterval(refreshInterval);
        return;
      }

      descOriginHeight.value = descriptionTemp.value?.scrollHeight || 0;

      refreshCount += 1;
    }, 200); // 0.2초
  });

  return {
    descriptionTemp,
    is3LineExceeded,
    isDescFolded,
    chevron,
  };
}
