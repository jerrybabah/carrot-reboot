<template>
  <div class="radio-group">
    <ion-button
      size="small"
      shape="round"
      color="medium"
      :fill="props.modelValue === 'all' ? 'solid' : 'outline'"
      @click="() => {
        if (props.modelValue !== 'all') {
          emit('update:modelValue', 'all');
        }
      }"
    >
      모두 보기
    </ion-button>

    <ion-button
      size="small"
      shape="round"
      color="medium"
      :fill="props.modelValue === 'future' ? 'solid' : 'outline'"
      @click="() => {
        if (props.modelValue !== 'future') {
          emit('update:modelValue', 'future');
        }
      }"
    >
      작업예정
    </ion-button>

    <ion-button
      size="small"
      shape="round"
      color="medium"
      :fill="props.modelValue === 'present' ? 'solid' : 'outline'"
      @click="() => {
        if (props.modelValue !== 'present') {
          emit('update:modelValue', 'present');
        }
      }"
    >
      작업중
    </ion-button>

    <ion-button
      size="small"
      shape="round"
      color="medium"
      :fill="props.modelValue === 'past' ? 'solid' : 'outline'"
      @click="() => {
        if (props.modelValue !== 'past') {
          emit('update:modelValue', 'past');
        }
      }"
    >
      작업완료
    </ion-button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, defineEmits } from 'vue';
import { IonButton } from '@ionic/vue';

/**
 * prop and emit
 */
type Prop = {
  modelValue: 'all' | 'future' | 'present' | 'past',
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: 'all',
});

type Emit = {
  (event: 'update:modelValue', payload: 'all' | 'future' | 'present' | 'past'): void,
};

const emit = defineEmits<Emit>();

</script>

<style lang="scss" scoped>
.radio-group {

  ion-button {
    --padding-start: 10px;
    --padding-end: 10px;

    margin: 0;
    margin-right: 8px;
  }
}
</style>
