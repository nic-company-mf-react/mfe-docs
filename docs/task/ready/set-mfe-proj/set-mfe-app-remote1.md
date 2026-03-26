---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "mfe-app-remote1 환경구성"
---

# mfe-app-remote1(Remote 앱) 환경구성


## React 프로젝트 생성
---
* [React 애플리케이션 기본 프로젝트 생성 가이드](./init-project-setup)를 참조하여 프로젝트를 생성합니다.






## Host 앱에 마운트 가능하도록 설정
---
다음 설정들은 **독립 실행 가능한 React 앱**을 **Host에 안전하게 마운트 가능한 MF 모듈**로 전환하기 위한 최소한의 기본 구성입니다.

* **`vite.config.ts`** 파일의 **Federation 설정**을 추가합니다.
    ```ts
    export default defineConfig({
        plugins: [
            // ...
            // highlight-start
            federation({
                name: 'remote1App',
                dts: false,
                filename: 'remote1Entry.js',
                exposes: {
                    './Remote1App': './src/bridge.tsx',
                },
                shared: { /* 기존 유지 */ },
            }),
            // highlight-end
        ],
        resolve: {
            alias: {
            "@": resolve(__dirname, "src"),
            },
        },
        // highlight-start
        server: {
            port: 5174,
            cors: true,
        },
        // highlight-end
    });
    ```
    :::info <span class="admonition-title">Federation</span>설정 설명
    * **name**: `remote1App` 리모트 앱 이름
        - Module Federation에서 이 앱을 식별하는 고유 ID입니다. Host 앱이 Remote를 참조할 때 이 name을 기준으로 모듈을 찾기 때문에, Host의 `remotes` 설정과 반드시 일치해야 합니다. 만약 잘못된 이름이 들어가면 Host가 Remote 모듈을 로드하지 못합니다.
        - 이름은 하이픈(-)이 포함되지 않는 카멜 케이스(camelCase)로 작성하는 것이 좋습니다. 예를 들어, `mfe-app-remote1` → `remote1App`
            - 브라우저 전역(global) 변수명으로 사용될 수 있기 때문에 되도록이면 하이픈(-)이 포함되지 않는 카멜 케이스(camelCase)로 작성하는 것이 좋습니다.
            ```ts
            // 내부적으로 이런 방식으로 노출됨 (Webpack 기준)
            window["mfe-app-remote1"] = { ... }  // 접근 가능하지만 식별자로는 불가
            window.remote1App = { ... }           // 정상적인 JS 식별자
            ```

    * **filename**: `remote1Entry.js` 추가
        - 빌드 결과물에서 MFE 진입점 파일의 이름을 명시적으로 지정합니다.
        - Module Federation은 빌드 시 매니페스트/엔트리 파일을 생성합니다. filename을 지정하지 않으면 기본값(remoteEntry.js)이 사용되는데, 여러 Remote가 있는 멀티레포포 구조에서는 각 Remote마다 고유한 파일명을 주는 것이 관리상 명확합니다. Host 앱은 이 URL을 `remotes` 설정에 등록합니다:
        ```ts
        // Host의 vite.config.ts (예시)
        remotes: {
            remote1: 'http://localhost:5174/remote1Entry.js'
        }
        ```
    * **exposes**: `{ './Remote1App': './src/bridge.tsx' }` 추가
        - 이 Remote 앱이 외부(Host)에 노출할 모듈을 선언합니다.
        - `exposes`는 "이 Remote 앱에서 Host가 import해서 쓸 수 있는 모듈 목록" 입니다.
        - `Key('./Remote1App')`는 Host에서 import('remote1/Remote1App')으로 접근할 때 쓰는 경로, `Value('./src/bridge.tsx')`는 실제 소스 파일 경로입니다.
        - `exposes`가 없으면 이 앱은 Remote로서 아무것도 제공하지 않는 빈 껍데기가 됩니다.

    * **dts: false** 추가
        - TypeScript 타입 정의(.d.ts) 자동 생성 비활성화
        - @module-federation/vite는 기본적으로 Remote가 노출하는 모듈의 타입 파일을 자동으로 생성하고 Host에게 배포하려 시도합니다. 이 기능은 편리하지만 초기 설정이나 단순 구조에서는 불필요한 빌드 에러나 복잡성을 만들 수 있어, false로 비활성화하는 것이 일반적인 시작점입니다.

    * **server.cors: true** 추가
        - 개발 서버가 Cross-Origin 요청을 허용하도록 설정합니다.
        - Host 앱(예: localhost:5173)이 Remote 앱(localhost:5174)의 번들 파일을 런타임에 동적으로 fetch합니다. 브라우저의 CORS 정책에 의해 다른 포트는 다른 Origin으로 취급되므로, Remote 개발 서버가 CORS 헤더를 응답하지 않으면 Host가 Remote 파일 로드에 실패합니다.
    :::

* **`src/bridge.tsx`** 신규 생성
    ```tsx
    import './assets/styles/app.css';
    import { useRoutes } from 'react-router';
    import routes from '@/shared/router'; // 통합 라우터 참조

    const Remote1App = () => {
        // useRoutes는 라우트 배열을 "URL → 컴포넌트" 변환 테이블로 보고, 현재 URL에 해당하는 컴포넌트를 돌려주는 역할
        const element = useRoutes(routes);
        return <>{element}</>;
    };

    export default Remote1App;
    ```
    :::info <span class="admonition-title">src/bridge.tsx</span> 설명
    * Remote 앱을 Host에 마운트하기 위한 "어댑터" 컴포넌트입니다.
    현재 Remote 앱의 구조를 보면: `main.tsx`  →  `Bootstrap.tsx`  →  `App.tsx`  →  `RouterProvider (createBrowserRouter)`
        - `App.tsx`는 `RouterProvider`로 자체 Router 인스턴스를 생성합니다. 이걸 그대로 Host에 노출하면 Host의 Router와 충돌합니다. React Router는 앱 전체에 단 하나의 Router Context만 존재해야 하는데, Host도 자신의 RouterProvider를 가지고 있기 때문입니다. `bridge.tsx`가 이런 문제를 해결하는 역할을 합니다.

    * 그 외 에도 `bridge.tsx`는 'ErrorBoundary' 추가, Host로부터 props 수신, 전역 상태(Context) 주입, 인증 토큰 전달 등의 기능을 할 수 있습니다.
    * 현재는 Router Context 충돌 해결 부분만 있는데, 추후 필요한 기능들을 추가할 수 있습니다.
    :::






