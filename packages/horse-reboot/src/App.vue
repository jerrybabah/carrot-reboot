<template>
  <ion-app>
    <div v-if="myStore.isAutoLoggingIn || worksStore.isRecruitingFetching" class="spinner-wrapper">
      <ion-spinner />
    </div>

    <ion-router-outlet v-else />

    <ion-modal
      css-class="login-required-modal"
      :is-open="uiStore.isLoginRequiredModalOpened"
      @didDismiss="() => {
        uiStore.$patch({
          isLoginRequiredModalOpened: false,
        });
      }"
    >
      <div class="login-required-modal-content">
        <div class="description">
          <ion-text color="dark">
            <h3 class="ion-no-margin">로그인을 먼저 해주세요.</h3>
          </ion-text>
        </div>

        <ion-button
          expand="block"
          @click="() => {
            uiStore.$patch({
              isLoginRequiredModalOpened: false,
            });

            router.push({ name: ROUTE_NAMES.LOGIN });
          }"
        >
          로그인
        </ion-button>
      </div>
    </ion-modal>

    <ion-modal
      css-class="work-creation-modal"
      :is-open="uiStore.isWorkCreationModalOpened"
      @didDismiss="() => {
        uiStore.$patch({
          isWorkCreationModalOpened: false,
        });
      }"
    >
      <div class="work-creation-modal-content">
        <div class="description">
          <ion-text color="dark">
            임시 저장된 작업 요청서가 있습니다. <br/> 이어서 작성하시겠습니까?
          </ion-text>
        </div>

        <div class="actions">
          <ion-button
            expand="block"
            @click="() => {
              uiStore.$patch({
                isWorkCreationModalOpened: false,
              });

              router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP1 });
            }"
          >
            이어서 작성하기
          </ion-button>

          <ion-button
            expand="block"
            fill="outline"
            @click="() => {
              workCreationStore.initInputs();

              uiStore.$patch({
                isWorkCreationModalOpened: false,
              });

              router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP1 });
            }"
          >
            새로 작성하기
          </ion-button>
        </div>
      </div>
    </ion-modal>

    <van-popup
      v-model:show="hasUpdate"
      :close-on-click-overlay="false"
    >
      <div class="update-content">
        <div class="update-description">
          <ion-text color="dark">
            <span v-if="!isDownloading">새로운 업데이트가 있습니다. 확인을 눌러 설치를 시작합니다.</span>
            <span v-else>
              <span>{{ downloadProgress }}% 설치 완료.</span>
              <span v-if="isCompleted"><br/>앱을 재시작합니다. 잠시만 기다려주세요.</span>
            </span>
          </ion-text>
        </div>

        <div class="btn-wrapper">
          <ion-button
            expand="block"
            :disabled="isDownloading"
            @click="onClickDownload"
          >
            확인
          </ion-button>
        </div>
      </div>
    </van-popup>
  </ion-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonApp, IonRouterOutlet, IonSpinner, IonModal, IonText, IonButton,
  useBackButton, useIonRouter,
} from '@ionic/vue';
import { Popup as VanPopup } from 'vant';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Deploy } from 'cordova-plugin-ionic';

import {
  useMyStore, useWorksStore, useUiStore, useWorkCreationStore,
} from '@/store';
import { ROUTE_NAMES } from '@/router';

const router = useRouter();
const route = useRoute();

const myStore = useMyStore();

const worksStore = useWorksStore();

const uiStore = useUiStore();

const workCreationStore = useWorkCreationStore();

const hasUpdate = ref(false);

const isDownloading = ref(false);

const downloadProgress = ref(0);

const isCompleted = ref(false);

const onClickDownload = async () => {
  isDownloading.value = true;

  try {
    await Deploy.downloadUpdate((progress) => {
      if (!progress) {
        return;
      }

      downloadProgress.value = progress;

      if (progress === 100) {
        isCompleted.value = true;
      }
    });

    await Deploy.extractUpdate();

    await Deploy.reloadApp();
  } catch (e) {
    console.log(e);
    hasUpdate.value = false;
  } finally {
    isDownloading.value = false;
  }
};

onMounted(async () => {
  await myStore.autoLogin();

  if (myStore.isLoggedIn) {
    if (Capacitor.isNativePlatform()) {
      myStore.updateRegistrationTokenIfChanged(); // 비동기
    }

    await worksStore.fetchRecruitings();
  }

  if (Capacitor.isNativePlatform()) {
    const update = await Deploy.checkForUpdate();

    if (update.available) {
      hasUpdate.value = true;
    }
  }
});

if (Capacitor.getPlatform() === 'android') {
  const ionRouter = useIonRouter();

  useBackButton(-1, () => {
    if (
      route.name === ROUTE_NAMES.ON_BOARDING
      || (!ionRouter.canGoBack() && route.name === ROUTE_NAMES.HOME)
    ) {
      App.exitApp();
    }
  });
}
</script>

<style lang="scss">
.district-modal {
  --height: 60vh;

  align-items: flex-end;
}

.work-creation-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.work-selection-modal {
  --width: 80%;
  --height: 80%;
  --min-height: 240px;
  --max-height: 550px;
}

.login-required-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 180px;
}

.contact-modal {
  --height: 200px;

  align-items: flex-end;
}

.contract-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.contract-work-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.review-leave-confirm-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.work-modification-leave-confirm-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.review-delete-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.review-modification-leave-confirm-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.client-modification-leave-confirm-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.district-modification-modal {
  --height: 60vh;

  align-items: flex-end;
}
</style>

<style lang="scss" scoped>
.spinner-wrapper {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-required-modal-content {
  padding: 0 16px;
  padding-bottom: 22px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .description {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.work-creation-modal-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .description {
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

.update-content {
  min-width: 250px;
  max-width: 600px;
  height: 180px;
  display: flex;
  flex-direction: column;

  .update-description {
    flex-grow: 1;
    padding: 8px 16px;
    display: flex;
    align-items: center;
  }

  .btn-wrapper {
    flex-grow: 0;
    padding: 8px;
  }
}
</style>
