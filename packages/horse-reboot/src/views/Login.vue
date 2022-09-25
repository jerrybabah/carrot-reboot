<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/onBoarding" />
        </ion-buttons>

        <ion-title>로그인 / 회원가입</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <div v-if="!clientSigninStore.isSended" class="title">
          <ion-text color="dark">
            <h1>전화번호만 입력하면 가입이 가능합니다.</h1>
          </ion-text>
        </div>

        <div class="phone-number-group">
          <ion-item class="phone-number-input" mode="md">
            <ion-label position="stacked" mode="md">전화번호</ion-label>

            <ion-input
              v-model="clientSigninStore.phoneNumber"
              mode="md"
              placeholder="- 없이 숫자만 입력해주세요."
              type="number"
            />
          </ion-item>

          <ion-button
            :disabled="!clientSigninStore.isPhoneNumberValidated || clientSigninStore.isSending || clientSigninStore.isAuthing || myStore.isLoggingIn || worksStore.isRecruitingFetching"
            expand="block"
            @click="() => {
              clientSigninStore.sendAuthNumber()
                .then(() => {
                  initTimer();
                  startTimer();
                });
            }"
          >
            <span v-if="clientSigninStore.isSended">인증문자 다시 받기 ({{ remainTime }})</span>
            <span v-else>인증문자 받기</span>
            <ion-spinner v-if="clientSigninStore.isSending" class="ion-margin-start" />
          </ion-button>
        </div>

        <div v-if="clientSigninStore.isSended" class="auth-number-group">
          <ion-item class="auth-number-input" mode="md">
            <ion-label position="stacked" mode="md">인증번호</ion-label>
            <ion-input
              v-model="clientSigninStore.authNumber"
              mode="md"
              placeholder="인증번호 숫자 6자리를 입력해주세요."
              type="number"
            />
          </ion-item>

          <div class="description">
            <ion-text color="medium">
              가입하시면
              <u @click="() => { router.push({ name: ROUTE_NAMES.PRIVACY }); }">개인정보 처리방침</u>,
              <br/>
              <u @click="() => { router.push({ name: ROUTE_NAMES.MARKETING }); }">구인&구직정보 및 마케팅 수신</u>에
              동의한 것으로 간주됩니다.
            </ion-text>
          </div>

          <ion-button
            expand="block"
            :disabled="!clientSigninStore.isAuthNumberValidated || clientSigninStore.isSending || clientSigninStore.isAuthing || myStore.isLoggingIn || worksStore.isRecruitingFetching"
            @click="() => { onClickStart() }"
          >
            동의하고 시작하기
            <ion-spinner v-if="clientSigninStore.isAuthing || myStore.isLoggingIn || worksStore.isRecruitingFetching" class="ion-margin-start" />
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonText, IonItem, IonLabel, IonInput, IonSpinner, IonButton,
} from '@ionic/vue';
import { Capacitor } from '@capacitor/core';

import { useTimer } from '@/hooks';
import { ROUTE_NAMES } from '@/router';
import { useClientSigninStore, useMyStore, useWorksStore } from '@/store';
import { addPushNotificationEventsListener } from '@/utils';

const router = useRouter();

const clientSigninStore = useClientSigninStore();

const myStore = useMyStore();

const worksStore = useWorksStore();

const {
  remainTime,
  start: startTimer,
  init: initTimer,
} = useTimer(300); // 300초 = 5분

const onClickStart = async () => {
  await clientSigninStore.authAuthNumber();

  if (clientSigninStore.isNewUser) {
    initTimer();
    router.push({ name: ROUTE_NAMES.SIGNUP });
    return;
  }

  await myStore.login(clientSigninStore.token!);

  await worksStore.fetchRecruitings();

  initTimer();

  await router.push({ name: ROUTE_NAMES.HOME });

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

.phone-number-group {
  margin-bottom: 32px;

  .phone-number-input {
    margin-bottom: 24px;
  }
}

.auth-number-group {

  .auth-number-input {
    margin-bottom: 24px;
  }

  .description {
    font-size: 12px;
    text-align: center;
    margin-bottom: 24px;
  }
}
</style>
