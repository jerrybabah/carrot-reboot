<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/createWork/step3" />
        </ion-buttons>

        <ion-title>작업 요청서 작성</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="0.8" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-margin-bottom">필요한 인력 정보를 알려주세요.</h1>
        </ion-text>

        <div class="worker-info">
          <ion-text class="count" color="dark">
            <h3 class="ion-no-margin">{{ workCreationStore.requriedWorkerCount }}명</h3>
          </ion-text>

          <RequiredWorkersForm
            v-model="workCreationStore.requiredWorkers"
          />

        </div>

        <div class="ion-text-end ion-margin-bottom">
          <ion-text color="dark">
            <ion-text color="medium">총 금액</ion-text> {{ currencyFormatter(workCreationStore.totalCost) }}
          </ion-text>
        </div>

        <ion-button
          :disabled="!workCreationStore.isRequiredWorkersInputed"
          expand="block"
          @click="() => { router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP5 }) }"
        >
          다음
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton, IonProgressBar, IonText,
} from '@ionic/vue';

import { ROUTE_NAMES } from '@/router';
import { RequiredWorkersForm } from '@/containers';
import { useWorkCreationStore } from '@/store';

const router = useRouter();

const workCreationStore = useWorkCreationStore();

const currencyFormatter = (cost: number): string => {
  const formatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  });

  return `${formatter.format(cost).slice(1)}원`;
};
</script>

<style lang="scss" scoped>
.worker-info {
  margin-bottom: 16px;
}
</style>
