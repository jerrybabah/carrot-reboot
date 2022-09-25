<template>
  <div class="wrapper">
    <div v-if="props.header" class="header">
      <div class="title">
        지역 선택
      </div>

      <ion-button
        v-if="props.clearable"
        fill="clear"
        size="small"
        @click="() => clear()"
      >
        선택해제
      </ion-button>
    </div>

    <van-tree-select
      class="district-select"
      :items="treeItems"
      v-model:main-active-index="selectedLargeDistrict"
      :active-id="selectedSmallDistricts"
      @update:active-id="(payload) => {
        selectedSmallDistricts = payload
        emit('update:modelValue', payload);
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps, withDefaults, defineEmits, ref,
} from 'vue';
import { IonButton } from '@ionic/vue';
import { TreeSelect as VanTreeSelect, TreeSelectItem, TreeSelectChild } from 'vant';
import { DISTRICTS } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';

/**
 * prop and emit
 */
type Prop = {
  modelValue: string | string[],
  clearable: boolean,
  multiple: boolean,
  allSelectable: boolean,
  header: boolean,
}

const props = withDefaults(defineProps<Prop>(), {
  clearable: false,
  multiple: false,
  allSelectable: false,
  header: true,
  modelValue: ({ multiple }) => (multiple ? [] : '/'),
});

type Emit = {
  (event: 'update:modelValue', payload: string | string[]): void,
};

const emit = defineEmits<Emit>();

/**
 * data and computed
 */
const treeItems = Object.entries(DISTRICTS).reduce<TreeSelectItem[]>((items, [largeDistrict, smallDistricts]) => {
  const children: TreeSelectChild[] = [];

  if (props.allSelectable) {
    children.push({
      id: `${largeDistrict}/전체`,
      text: '전체',
    });
  }

  smallDistricts.forEach((smallDistrict) => {
    children.push({
      id: `${largeDistrict}/${smallDistrict}`,
      text: smallDistrict,
    });
  });

  return [
    ...items,
    {
      text: largeDistrict,
      children,
    },
  ];
}, []);

const selectedLargeDistrict = ref<number>(NaN);
const selectedSmallDistricts = ref<string | string[]>(props.modelValue);

/**
 * method
 */
const clear = () => {
  if (props.multiple) {
    selectedSmallDistricts.value = [];
    emit('update:modelValue', []);
    return;
  }

  selectedSmallDistricts.value = '/';
  emit('update:modelValue', '/');
};
</script>

<style lang="scss" scoped>
.wrapper {
  --header-height: 40px;

  .header {
    height: var(--header-height);
    display: flex;
    align-items: center;
    padding: 0 8px;
  }

  .district-select {
    height: calc(60vh - var(--header-height)) !important;
  }
}
</style>
