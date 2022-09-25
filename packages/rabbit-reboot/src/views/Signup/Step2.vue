<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/signup/step1" />
        </ion-buttons>

        <ion-title>프로필 설정</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="0.4" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-margin-bottom">경력과 희망일당을 알려주세요.</h1>
        </ion-text>

        <div class="career">
          <div class="career-label">
            <ion-text color="dark">경력<ion-text color="medium">(년)</ion-text></ion-text>
          </div>

          <van-stepper
            v-model="workerSigninStore.career"
            :min="0"
          />
        </div>

        <div class="wage">
          <div class="wage-label">
            <ion-text>희망일당<ion-text color="medium">(원)</ion-text></ion-text>
          </div>

          <ion-grid>
            <ion-row class="ion-align-items-center">
              <ion-col>
                <ion-item mode="md">
                  <ion-label mode="md" position="stacked">최소</ion-label>

                  <ion-input
                    v-model="workerSigninStore.minWage"
                    mode="md"
                    type="number"
                    placeholder="금액 입력(원)"
                  />
                </ion-item>
              </ion-col>

              <ion-col size="1" class="ion-text-center">
                <ion-text color="dark">~</ion-text>
              </ion-col>

              <ion-col>
                <ion-item mode="md">
                  <ion-label mode="md" position="stacked">최대</ion-label>

                  <ion-input
                    v-model="workerSigninStore.maxWage"
                    mode="md"
                    type="number"
                    placeholder="금액 입력(원)"
                  />
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <ion-button
          :disabled="!workerSigninStore.isCareerInputed || !workerSigninStore.isMinWageInputed || !workerSigninStore.isMaxWageInputed"
          expand="block"
          @click="() => { router.push({ name: ROUTE_NAMES.SIGNUP_STEP3 }); }"
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
  IonProgressBar, IonText, IonButton, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput,
} from '@ionic/vue';
import { Stepper as VanStepper } from 'vant';

import { useWorkerSigninStore } from '@/store';
import { ROUTE_NAMES } from '@/router';

const router = useRouter();

const workerSigninStore = useWorkerSigninStore();
</script>

<style lang="scss" scoped>
.career {
  margin-bottom: 16px;

  .career-label {
    margin-bottom: 10px;
  }
}
</style>
