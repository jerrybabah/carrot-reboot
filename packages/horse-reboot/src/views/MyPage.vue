<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>마이페이지</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="user-info-wrapper">
        <div v-if="myStore.isLoggedIn" class="user-info">
          <div class="user-name-wrapper">
            <div class="user-name">
              <ion-text color="dark">
                {{ myStore.currentUser?.name || '사용자' }}님
              </ion-text>
            </div>

            <div class="user-edit-btn-wrapper">
              <ion-button
                fill="clear"
                size="small"
                color="medium"
                @click="() => {
                  if (!myStore.currentUser) {
                    return;
                  }

                  clientModificationStore.init(myStore.currentUser)
                  router.push({ name: ROUTE_NAMES.CLIENT_MODIFICATION });
                }"
              >
                <ion-icon slot="icon-only" :icon="pencil" />
              </ion-button>
            </div>
          </div>

          <div class="phone-number">
            <ion-text color="medium">
              {{ myStore.currentUser?.phoneNumber.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3') || '010-0000-0000' }}
            </ion-text>
          </div>
        </div>

        <div v-else class="login-btn-wrapper">
          <ion-button
            expand="block"
            @click="() => {
              router.push({ name: ROUTE_NAMES.LOGIN });
            }"
          >
            로그인 하러가기
          </ion-button>
        </div>
      </div>

      <ion-list>
        <ion-item v-if="myStore.isLoggedIn" button @click="() => { router.push({ name: ROUTE_NAMES.FAVORITES }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="heartOutline" color="primary" />
            <ion-text color="dark">즐겨찾는 기술자 목록</ion-text>
          </ion-label>
        </ion-item>

        <ion-item v-if="myStore.isLoggedIn" button @click="() => { router.push({ name: ROUTE_NAMES.REVIEWS }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="chatboxEllipsesOutline" color="primary" />
            <ion-text color="dark">작성한 후기 목록</ion-text>
          </ion-label>
        </ion-item>

        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.SERVICE_CENTER }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="earOutline" color="primary" />
            <ion-text color="dark">고객센터</ion-text>
          </ion-label>
        </ion-item>

        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.SETTINGS }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="settingsOutline" color="primary" />
            <ion-text color="dark">환경설정</ion-text>
          </ion-label>
        </ion-item>

        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.REPORT }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="megaphoneOutline" color="primary" />
            <ion-text color="dark">신고</ion-text>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonList, IonItem, IonIcon, IonLabel, IonText,
} from '@ionic/vue';
import {
  pencil, heartOutline, chatboxEllipsesOutline, earOutline, settingsOutline, megaphoneOutline,
} from 'ionicons/icons';

import { useMyStore, useClientModificationStore } from '@/store';
import { ROUTE_NAMES } from '@/router';

const router = useRouter();

const myStore = useMyStore();

const clientModificationStore = useClientModificationStore();
</script>

<style lang="scss" scoped>
.user-info-wrapper {
  width: 100%;
  min-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: var(--ion-color-light);

  .user-info {
    width: 100%;
    display: flex;
    flex-direction: column;

    .user-name-wrapper {
      display: flex;
      align-items: center;

      .user-name {
        font-size: 1.6em;
        margin-right: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        ion-text {
          white-space: nowrap;
        }
      }

      .user-edit-btn-wrapper {

        ion-button {
          --padding-start: 0;
          --padding-end: 0;
          height: unset;
          font-size: 12px;
        }
      }
    }

    .phone-number {
      font-size: 0.9em;
    }
  }

  .login-btn-wrapper {
    width: 100%;
  }
}

.menu-item-content {
  display: flex;
  align-items: center;

  .menu-item-icon {
    margin-right: 6px;
  }
}
</style>
