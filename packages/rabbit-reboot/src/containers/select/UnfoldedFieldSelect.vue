<template>
  <ion-grid>
    <ion-row v-for="(row, index) in gridFields" :key="index">
      <ion-col v-for="(col, index) in row" :key="index">
        <div class="field" @click="() => onClick(col.field.kor)">
          <ion-thumbnail :class="{ selected: col.isSelected }">
            <img :src="`/fields/${col.field.eng.toLowerCase()}.svg`">
          </ion-thumbnail>
          <ion-label :color="col.isSelected ? 'primary' : 'medium'">{{ col.field.kor }}</ion-label>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts" setup>
import {
  defineProps, withDefaults, defineEmits, ref, computed, readonly,
} from 'vue';
import {
  IonGrid, IonRow, IonCol, IonThumbnail, IonLabel,
} from '@ionic/vue';
import { FIELDS } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';

/**
 * prop and emit
 */
type Prop = {
  modelValue: string | string[],
  multiple: boolean,
};

const props = withDefaults(defineProps<Prop>(), {
  multiple: false,
  modelValue: ({ multiple }) => (multiple ? [] : ''),
});

type Emit = {
  (event: 'update:modelValue', payload: string | string[]): void,
}

const emit = defineEmits<Emit>();

/**
 * data and computed
 */
const windowWidth = readonly(ref(window.innerWidth));
const colCount = readonly(ref(windowWidth.value >= 680 ? 5 : 3));

type GridFields = {
  field: {
    eng: string,
    kor: string,
  },
  isSelected: boolean,
}[][];

const gridFields = computed<GridFields>(() => Object.entries(FIELDS).reduce<GridFields>((grid, [fieldEng, fieldKor], index) => {
  let isSelected: boolean;

  if (props.multiple) {
    isSelected = (props.modelValue as string[]).some((v) => v === fieldKor);
  } else {
    isSelected = (props.modelValue as string) === fieldKor;
  }

  if (index % colCount.value === 0) {
    return [
      ...grid,
      [
        {
          field: {
            eng: fieldEng,
            kor: fieldKor,
          },
          isSelected,
        },
      ],
    ];
  }

  const rowIndex = Math.floor(index / colCount.value);

  grid[rowIndex].push({
    field: {
      eng: fieldEng,
      kor: fieldKor,
    },
    isSelected,
  });

  return [...grid];
}, []));

/**
 * method
 */
const onClick = (field: string) => {
  if (props.multiple) {
    if ((props.modelValue as string[]).some(((v) => v === field))) {
      return emit('update:modelValue', (props.modelValue as string[]).filter((v) => v !== field));
    }

    return emit('update:modelValue', [...props.modelValue, field]);
  }

  if ((props.modelValue as string) === field) {
    return emit('update:modelValue', '');
  }

  return emit('update:modelValue', field);
};
</script>

<style lang="scss" scoped>
ion-row {
  flex-wrap: nowrap;
}

ion-thumbnail {
  --size: 64px;
}

.field {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ion-thumbnail {
    --border-radius: 50%;

    border: 1px solid var(--ion-color-light, #f4f5f8);

    &.selected {
      border: 3px solid var(--ion-color-primary, #3880ff);
    }
  }
}
</style>
