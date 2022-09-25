<template>
  <ion-app>
    <div v-if="myStore.isAutoLoggingIn" class="spinner-wrapper">
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
      css-class="contact-modal"
      :is-open="uiStore.isContactModalOpened"
      @didDismiss="() => {
        uiStore.$patch({
          isContactModalOpened: false,
        });
      }"
    >
      <div class="contact-modal-content">
        <ion-button
          fill="clear"
          @click="() => { openCall(); }"
        >
          <div class="button-inner">
            <ion-text class="icon" color="primary">
              <ion-icon :icon="call" />
            </ion-text>

            <ion-text class="label" color="dark">
              전화걸기
            </ion-text>
          </div>
        </ion-button>

        <ion-button
          fill="clear"
          @click="() => { openChat(); }"
        >
          <div class="button-inner">
            <ion-text class="icon" color="primary">
              <ion-icon :icon="chatboxEllipses" />
            </ion-text>

            <ion-row class="ion-align-items-center">
              <ion-text class="label" color="dark">
                채팅하기
              </ion-text>
              <noti-badge v-if="jobSearchStore.selectedRecruit?.haveUnreadChatsByWorker" />
            </ion-row>
          </div>
        </ion-button>
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
  IonApp, IonRouterOutlet, IonSpinner, IonModal, IonButton, IonText, IonIcon, IonRow,
  useBackButton, useIonRouter,
} from '@ionic/vue';
import { Popup as VanPopup } from 'vant';
import { call, chatboxEllipses } from 'ionicons/icons';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Deploy } from 'cordova-plugin-ionic';

import { useMyStore, useUiStore, useJobSearchStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import { NotiBadge } from '@/components';

const router = useRouter();
const route = useRoute();

const myStore = useMyStore();

const uiStore = useUiStore();

const jobSearchStore = useJobSearchStore();

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

const openCall = () => {
  if (jobSearchStore.isSelected) {
    window.open(`tel:${jobSearchStore.selectedRecruit!.client.phoneNumber}`, '_self');
  }
};

const openChat = () => {
  if (jobSearchStore.isSelected) {
    uiStore.$patch({
      isContactModalOpened: false,
    });

    router.push({ name: ROUTE_NAMES.CHAT, params: { recruitId: jobSearchStore.selectedRecruit!.id } });
  }
};

onMounted(async () => {
  await myStore.autoLogin();

  if (myStore.isLoggedIn && Capacitor.isNativePlatform()) {
    myStore.updateRegistrationTokenIfChanged(); // 비동기
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
.login-required-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 180px;
}

.apply-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.contact-modal {
  --height: 200px;

  align-items: flex-end;
}

.portfolio-creation-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.portfolio-modification-confirm-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.portfolio-delete-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.worker-modification-leave-confirm-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 240px;
}

.district-modification-modal {
  --height: 60vh;

  align-items: flex-end;
}

.inactive-modal {
  --width: 80%;
  --min-width: 250px;
  --max-width: 600px;
  --height: 180px;
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

.contact-modal-content {
  height: 100%;
  display: flex;
  align-items: center;

  ion-button {
    height: 100%;
    flex-grow: 1;

    .button-inner {
      display: flex;
      flex-direction: column;

      .icon {
        font-size: 52px;
      }

      .label {
        font-size: 20px;
        font-weight: 600;
      }
    }
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
