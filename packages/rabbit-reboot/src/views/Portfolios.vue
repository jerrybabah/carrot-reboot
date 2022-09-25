<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/myPage" />
        </ion-buttons>

        <ion-title>
          포트폴리오 관리
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <PortfolioList />

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button
          @click="() => {
            if (!myStore.isLoggedIn) {
              return;
            }

            if (portfolioCreationStore.isInputed) {
              setPortfolioModalOpen(true);
              return;
            }

            router.push({ name: ROUTE_NAMES.PORTFOLIO_CREATION });
          }"
        >
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <ion-modal
        css-class="portfolio-creation-modal"
        :is-open="isPortfolioModalOpened"
        @didDismiss="() => {
          setPortfolioModalOpen(false);
        }"
      >
        <div class="modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              임시 저장된 포트폴리오가 있습니다. <br/> 이어서 작성하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="() => {
                setPortfolioModalOpen(false);

                router.push({ name: ROUTE_NAMES.PORTFOLIO_CREATION });
              }"
            >
              이어서 작성하기
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              @click="() => {
                portfolioCreationStore.$reset();

                setPortfolioModalOpen(false);

                router.push({ name: ROUTE_NAMES.PORTFOLIO_CREATION });
              }"
            >
              새로 작성하기
            </ion-button>
          </div>
        </div>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonFab, IonFabButton, IonIcon, IonModal,
} from '@ionic/vue';
import { add } from 'ionicons/icons';

import { PortfolioList } from '@/containers';
import { useMyStore, usePortfolioCreationStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import { useModal } from '@/hooks';

const router = useRouter();

const myStore = useMyStore();

const portfolioCreationStore = usePortfolioCreationStore();

const {
  isOpened: isPortfolioModalOpened,
  setOpen: setPortfolioModalOpen,
} = useModal();
</script>

<style lang="scss" scoped>
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
