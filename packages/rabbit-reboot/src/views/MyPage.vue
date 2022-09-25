<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>마이페이지</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="user-info-wrapper">
        <div v-if="myStore.currentUser" class="user-info">
          <ion-thumbnail class="profile-image">
            <ion-img
              :src="myStore.currentUser.profileImage ? getResizedImageUrl(myStore.currentUser.profileImage) : defaultProfileImage"
              @ion-error="onError($event, myStore.currentUser?.profileImage || '')"
            />
          </ion-thumbnail>

          <div class="name-wrapper">
            <div class="name">
              <ion-text color="dark">
                {{ myStore.currentUser.name }}
              </ion-text>
            </div>

            <div class="edit-btn-wrapper">
              <ion-button
                fill="clear"
                size="small"
                color="medium"
                @click="() => {
                  if (!myStore.currentUser) {
                    return;
                  }

                  workerModificationStore.init(myStore.currentUser);

                  router.push({ name: ROUTE_NAMES.WORKER_MODIFICATION });
                }"
              >
                <ion-icon slot="icon-only" :icon="pencil" />
              </ion-button>
            </div>
          </div>

          <div class="specialties">
            <ion-chip
              v-for="(specialty, index) in myStore.currentUser.specialties"
              :key="index"
              class="specialty"
              color="primary"
            >
              {{ specialty }}
            </ion-chip>
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
        <ion-item v-if="myStore.isLoggedIn" button @click="() => { router.push({ name: ROUTE_NAMES.PORTFOLIOS }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="albumsOutline" color="primary" />
            <ion-text color="dark">포트폴리오 관리</ion-text>
          </ion-label>
        </ion-item>

        <ion-item v-if="myStore.isLoggedIn" button @click="() => { router.push({ name: ROUTE_NAMES.REVIEWS }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="chatboxEllipsesOutline" color="primary" />
            <ion-text color="dark">내게 달린 후기 목록</ion-text>
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
  IonList, IonItem, IonIcon, IonLabel, IonText, IonThumbnail, IonImg, IonChip,
} from '@ionic/vue';
import {
  pencil, albumsOutline, chatboxEllipsesOutline, earOutline, settingsOutline, megaphoneOutline,
} from 'ionicons/icons';

import { useMyStore, useWorkerModificationStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import defaultProfileImage from '@/assets/profileImage.svg';
import { getResizedImageUrl } from '@/utils';

const router = useRouter();

const myStore = useMyStore();

const workerModificationStore = useWorkerModificationStore();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};
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
    align-items: center;

    .profile-image {
      --size: 100px;
      margin-bottom: 8px;
      border: 1px solid var(--ion-color-light);
      border-radius: 50%;
      overflow: hidden;
    }

    .name-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-bottom: 8px;

      .name {
        font-size: 1.2em;
        margin-right: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        ion-text {
          white-space: nowrap;
        }
      }

      .edit-btn-wrapper {
        ion-button {
          --padding-start: 0;
          --padding-end: 0;
          height: unset;
          font-size: 10px;
        }
      }
    }

    .specialties {
      max-width: 256px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .specialty {
        margin: 0 4px 4px 4px;
        padding: 0 8px;
        height: 24px;
        font-size: 12px;
        flex-shrink: 0;
      }
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
