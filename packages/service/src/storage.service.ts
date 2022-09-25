import firebase from 'firebase/app';

export async function uploadFile(storage: firebase.storage.Storage, file: File, directory?: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const path = directory ? `${directory}/${file.name}` : file.name;

    const metadata: firebase.storage.UploadMetadata = {
      contentType: file.type,
    };

    const uploadTask = storage
      .ref()
      .child(path)
      .put(file, metadata);

    /**
     * INFO: upload task의 모든 state
     * - canceled
     * - error
     * - paused
     * - running
     * - success
     */
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      /**
       * INFO: state가 변경될 때마다 호출되는 함수
       */
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`${progress}% 완료`);

        switch (snapshot.state) {
          // WARN: 다음 경우에 대해서는 정보가 없어서 구현 안함
          // case firebase.storage.TaskState.CANCELED: {
          //   console.log('Upload is canceled');
          //   break;
          // }
          case firebase.storage.TaskState.PAUSED: {
            console.log('Upload is paused');
            break;
          }
          case firebase.storage.TaskState.RUNNING: {
            console.log('Upload is running');
            break;
          }
          default: {
            break;
          }
        }
      },
      /**
       * INFO: state가 error로 바뀔 때 호출되는 함수
       */
      (error) => {
        reject(error);
      },
      /**
       * INFO: state가 success로 바뀔 때 호출되는 함수
       */
      async () => {
        try {
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          resolve(url);
        } catch (e) {
          reject(e);
        }
      },
    );
  });
}

export async function uploadFiles(storage: firebase.storage.Storage, files: File[], directory?: string): Promise<string[]> {
  const urls = await Promise.all(files.map((file) => uploadFile(storage, file, directory)));
  return urls;
}
