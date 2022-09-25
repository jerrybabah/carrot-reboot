import firebase from 'firebase/app';
import { toastController } from '@ionic/vue';
import { PushNotifications } from '@capacitor/push-notifications';

import {
  Worker,
  getWorkerByPhoneNumber,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';

export function validateDistrict(district: string): void {
  const regex = /^([^/\t\n\r]*)[/]([^/\t\n\r]*)$/g;

  if (!regex.test(district)) {
    throw new Error(`알맞지 않은 형식의 지역 문자열: ${district}`);
  }
}

export function parseDistrict(district: string, allowEmpty = false): { beautifiedDistrict: string, largeDistrict: string, smallDistrict: string } {
  validateDistrict(district);

  const [largeDistrict, smallDistrict] = district.split('/');

  let beautifiedDistrict: string;

  if (largeDistrict === '') {
    beautifiedDistrict = allowEmpty ? '' : '지역';
  } else if (largeDistrict === '세종') {
    beautifiedDistrict = '세종';
  } else {
    beautifiedDistrict = `${largeDistrict} ${smallDistrict}`;
  }

  return {
    beautifiedDistrict,
    largeDistrict,
    smallDistrict,
  };
}

export async function getFirebaseUser(): Promise<firebase.User | null> {
  return new Promise<firebase.User | null>((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

/**
 * INFO
 *
 * <로그인이 안됐다고 판단하는 경우>
 * - firebase user가 없는 경우 (firebase sdk에 의해 브라우저 로컬에 저장된 사용자 정보. firebase authentication 서비스를 기반으로 함)
 * - firebase user는 있지만 db user가 없는 경우
 *
 * <로그인이 됐다고 판단하는 경우>
 * - firebase user, db user 모두 있는 경우
 */
export async function getLocallyLoggedInWorker(): Promise<Worker | null> {
  const firebaseUser = await getFirebaseUser();

  if (!firebaseUser) {
    return null;
  }

  const [_, phoneNumber] = firebaseUser.uid.split(':');

  const worker = await getWorkerByPhoneNumber(phoneNumber);

  if (!worker) {
    await firebase.auth().signOut();
  }

  return worker;
}

export async function loginLocally(token: string): Promise<Worker> {
  const { user: firebaseUser } = await firebase.auth().signInWithCustomToken(token);

  if (!firebaseUser) {
    throw new Error('토큰으로 로그인했지만 로그인 사용자를 얻지 못함');
  }

  const [_, phoneNumber] = firebaseUser.uid.split(':');

  const worker = await getWorkerByPhoneNumber(phoneNumber);

  if (!worker) {
    throw new Error('firebase user는 존재하지만 firestore user가 존재하지 않음');
  }

  return worker;
}

export async function toast(message: string, duration = 2000) {
  const toastElement = await toastController.create({
    message,
    duration,
    color: 'dark',
  });

  await toastElement.present();
}

export async function getRegistrationToken(): Promise<string> {
  const permission = await PushNotifications.requestPermissions();

  if (permission.receive !== 'granted') {
    throw new Error('push permission denied'); // only ios
  }

  PushNotifications.register();

  return new Promise<string>((resolve, reject) => {
    const registrationEventHandler = PushNotifications.addListener('registration', (token) => {
      registrationEventHandler.remove();
      resolve(token.value);
    });

    const registrationErrorEventHandler = PushNotifications.addListener('registrationError', (error) => {
      registrationErrorEventHandler.remove();
      reject(error);
    });
  });
}

export const splitExt = (path: string): [string, string] => {
  const dirs = path.split('/');
  const lastDir = dirs.pop()!; // INFO: dirs가 비어 있을 수 없으므로 undefined가 반환되지 않는다.

  const dotSplits = lastDir.split('.');

  const ext = dotSplits.length > 1 ? dotSplits.pop()! : '';
  const pathExceptExt = `${dirs.join('/')}/${dotSplits.join('.')}`;

  return [pathExceptExt, ext];
};

export function getResizedImageUrl(originImageUrl: string, width?: number, height?: number): string {
  /**
   * ex) https://firebasestorage.googleapis.com/v0/b/blueberry-dev.appspot.com/o/temp%2Ftest%2Faaron-huber-G7sE2S4Lab4-unsplash.jpg?alt=media&token=b366c01f-826d-4e88-9838-d92e2c687b18
   */
  const parsedUrl = new URL(originImageUrl);

  let size: string;

  if (width && height) {
    size = `${width}x${height}`;
  } else if (width) {
    size = `${width}x${width}`;
  } else {
    size = '320x320';
  }

  /**
   * ex) https://firebasestorage.googleapis.com/v0/b/blueberry-dev.appspot.com/o/temp%2Ftest%2Faaron-huber-G7sE2S4Lab4-unsplash.jpg?alt=media
   */
  parsedUrl.searchParams.delete('token');

  /**
   * ex)
   * origin: https://firebasestorage.googleapis.com
   * pathname: /v0/b/blueberry-dev.appspot.com/o/temp%2Ftest%2Faaron-huber-G7sE2S4Lab4-unsplash.jpg
   * search: ?alt=media
   */
  const { origin, pathname, search } = parsedUrl;

  const pathes = pathname.split('/');

  /**
   * ex)
   * objectname: temp%2Ftest%2Faaron-huber-G7sE2S4Lab4-unsplash.jpg
   * directory: /v0/b/blueberry-dev.appspot.com/o
   */
  const objectname = pathes.pop()!;
  const directory = pathes.join('/');

  const slashSplits = objectname.split('%2F');

  /**
   * ex)
   * filename: aaron-huber-G7sE2S4Lab4-unsplash.jpg
   * folder: temp%2Ftest
   */
  const filename = slashSplits.pop()!;
  const folder = slashSplits.join('%2F');

  const dotSplits = filename.split('.');

  /**
   * ex)
   * ext: jpg
   * filenameExceptExt: aaron-huber-G7sE2S4Lab4-unsplash
   */
  const ext = dotSplits.length > 1 ? dotSplits.pop()! : '';
  const filenameExceptExt = dotSplits.join('.');

  const thumbnailFolder = 'thumbs';

  /**
   * ex) https://firebasestorage.googleapis.com/v0/b/blueberry-dev.appspot.com/o/temp%2Ftest%2Fthumbs%2Faaron-huber-G7sE2S4Lab4-unsplash_320x320.jpg?alt=media
   */
  const resizedUrl = `${origin}${directory}/${folder}%2F${thumbnailFolder}%2F${filenameExceptExt}_${size}.${ext}${search}`;

  return resizedUrl;
}
