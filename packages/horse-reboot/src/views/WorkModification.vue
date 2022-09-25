<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" :default-href="`/works/${props.workId}`" />
        </ion-buttons>

        <ion-title>작업 요청서 수정</ion-title>

        <ion-buttons slot="end">
          <ion-button
            :disabled="!workModificationStore.isChanged || !workModificationStore.isCompleted || workModificationStore.isImagesUploading"
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
          <ion-item>
            <ion-label position="stacked">
              시공분야
            </ion-label>

            <ion-select
              v-model="workModificationStore.field"
              placeholder="분야를 선택해주세요."
              cancel-text="취소"
              ok-text="완료"
            >
              <ion-select-option v-for="(fieldKr, _, index) in FIELDS" :key="index" :value="fieldKr">
                {{ fieldKr }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              시공기간
            </ion-label>

            <ion-input
              readonly
              placeholder="시공기간을 선택해주세요."
              :value="`${workModificationStore.startDate?.toLocaleDateString() || '0000. 00. 00.'} ~ ${workModificationStore.endDate?.toLocaleDateString() || '0000. 00. 00.'}`"
              @click="() => { isCalendarShow = true }"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              지역
            </ion-label>

            <ion-input
              readonly
              placeholder="지역을 선택해주세요."
              :value="`${workModificationStore.parsedDistrict.largeDistrict || '--'} ${workModificationStore.parsedDistrict.smallDistrict || '--'}`"
              @click="() => { isDistrictModalOpen = true }"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              상세주소
            </ion-label>

            <ion-input
              v-model="workModificationStore.addressDetail"
              placeholder="상세주소를 입력해주세요."
            />
          </ion-item>

          <van-collapse v-model="isCollapsed" accordion class="required-worker-info">
            <van-collapse-item :title="`필요 인력 정보 (${isCollapsed ? '접기' : '펼치기'})`" name="1">
              <RequiredWorkersForm
                v-model="workModificationStore.requiredWorkers"
              />
            </van-collapse-item>
          </van-collapse>

          <ion-item>
            <ion-label position="stacked">
              제목
            </ion-label>

            <ion-input
              v-model="workModificationStore.title"
              placeholder="제목을 입력해주세요."
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              세부 내용
            </ion-label>

            <ion-textarea
              v-model="workModificationStore.description"
              placeholder="세부 내용을 입력해주세요."
              auto-grow
              rows="10"
            />
          </ion-item>

          <div class="images">
            <div class="images-label">
              <ion-text>
                현장사진
              </ion-text>
            </div>

            <van-uploader
              v-model="workModificationStore.images"
              multiple
              :max-count="10"
              :after-read="afterRead"
            />
          </div>
        </ion-list>
      </div>

      <ion-modal
        css-class="district-modification-modal"
        :is-open="isDistrictModalOpen"
        @didDismiss="setDistrictModalOpen(false)"
      >
        <DistrictSelect
          v-model="workModificationStore.district"
          @update:model-value="() => { setDistrictModalOpen(false) }"
        />
      </ion-modal>

      <ion-modal
        css-class="work-modification-leave-confirm-modal"
        :is-open="uiStore.isWorkModificationLeaveConfirmModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isWorkModificationLeaveConfirmModalOpened: false,
          });
        }"
      >
        <div class="modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              수정 중인 내용이 삭제됩니다. 작업 요청서 수정을 그만하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="() => {
                uiStore.$patch({
                  isWorkModificationLeaveConfirmModalOpened: false,
                });

                workModificationStore.$reset();

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
                  isWorkModificationLeaveConfirmModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="workModificationStore.isUpdating"
        message="수정중..."
      />
    </ion-content>

    <van-calendar
      ref="calendarTemp"
      v-model:show="isCalendarShow"
      type="range"
      allow-same-day
      :show-confirm="false"
      :show-mark="false"
      @confirm="onConfirm"
    />
  </ion-page>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonLoading,
  IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonModal, IonTextarea, IonText,
} from '@ionic/vue';
import {
  Calendar as VanCalendar, Collapse as VanCollapse, CollapseItem as VanCollapseItem, Uploader as VanUploader, UploaderFileListItem,
} from 'vant';
import firebase from 'firebase/app';

import { FIELDS } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import { DistrictSelect, RequiredWorkersForm } from '@/containers';
import { useModal } from '@/hooks';
import { useWorkModificationStore, useUiStore, useWorksStore } from '@/store';

const props = defineProps<{
  workId: string,
}>();

const router = useRouter();

const workModificationStore = useWorkModificationStore();

const uiStore = useUiStore();

const worksStore = useWorksStore();

const calendarTemp = ref<any>(null);

const isCalendarShow = ref(false);

const {
  isOpened: isDistrictModalOpen,
  setOpen: setDistrictModalOpen,
} = useModal();

const isCollapsed = ref('');

const onConfirm = ([startDate, endDate]: Date[]) => {
  workModificationStore.$patch({
    startDate,
    endDate,
  });

  isCalendarShow.value = false;
};

/* eslint-disable no-param-reassign */
const afterRead = (readedFiles: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileItems: UploaderFileListItem[] = Array.isArray(readedFiles) ? readedFiles : [readedFiles];

  Promise.all(fileItems.map(async (fileItem) => {
    if (!fileItem.file) {
      return;
    }

    fileItem.status = 'uploading';
    fileItem.message = '업로드중...';

    try {
      fileItem.url = await uploadFile(firebase.storage(), fileItem.file, 'works');

      fileItem.status = 'done';
      fileItem.message = '';
    } catch (e) {
      console.log(e);

      fileItem.status = 'failed';
      fileItem.message = '업로드 실패';
    }
  }));
};

const onClickSubmit = async () => {
  await workModificationStore.updateWork();

  worksStore.initRecruitingState();
  worksStore.initRecruitedState();

  worksStore.fetchRecruitings(); // async
  worksStore.fetchRecruiteds(); // async

  workModificationStore.$reset();

  router.back();
};

onMounted(() => {
  if (!workModificationStore.startDate && !workModificationStore.endDate) {
    calendarTemp.value.reset(null);
    return;
  }

  if (workModificationStore.startDate && !workModificationStore.endDate) {
    calendarTemp.value.reset([workModificationStore.startDate]);
    return;
  }

  if (workModificationStore.startDate && workModificationStore.endDate) {
    calendarTemp.value.reset([workModificationStore.startDate, workModificationStore.endDate]);
    return;
  }

  calendarTemp.value.reset(null);
});
</script>

<style lang="scss" scoped>
ion-item, .required-worker-info, .images {
  margin-bottom: 16px;
}

ion-item {
  --padding-start: 0;
}

.required-worker-info {
  margin-top: 44px;
  margin-bottom: 36px;

  &::after {
    border-color: #666666;
    border-top: unset;
  }

  & :deep(.van-cell) {
    padding: 10px 0;
  }
}

.images-label {
  margin-bottom: 8px;
  font-size: 16px;
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
