<template>
  <van-empty v-if="!myStore.isLoggedIn" description="잘못된 접근입니다. 로그인을 먼저 해주세요." />

  <div v-else>
    <ion-progress-bar v-if="portfoliosStore.isFirstFetching" type="indeterminatec" />

    <div v-else class="list">
      <van-empty v-if="portfoliosStore.isEmpty" image="error" description="등록한 포트폴리오가 없습니다." />

      <van-cell-group
        class="portfolio"
        v-else
        v-for="(portfolio, index) in portfoliosStore.portfolios"
        :key="index"
      >
        <van-cell value-class="content">
          <div class="images">
            <ion-thumbnail
              v-for="(image, index) in portfolio.images"
              :key="index"
              class="image"
              @click="() => { ImagePreview({ images: portfolio.images, startPosition: index, closeable: true }) }"
            >
              <ion-img
                :src="image ? getResizedImageUrl(image) : defaultProfileImage"
                @ion-error="onError($event, image)"
              />
            </ion-thumbnail>
          </div>

          <div v-if="portfolio.description" class="description">
            <ion-text color="dark">
              {{ portfolio.description }}
            </ion-text>
          </div>
        </van-cell>

        <van-cell
          class="action"
          title-class="edit"
          value-class="remove"
        >
          <template #title>
            <ion-button
              fill="clear"
              size="small"
              expand="full"
              @click="() => {
                portfoliosStore.selectPortfolio(portfolio);
                portfolioModificationStore.init(portfolio);

                router.push({ name: ROUTE_NAMES.PORTFOLIO_MODIFICATION, params: { portfolioId: portfolio.id } });
              }"
            >
              수정
            </ion-button>
          </template>

          <template #value>
            <ion-button
              fill="clear"
              size="small"
              expand="full"
              @click="() => {
                portfoliosStore.selectPortfolio(portfolio);
                setDeleteModalOpen(true);
              }"
            >
              삭제
            </ion-button>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>

  <ion-modal
    css-class="portfolio-delete-modal"
    :is-open="isDeleteModalOpened"
    @didDismiss="() => {
      setDeleteModalOpen(false);
      portfoliosStore.selectPortfolio(null);
    }"
  >
    <div class="modal-content">
      <div class="modal-description">
        <ion-text color="dark">
          선택하신 포트폴리오를 삭제하시겠습니까?
        </ion-text>
      </div>

      <div class="actions">
        <ion-button
          expand="block"
          @click="onClickDelete"
        >
          확인
        </ion-button>

        <ion-button
          expand="block"
          fill="outline"
          @click="() => {
            setDeleteModalOpen(false);
            portfoliosStore.selectPortfolio(null);
          }"
        >
          취소
        </ion-button>
      </div>
    </div>
  </ion-modal>

  <ion-loading
    :is-open="isDeleting"
    message="삭제중..."
  />

  <ion-infinite-scroll
    :disabled="portfoliosStore.isInfiniteDisabled"
    threhold="100px"
    @ion-infinite="infiniteFetch"
  >
    <ion-infinite-scroll-content />
  </ion-infinite-scroll>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonProgressBar, IonInfiniteScroll, IonInfiniteScrollContent, IonModal, IonLoading, IonThumbnail, IonImg,
  IonButton, IonText,
} from '@ionic/vue';
import {
  CellGroup as VanCellGroup, Cell as VanCell, Empty as VanEmpty, ImagePreview,
} from 'vant';

import { deleteWorkerPortfolio } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { usePortfoliosStore, useMyStore, usePortfolioModificationStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import { useModal } from '@/hooks';
import { toast, getResizedImageUrl } from '@/utils';
import defaultProfileImage from '@/assets/profileImage.svg';

const router = useRouter();

const portfoliosStore = usePortfoliosStore();

const myStore = useMyStore();

const portfolioModificationStore = usePortfolioModificationStore();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const {
  isOpened: isDeleteModalOpened,
  setOpen: setDeleteModalOpen,
} = useModal();

const isDeleting = ref(false);

const infiniteFetch = async (e: CustomEvent) => {
  try {
    await portfoliosStore.fetchPortfolios();
  } finally {
    (e.target as any).complete();
  }
};

const onClickDelete = async () => {
  if (!myStore.isLoggedIn || !portfoliosStore.isSelected) {
    return;
  }

  isDeleting.value = true;

  try {
    await deleteWorkerPortfolio(
      myStore.currentUser!.id,
      portfoliosStore.selectedPorfolio!.id,
    );
  } catch (e) {
    console.log(e);
    toast('포트폴리오 삭제에 실패했습니다. 다시 시도해주세요.');
    return;
  } finally {
    isDeleting.value = false;
  }

  portfoliosStore.$reset();
  portfoliosStore.fetchPortfolios(); // async

  setDeleteModalOpen(false);
};

onMounted(async () => {
  if (myStore.isLoggedIn) {
    await portfoliosStore.fetchPortfolios();
  }
});
</script>

<style lang="scss" scoped>
.list {
  padding-top: 8px;

  .portfolio {
    margin-bottom: 16px;

    & :deep(.content) {

      .images {
        display: flex;
        overflow: scroll;
        margin-bottom: 12px;

        &::-webkit-scrollbar {
          display: none;
        }

        .image {
          --size: 60px;

          flex-shrink: 0;
          margin-right: 12px;
          border: 1px solid var(--ion-color-light);
          border-radius: 8px;
          overflow: hidden;
        }
      }

      .description {
      }
    }

    .action {
      padding: var(--van-cell-vertical-padding) 0;

      ion-button {
        flex: 1;
        margin: 0;
        height: 1.5em;
      }

      & :deep(.edit) {
        border-right: 1px solid var(--van-cell-border-color);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      & :deep(.remove) {
        display: flex;
        justify-content: center;
        align-items: center
      }
    }
  }
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
