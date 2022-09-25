<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/signup/step2" />
        </ion-buttons>

        <ion-title>프로필 설정</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="0.6" />

      <div class="ion-padding-vertical">
        <ion-text>
          <h1 class="ion-padding-horizontal">시공 가능 지역을 선택해주세요.</h1>
        </ion-text>

        <div class="selected-districts">
          <ion-chip
            v-for="(district, index) in workerSigninStore.districts"
            :key="index"
            class="selected-district"
            color="primary"
          >
            <ion-label>
              {{ district.replace('/', ' ') }}
            </ion-label>

            <ion-icon
              :icon="closeCircle"
              @click="() => {
                workerSigninStore.districts.splice(index, 1);
              }"
            />
          </ion-chip>
        </div>

        <DistrictSelect
          class="district-select"
          v-model="workerSigninStore.districts"
          :multipl="true"
          :all-selectable="true"
          :header="false"
        />

        <ion-button
          class="ion-padding-horizontal"
          :disabled="!workerSigninStore.isDistrictsSelected"
          expand="block"
          @click="() => { router.push({ name: ROUTE_NAMES.SIGNUP_STEP4 }) }"
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
  IonProgressBar, IonText, IonButton, IonChip, IonIcon, IonLabel,
} from '@ionic/vue';
import { closeCircle } from 'ionicons/icons';

import { DistrictSelect } from '@/containers';
import { useWorkerSigninStore } from '@/store';
import { ROUTE_NAMES } from '@/router';

const router = useRouter();

const workerSigninStore = useWorkerSigninStore();
</script>

<style lang="scss" scoped>
.selected-districts {
  padding: 8px;
  background-color: var(--ion-color-light);
  min-height: 48px;
  max-height: 112px;
  overflow: scroll;

  .selected-district {
    padding: 0 8px;
    height: 24px;
    font-size: 12px;
  }
}

.district-select {
  margin-bottom: 16px;
  border: 1px solid var(--ion-color-light)
}
</style>
