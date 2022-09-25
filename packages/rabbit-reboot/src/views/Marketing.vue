<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/settings" />
        </ion-buttons>

        <ion-title>
          구인,구직정보 및 마케팅 수신 동의
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <article id="6c3834fd-6cbf-42ae-a957-631589500c07" class="ion-padding page sans">
        <div class="page-body">
          <p id="67ce4af3-b3cf-4433-b599-362d9bee9fe8" class="">엑스플랫폼 주식회사는 회원들께 더 나은 서비스를 제공하고자 정보 제공 및 이벤트 알림 목적의 개인정보 수집
            및 이용에 대한 동의를 받고자 합니다. 내용을 자세히 읽으신 후, 동의를 원하시면 원래의 화면으로 돌아가 다음 단계로 넘어가시면 됩니다. 해당 내용은 [마이페이지] - [환경설정]에서 다시 확인 하실
            수 있습니다.</p>
          <p id="f629bfa8-a0d6-4c1c-bd19-756972d52430" class="">
          </p>
          <h3 id="2c649017-88db-4dd9-9467-339490d7857c" class=""><strong>목적</strong></h3>
          <ul id="43293a9c-5c28-4006-9711-3cebb0f11fe4" class="bulleted-list">
            <li style="list-style-type:disc">김프로 서비스가 제공하는 이용자 맞춤형 서비스(직접정보, 서비스에 대한 정보) 및 각종 경품 행사, 이벤트 등의 광고성 정보를 문자(SMS
              또는 카카오 알림톡), 푸시, 전화 등을 이용자에게 제공합니다.</li>
          </ul>
          <h3 id="ecc4c337-96ce-4937-ad11-c0159b309016" class=""><strong>처리하는 개인정보 항목</strong></h3>
          <ul id="3553004e-e1b9-4261-b6d9-043865a0ddcc" class="bulleted-list">
            <li style="list-style-type:disc">이름, 휴대전화번호</li>
          </ul>
          <h3 id="2caab9d9-b923-4db7-9142-a5b93e1e1b72" class=""><strong>개인정보 보유 및 이용기간</strong></h3>
          <p id="ef7e99bb-cca2-41c8-b718-090437a97954" class="">정보 및 이벤트 목적의 개인정보 수집, 이용에 대한 동의 시부터 동의 철회 또는 회원 탈퇴시까지 (최대
            2년간)</p>
          <p id="3ac14baf-011a-4e0c-a150-0aa69ba5540c" class="">
          </p>
        </div>
      </article>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
} from '@ionic/vue';
</script>

<style lang="scss" scoped>
a,
a.visited {
  color: inherit;
  text-decoration: underline;
}

.pdf-relative-link-path {
  font-size: 80%;
  color: #444;
}

h1,
h2,
h3 {
  letter-spacing: -0.01em;
  line-height: 1.2;
  font-weight: 600;
  margin-bottom: 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 0.75em;
}

h1 {
  font-size: 1.875rem;
  margin-top: 1.875rem;
}

h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
}

h3 {
  font-size: 1.25rem;
  margin-top: 1.25rem;
}

.source {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 1.5em;
  word-break: break-all;
}

.callout {
  border-radius: 3px;
  padding: 1rem;
}

figure {
  margin: 1.25em 0;
  page-break-inside: avoid;
}

figcaption {
  opacity: 0.5;
  font-size: 85%;
  margin-top: 0.5em;
}

mark {
  background-color: transparent;
}

.indented {
  padding-left: 1.5em;
}

hr {
  background: transparent;
  display: block;
  width: 100%;
  height: 1px;
  visibility: visible;
  border: none;
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
}

img {
  max-width: 100%;
}

@media only print {
  img {
    max-height: 100vh;
    object-fit: contain;
  }
}

@page {
  margin: 1in;
}

.collection-content {
  font-size: 0.875rem;
}

.column-list {
  display: flex;
  justify-content: space-between;
}

.column {
  padding: 0 1em;
}

.column:first-child {
  padding-left: 0;
}

.column:last-child {
  padding-right: 0;
}

.table_of_contents-item {
  display: block;
  font-size: 0.875rem;
  line-height: 1.3;
  padding: 0.125rem;
}

.table_of_contents-indent-1 {
  margin-left: 1.5rem;
}

.table_of_contents-indent-2 {
  margin-left: 3rem;
}

.table_of_contents-indent-3 {
  margin-left: 4.5rem;
}

.table_of_contents-link {
  text-decoration: none;
  opacity: 0.7;
  border-bottom: 1px solid rgba(55, 53, 47, 0.18);
}

table,
th,
td {
  border: 1px solid rgba(55, 53, 47, 0.09);
  border-collapse: collapse;
}

table {
  border-left: none;
  border-right: none;
}

th,
td {
  font-weight: normal;
  padding: 0.25em 0.5em;
  line-height: 1.5;
  min-height: 1.5em;
  text-align: left;
}

th {
  color: rgba(55, 53, 47, 0.6);
}

ol,
ul {
  margin: 0;
  margin-block-start: 0.6em;
  margin-block-end: 0.6em;
}

li > ol:first-child,
li > ul:first-child {
  margin-block-start: 0.6em;
}

ul > li {
  list-style: disc;
}

ul.to-do-list {
  text-indent: -1.7em;
}

ul.to-do-list > li {
  list-style: none;
}

.to-do-children-checked {
  text-decoration: line-through;
  opacity: 0.375;
}

ul.toggle > li {
  list-style: none;
}

ul {
  padding-inline-start: 1.7em;
}

ul > li {
  padding-left: 0.1em;
}

ol {
  padding-inline-start: 1.6em;
}

ol > li {
  padding-left: 0.2em;
}

.mono ol {
  padding-inline-start: 2em;
}

.mono ol > li {
  text-indent: -0.4em;
}

.toggle {
  padding-inline-start: 0em;
  list-style-type: none;
}

/* Indent toggle children */
.toggle > li > details {
  padding-left: 1.7em;
}

.toggle > li > details > summary {
  margin-left: -1.1em;
}

.selected-value {
  display: inline-block;
  padding: 0 0.5em;
  background: rgba(206, 205, 202, 0.5);
  border-radius: 3px;
  margin-right: 0.5em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
  white-space: nowrap;
}

.collection-title {
  display: inline-block;
  margin-right: 1em;
}

.simple-table {
  margin-top: 1em;
  font-size: 0.875rem;
}

.simple-table-header {
  background: rgb(247, 246, 243);
  color: black;
  font-weight: 500;
}

time {
  opacity: 0.5;
}

.icon {
  display: inline-block;
  max-width: 1.2em;
  max-height: 1.2em;
  text-decoration: none;
  vertical-align: text-bottom;
  margin-right: 0.5em;
}

img.icon {
  border-radius: 3px;
}

.user-icon {
  width: 1.5em;
  height: 1.5em;
  border-radius: 100%;
  margin-right: 0.5rem;
}

.user-icon-inner {
  font-size: 0.8em;
}

.text-icon {
  border: 1px solid #000;
  text-align: center;
}

.page-cover-image {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 30vh;
}

.page-header-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.page-header-icon-with-cover {
  margin-top: -0.72em;
  margin-left: 0.07em;
}

.page-header-icon img {
  border-radius: 3px;
}

.link-to-page {
  margin: 1em 0;
  padding: 0;
  border: none;
  font-weight: 500;
}

p > .user {
  opacity: 0.5;
}

td > .user,
td > time {
  white-space: nowrap;
}

input[type="checkbox"] {
  transform: scale(1.5);
  margin-right: 0.6em;
  vertical-align: middle;
}

p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.image {
  border: none;
  margin: 1.5em 0;
  padding: 0;
  border-radius: 0;
  text-align: center;
}

.code,
code {
  background: rgba(135, 131, 120, 0.15);
  border-radius: 3px;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 85%;
  tab-size: 2;
}

code {
  color: #eb5757;
}

.code {
  padding: 1.5em 1em;
}

.code-wrap {
  white-space: pre-wrap;
  word-break: break-all;
}

.code > code {
  background: none;
  padding: 0;
  font-size: 100%;
  color: inherit;
}

blockquote {
  font-size: 1.25em;
  margin: 1em 0;
  padding-left: 1em;
  border-left: 3px solid rgb(55, 53, 47);
}

.bookmark {
  text-decoration: none;
  max-height: 8em;
  padding: 0;
  display: flex;
  width: 100%;
  align-items: stretch;
}

.bookmark-title {
  font-size: 0.85em;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 1.75em;
  white-space: nowrap;
}

.bookmark-text {
  display: flex;
  flex-direction: column;
}

.bookmark-info {
  flex: 4 1 180px;
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bookmark-image {
  width: 33%;
  flex: 1 1 180px;
  display: block;
  position: relative;
  object-fit: cover;
  border-radius: 1px;
}

.bookmark-description {
  color: rgba(55, 53, 47, 0.6);
  font-size: 0.75em;
  overflow: hidden;
  max-height: 4.5em;
  word-break: break-word;
}

.bookmark-href {
  font-size: 0.75em;
  margin-top: 0.25em;
}

.sans {
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji",
    "Segoe UI Symbol";
}
.code {
  font-family: "SFMono-Regular", Menlo, Consolas, "PT Mono", "Liberation Mono",
    Courier, monospace;
}
.serif {
  font-family: Lyon-Text, Georgia, ui-serif, serif;
}
.mono {
  font-family: iawriter-mono, Nitti, Menlo, Courier, monospace;
}
.pdf .sans {
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif,
    "Segoe UI Emoji", "Segoe UI Symbol", "Twemoji", "Noto Color Emoji",
    "Noto Sans CJK JP";
}
.pdf:lang(zh-CN) .sans {
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif,
    "Segoe UI Emoji", "Segoe UI Symbol", "Twemoji", "Noto Color Emoji",
    "Noto Sans CJK SC";
}
.pdf:lang(zh-TW) .sans {
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif,
    "Segoe UI Emoji", "Segoe UI Symbol", "Twemoji", "Noto Color Emoji",
    "Noto Sans CJK TC";
}
.pdf:lang(ko-KR) .sans {
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif,
    "Segoe UI Emoji", "Segoe UI Symbol", "Twemoji", "Noto Color Emoji",
    "Noto Sans CJK KR";
}
.pdf .code {
  font-family: Source Code Pro, "SFMono-Regular", Menlo, Consolas, "PT Mono",
    "Liberation Mono", Courier, monospace, "Twemoji", "Noto Color Emoji",
    "Noto Sans Mono CJK JP";
}
.pdf:lang(zh-CN) .code {
  font-family: Source Code Pro, "SFMono-Regular", Menlo, Consolas, "PT Mono",
    "Liberation Mono", Courier, monospace, "Twemoji", "Noto Color Emoji",
    "Noto Sans Mono CJK SC";
}
.pdf:lang(zh-TW) .code {
  font-family: Source Code Pro, "SFMono-Regular", Menlo, Consolas, "PT Mono",
    "Liberation Mono", Courier, monospace, "Twemoji", "Noto Color Emoji",
    "Noto Sans Mono CJK TC";
}
.pdf:lang(ko-KR) .code {
  font-family: Source Code Pro, "SFMono-Regular", Menlo, Consolas, "PT Mono",
    "Liberation Mono", Courier, monospace, "Twemoji", "Noto Color Emoji",
    "Noto Sans Mono CJK KR";
}
.pdf .serif {
  font-family: PT Serif, Lyon-Text, Georgia, ui-serif, serif, "Twemoji",
    "Noto Color Emoji", "Noto Serif CJK JP";
}
.pdf:lang(zh-CN) .serif {
  font-family: PT Serif, Lyon-Text, Georgia, ui-serif, serif, "Twemoji",
    "Noto Color Emoji", "Noto Serif CJK SC";
}
.pdf:lang(zh-TW) .serif {
  font-family: PT Serif, Lyon-Text, Georgia, ui-serif, serif, "Twemoji",
    "Noto Color Emoji", "Noto Serif CJK TC";
}
.pdf:lang(ko-KR) .serif {
  font-family: PT Serif, Lyon-Text, Georgia, ui-serif, serif, "Twemoji",
    "Noto Color Emoji", "Noto Serif CJK KR";
}
.pdf .mono {
  font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace,
    "Twemoji", "Noto Color Emoji", "Noto Sans Mono CJK JP";
}
.pdf:lang(zh-CN) .mono {
  font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace,
    "Twemoji", "Noto Color Emoji", "Noto Sans Mono CJK SC";
}
.pdf:lang(zh-TW) .mono {
  font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace,
    "Twemoji", "Noto Color Emoji", "Noto Sans Mono CJK TC";
}
.pdf:lang(ko-KR) .mono {
  font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace,
    "Twemoji", "Noto Color Emoji", "Noto Sans Mono CJK KR";
}
.highlight-default {
  color: rgba(55, 53, 47, 1);
}
.highlight-gray {
  color: rgba(120, 119, 116, 1);
  fill: rgba(145, 145, 142, 1);
}
.highlight-brown {
  color: rgba(159, 107, 83, 1);
  fill: rgba(187, 132, 108, 1);
}
.highlight-orange {
  color: rgba(217, 115, 13, 1);
  fill: rgba(215, 129, 58, 1);
}
.highlight-yellow {
  color: rgba(203, 145, 47, 1);
  fill: rgba(203, 148, 51, 1);
}
.highlight-teal {
  color: rgba(68, 131, 97, 1);
  fill: rgba(108, 155, 125, 1);
}
.highlight-blue {
  color: rgba(51, 126, 169, 1);
  fill: rgba(91, 151, 189, 1);
}
.highlight-purple {
  color: rgba(144, 101, 176, 1);
  fill: rgba(167, 130, 195, 1);
}
.highlight-pink {
  color: rgba(193, 76, 138, 1);
  fill: rgba(205, 116, 159, 1);
}
.highlight-red {
  color: rgba(212, 76, 71, 1);
  fill: rgba(225, 111, 100, 1);
}
.highlight-gray_background {
  background: rgba(241, 241, 239, 1);
}
.highlight-brown_background {
  background: rgba(244, 238, 238, 1);
}
.highlight-orange_background {
  background: rgba(251, 236, 221, 1);
}
.highlight-yellow_background {
  background: rgba(251, 243, 219, 1);
}
.highlight-teal_background {
  background: rgba(237, 243, 236, 1);
}
.highlight-blue_background {
  background: rgba(231, 243, 248, 1);
}
.highlight-purple_background {
  background: rgba(244, 240, 247, 0.8);
}
.highlight-pink_background {
  background: rgba(249, 238, 243, 0.8);
}
.highlight-red_background {
  background: rgba(253, 235, 236, 1);
}
.block-color-default {
  color: inherit;
  fill: inherit;
}
.block-color-gray {
  color: rgba(120, 119, 116, 1);
  fill: rgba(145, 145, 142, 1);
}
.block-color-brown {
  color: rgba(159, 107, 83, 1);
  fill: rgba(187, 132, 108, 1);
}
.block-color-orange {
  color: rgba(217, 115, 13, 1);
  fill: rgba(215, 129, 58, 1);
}
.block-color-yellow {
  color: rgba(203, 145, 47, 1);
  fill: rgba(203, 148, 51, 1);
}
.block-color-teal {
  color: rgba(68, 131, 97, 1);
  fill: rgba(108, 155, 125, 1);
}
.block-color-blue {
  color: rgba(51, 126, 169, 1);
  fill: rgba(91, 151, 189, 1);
}
.block-color-purple {
  color: rgba(144, 101, 176, 1);
  fill: rgba(167, 130, 195, 1);
}
.block-color-pink {
  color: rgba(193, 76, 138, 1);
  fill: rgba(205, 116, 159, 1);
}
.block-color-red {
  color: rgba(212, 76, 71, 1);
  fill: rgba(225, 111, 100, 1);
}
.block-color-gray_background {
  background: rgba(241, 241, 239, 1);
}
.block-color-brown_background {
  background: rgba(244, 238, 238, 1);
}
.block-color-orange_background {
  background: rgba(251, 236, 221, 1);
}
.block-color-yellow_background {
  background: rgba(251, 243, 219, 1);
}
.block-color-teal_background {
  background: rgba(237, 243, 236, 1);
}
.block-color-blue_background {
  background: rgba(231, 243, 248, 1);
}
.block-color-purple_background {
  background: rgba(244, 240, 247, 0.8);
}
.block-color-pink_background {
  background: rgba(249, 238, 243, 0.8);
}
.block-color-red_background {
  background: rgba(253, 235, 236, 1);
}
.select-value-color-pink {
  background-color: rgba(245, 224, 233, 1);
}
.select-value-color-purple {
  background-color: rgba(232, 222, 238, 1);
}
.select-value-color-green {
  background-color: rgba(219, 237, 219, 1);
}
.select-value-color-gray {
  background-color: rgba(227, 226, 224, 1);
}
.select-value-color-orange {
  background-color: rgba(250, 222, 201, 1);
}
.select-value-color-brown {
  background-color: rgba(238, 224, 218, 1);
}
.select-value-color-red {
  background-color: rgba(255, 226, 221, 1);
}
.select-value-color-yellow {
  background-color: rgba(253, 236, 200, 1);
}
.select-value-color-blue {
  background-color: rgba(211, 229, 239, 1);
}

.checkbox {
  display: inline-flex;
  vertical-align: text-bottom;
  width: 16;
  height: 16;
  background-size: 16px;
  margin-left: 2px;
  margin-right: 5px;
}
</style>
