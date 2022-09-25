<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/myPage" />
        </ion-buttons>

        <ion-title>프로필 수정</ion-title>

        <ion-buttons slot="end">
          <ion-button
            :disabled="!clientModificationStore.isChanged || !clientModificationStore.isCompleted"
            @click="onClickSubmit"
          >
            완료
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding ion-margin-vertical">
        <ion-list>
          <ion-item class="name">
            <ion-label position="stacked">
              이름
            </ion-label>

            <ion-input
              v-model="clientModificationStore.name"
            />
          </ion-item>
        </ion-list>
      </div>

      <ion-modal
        css-class="client-modification-leave-confirm-modal"
        :is-open="uiStore.isClientModificationLeaveConfirmModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isClientModificationLeaveConfirmModalOpened: false,
          });
        }"
      >
        <div class="modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              수정 중인 내용이 삭제됩니다. 프로필 수정을 그만하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="() => {
                uiStore.$patch({
                  isClientModificationLeaveConfirmModalOpened: false,
                });

                clientModificationStore.$reset();

                router.back();
              }"
            >
              확인
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              @click="() => {
                uiStore.$patch({
                  isClientModificationLeaveConfirmModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="clientModificationStore.isUpdating"
        message="수정중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonInput, IonModal, IonLoading,
} from '@ionic/vue';

import { useClientModificationStore, useUiStore } from '@/store';

const router = useRouter();

const clientModificationStore = useClientModificationStore();

const uiStore = useUiStore();

const onClickSubmit = async () => {
  await clientModificationStore.updateClient();

  clientModificationStore.$reset();

  router.back();
};
</script>

<style lang="scss" scoped>
.name {
  --padding-start: 0;
}

.modal-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .modal-description {
    text-align: center;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
  }

  .actions {
    width: 100%
  }
}
</style>
