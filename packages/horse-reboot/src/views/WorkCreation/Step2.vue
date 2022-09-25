<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/createWork/step1" />
        </ion-buttons>

        <ion-title>작업 요청서 작성</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="0.4" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-margin-bottom">시공 <ion-text color="success">{{ selectionGuideline }}</ion-text>을 선택해주세요.</h1>
        </ion-text>

        <van-calendar
          ref="calendarTemp"
          class="calendar ion-margin-bottom"
          type="range"
          allow-same-day
          :poppable="false"
          :show-confirm="false"
          :show-title="false"
          :show-subtitle="false"
          :show-mark="false"
          @select="onSelect"
          @confirm="onConfirm"
        />

        <ion-button
          expand="block"
          :disabled="!workCreationStore.isStartDateSelected || !workCreationStore.isEndDateSelected"
          @click="() => { router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP3 }) }"
        >
          다음
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton, IonProgressBar, IonText,
} from '@ionic/vue';
import { Calendar as VanCalendar } from 'vant';

import { ROUTE_NAMES } from '@/router';
import { useWorkCreationStore } from '@/store';

const calendarTemp = ref<any>(null);

const router = useRouter();

const workCreationStore = useWorkCreationStore();

const selectionGuideline = computed<string>(() => {
  if (!workCreationStore.isStartDateSelected && !workCreationStore.isEndDateSelected) {
    return '시작일';
  }

  if (workCreationStore.isStartDateSelected && !workCreationStore.isEndDateSelected) {
    return '종료일';
  }

  if (workCreationStore.isStartDateSelected && workCreationStore.isEndDateSelected) {
    return '시작일';
  }

  return '작업일'; // 예상치 못한 상황: 시작일은 없는데, 종료일이 있음
});

const onSelect = (selectedDates: Date[]) => {
  if (selectedDates.length === 1) {
    [workCreationStore.startDate] = selectedDates;
    workCreationStore.endDate = null;
  }
};

const onConfirm = ([start, end]: Date[]) => {
  workCreationStore.startDate = start;
  workCreationStore.endDate = end;

  router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP3 });
};

onMounted(() => {
  if (!workCreationStore.isStartDateSelected && !workCreationStore.isEndDateSelected) {
    calendarTemp.value.reset(null);
    return;
  }

  if (workCreationStore.isStartDateSelected && !workCreationStore.isEndDateSelected) {
    calendarTemp.value.reset([workCreationStore.startDate!]);
    return;
  }

  if (workCreationStore.isStartDateSelected && workCreationStore.isEndDateSelected) {
    calendarTemp.value.reset([workCreationStore.startDate!, workCreationStore.endDate!]);
    return;
  }

  calendarTemp.value.reset(null);
});
</script>

<style lang="scss" scoped>
.calendar {
  height: 458px;
  border: 1px solid var(--ion-color-light);
}
</style>
