<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/login" />
        </ion-buttons>

        <ion-title>프로필 설정</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="0.2" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1>전문분야를 선택해주세요. <ion-text color="medium">(다중선택)</ion-text> </h1>
        </ion-text>

        <UnfoldedFieldSelect
          class="ion-margin-bottom"
          v-model="workerSigninStore.specialties"
          :multiple="true"
        />

        <ion-button
          :disabled="!workerSigninStore.isSpecialtiesSelected"
          expand="block"
          @click="() => { router.push({ name: ROUTE_NAMES.SIGNUP_STEP2 }); }"
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
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonProgressBar, IonText, IonButton,
} from '@ionic/vue';

import { UnfoldedFieldSelect } from '@/containers';
import { useWorkerSigninStore } from '@/store';
import { ROUTE_NAMES } from '@/router';

const router = useRouter();

const workerSigninStore = useWorkerSigninStore();
</script>

<style lang="scss" scoped>
</style>
