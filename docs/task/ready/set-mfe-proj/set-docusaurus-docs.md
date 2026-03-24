---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "Docs(Docusaurus) 환경구성"
---

# Docs(Docusaurus)환경구성

개발자 가이드 문서 사이트는 **Docusaurus** 프로젝트를 활용하여 구성되었습니다.
따라서 추후 최초 문서 사이트 구성 시 **Docusaurus** 프로젝트 설치 및 환경구성 방법을 안내합니다.



## 설치
---
* [Node.js](https://nodejs.org/en/download/) 18.0 이상 버전 설치 필요.

### Docusaurus 설치
작업할 폴더에서 다음 명령어를 실행하면 `mf-docs`라는 이름의 폴더가 생성되며, docusaurus 프로젝트의 기본 파일이 생성 됩니다.  
프로젝트 이름은 자유롭게 설정할 수 있습니다.
```sh
npx create-docusaurus@latest mf-docs classic
```
* create-docusaurus 에 대한 설명은 [API문서(create-docusaurus)](https://docusaurus.io/ko/docs/next/api/misc/create-docusaurus)를 참고하세요.






## Docusaurus 프로젝트 구조
---
classic 템플릿을 선택하면 아래와 같은 폴더 구조를 가집니다.
```
mf-docs/
├── .docusaurus
├── blog
│   ├── 2019-05-28-....md
│   ├── 2019-05-29-....md
│   └── 2020-05-30-....md
├── docs
│   ├── ....md
│   ├── ....md
│   ├── ....md
│   └── ....md
├── src
│   ├── components
│   │   └── .....tsx
│   ├── css
│   │   └── custom.css
│   └── pages
│       ├── index.module.css
│       ├── index.tsx
│       └── markdown.page.md
├── static
│   └── img
├── docusaurus.config.ts
├── package.json
├── README.md
├── sidebars.ts
└── tsconfig.json
```
### 프로젝트 구조 요약
* `/blog/` - 블로그 형식의 마크다운 파일 디렉토리 입니다. 블로그 플러그인을 비활성화한 경우 디렉토리를 삭제 하거나 path옵션을 설정한 후 이름을 변경할 수 있습니다. 좀 더 자세한 설명은 [블로그 가이드](https://docusaurus.io/ko/docs/blog)에서 참조할 수 있습니다.

* `/docs/` - 문서 형식의 마크다운 파일 디렉토리 입니다. `sidebars.ts`에서 사이드바에 표시되는 문서 순서를 변경할 수 있습니다. 좀 더 자세한 설명은 [docs 문서형식 가이드](https://docusaurus.io/ko/docs/docs-introduction)에서 확인할 수 있습니다.

* `/src/` - 페이지나 React 컴포넌트처럼 마크다운이 아닌 파일 디렉토리 입니다. React 컴포넌트를 무조건 `src`에 모아놓을 필요는 없습니다. 하지만 한곳에 모아놓으면 모든면에 편리합니다. 참조 가이드는 [페이지 및 컴포넌트 가이드](https://docusaurus.io/ko/docs/creating-pages)에서 확인할 수 있습니다.

* `/static/` - 정적 파일 디렉토리 입니다. 이곳에 있는 파일은 build 했을 때 루트 디렉토리 위치에 복사 됩니다.

* `/docusaurus.config.ts` - 사이트 설정이 저장된 파일입니다.

* `/sidebars.ts` - 사이드바에 표시되는 문서의 순서를 조정할 때 사용합니다. 좀 더 자세한 설명은 [sidebar 가이드](https://docusaurus.io/ko/docs/sidebar)에 참조하세요.

* `/tsconfig.json/` - TypeScript를 사용했을 때 TypeScript설정이 저장된 파일입니다.






## 개발 서버 실행
---
Docusaurus 프로젝트 루트 폴더에서 아래 명령어를 실행합니다. 물론 **의존성 라이브러리** 를 먼저 생성 `npm install`하고, 실행합니다.
```sh
npm run start
```
* 기본적으로 `http://localhost:3000/` 으로 열립니다.
![docusaurus 첫 기본 화면면](../../assets/ready/docusaurus-site01.png)






## 빌드
---
웹 사이트를 빌드하기 위해서는 아래 명령어를 실행합니다. 그러면 `/build/` 디렉토리가 생성되고 빌드된 결과 파일들이 생성 됩니다. 배포 관련 좀 더 자세한 설명은 [Docusaurus 배포 가이드](https://docusaurus.io/ko/docs/deployment) 참조하세요.
```sh
npm run build
```
* **빌드된 결과물**을 웹 사이트에 배포하기 전에 로컬에서 빌드 테스트를 해보려면, 아래 명령어를 실행하여 **빌드 결과물로 웹 사이트를 확인**해볼 수 있습니다.
```sh
npm run serve
```









