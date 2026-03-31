# MFE i18n 다국어 세팅 플랜

> i18next + react-i18next를 기반으로, mfe-lib-shared에 공통 Provider와 i18n 인스턴스를 배치하고
> Module Federation singleton 공유를 통해 Host(mfe-app-main)와 Remote(mfe-app-remote1)가
> 하나의 i18n 인스턴스를 공유하는 구조로 세팅합니다.

---

## 라이브러리 선택

- **i18next + react-i18next**: MFE에서 가장 널리 사용, 네임스페이스 분리 지원
- **i18next-http-backend**: Host의 `public/locales/` 파일 비동기 로딩
- **i18next-browser-languagedetector**: 브라우저 언어 자동 감지

---

## 전체 아키텍처

```
mfe-lib-shared (i18n instance singleton)
       │
       ├──▶ mfe-app-main / Bootstrap.tsx
       │       i18next.init() with http-backend
       │       init 완료 후 렌더링
       │
       └──▶ AppProviders.tsx
               I18nextProvider 래핑
                      │
                      └──▶ mfe-app-remote1 / Remote1App.tsx
                               i18n.addResourceBundle()
```

---

## 네임스페이스 구조

| 네임스페이스 | 관리 주체 | 용도 |
|---|---|---|
| `common` | Host (mfe-app-main) | 공통 UI 문자열 (버튼, 에러 등) |
| `main` | Host (mfe-app-main) | Host 앱 전용 문자열 |
| `remote1` | Remote (mfe-app-remote1) | Remote1 앱 전용 문자열 |

---

## 번역 파일 위치

```
mfe-app-main/public/locales/
├── ko/
│   ├── common.json   # 공통
│   └── main.json     # Host 전용
└── en/
    ├── common.json
    └── main.json

mfe-app-remote1/src/locales/
├── ko/remote1.json   # 빌드 번들에 포함 (CORS 회피)
└── en/remote1.json
```

---

## 변경 파일 목록

### 1. mfe-lib-shared/package.json
- `peerDependencies`에 `i18next`, `react-i18next` 추가
- `exports`에 `"./i18n"` 서브패스 추가

### 2. mfe-lib-shared/vite.config.ts
- `rollupOptions.external`에 `i18next`, `react-i18next` 추가 (번들 제외)
- `build.lib.entry`에 `'i18n/index'` 진입점 추가

### 3. mfe-lib-shared/src/i18n/ (신규 폴더)
- `i18n-instance.ts`: `i18next.createInstance()`로 공유 인스턴스 생성 및 export
- `I18nProvider.tsx`: `I18nextProvider` 래퍼 컴포넌트
- `index.ts`: `i18n`, `I18nProvider`, `useTranslation` re-export

### 4. mfe-lib-shared/src/components/providers/AppProviders.tsx
- `I18nProvider`를 `ThemeProvider` 안쪽에 추가
- `AppProvidersProps`에 선택적 `i18nInstance` prop 추가 (기본값: 공유 인스턴스)

```tsx
// 변경 전
<ThemeProvider>
  <HelmetProvider>
    <QueryClientProvider ...>

// 변경 후
<ThemeProvider>
  <I18nProvider i18n={i18nInstance}>
    <HelmetProvider>
      <QueryClientProvider ...>
```

### 5. mfe-lib-shared/src/index.ts
- i18n 관련 exports 추가

### 6. mfe-app-main/package.json
- `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector` 추가

### 7. mfe-app-main/vite.config.ts
- Module Federation `shared`에 `i18next`, `react-i18next` 싱글톤 추가

```ts
shared: {
  // ... 기존 항목
  i18next: { singleton: true, requiredVersion: '^24.0.0' },
  'react-i18next': { singleton: true, requiredVersion: '^15.0.0' },
}
```

### 8. mfe-app-main/src/Bootstrap.tsx
- i18n 인스턴스 import 후 `http-backend` + `languageDetector` 플러그인으로 init
- `i18n.init()` 완료 후 `createRoot().render()` 호출 (초기화 순서 보장)

```tsx
import i18n from '@nic/mfe-lib-shared/i18n';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    ns: ['common', 'main'],
    defaultNS: 'common',
    fallbackLng: 'ko',
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
  })
  .then(() => {
    createRoot(...).render(<StrictMode><AppProviders>...</AppProviders></StrictMode>);
  });
```

### 9. mfe-app-main/public/locales/ (신규)
- `ko/common.json`, `ko/main.json`
- `en/common.json`, `en/main.json`

### 10. mfe-app-remote1 (별도 레포 변경)
- `package.json`: `i18next`, `react-i18next` 추가
- `vite.config.ts`: MF `shared`에 `i18next`, `react-i18next` 싱글톤 추가
- `src/locales/ko/remote1.json`, `src/locales/en/remote1.json` 신규 생성
- 진입 컴포넌트(`Remote1App.tsx`)에서 `i18n.addResourceBundle()` 호출하여 네임스페이스 주입

---

## 적용 순서

1. `mfe-lib-shared` 수정 및 빌드
2. `mfe-app-main` 패키지 설치 및 설정 적용
3. `mfe-app-remote1` 패키지 설치 및 설정 적용
