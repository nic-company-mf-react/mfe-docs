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







- 최종 설치 완료된 프로젝트를 띄우기 위해 `npm run dev`명령어를 실행하여 로컬 서버를 띄웁니다.
    - **port**를 변경하려면 `package.json`파일에서 포트 설정을 합니다.
        ```json
        {
            "scripts": {
                "dev": "next dev -p 5173"
            }
        }
        ```
    - 또는 **cross-env** 패키지를 사용하여 포트 설정, 다음 명령어로 설치 후 `package.json`파일에 설정합니다.
        ```sh
        # cross-env 패키지 설치
        npm install cross-env --save-dev
        ```
        ```json
        {
            "scripts": {
                "dev": "cross-env PORT=5173 next dev"
            }
        }
        ```
        ![next 로컬 서버 띄우기 예시](../../assets/ready/set-mf-main02.png)
        ![next 로컬 서버 띄우기 예시](../../assets/ready/set-mf-main03.png)










## VSCode(Visual Studio Code) 설정
---

### settings.json 셋팅 (VSCode 설정)

<span class="react-color">Frontend (React)</span> 개발을 위해 **VSCode**를 활용할 것입니다. 따라서 개발자의 통일된 코드 작성을 위하여 **VSCode**의 환경설정을 **settings.json**파일에 적용합니다.

#### settings.json 설정

> - **settings.json 파일열기** : f1 ⤍ settings 입력 ⤍ Preferences: Open Workspace Settings (JSON) 클릭.  
>   위와같이 열면 프로젝트 루트에 **.vscode** 디렉토리가 생성되고 **settings.json**파일이 생성됩니다.
> - **settings(설정)가 적용되는 우선 순위** : .vscode settings.json ⤇ settings.json ⤇ defaultSetting.json(<span class="text-color-red">수정하지 않는 파일.</span>)  
>   <span class="text-color-red">defaultSetting.json은 모든 설정내용이 다 들어있는 기본 설정 파일입니다. 수정은 하지 않는 파일입니다.</span>
> - **.vscode** 디렉토리에 생성된 **settings.json** 파일에 아래 내용 입력합니다.

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "editor.insertSpaces": false,
  "editor.renderWhitespace": "all",
  "editor.comments.insertSpace": false,
  "files.associations": {
    "*.json": "jsonc"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.useFlatConfig": true,
  "css.lint.unknownAtRules": "ignore",
  "scss.lint.unknownAtRules": "ignore",
  "less.lint.unknownAtRules": "ignore"
}
```

:star: 이렇게 `settings.json` 파일로 **VSCode** 설정을 하면 **메뉴(File ⤍ Preferences ⤍ Settings)** 로 설정한것 보다 우선순위가 높게 적용됩니다.

:::info 설명
- **"editor.formatOnSave"** : 파일 저장 시 자동으로 코드 서식을 정리합니다.
- **"editor.codeActionsOnSave" ⤍ "source.fixAll.eslint"** : 파일 저장 시 ESLint가 감지한 모든 문제를 자동으로 수정합니다.
- **"editor.tabSize"** : 탭 크기를 몇칸으로 설정할지 지정합니다.
- **"editor.detectIndentation"** : VSCode가 파일의 들여쓰기를 자동으로 감지하는 기능을 활용할지 여부 입니다.
- **"editor.insertSpaces"** : 탭 키를 누를 때 공백 대신 탭 문자를 삽입합니다.
- **"editor.renderWhitespace"** : 공백 문자를 시각적으로 표시합니다.
- **"editor.comments.insertSpace"** : 주석 기호(//, /\*) 뒤에 자동으로 공백을 삽입할지 여부 입니다.
- **"files.associations" ⤍ "\*.json": "jsonc"** : .json 파일을 jsonc(주석이 있는 JSON) 형식으로 인식하도록 설정합니다.
- **"eslint.validate": \["javascript", "javascriptreact", "typescript", "typescriptreact"\]** : ESLint가 TypeScript, React, JavaScript 파일을 검사하도록 설정합니다.
- **"eslint.workingDirectories"** : \[\{"mode":"auto"\}\] : ESLint 작업 디렉토리를 자동으로 감지하도록 설정합니다.
- **"editor.defaultFormatter": "esbenp.prettier-vscode"** : VSCode의 기본 코드 포맷터로 Prettier를 사용합니다.
- **"eslint.useFlatConfig"** : ESLint의 설정방식이 `v8.21.0` 부터 **Flat Config**를 지원하면서, 구성 형식을 **Flat Config**으로 할지 여부 설정.

- **"css.lint.unknownAtRules": "ignore"** : VSCode에서 CSS의 "Unknown At Rules" 경고를 무시하도록 설정.
- **"scss.lint.unknownAtRules": "ignore"** : VSCode에서 scss의 "Unknown At Rules" 경고를 무시하도록 설정.
- **"less.lint.unknownAtRules": "ignore"** : VSCode에서 less의 "Unknown At Rules" 경고를 무시하도록 설정.
:::

:::tip <span class="admonition-title">Tailwind CSS</span>사용 시 다음 설정 적용.
* **Tailwind CSS**의 @apply, @layer 등으로 인한 경고라면 위 설정(**css.lint.unknownAtRules : "ignore"**)으로 해결됩니다. 그리고 **Tailwind CSS IntelliSense** VSCode 확장(Extensions)을 설치하면 더 나은 지원을 받을 수 있습니다.
:::

:::tip <span class="admonition-title">ESLint</span> 설정방식에 대하여

- **ESLint**가 `v8.21.0` 부터 새로운 구성방식인 플랫 구성(Flat Config) 시스템을 지원합니다. 기존 방식은 `.eslintrc` 파일을 이용한 구성 방식이었습니다.
- `v9.0.0`부터는 기본 구성방식이 플랫 구성(Flat Config) 시스템으로 바뀌게 됩니다.
:::








## 환경 변수 파일 구성
---
Remote 앱 URL을 환경 변수로 관리한다.
* `.env.local` — 로컬 개발용
* `.env.development` — 개발 서버용
* `.env.production` — 프로덕션용
```env
# .env.local 예시
NEXT_PUBLIC_REMOTE_REMOTE1_URL=http://localhost:5174
NEXT_PUBLIC_REMOTE_REMOTE2_URL=http://localhost:5175
```








## next.config.ts - Multi Zones rewrites 설정
---
Host 앱이 Remote 앱들의 요청을 프록시하도록 rewrites를 설정한다.  
Remote 앱 각각은 basePath: '/blog'처럼 독립적인 basePath를 가져야 충돌이 없다.
```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: `${process.env.NEXT_PUBLIC_REMOTE_REMOTE1_URL}/blog`,
      },
      {
        source: "/blog/:path*",
        destination: `${process.env.NEXT_PUBLIC_REMOTE_REMOTE1_URL}/blog/:path*`,
      },
      // 다른 remote 앱 경로 추가...
    ];
  },
};

export default nextConfig;
```







## 공유 라이브러리(`@nic/mf-lib-shared`) 연동
---
* 공유 라이브러리를 GitHub/GitLab 등에 올린 경우 npm install을 통해 공유 라이브러리 git을 설치할 수 있습니다.  
  ```sh
  npm install git+https://github.com/nic-company/mf-lib-shared.git
  ```
  ```json
  // package.json
  "dependencies": {
    "@nic/mf-lib-shared": "git+https://github.com/nic-company/mf-lib-shared.git"
  }
  ```
  - host 앱과 remote 앱이 각자 배포 시점에 다른 커밋을 참조할 수 있으므로 좀 더 안정적인 설치 배포 방식은 커밋 해시로 버전 고정하는 것이 권장됩니다.
    ```json
    "dependencies": {
      "@nic/mf-lib-shared": "git+https://github.com/nic-company/mf-lib-shared.git#commit-hash"
      // 또는 "@nic/mf-lib-shared": "git+https://github.com/nic-company/mf-lib-shared.git#v1.0.0"
    }
    ```
* 공유 라이브러리가 아직 npm에 배포되기 전이면, `file:` 경로 또는 git 링크로 연결할 수 있습니다.
  ```json
  "dependencies": {
    "@nic/mf-lib-shared": "file:../mf-lib-shared"
  }
  ```

  :::tip <span class="admonition-title">공유 라이브러리 배포 방식</span> (중장기 권장 방식)
  * 중장기적으로는 GitHub Package Registry를 사용하는 것이 권장됩니다.
  ```sh
  # mf-lib-shared에서 배포
  npm publish --registry https://npm.pkg.github.com

  # 각 앱 .npmrc에 추가
  @nic:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
  ```
  ```json
  // package.json
  "@nic/mf-lib-shared": "^1.0.0"  // 진짜 semver 사용 가능
  ```
  &#8251; 인터넷 연결 없는 폐쇄망 환경이라면
  사내 Verdaccio 프라이빗 레지스트리 운영(완전 독립)
  :::

* 공유 라이브러리의 UI 컴포넌트 파일에 Tailwind 클래스가 포함되어 있으므로, Tailwind v4가 해당 소스를 스캔하도록 `src/assets/styles/app.css`에 **@source** 지시어를 추가한다.
  ```css
  @import "tailwindcss";
  /* 공유 라이브러리의 빌드 결과물로 가져오려면 src를 dist로 변경해야한다. */
  @source "../../node_modules/@nic/mf-lib-shared/src/**/*.{ts,tsx}";
  ```







## tsconfig.json 경로 alias 추가
---
공유 라이브러리 import 경로를 명확하게 하기 위하여 `tsconfig.json`에 **path**를 추가한다.  
@nic/mf-lib-shared path alias는 로컬 file 링크 개발 시 타입 추론을 돕기 위한 설정이다. npm 배포 후에는 제거한다.
* <span class="text-color-red">현재는 `git+저장소url` 방식으로 설치 했기 때문에 아래 alias를 적용하지 않는다.</span>
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@nic/mf-lib-shared": ["../../mf-lib-shared/src/index.ts"] // 로컬 개발용
    }
  }
}
```







## layout.tsx - 공통 레이아웃 구성
---
Multi Zones에서 Host 앱의 레이아웃은 Host 앱에서 직접 렌더링되는 페이지에만 적용된다. Remote 앱의 페이지에는 Remote 앱 자체 레이아웃이 적용되므로, 공통 네비게이션/헤더가 필요하다면 공유 라이브러리에 Shell 컴포넌트를 두고 Host/Remote 앱 모두에서 import하는 방식을 권장한다.

