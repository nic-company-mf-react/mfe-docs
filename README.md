# MultiRepo MFE Boilerplate - Docs

멀티레포 환경의 **마이크로 프론트엔드(Micro Frontend) React.js 프로젝트**를 설명하는 가이드 문서 사이트입니다.  
[Docusaurus](https://docusaurus.io/) 기반의 정적 웹사이트로 구성되어 있습니다.

## 개요

이 프로젝트는 멀티레포 환경에서 마이크로 프론트엔드 아키텍처를 React.js로 구성하는 방법을 안내하는 문서 사이트입니다.  
각 마이크로 프론트엔드 앱의 설치, 설정, 개발 규칙, 컴포넌트 사용 방법 등을 포함합니다.

## 사전 요구사항

- **Node.js 18.0 이상** 버전이 설치되어 있어야 합니다.

## 프로젝트 구조

```
mfe-docs/
├── .docusaurus
├── blog/
├── docs/                    # 문서 마크다운 파일 디렉토리
├── src/
│   ├── components/          # React 컴포넌트
│   ├── css/
│   │   └── custom.css
│   └── pages/
│       └── index.tsx
├── static/
│   └── img/
├── docusaurus.config.ts     # 사이트 설정 파일
├── sidebars.ts              # 사이드바 문서 순서 설정
├── package.json
├── README.md
└── tsconfig.json
```

## 설치

의존성 라이브러리를 설치합니다.

```bash
npm install
```

## 개발 서버 실행

```bash
npm run start
```

기본적으로 `http://localhost:3000/` 으로 브라우저가 열립니다.  
대부분의 변경사항은 서버를 재시작하지 않아도 실시간으로 반영됩니다.

## 빌드

```bash
npm run build
```

`/build/` 디렉토리가 생성되고, 정적 파일로 빌드된 결과물이 생성됩니다.  
빌드된 결과물은 모든 정적 파일 호스팅 서비스에 배포할 수 있습니다.

## 빌드 결과물 로컬 확인

배포 전에 빌드 결과물을 로컬에서 확인하려면 아래 명령어를 실행합니다.

```bash
npm run serve
```

## 참고 링크

- [Docusaurus 공식 문서](https://docusaurus.io/)
- [Docs 환경구성 가이드](http://redsky0212.dothome.co.kr/2026/mfe-multirepo/guide/docs/task/ready/set-mfe-proj/set-docusaurus-docs)
