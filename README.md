# carrot-reboot

## 도메인의 이해
- [(구인~시공) 모든 과정 다이어그램](https://whimsical.com/Juk6MrnLRfpD2NqXAwg8Fj)
- [인테리어 업계 주요 주체 및 그들간의 상호작용](https://whimsical.com/fbWqGJVPRmYjQWCPWhDYS)

## 기획 결과물
- [One Pager](https://jerrybaba.notion.site/One-Pager-ab3bfdcd1dc64b3ca65767a53355edfb)
- IA ([구인자](https://whimsical.com/ia-GG3qVKpcHfy7Tctt26mcoJ)) ([구직자](https://whimsical.com/ia-UNSrGjKgCiVP4NdcnFaFFL))
- userflow ([구인자](https://whimsical.com/userflow-4kbBBhtVbDfSJNKZnQZjEU))
- wireframe ([구인자](https://whimsical.com/wireframe-XWuigkh2U8Xw5ZNSbq2WBM))

## 개발 문서 관리
- [notion](https://jerrybaba.notion.site/Develop-494532bbfa784bb5a44813368817c05c)

## 주요 디렉토리 구조
```
packages/
├── backend/
│   ├── src/
│   │   ├── firestore/
│   │   └── functions/
├── horse-reboot/
├── rabbit-reboot/
└── service/
```
- `firestore`: document 스키마와 firestore를 다루는 universal code(functions, horse-reboot, rabbit-reboot에서 사용) 존재
- `horse-reboot`: 구인자용 클라이언트 코드(AOS, iOS, 웹)
- `rabbit-reboot`: 구직자용 클라이언트 코드(AOS, iOS, 웹)
- `service`: 웹 sdk를 이용하여, firebase storage에 파일을 업로드하는 코드(horse-reboot, rabbit-reboot에서 사용) 존재
