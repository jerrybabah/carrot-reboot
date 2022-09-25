<template>
  <ion-slides
    class="events"
    pager
    :options="slideOpts"
  >
    <ion-slide v-for="index in props.count" :key="index">
      <img :src="`/events/event${index}.png`">
    </ion-slide>
  </ion-slides>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import {
  IonSlides, IonSlide,
} from '@ionic/vue';

const props = defineProps<{
  count: number,
}>();

const slideOpts = {
  loop: true,
  autoplay: {
    disableOnInteraction: false,
  },
};
</script>

<style lang="scss" scoped>
.events {
  min-height: 50vw;
}
</style>
