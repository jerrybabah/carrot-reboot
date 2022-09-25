<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/createWork/step2" />
        </ion-buttons>

        <ion-title>작업 요청서 작성</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="0.6" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-margin-bottom">시공 현장 주소를 알려주세요.</h1>
        </ion-text>

        <ion-list>
          <ion-item
            :class="{ 'item-has-focus': isDistrictModalOpened }"
            mode="md"
            @click="onDistrictInputClick"
          >
            <ion-label mode="md" position="stacked">지역</ion-label>
            <ion-input
              :value="workCreationStore.parsedDistrict.beautifiedDistrict"
              readonly
              mode="md"
              placeholder="지역 선택"
            />
          </ion-item>

          <ion-modal
            css-class="district-modal"
            :is-open="isDistrictModalOpened"
            @didDismiss="setDistrictModalOpen(false)"
          >
            <div class="modal-content">
              <ion-button
                class="close-modal"
                fill="clear"
                color="dark"
                @click="setDistrictModalOpen(false)"
              >
                <ion-icon slot="icon-only" :icon="closeOutline" />
              </ion-button>

              <DistrictSelect
                v-model="workCreationStore.district"
                @update:model-value="(payload) => { setDistrictModalOpen(false) }"
                clearable
              />
            </div>
          </ion-modal>

          <ion-item class="ion-margin-bottom" mode="md">
            <ion-label mode="md" position="stacked">상세 주소</ion-label>
            <ion-input
              v-model="workCreationStore.addressDetail"
              ref="addressDetailInput"
              mode="md"
              placeholder="상세 주소 입력"
            />
          </ion-item>
        </ion-list>

        <ion-button
          :disabled="!workCreationStore.isDistrictSelected"
          expand="block"
          @click="() => { router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP4 }) }"
        >
          다음
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton, IonProgressBar, IonText, IonList, IonItem, IonLabel, IonInput, IonModal,
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';

import { ROUTE_NAMES } from '@/router';
import { DistrictSelect } from '@/containers';
import { useModal } from '@/hooks';
import { useWorkCreationStore } from '@/store';

const router = useRouter();

const workCreationStore = useWorkCreationStore();

const {
  isOpened: isDistrictModalOpened,
  setOpen: setDistrictModalOpen,
} = useModal();

const onDistrictInputClick = (e: any) => {
  setDistrictModalOpen(true);
};

onMounted(() => {
  setDistrictModalOpen(true);
});
</script>

<style lang="scss" scoped>
.modal-content {
  position: relative;

  .close-modal {
    --padding-start: 0;
    --padding-end: 0;

    position: absolute;
    top: 0;
    right: 8px;
    height: 40px;
    margin: 0;
  }
}
</style>
