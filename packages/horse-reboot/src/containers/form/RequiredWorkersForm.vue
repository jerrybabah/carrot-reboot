<template>
<div class="form-list">
  <div class="form" v-for="(workerInfo, index) in props.modelValue" :key="index">
    <div class="type-and-remove">
      <van-radio-group
        :model-value="workerInfo.type"
        @update:model-value="(payload) => {
          const copiedWorkerInfos = [
            ...props.modelValue,
          ];

          copiedWorkerInfos[index].type = payload;

          emit('update:modelValue', copiedWorkerInfos);
        }"
        class="type"
        direction="horizontal"
      >
        <van-radio name="기공">기술공</van-radio>
        <van-radio name="조공">보조공</van-radio>
      </van-radio-group>

      <ion-button
        v-if="props.modelValue.length >= 2"
        class="remove"
        fill="clear"
        size="small"
        @click="() => {
          const copiedWorkerInfos = [
            ...props.modelValue,
          ];

          copiedWorkerInfos.splice(index, 1);

          emit('update:modelValue', [
            ...copiedWorkerInfos,
          ]);
        }"
      >
        <ion-icon slot="start" :icon="removeCircleOutline" />
        삭제
      </ion-button>
    </div>

    <div class="wage">
      <van-field
        :model-value="currencyFormatter(workerInfo.wage)"
        class="wage-input"
        label="제시일당"
        type="number"
        input-align="right"
        placeholder="일당 입력"
        clearable
        @update:model-value="(payload) => {
          const copiedWorkerInfos = [
            ...props.modelValue,
          ];

          copiedWorkerInfos[index].wage = Number.parseInt(payload);

          emit('update:modelValue', copiedWorkerInfos);
        }"
      />
    </div>

    <div class="util-buttons">
      <ion-button
        class="util"
        expand="block"
        fill="outline"
        size="small"
        @click="() => {
          const copiedWorkerInfos = [
            ...props.modelValue,
          ];

          const beforeWage = copiedWorkerInfos[index].wage;

          if (!beforeWage) {
            copiedWorkerInfos[index].wage = 100000;
          } else {
            copiedWorkerInfos[index].wage = beforeWage + 100000;
          }

          emit('update:modelValue', copiedWorkerInfos);
        }"
      >
        +10만원
      </ion-button>
      <ion-button
        class="util"
        expand="block"
        fill="outline"
        size="small"
        @click="() => {
          const copiedWorkerInfos = [
            ...props.modelValue,
          ];

          const beforeWage = copiedWorkerInfos[index].wage;

          if (!beforeWage) {
            copiedWorkerInfos[index].wage = 10000;
          } else {
            copiedWorkerInfos[index].wage = beforeWage + 10000;
          }

          emit('update:modelValue', copiedWorkerInfos);
        }"
      >
        +1만원
      </ion-button>
    </div>
  </div>

  <ion-button
    color="secondary"
    expand="block"
    size="small"
    @click="() => {
      emit('update:modelValue', [
        ...props.modelValue,
        {
          type: '기공',
          wage: null,
        },
      ]);
    }"
  >
    인원 추가
  </ion-button>
</div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { removeCircleOutline } from 'ionicons/icons';
import { RadioGroup as VanRadioGroup, Radio as VanRadio, Field as VanField } from 'vant';

import { RequiredWorkerInfo } from '@/store/workCreation.store';

/**
 * prop and emit
 */
type Prop = {
  modelValue: RequiredWorkerInfo[],
};

const props = defineProps<Prop>();

type Emit = {
  (event: 'update:modelValue', payload: RequiredWorkerInfo[]): void,
};

const emit = defineEmits<Emit>();

const currencyFormatter = (wage: number | null): string => {
  if (wage === null || Number.isNaN(wage)) {
    return '';
  }

  const formatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  });

  return formatter.format(wage);
};
</script>

<style lang="scss" scoped>
.form-list {
  background-color: var(--ion-color-light, #f4f5f8);
  padding: 8px 16px;

  .form {
    background-color: var(--ion-background-color, #fff);
    padding: 0 8px;
    margin-bottom: 10px;

    .type-and-remove {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--ion-color-light);

      .type {
        --van-radio-size: 16px;
      }

      .remove {
        --padding-end: 0;
      }
    }

    .wage {
      padding: 8px 0;
      border-bottom: 1px solid var(--ion-color-light);

      .wage-input {
        --van-cell-vertical-padding: 0;
        --van-cell-horizontal-padding: 0;
      }
    }

    .util-buttons {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;

      .util {
        width: 49%;
        margin: 0;
      }
    }
  }
}
</style>
