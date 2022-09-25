<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/serviceCenter" />
        </ion-buttons>

        <ion-title>
          자주 묻는 질문
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <article id="48f9a549-2e02-4561-9114-62b78c6c6d45" class="ion-padding-end page sans">
        <div class="page-body">
          <ol type="1" id="7a1dfb9d-44d4-4d99-9d6f-5709782d118c" class="numbered-list" start="1">
            <li>
              <strong>본인 사진이나 정보는 꼭 올려야 하나요?</strong>
              <ul id="8ed80434-b428-401c-9523-a91e0b3f9cda" class="bulleted-list">
                <li
                  style="list-style-type:disc"
                >프로필 사진은 등록하지 않아도 무방하지만, 기술자 분들과 대화시 프로필 사진이 노출되기 때문에 업체정보등이 표현된 사진을 등록하시는걸 추천드립니다.</li>
              </ul>
            </li>
          </ol>
          <ol type="1" id="8f9a4678-5243-4168-80ba-d042219c82f3" class="numbered-list" start="2">
            <li>
              <strong>개인정보 공개는 어떻게 되나요?</strong>
              <ul id="395ba687-408f-4c37-afea-a089f66171cb" class="bulleted-list">
                <li
                  style="list-style-type:disc"
                >김프로는 앱 내 채팅을 기능을 제공하고 있습니다. 앱 내 채팅기능을 이용하실 경우 개인정보가 노출될 걱정을 안하셔도 됩니다. 또한 직접 체결하신 기술자님만 고객님의 정보를 확인할 수 있습니다김프로는 고객의 소중한 개인 정보가 외부로 유출되는 일이 없도록 언제나 최선을 다하고 있습니다.</li>
              </ul>
            </li>
          </ol>
          <ol type="1" id="ee874da4-1d4b-490b-9868-69abb367b986" class="numbered-list" start="3">
            <li>
              <strong>한번 설정한 프로필은 수정 가능한가요?</strong>
              <ul id="9a2e436f-2533-4566-b722-df44d2dc03be" class="bulleted-list">
                <li style="list-style-type:disc">네 [마이페이지] 내에서 언제든지 수정이 가능합니다.</li>
              </ul>
            </li>
          </ol>
          <ol type="1" id="a0052481-87ae-4879-8187-74494cc6d1f8" class="numbered-list" start="4">
            <li>
              <strong>탈퇴는 어떻게 하나요?</strong>
              <ul id="ad7f98ae-cb7e-43a9-8924-cf766f936274" class="bulleted-list">
                <li style="list-style-type:disc">탈퇴를 원하시면 고객센터를 통해 말씀해 주십시오. 탈퇴처리를 도와드리겠습니다.</li>
              </ul>
            </li>
          </ol>
          <ol type="1" id="853ce051-6e8f-4fc8-80e8-8503edb1daf6" class="numbered-list" start="5">
            <li>
              <strong>리뷰쓰기는 어떻게 하나요?</strong>
              <ul id="df31f21c-43cf-4336-985d-f228edd999bd" class="bulleted-list">
                <li style="list-style-type:disc">
                  일자리 마감 후, 작업이 완료되면 리뷰쓰기를 하실 수 있습니다.
                  알림을 통해 리뷰쓰기로 바로 이동하여 작성하거나 내가 등록한 일자리 목록에서 해당 작업을 찾아 리뷰를 쓸 수 있습니다. 고객님의 소중한 리뷰는 더 나은 &#x27;김프로&#x27;에 엄청난 도움이 될 것입니다.
                </li>
              </ul>
            </li>
          </ol>
          <ol type="1" id="7c71d070-1aaf-40e3-bcaf-2cb37d9964c3" class="numbered-list" start="6">
            <li>
              <strong>일자리 등록 후 수정 및 마감은 어디서 할 수 있나요?</strong>
              <ul id="adb16a6a-52f8-4419-8dcc-5fdd0d12fe4f" class="bulleted-list">
                <li style="list-style-type:disc">작업요청 목록에서 해당 작업을 찾아 수정 및 마감 가능합니다.</li>
              </ul>
            </li>
          </ol>
          <ol type="1" id="80abc333-fe2a-4e95-aa43-839716395955" class="numbered-list" start="7">
            <li>
              <strong>작성한 리뷰는 수정이나 삭제를 할 수 있나요?</strong>
              <ul id="6e9189ee-47ac-4665-aa89-91f259ad56f5" class="bulleted-list">
                <li style="list-style-type:disc">한번 작성된 리뷰는 3일 동안 수정이 가능하고 3일 후부터는 수정이 불가능합니다.</li>
              </ul>
              <ul id="80c761d8-d926-43df-b3b9-9627527cbe92" class="bulleted-list">
                <li style="list-style-type:disc">리뷰는 언제든지 삭제가 가능하지만 삭제 후에 해당 작업에 대한 리뷰는 작성하실 수 없습니다.</li>
              </ul>
            </li>
          </ol>
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
