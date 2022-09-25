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
      <div class="ion-padding">
        <div class="title">
          <ion-text color="dark">
            <h1>서비스에서 이용하실 이름을 입력해주세요.</h1>
          </ion-text>
        </div>

        <ion-item class="name-input" mode="md">
          <ion-label position="stacked" mode="md">이름</ion-label>

          <ion-input
            v-model="clientSigninStore.name"
            mode="md"
            placeholder="이름을 입력해주세요."
          />
        </ion-item>

        <ion-button
          :disabled="!clientSigninStore.isNameInputed || clientSigninStore.isCreatingClient || myStore.isLoggingIn || isNavigating"
          expand="block"
          @click="() => { onClickStart(); }"
        >
          완료
          <ion-spinner v-if="clientSigninStore.isCreatingClient || myStore.isLoggingIn || isNavigating" class="ion-margin-start" />
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonText, IonItem, IonLabel, IonInput, IonButton, IonSpinner,
} from '@ionic/vue';
import { Capacitor } from '@capacitor/core';

import { useClientSigninStore, useMyStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import { addPushNotificationEventsListener } from '@/utils';

const router = useRouter();

const clientSigninStore = useClientSigninStore();

const myStore = useMyStore();

const isNavigating = ref(false);

const onClickStart = async () => {
  clientSigninStore.$patch({
    isCreatingClient: true,
  });

  myStore.$patch({
    isLoggingIn: true,
  });

  isNavigating.value = true;

  await clientSigninStore.createClient();

  await myStore.login(clientSigninStore.token!);

  await router.push({ name: ROUTE_NAMES.HOME });

  isNavigating.value = false;

  if (Capacitor.isNativePlatform()) {
    myStore.updateRegistrationTokenIfChanged(); // 비동기
    addPushNotificationEventsListener();
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 32px;
}

.name-input {
  margin-bottom: 24px;
}
</style>
