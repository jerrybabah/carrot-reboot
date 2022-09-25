<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img
            :src="logo"
            alt="김프로"
            width="88"
          />
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <EventsCarousel :count="3" />

      <div class="ion-padding">
        <ion-button
          @click="() => {
            if (!myStore.isLoggedIn) {
              uiStore.$patch({
                isLoginRequiredModalOpened: true,
              });

              return;
            }

            if (workCreationStore.isInputed) {
              uiStore.$patch({
                isWorkCreationModalOpened: true,
              });
              return;
            }

            router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP1 });
          }"
          expand="block"
          size="large"
          mode="md"
        >
          작업 요청서 작성하기
        </ion-button>

        <div class="ion-margin-top">
          <ion-text color="dark">
            <h1>분야별로 기술자 찾기</h1>
          </ion-text>

          <UnfoldedFieldSelect @update:model-value="(field) => router.push({ name: ROUTE_NAMES.WORKERS, query: { field } })"/>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonText,
} from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

import logo from '@/assets/logo.svg';
import { EventsCarousel, UnfoldedFieldSelect } from '@/containers';
import { ROUTE_NAMES } from '@/router';
import { useWorkCreationStore, useMyStore, useUiStore } from '@/store';

const router = useRouter();

const workCreationStore = useWorkCreationStore();

const myStore = useMyStore();

const uiStore = useUiStore();

// push noti를 통해서 앱을 켠 경우 알맞은 페이지로 라우팅시키기
const routeIfPushActionPerformed = async () => {
  if (!Capacitor.isNativePlatform()) {
    return undefined;
  }

  return new Promise<void>((resolve, reject) => {
    const actionPerformedEventHandler = PushNotifications.addListener('pushNotificationActionPerformed', ({ notification: { data } }) => {
      actionPerformedEventHandler.remove();

      if (!data.type) {
        resolve();
      }

      switch (data.type) {
        case 'apply': {
          const { workId } = data;

          if (!workId) {
            reject(new Error('apply type에 workId가 없음'));
          }

          router.push({ name: ROUTE_NAMES.RECRUITS, params: { workId } });

          uiStore.$patch({
            recruits: {
              segment: 'apply',
            },
          });

          break;
        }

        case 'chat': {
          const { workId, recruitId } = data;

          if (!workId || !recruitId) {
            reject(new Error('chat type에 workId 또는 recruitId가 없음'));
          }

          router.push({ name: ROUTE_NAMES.CHAT, params: { workId, recruitId } });

          break;
        }

        default: {
          reject(new Error(`알 수 없는 push noti data type: ${data.type}`));
        }
      }

      resolve();
    });

    setTimeout(resolve, 5000);
  });
};

onMounted(async () => {
  await myStore.waitForAutoLogin();

  if (myStore.isLoggedIn && Capacitor.isNativePlatform()) {
    routeIfPushActionPerformed();
  }
});
</script>

<style lang="scss" scoped>
</style>
