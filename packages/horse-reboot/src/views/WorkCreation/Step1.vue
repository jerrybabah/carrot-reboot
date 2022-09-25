<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/home" />
        </ion-buttons>

        <ion-title>작업 요청서 작성</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="0.2" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1>원하는 시공분야를 선택해주세요.</h1>
        </ion-text>

        <UnfoldedFieldSelect
          class="ion-margin-bottom"
          v-model="workCreationStore.field"
          @update:modelValue="(payload) => {
            if (payload !== '') {
              router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP2 });
            }
          }"
        />
        <ion-button
          :disabled="!workCreationStore.isFieldSelected"
          expand="block"
          @click="() => { router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP2 }) }"
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
import { UnfoldedFieldSelect } from '@/containers';
import { useWorkCreationStore } from '@/store';

const router = useRouter();

const workCreationStore = useWorkCreationStore();
</script>

<style lang="scss" scoped>
</style>
