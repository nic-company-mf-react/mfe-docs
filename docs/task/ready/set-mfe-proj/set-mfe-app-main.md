---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "mfe-app-main 환경구성"
---

# mfe-app-main(Host 앱) 환경구성


## React 프로젝트 생성
---
* [React 애플리케이션 기본 프로젝트 생성 가이드](./init-project-setup)를 참조하여 프로젝트를 생성합니다.








## react-router 설치
---
:::warning 멀티레포, 마이크로 프론트엔드 환경에서 라우팅을 구현하기 위해 <span class="admonition-title">react-router</span> 관리
* 멀티레포 MFE 환경에서 **react-router**를 각 앱이 따로 설치하면, 런타임에 여러 개의 라우터 인스턴스가 생겨 **useNavigate, useLocation** 등이 동작하지 않는 심각한 문제가 발생할 수 있습니다.
* 따라서 다음과 같이 설정이 되어야 합니다.  
  - **host 앱** : `react-router`를 설치하고, vite.config.ts 파일에 `react-router`를 **federation shared**에 등록합니다.
  - **remote 앱** : `react-router`를 설치하고, vite.config.ts 파일에 `react-router`를 **federation shared**에 등록합니다.
  - **공유 라이브러리** : `react-router`를 설치하고(개발용), peerDependencies 등록합니다.
:::

### 1. host 앱 react-router 설치
* `react-router`를 설치하고 `@module-federation/vite` 패키지를 설치하여 Vite 프로젝트에서 Module Federation을 사용할 수 있도록 합니다.
* 이 설정은 **리모트 앱**에서도 동일하게 적용하면 됩니다.
  ```sh
  npm install react-router
  npm install @module-federation/vite --save-dev
  ```


### 2. Host 앱 `vite.config.ts` 설정
```ts showLineNumbers
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// highlight-start
import { federation } from '@module-federation/vite';
// highlight-end
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // highlight-start
    federation({
      name: 'mfe-app-main',
      // 리모트 앱은 추후 생성되면 연결하여 사용합니다.
      //remotes: {
      //  mfe_docs: 'http://localhost:5174/mf-manifest.json',
      //},
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router': { singleton: true, requiredVersion: '^7.0.0' },
      },
    }),
    // highlight-end
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
  },
}); 
```


### 3. Host 앱 라우터 설정
* 설치한 `react-router`를 사용하여 **RouterProvider**에 router를 전달하여 라우팅을 적용합니다.
* `src/App.tsx` 파일 코드를 모두 삭제하고 다음 코드를 추가합니다.
  ```tsx showLineNumbers
  // highlight-start
  import { RouterProvider } from 'react-router';
  import router from '@/core/router';
  // highlight-end

  export function App() {
    return (
      <>
        {/* TODO: 추가 html 요소가 있으면 추가. */}
        // highlight-start
        <RouterProvider router={router} />
        // highlight-end
      </>
    );
  }

  export default App;
  ```
* `src/core/router/index.ts` 파일이 없기 때문에 신규 생성합니다.
  - 이 파일은 공통함수 **createAppRouter** 함수를 통해 **router** 인스턴스를 생성, 설정하고, 각 **개별업무(domain) 라우터**를 통합해서 리턴해주는 core 라우터 파일입니다. 공통 core영역 파일이기 때문에 공통 개발자 외에는 수정할 일이 없습니다.
  - **개별업무(domain) 라우터**는 `src/shared/router/index.ts` 파일에 있습니다.
  ```ts showLineNumbers
  import { createAppRouter } from './app-common-router.ts';
  import routes from '@/shared/router';

  const router = createAppRouter(routes, {
    // .env 파일에 설정된 VITE_ROUTER_BASENAME 값을 사용합니다.
    basename: import.meta.env.VITE_ROUTER_BASENAME,
  });

  export * from './app-common-router.ts';
  export default router;
  ```

* `src/core/router/app-common-router.ts` 파일이 없기 때문에 신규 생성합니다.
  - 이 파일은 **react-router**의 **createHashRouter** 또는 **createBrowserRouter** 함수를 통해 **router** 인스턴스를 생성하고, **$router** 객체를 구현한 파일입니다.
  ```ts showLineNumbers
  import { createHashRouter, type DOMRouterOpts } from 'react-router';
  import type { TAppRoute } from '@nic/mfe-lib-shared/types';

  export const createAppRouter = (routes: TAppRoute[], opts?: DOMRouterOpts) => {
    // createBrowserRouter는 서버 설정이 필요 (모든 경로를 index.html로 리다이렉트)하기 때문에 사용하지 않는다.
    //return createBrowserRouter(routes, opts);
    return createHashRouter(routes, opts);
  };

  // $router 객체 구현은 추후 예정
  ```

* `src/shared/router/index.tsx` 파일이 없기 때문에 신규 생성합니다.
  - 현재 파일에서 각 domain 업무가 추가 될 때마다 해당 업무 라우터를 계속 등록합니다.
  - `import MainRouter from '@/domains/main/router';` 이와같이 현재는 **main** 업무가 없기 때문에 다음 스탭의 업무 추가 하면서 생성합니다.
  - `import RootLayout from '@/shared/components/layout/RootLayout';` 이와같이 현재는 **루트 레이아웃**이 없기 때문에 다음 스탭에서 추가합니다.
  ```ts showLineNumbers
  import type { TAppRoute } from '@nic/mfe-lib-shared/types';

  // root layout 가져오기 -----------
  import RootLayout from '@/shared/components/layout/RootLayout';

  // main router 가져오기 ----------------
  import MainRouter from '@/domains/main/router';
  // example router 가져오기 -------------
  //import ExampleRouter from '@/domains/example/router';

  const routes: TAppRoute[] = [
    {
      path: '/',
      element: <RootLayout />,
      children: MainRouter,
    },
    // 업무(domain) 라우터 생성될 때 다음과 같이 추가가
    //{
    //	path: '/example',
    //	element: <RootLayout />,
    //	children: ExampleRouter,
    //},
    {
      path: '*',
      element: (
        <RootLayout
        //message="죄송합니다. 현재 시스템에 일시적인 문제가 발생했습니다."
        //subMessage="잠시 후 다시 접속해주세요.
        //           <br />
        //           문제가 지속되면 아래 고객센터로 문의해주세요."
        />
      ),
    },
  ];

  export default routes;
  ```
 








## RootLayout 컴포넌트 생성
---
* **루트 레이아웃**은 모든 페이지의 공통 레이아웃을 정의하는 컴포넌트입니다.
* `src/shared/components/layout/RootLayout.tsx` 파일이 없기 때문에 신규 생성합니다.
  ```tsx showLineNumbers
  import LayoutContent from './LayoutContent';

  interface IRootLayoutProps {
    //
  }

  export default function RootLayout({}: IRootLayoutProps): React.ReactNode {
    return <LayoutContent />;
  }
  ```
* `src/shared/components/layout/LayoutContent.tsx` 파일이 없기 때문에 신규 생성합니다.
  - 우선 간단하게 구현하고 추후 수정 예정입니다.
  ```tsx showLineNumbers
  import { Outlet } from 'react-router';

  export default function LayoutContent(): React.ReactNode {
    return (
      <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        루트 레이아웃!!
        <Outlet />
      </div>
    );
  }
  ```









## Main 업무 추가
---
* **domains** 폴더에 **main** 업무를 추가하겠습니다.
* 다음과 같이 기본 **main** 업무 폴더 구조를 생성합니다.
  ```sh
  src/domains/main/
  ├── pages/
  |   └── MainIndex.tsx
  ├── router/
  |   └── index.tsx
  ```
* `src/domains/main/pages/MainIndex.tsx` 파일이 없기 때문에 신규 생성합니다.
  ```tsx showLineNumbers
  export default function MainIndex(): React.ReactNode {
    return (
      <div>
        <h1>Main Index</h1>
      </div>
    );
  }
  ```
* `src/domains/main/router/index.tsx` 파일이 없기 때문에 신규 생성합니다.
  ```tsx showLineNumbers
  import type { TAppRoute } from '@nic/mfe-lib-shared/types';

  // 메인화면 컴포넌트 가져오기
  import MainIndex from '../pages/MainIndex';

  const routes: TAppRoute[] = [
    {
      path: '/',
      element: <MainIndex />,
      name: 'MainIndex',
    },
  ];

  export default routes;
  ```








## 로컬 서버 띄우기(브라우저 확인)
---
* 현재까지 진행하고 `npm run dev` 명령어를 실행하여 로컬 서버를 띄우면 **Module Federation** 의 **Bootstrap** 관련 에러가 발생합니다. 따라서 다음과 같이 설정을 해야 합니다.
* Module Federation 런타임이 초기화되기 전에 main.tsx가 이미 react를 불러와버리면서, singleton 제어가 제대로 되지 않아 react가 중복 로드되거나 정의되지 않은 상태로 남게 됩니다.

### Bootstrap 패턴 적용
* **1:** `src/main.tsx` 내용을 `src/Bootstrap.tsx`로 옮기기
  ```tsx showLineNumbers
  import { StrictMode } from 'react';
  import { createRoot } from 'react-dom/client';
  import './assets/styles/app.css';
  import App from './App.tsx';
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  ```
* **2.** `src/main.tsx`를 dynamic import만 하도록 교체
  ```tsx showLineNumbers
  // src/main.tsx
  import('./Bootstrap');
  ```
* **3.** 브라우저에서 확인
  - `http://localhost:5173/` 에 접속하여 확인합니다.
  - 상황에 따라 다음과 같이 port를 변경하여 띄울 수도 있습니다.
    ```json
    {
        "scripts": {
            "dev": "vite --port 5173",
        }
    }
    ```
    ![메인 애플리케이션 브라우저 확인](../../assets/ready/mfe-app-main/create-app02.png)








## 환경 변수 파일 구성
---
Remote 앱 URL을 환경 변수로 관리한다.
* `.env` — 환경 변수 파일(default)
* `.env.local` — 로컬 개발용
* `.env.development` — 개발 서버용
* `.env.production` — 프로덕션용
```env
# .env.local 예시
# Host 앱 포트
PORT=5000

# Vite Base URL (default: /)
VITE_BASE_URL=/

# Vite Router Base Name (default: /)
VITE_ROUTER_BASENAME=/

# 외부 API 기본 URL (테스트용)
VITE_EXTERNAL_API_BASE_URL1=https://koreanjson.com

# remote1 dev server 직접 연결
VITE_REMOTE_REMOTE1_URL=http://localhost:5001/remote1Entry.js
# corporate dev server 직접 연결
VITE_REMOTE_CORPORATE_URL=http://localhost:5002/corporateEntry.js
# asset dev server 직접 연결
VITE_REMOTE_ASSET_URL=http://localhost:5003/assetManagementEntry.js
# retirement dev server 직접 연결
VITE_REMOTE_RETIREMENT_URL=http://localhost:5004/retirementPensionEntry.js
# 리모트 앱 계속 추가...
```








## 공유 라이브러리(`@company/mfe-lib-shared`) 연동 관련
---
* 공유 라이브러리를 GitHub/GitLab 등에 올린 경우 npm install을 통해 공유 라이브러리 git을 설치할 수 있습니다.  
  ```sh
  # 설치 예시 명령어
  npm install git+https://github.com/nic-company/mf-lib-shared.git
  ```
  ```json
  // package.json
  "dependencies": {
    "@company/mfe-lib-shared": "git+https://github.com/nic-company/mf-lib-shared.git"
  }
  ```
  - host 앱과 remote 앱이 각자 배포 시점에 다른 커밋을 참조할 수 있으므로 좀 더 안정적인 설치 배포 방식은 커밋 해시로 버전 고정하는 것이 권장됩니다.
    ```json
    "dependencies": {
      "@company/mfe-lib-shared": "git+https://github.com/nic-company/mf-lib-shared.git#commit-hash"
      // 또는 "@company/mfe-lib-shared": "git+https://github.com/nic-company/mf-lib-shared.git#v1.0.0"
    }
    ```
* 공유 라이브러리가 아직 npm에 배포되기 전이면, `file:` 경로 또는 git 링크로 연결할 수 있습니다.
  ```json
  "dependencies": {
    "@company/mfe-lib-shared": "file:../mfe-lib-shared"
  }
  ```

  :::tip <span class="admonition-title">공유 라이브러리 배포 방식</span> (중장기 권장 방식)
  * 중장기적으로는 GitHub Package Registry를 사용하는 것이 권장됩니다.
  ```sh
  # mfe-lib-shared에서 배포
  npm publish --registry https://npm.pkg.github.com

  # 각 앱 .npmrc에 추가
  @nic:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
  ```
  ```json
  // package.json
  "@company/mfe-lib-shared": "^1.0.0"  // 진짜 semver 사용 가능
  ```
  &#8251; 인터넷 연결 없는 폐쇄망 환경이라면
  사내 프라이빗 레지스트리 운영(완전 독립)
  :::

* 공유 라이브러리의 UI 컴포넌트 파일에 Tailwind 클래스가 포함되어 있으므로, Tailwind v4가 해당 소스를 스캔하도록 `src/assets/styles/app.css`에 **@source** 지시어를 추가해야한다.
  ```css
  @import "tailwindcss";
  /* 공유 라이브러리의 빌드 결과물로 가져오려면 src를 dist로 변경해야한다. */
  @source "../../node_modules/@company/mfe-lib-shared/src/**/*.{ts,tsx}";
  ```













## layout.tsx - 공통 레이아웃 구성(고민필요)
---
Host 앱의 레이아웃은 Host 앱에서 직접 렌더링되는 페이지에만 적용된다. Remote 앱의 페이지에는 Remote 앱 자체 레이아웃이 적용되므로, 공통 네비게이션/헤더가 필요하다면 공유 라이브러리에 Shell 컴포넌트를 두고 Host/Remote 앱 모두에서 import하는 방식을 권장한다.

