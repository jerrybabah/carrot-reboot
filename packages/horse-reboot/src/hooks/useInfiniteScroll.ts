import {
  ref, shallowRef, reactive, computed,
} from 'vue';
import { Cursor, Pagination } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';

export function useInfiniteScroll<T = any>() {
  const currentCursor = shallowRef<Cursor<T, keyof T> | null>(null);
  const isInfiniteDisabled = computed<boolean>(() => currentCursor.value === null);

  const items: T[] = reactive([]);
  const isEmpty = computed(() => items.length === 0);

  const isFirstFetching = ref(false);

  const initInfiniteState = () => {
    currentCursor.value = null;
    items.length = 0;
    isFirstFetching.value = false;
  };

  const fetch = async (promise: Promise<Pagination<T>>) => {
    if (currentCursor.value === null) {
      isFirstFetching.value = true;
    }

    try {
      const { list, cursor } = await promise;

      items.splice(items.length, 0, ...list);

      currentCursor.value = cursor;
    } finally {
      if (isFirstFetching.value) {
        isFirstFetching.value = false;
      }
    }
  };

  return {
    currentCursor,
    isInfiniteDisabled,
    items,
    isEmpty,
    isFirstFetching,
    initInfiniteState,
    fetch,
  };
}
