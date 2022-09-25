import crypto from 'crypto';
import cryptoRandomString from 'crypto-random-string';
import axios from 'axios';
import dayjs from 'dayjs';

export async function sendSMS(to: string, text: string): Promise<void> {
  /**
   * signature 생성, 문자 전송에 필요한 상수
   */
  const SENDER_POHNENUMBER = '01027954134';
  const URL = 'https://api.solapi.com/messages/v4/send';
  const API_KEY = ''; // TODO: 안전하게 보관하기
  const API_SECRET = ''; // TODO: 안전하게 보관하기

  /**
   * siganture 생성
   */
  const now = dayjs();
  const nowString = now.format('YYYY-MM-DD HH:mm:ss');

  const salt = cryptoRandomString(64);

  const signatureKey = crypto.createHmac('sha256', API_SECRET);
  const signature = signatureKey.update(`${nowString}${salt}`).digest('hex');

  /**
   * 문자 전송
   */
  const response = await axios.post(
    URL,
    {
      message: {
        to,
        from: SENDER_POHNENUMBER,
        text,
      },
    },
    {
      headers: {
        Authorization: `HMAC-SHA256 apiKey=${API_KEY}, date=${nowString}, salt=${salt}, signature=${signature}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error(JSON.stringify(response.data));
  }
}
