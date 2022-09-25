import { ref } from 'vue';

export const useModal = (initialState = false) => {
  const isOpened = ref(initialState);

  const setOpen = (state: boolean) => {
    isOpened.value = state;
  };

  return {
    isOpened,
    setOpen,
  };
};
