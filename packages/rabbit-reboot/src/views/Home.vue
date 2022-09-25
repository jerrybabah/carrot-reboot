<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img
            :src="logo"
            alt="김프로"
            width="88"
          >
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <EventsCarousel :count="3" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1>분야별로 일자리 찾기</h1>
        </ion-text>

        <UnfoldedFieldSelect
          @update:model-value="(field) => {
            router.push({ name: ROUTE_NAMES.WORKS, query: { field } });
          }"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText,
} from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

import logo from '@/assets/logo.svg';
import { EventsCarousel, UnfoldedFieldSelect } from '@/containers';
import { ROUTE_NAMES } from '@/router';
import { useMyStore } from '@/store';

const router = useRouter();

const myStore = useMyStore();

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
        case 'offer': {
          // TODO: 구직현황 페이지, 내게 요청한 탭 이동
          break;
        }

        case 'accept': {
          // TODO: 구직현황 페이지, 내가 지원한 탭 이동
          break;
        }

        case 'contract': {
          // TODO: 구직현황 페이지, 체결된 일자리 탭 이동
          break;
        }

        case 'workCreation': {
          const { workId } = data;

          if (!workId) {
            reject(new Error('workCreation type에 workId가 없음'));
          }

          router.push({ name: ROUTE_NAMES.WORK, params: { workId } });

          break;
        }

        case 'reviewCreation': {
          router.push({ name: ROUTE_NAMES.REVIEWS });

          break;
        }

        case 'chat': {
          const { recruitId } = data;

          if (!recruitId) {
            reject(new Error('chat type에 recruitId가 없음'));
          }

          router.push({ name: ROUTE_NAMES.CHAT, params: { recruitId } });

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
