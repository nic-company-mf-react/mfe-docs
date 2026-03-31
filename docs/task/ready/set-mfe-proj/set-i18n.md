---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "다국어 설정"
---

# 다국어 지원 설정
* 다국어 지원을 위한 설정 내용을 정리합니다.





## mfe-lib-shared 에 설정 내용 정리
---
* 공유 라이브러리(mfe-lib-shared)에 다국어 지원관련 peerDependencies에 i18next, react-i18next 추가
```sh
npm install --save-peer i18next
npm install --save-peer react-i18next
```
* `package.json` 파일의 `exports` 필드에 `./i18n` 서브패스 추가.
```json showLineNumbers
"exports": {
    "./i18n": {
        "import": "./dist/i18n/index.js",
        "require": "./dist/i18n/index.cjs",
        "types": "./dist/i18n/index.d.ts"
    }
}
```

* `mfe-lib-shared/vite.config.ts`에 external에 i18next, react-i18next 추가, entry에 i18n/index 추가.
```ts showLineNumbers
// https://vite.dev/config/
export default defineConfig({
    // ...
    build: {
        lib: {
            entry: {
                // ...
                // highlight-start
                'i18n/index': resolve(__dirname, 'src/i18n/index.ts'),
                // highlight-end
            },
        },
        rollupOptions: {
            external: [
                // ...
                // i18n
                // highlight-start
                'i18next',
                'react-i18next',
                // highlight-end
            ],
        },
    },
});
```

* `mfe-lib-shared/src/i18n/i18n-instance.ts` (신규 생성)  
MFE 전체에서 공유되는 i18next Singleton 인스턴스.
```ts showLineNumbers
import i18next from 'i18next';

// createInstance()로 전역 i18next 인스턴스와 분리된 독립 인스턴스 생성.
// Module Federation singleton: true 설정과 함께 Host/Remote가 동일 객체를 참조한다.
const i18n = i18next.createInstance();

export default i18n;
```

* ` mfe-lib-shared/src/i18n/I18nProvider.tsx` (신규 생성)  
I18nextProvider를 래핑하여 AppProviders에서 주입할 수 있게 하는 컴포넌트.
```tsx showLineNumbers
import { type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';
import i18nDefault from './i18n-instance';

interface I18nProviderProps {
  children: ReactNode;
  // 테스트 등에서 커스텀 인스턴스 주입 가능, 기본값은 공유 Singleton
  i18n?: I18nInstance;
}

export function I18nProvider({ children, i18n = i18nDefault }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

* `mfe-lib-shared/src/i18n/index.ts` (신규 생성)  
i18n 서브패스(@nic/mfe-lib-shared/i18n)의 공개 API.
```ts showLineNumbers
export { default as i18n } from './i18n-instance';
export { I18nProvider } from './I18nProvider';
// react-i18next의 useTranslation을 re-export하여 각 앱이 직접 의존성 없이 사용 가능
export { useTranslation } from 'react-i18next';
export type { TFunction } from 'i18next';
```

* `mfe-lib-shared/src/components/providers/AppProviders.tsx` (수정)  
18nProvider를 ThemeProvider 바로 안쪽에 추가.
```tsx showLineNumbers
// ...
// highlight-start
import { I18nProvider } from '../../i18n/I18nProvider';
import type { i18n as I18nInstance } from 'i18next';
// highlight-end

interface AppProvidersProps {
	children: ReactNode;
	queryConfig?: QueryClientConfig;
	// 테스트 등에서 별도 인스턴스 주입 가능, 기본값은 공유 Singleton 사용
    // highlight-start
	i18nInstance?: I18nInstance;
    // highlight-end
}

export function AppProviders({ children, queryConfig, i18nInstance }: AppProvidersProps) {
    // ...
	const content = (
		<ThemeProvider>
        // highlight-start
			<I18nProvider i18n={i18nInstance}>
            // highlight-end
				<HelmetProvider>
					<QueryClientProvider client={queryClient}>
						{children}
						{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
					</QueryClientProvider>
				</HelmetProvider>
                // highlight-start
			</I18nProvider>
            // highlight-end
		</ThemeProvider>
	);

	return content;
}
```

* ` mfe-lib-shared/src/index.ts` 에 i18n 관련 exports 추가.
```ts showLineNumbers
// ── i18n ──
export { i18n, I18nProvider, useTranslation } from './i18n/index';
export type { TFunction } from 'i18next';
```






## mfe-app-main 에 설정 내용 정리
* 다국어 관련 패키지 설치
```sh
npm install i18next react-i18next i18next-browser-languagedetector
```


* `mfe-app-main/vite.config.ts` (수정)  
Module Federation shared에 i18next/react-i18next singleton 추가.
```ts showLineNumbers
export default defineConfig({
    // ...
    // highlight-start
    shared: {
        // ↓ 신규 추가: 동일 i18n 인스턴스를 Host/Remote가 공유하기 위한 singleton 선언
        i18next: { singleton: true, requiredVersion: '^26.0.0' },
        'react-i18next': { singleton: true, requiredVersion: '^17.0.0' },
    },
    // highlight-end
});
```

* `mfe-app-main/src/i18n/AuthBackend.ts` (신규 생성)  
인증 토큰 기반 서버 API 번역 로딩 커스텀 백엔드.
    * 메모리 캐시(TTL 5분)로 동일 네임스페이스 중복 요청 방지
    * 토큰 없음 / 401 / 서버 장애 시 callback(err, false) → i18next가 번들 폴백 자동 사용
    * getToken 함수는 Bootstrap.tsx에서 주입 (실제 auth 스토어와 연결)
```ts showLineNumbers
import type { BackendModule, ReadCallback } from 'i18next';

export interface AuthBackendOptions {
  // 번역 API 경로 템플릿, {{lng}}/{{ns}} 치환자 사용
  loadPath: string;
  // 현재 액세스 토큰을 반환하는 함수 — Bootstrap에서 실제 auth 스토어와 연결
  getToken: () => string | null;
  // 메모리 캐시 유지 시간(ms), 기본 5분
  cacheTTL?: number;
}

interface CacheEntry {
  data: Record<string, unknown>;
  expiredAt: number;
}

const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

export class AuthBackend implements BackendModule<AuthBackendOptions> {
  static type = 'backend' as const;
  type = 'backend' as const;

  private opts: AuthBackendOptions = {
    loadPath: '/api/i18n/translations?lng={{lng}}&ns={{ns}}',
    getToken: () => null,
    cacheTTL: DEFAULT_CACHE_TTL,
  };

  // 인스턴스별 캐시: MF singleton이므로 실질적으로 앱 전체에서 하나
  private cache = new Map<string, CacheEntry>();

  init(_services: unknown, backendOptions: AuthBackendOptions): void {
    this.opts = { ...this.opts, ...backendOptions };
  }

  read(language: string, namespace: string, callback: ReadCallback): void {
    const { loadPath, getToken, cacheTTL = DEFAULT_CACHE_TTL } = this.opts;
    const cacheKey = `${language}:${namespace}`;
    const cached = this.cache.get(cacheKey);

    // 유효한 캐시가 있으면 서버 요청 없이 즉시 반환
    if (cached && Date.now() < cached.expiredAt) {
      callback(null, cached.data);
      return;
    }

    const token = getToken();

    // 토큰이 없으면 번들 폴백 사용 (로그인 전 상태)
    if (!token) {
      callback(new Error('[AuthBackend] No token - using bundle fallback'), false);
      return;
    }

    const url = loadPath
      .replace('{{lng}}', encodeURIComponent(language))
      .replace('{{ns}}', encodeURIComponent(namespace));

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    })
      .then(async (res) => {
        // 401: 토큰 만료 — 번들 폴백 유지 (갱신 로직은 axios interceptor 등에서 처리)
        if (res.status === 401) {
          callback(new Error('[AuthBackend] 401 Unauthorized - using bundle fallback'), false);
          return;
        }
        if (!res.ok) {
          throw new Error(`[AuthBackend] HTTP ${res.status}`);
        }
        const data = (await res.json()) as Record<string, unknown>;
        this.cache.set(cacheKey, { data, expiredAt: Date.now() + cacheTTL });
        callback(null, data);
      })
      .catch((err: Error) => {
        // 서버 장애, 네트워크 오류 → false 반환 시 i18next가 번들 폴백 유지
        callback(err, false);
      });
  }

  // 긴급 공지 / 약관 변경 시 외부에서 캐시 무효화 호출 가능
  invalidateCache(language?: string, namespace?: string): void {
    if (language && namespace) {
      this.cache.delete(`${language}:${namespace}`);
    } else {
      this.cache.clear();
    }
  }
}
```


* `mfe-app-main/src/i18n/locales/ko/common.json` (신규 생성)  
공통 UI 문자열 한국어 번들 폴백.
```json showLineNumbers
{
	"btn.confirm": "확인",
	"btn.cancel": "취소",
	"btn.close": "닫기",
	"btn.save": "저장",
	"btn.edit": "수정",
	"btn.delete": "삭제",
	"btn.back": "뒤로",
	"btn.login": "로그인",
	"btn.logout": "로그아웃",
	"error.network": "네트워크 오류가 발생했습니다.",
	"error.timeout": "요청 시간이 초과되었습니다.",
	"error.unauthorized": "인증이 필요합니다.",
	"error.unknown": "알 수 없는 오류가 발생했습니다.",
	"label.loading": "로딩 중...",
	"label.noData": "데이터가 없습니다."
}
```

* `mfe-app-main/src/i18n/locales/en/common.json` (신규 생성)  
공통 UI 문자열 영어 번들 폴백.
```json showLineNumbers
{
	"btn.confirm": "Confirm",
	"btn.cancel": "Cancel",
	"btn.close": "Close",
	"btn.save": "Save",
	"btn.edit": "Edit",
	"btn.delete": "Delete",
	"btn.back": "Back",
	"btn.login": "Login",
	"btn.logout": "Logout",
	"error.network": "A network error occurred.",
	"error.timeout": "The request timed out.",
	"error.unauthorized": "Authentication required.",
	"error.unknown": "An unknown error occurred.",
	"label.loading": "Loading...",
	"label.noData": "No data available."
}
```     

* `mfe-app-main/src/Bootstrap.tsx` (수정)  
i18n init 완료 후 React 렌더링. 번들 폴백 + AuthBackend + LanguageDetector 통합.
```ts showLineNumbers
// ...
import { i18n } from '@nic/mfe-lib-shared/i18n';
import LanguageDetector from 'i18next-browser-languagedetector';
import { AuthBackend } from './i18n/AuthBackend';

// 번들 내장 폴백 번역 — 토큰 없음/서버 장애 시 사용 (src/ 내부 import → JS 번들에 포함)
import koCommon from './i18n/locales/ko/common.json';
import enCommon from './i18n/locales/en/common.json';

// 액세스 토큰 getter — 실제 프로젝트의 auth 스토어(zustand, redux 등)와 연결
// 현재는 localStorage 기준 예시
const getToken = (): string | null => {
	return localStorage.getItem('access_token');
};

i18n
.use(AuthBackend) // 인증 기반 서버 번역 로딩
.use(LanguageDetector) // 브라우저 언어 자동 감지
.init({
    // 번들 내장(resources) + 서버 로딩(backend) 동시 사용 허용하는 핵심 옵션
    partialBundledLanguages: true,
    // 번들 내장 폴백: 서버 응답 전 / 장애 시 사용
    resources: {
        ko: { common: koCommon },
        en: { common: enCommon },
    },
    ns: ['common', 'main'],
    defaultNS: 'common',
    fallbackLng: 'ko',
    interpolation: {
        escapeValue: false, // React는 XSS를 자체 처리하므로 불필요
    },
    // AuthBackend에 전달되는 옵션
    backend: {
        loadPath: '/api/i18n/translations?lng={{lng}}&ns={{ns}}',
        getToken,
        cacheTTL: 5 * 60 * 1000, // 5분
    },
    // LanguageDetector 옵션
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18n_language', // localStorage 키명
    },
})
.then(() => {
    // i18n 초기화 완료 후 렌더링 — 첫 화면부터 번역 텍스트 정상 표시 보장
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <AppProviders queryConfig={queryConfig}>
                <App />
            </AppProviders>
        </StrictMode>,
    );
});
```





## 다국어 세팅 각 앱에서 사용
---