---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "mfe-lib-shared 환경구성"
---

# mfe-lib-shared 환경구성
**@nic/mfe-lib-shared** 는 Micro Frontend 프로젝트에서 공통으로 사용되는 라이브러리를 제공하는 **공유 라이브러리 패키지** 입니다.


:::info 공통 라이브러리의 역할
* 공통 라이브러리는 다음과 같은 공유 자산을 모든 마이크로 프론트엔드(Host 및 Remote 앱)에 제공합니다:
  - **UI 컴포넌트**: 디자인 시스템, 공통 UI 요소 (Button, Input, Modal 등)
  - **유틸리티 함수**: 날짜 포맷팅, 데이터 변환, 검증 로직 등
  - **타입 정의**: 공통 인터페이스, 타입, Enum 등
  - **설정 파일**: ESLint, Prettier, TypeScript 공통 설정
  - **상수**: API 엔드포인트, 환경 변수, 설정 값 등
  - **훅(Hooks)**: 커스텀 React 훅
  - **스타일**: 공통 스타일, 테마, CSS 변수

* 마이크로 프론트엔드에서 공통 라이브러리가 필요한 이유
  1. **코드 중복 방지**
    - 여러 마이크로 프론트엔드에서 동일한 코드를 반복 작성하지 않음
    - Single Source of Truth 원칙 구현

  2. **일관성 유지**
    - 모든 앱에서 동일한 UI/UX 제공
    - 디자인 시스템의 중앙 관리
    - 브랜드 아이덴티티 통일

  3. **유지보수성 향상**
    - 한 곳에서 수정하면 모든 앱에 반영
    - 버그 수정 및 개선 사항의 빠른 전파

  4. **개발 생산성 증대**
    - 검증된 컴포넌트/함수 재사용
    - 개발 시간 단축
    - 표준화된 개발 패턴 제공

  5. **타입 안정성**
    - 공통 타입 정의로 타입 불일치 방지
    - TypeScript의 강력한 타입 체킹 활용

* 공통 라이브러리 사용 방식
  - 멀티레포 환경에서는 npm 레지스트리(또는 사설 레지스트리)에 패키지를 배포한 뒤, 각 레포지토리에서 패키지를 설치하여 참조합니다:

```json
// Host 또는 Remote 앱의 package.json
{ "dependencies": { "@nic/mfe-lib-shared": "^1.0.0" } }
// npm install @nic/mfe-lib-shared 명령으로 설치하여 사용.
```

```tsx
// 실제 사용 예시
import { Button, Card, Input, Badge, cn } from '@nic/mfe-lib-shared/components';
import { formatDate, validateEmail } from '@nic/mfe-lib-shared/utils';
import type { User, ApiResponse } from '@nic/mfe-lib-shared/types';

function UserProfile() {
  const user: User = { /* ... */ };
  
  return (
    <Card>
      <h1>{user.name}</h1>
      <p>{formatDate(user.createdAt)}</p>
      <Button>프로필 수정</Button>
    </Card>
  );
}
```
:::


## 1. 패키지 생성
---
* `mfe-lib-shared` 공유 라이브러리 패키지 프로젝트를 **Vite** 프로젝트로 생성합니다.
```sh
# mfe-lib-shared 폴더 안에서 실행
# 현재 폴더에 바로 생성하려면 . 사용
npm create vite@latest . -- --template react-ts
```
![공유 라이브러리 패키지 최초 Vite 설치 예시시](../../assets/ready/mfe-lib-shared/install-vite01.png)

* 생성된 프로젝트에서 `package.json` 파일의 패키지 이름을 변경합니다.
```json
{
  "name": "@nic/mfe-lib-shared",
  ...

```

* 생성된 폴더구조
  ```sh
  @nic/mfe-lib-shared/
  ├─public              # 정적 파일 (favicon 등)
  ├─src                 # 소스 코드 루트
  ├─.gitignore          # Git 추적 제외 파일 목록
  ├─eslint.config.js    # ESLint 설정 파일
  ├─index.html          # Vite 진입점 HTML
  ├─package.json        # 패키지 메타데이터 및 의존성 정의
  ├─README.md           # 프로젝트 설명 문서
  ├─tsconfig.app.json   # 앱 소스 코드용 TypeScript 설정
  ├─tsconfig.json       # TypeScript 기본 설정 (루트)
  ├─tsconfig.node.json  # Node.js 환경(vite.config 등)용 TypeScript 설정
  └─vite.config.ts      # Vite 빌드 및 개발 서버 설정
  ```
* 불필요한 앱 파일 정리
Vite가 만든 파일 중 라이브러리에 불필요한 것들을 제거합니다.
  ```sh
  삭제: index.html
  삭제: src/App.tsx
  삭제: src/App.css
  삭제: src/main.tsx
  삭제: src/assets/
  삭제: public/
  ```
* `npm install` 명령어를 실행하여 의존성 라이브러리를 설치합니다.
  ```sh
  # npm install 을 실행하면 node_modules 폴더가 생성됩니다.
  npm install
  ```











## 2. Shadcn UI 컴포넌트 설치를 위한 세팅
---
* **mfe-lib-shared** 패키지는 기본 UI 컴포넌트 제공용으로 [Shadcn UI](https://ui.shadcn.com/)를 사용합니다.  
* Shadcn UI 컴포넌트를 설치하고 하나의 폴더에서 관리하기 위하여 다음과 같이 세팅을 진행합니다.
  - Shadcn UI 관련 파일은 모두 `src/components/shadcn` 폴더에서 관리합니다.


### Tailwind CSS 설치
```sh
# Tailwind CSS 설치
npm install -D tailwindcss @tailwindcss/vite
```


### vite.config.ts 수정
* Tailwind CSS 플러그인을 추가하고, alias를 설정합니다.
  ```ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  // highlight-start
  import tailwindcss from '@tailwindcss/vite'
  import { resolve } from 'path'
  // highlight-end

  // https://vite.dev/config/
  export default defineConfig({
    // highlight-start
    plugins: [react(), tailwindcss(),],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    // highlight-end
  })
  ```


### `tsconfig.json`, `tsconfig.app.json`에 alias 추가
* compilerOptions 안에 두 줄 추가:
  ```json
  // tsconfig.json
  {
    // highlight-start
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    },
    // highlight-end
    "files": [],
    "references": [
      { "path": "./tsconfig.app.json" },
      { "path": "./tsconfig.node.json" }
    ]
  }
  ```
  ```json
  // tsconfig.app.json
  {
    "compilerOptions": {
      // highlight-start
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
      // highlight-end
      // ... 기존 설정들 그대로 유지
    }
  }
  ```


### `src/styles/globals.css` 생성
```css
@import "tailwindcss";
```


### 프로젝트 루트에 `components.json` 수동 생성 (shadcn 경로 커스터마이징)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components/shadcn/ui",
    "utils": "@/components/shadcn/lib/utils",
    "ui": "@/components/shadcn/ui",
    "lib": "@/components/shadcn/lib",
    "hooks": "@/components/shadcn/hooks"
  }
}
```


### shadcn 설치 실행
```sh
npx shadcn@latest init
```
![shadcn 설치 예시](../../assets/ready/mfe-lib-shared/install-vite02.png)


### UI 컴포넌트 설치
* 이제부터 각 UI 컴포넌트를 다음과 같이 설치하여 사용할 수 있습니다.
```sh
npx shadcn@latest add button   // button 컴포넌트 설치
npx shadcn@latest add input    // input 컴포넌트 설치
npx shadcn@latest add dialog   // dialog 컴포넌트 설치
npx shadcn@latest add dropdown // dropdown 컴포넌트 설치
npx shadcn@latest add menu     // menu 컴포넌트 설치
npx shadcn@latest add popover  // popover 컴포넌트 설치
npx shadcn@latest add tooltip  // tooltip 컴포넌트 설치
npx shadcn@latest add dropdown-menu // dropdown-menu 컴포넌트 설치
npx shadcn@latest add dropdown-item // dropdown-item 컴포넌트 설치
npx shadcn@latest add dropdown-menu-item // dropdown-menu-item 컴포넌트 설치
```


### 최종 디렉토리 구조 예시
```sh
@nic/mfe-lib-shared/src/
├─components          # 공통 컴포넌트
│  ├─shadcn              # Shadcn UI 컴포넌트
│  │  ├─ui               # Shadcn UI 컴포넌트 목록            
│  │  │  ├─button
│  │  │  └─...             
│  │  └─lib
│  │     └─utils.ts      # shadcn utils       
│  ├─providers
│  └─...
├─config              # 공통 설정
│  ├─eslint
│  └─prettier
├─design-system       # 공통 디자인 시스템
├─hooks               # 공통 훅
├─types               # 공통 타입
└─utils               # 공통 유틸리티 함수
```
:::info 설명
* 상황에 따라 필요한 컴포넌트, 유틸리티 함수, 타입 정의, 설정 파일 등을 제공하기 위한 디렉토리 구조를 생성하면 됩니다.
:::








## 3. 라이브러리 배포를 위한 설정
---
* `vite.config.ts` 파일을 수정하여 라이브러리 배포를 위한 설정을 합니다.
  ```ts
  // highlight-start
  import dts from 'vite-plugin-dts'
  // highlight-end
  // npm install -D vite-plugin-dts 먼저 설치
  export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      // highlight-start
      dts({ include: ['src'], insertTypesEntry: true }),
      // highlight-end
    ],
    // highlight-start
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
      },
      cssCodeSplit: false,
    },
    // highlight-end
  })
  ```
* `package.json` 파일을 수정하여 라이브러리 배포를 위한 설정을 합니다.
  ```json
  {
    "main": "./dist/index.cjs",
    "module": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "require": "./dist/index.cjs",
        "types": "./dist/index.d.ts"
      },
      "./styles": "./dist/style.css"
    }
  }
  ```
* 외부에 노출하는 진입점 파일(src/index.ts)을을 직접 만들어야 합니다.
  - `src/index.ts` 파일 생성
  ```ts
  // ── Shadcn 컴포넌트 ──
  export { Button, buttonVariants } from './components/shadcn/ui/button'
  // ── 유틸리티 ──
  export { cn } from './components/shadcn/lib/utils'
  // ── 직접 만든 공통 컴포넌트 (추후 추가) ──
  // export { CustomModal } from './components/Modal'
  ```
* 실제 빌드해보기
  `npm run build` 명령어를 통해 빌드를 실행해 봅니다. 빌드 결과물은 `dist` 폴더에 생성됩니다.
  ```sh
  npm run build
  ```
  ![빌드 예시](../../assets/ready/mfe-lib-shared/install-vite03.png)






## 4. 최종
---
* 현재까지 진행한 내용은 기본 패키지 구성 세팅 내용입니다. 프로젝트 공유 라이브러리 요구사항에 따라 추가적인 세팅이 필요할 수 있고 구조 또한 변경이 될 수도 있습니다.








## ESLint, Prettier 설정, 공유 적용 
---
* 모든 리모트 애플리케이션에서 공통으로 스타일을 적용하기 위하여 공유 라이브러리 패키지에 ESLint와 Prettier 설정 파일을 만들고, 공유하기 위한 작업을 합니다.  
* 처음부터 `*.js` 파일로 생성하여 빌드 과정을 거치지 않고 바로 사용할 수 있도록 합니다.







---
여기까지 완료!
다음 내용은 참고용.
---
### 3. package.json 설정 (구조 수정 필요, 추후 수정 예정)
```json
{
  "name": "@nic/mf-lib-shared",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./dist/globals.css": "./dist/globals.css",
    "./tailwind.config": "./tailwind.config.ts",
    "./config/eslint": {
      "types": "./dist/config/eslint/index.d.ts",
      "import": "./dist/config/eslint/index.mjs",
      "require": "./dist/config/eslint/index.js"
    },
    "./config/prettier": {
      "types": "./dist/config/prettier/index.d.ts",
      "import": "./dist/config/prettier/index.mjs",
      "require": "./dist/config/prettier/index.js"
    },
    "./config/eslint/base": "./dist/config/eslint/base.js",
    "./config/eslint/react": "./dist/config/eslint/react.js"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "dependencies": {
    "@eslint/js": "^9.39.1",
    "@radix-ui/react-slot": "^1.2.4",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "eslint-plugin-prettier": "^5.5.5",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "lucide-react": "latest",
    "tailwind-merge": "latest",
    "typescript-eslint": "^8.57.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@typescript-eslint/eslint-plugin": "^8.57.0",
    "@typescript-eslint/parser": "^8.57.0",
    "autoprefixer": "latest",
    "eslint": "^9.39.1",
    "eslint-config-prettier": "^10.1.8",
    "react": "^19",
    "react-dom": "^19",
    "tailwindcss": "^3",
    "tailwindcss-animate": "latest",
    "tsup": "latest",
    "typescript": "^5"
  }
}
```
:::info 설명
**주요 필드:**
* `name`: 패키지의 기본 엔트리 포인트 (레거시 방식, 단일 엔트리)
* `types`: TypeScript 타입 정의 파일의 위치
* `exports`: Node.js 12+에서 도입된 최신 엔트리 포인트 정의 방식

**exports 필드 구조**:
```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.mjs",
    "require": "./dist/index.js"
  },
  "./dist/globals.css": "./dist/globals.css",
  "./tailwind.config": "./tailwind.config.ts",
  "./config/eslint": {
    "types": "./dist/config/eslint/index.d.ts",
    "import": "./dist/config/eslint/index.mjs",
    "require": "./dist/config/eslint/index.js"
  },
  "./config/prettier": {
    "types": "./dist/config/prettier/index.d.ts",
    "import": "./dist/config/prettier/index.mjs",
    "require": "./dist/config/prettier/index.js"
  },
  "./config/eslint/base": "./dist/config/eslint/base.js",
  "./config/eslint/react": "./dist/config/eslint/react.js"
},
```

**중요**: 
- `exports`는 **빌드된 파일** (`./dist/`)을 참조해야 합니다
- 소스 파일(`./src/`)이 아닌 컴파일된 결과물을 참조
- `types`와 `default`또는 `import, require`를 함께 지정하여 타입과 런타임 코드를 명확히 구분
- `default`는 모든 모듈 시스템(CommonJS, ESM)에서 사용 가능한 fallback 옵션입니다.
- `import`는 ESM(ECMAScript Module) 방식으로 import될 때 사용되는 엔트리 포인트를 정의합니다.
- `require`는 CommonJS 방식(`require()`)으로 import될 때 사용되는 엔트리 포인트를 정의합니다.

- **exports 조건 목록**
  - **공식 Node.js 조건**
    | 조건 | 설명 |
    | --- | --- |
    | **import** | import / import() (ESM) 방식으로 불러올 때 사용되는 엔트리포인트 |
    | **require** | require() (CommonJS) 방식으로 불러올 때 사용되는 엔트리포인트 |
    | **default** | 위 조건들에 매칭되지 않을 때 사용되는 fallback. ESM/CJS 모두에서 동작 |
    | **node** | Node.js 환경에서 실행될 때 적용 |
    | **node-addons** | Node.js native addon (*.node) 사용 시 적용 |
    | **browser** | 브라우저 환경에서 실행될 때 적용 (번들러가 인식) |
    | **worker** | Web Worker / Node.js Worker Thread 환경에서 적용 |
    | **deno** | Deno 런타임에서 실행될 때 적용 |
    | **development** | 개발 환경 (NODE_ENV=development)에서 적용 |
    | **production** | 프로덕션 환경 (NODE_ENV=production)에서 적용 |
  - **TypeScript / 빌드 툴 관련 조건**
    | 조건 | 설명 |
    | --- | --- |
    | **types** | TypeScript가 타입 정의(.d.ts)를 찾을 때 사용하는 엔트리포인트 |
    | **source** | 번들러가 원본 소스 파일(.ts 등)을 직접 참조할 때 사용 (Vite, Rollup 등) |
    | **module** | 번들러용 ESM 엔트리포인트. Webpack/Rollup이 인식하는 비공식 조건 |
    | **bundle** | 이미 번들된 버전을 가리킬 때 사용하는 관례적 조건 |

  - **중요한 조건**
    - 순서가 중요 - 위에서부터 매칭되는 첫 번째 조건이 사용됩니다. default는 반드시 마지막에 위치해야 합니다.
    - types는 항상 첫 번째 - TypeScript 공식 권고사항으로, types를 가장 먼저 배치해야 타입 추론이 올바르게 동작합니다.
    - 커스텀 조건도 가능 - 번들러나 런타임이 --conditions 플래그로 임의 조건을 추가할 수 있습니다.

**장점**: 
- **명시적인 API 관리**: exports에 정의하지 않은 파일은 외부에서 접근 불가
- **서브패스 Export**: 각 기능별로 독립적인 import 경로 제공
- **Tree-shaking 최적화**: 필요한 모듈만 import하여 번들 크기 감소
- **타입 안정성**: types 필드로 TypeScript 지원 강화
- **개발 경험 향상**: IDE 자동완성, 명확한 import 경로

**실제 사용 예시**:
```tsx
// 각 서브패스로 필요한 것만 import
import { Button, Card } from '@rm/monorepo-mf-shared-library/components';
import { formatDate } from '@rm/monorepo-mf-shared-library/utils';
import type { User } from '@rm/monorepo-mf-shared-library/types';

// config 파일도 export 경로를 통해 사용
import eslintConfig from '@rm/monorepo-mf-shared-library/config/eslint';
import prettierConfig from '@rm/monorepo-mf-shared-library/config/prettier';
```

**config 파일도 빌드 대상**:
- ESLint, Prettier 설정 파일도 TypeScript로 작성되므로 `./dist/config/`에서 빌드된 파일을 참조
- `files: ["dist"]` 설정으로 배포 시 dist 폴더만 포함되도록 관리
  - ESLint, Prettier 설정 파일을 처음부터 JS 파일로 만들어 두면, 빌드 과정 없이도 `files` 설정을 통해 해당 JS 파일을 바로 배포할 수 있습니다. 그러나 이 방법은 권장되지 않습니다.

**styles 파일은 dist 대신 lib 사용(workspace 패키지이므로 소스 직접 참조)**:
```json
"styles": "./lib/styles/index.css",
"styles/tokens": "./lib/styles/tokens.css",
"styles/base": "./lib/styles/base.css"
```
:::




### 4. tsconfig.json 설정
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

:::info 설명
**주요 설정 옵션**:

* **`target`**: 컴파일 결과물의 JavaScript 버전
  - `ES2020`으로 설정하여 최신 문법(옵셔널 체이닝, nullish 병합 등) 지원

* **`lib`**: 컴파일 시 사용할 타입 정의 라이브러리
  - `ES2020`, `DOM`, `DOM.Iterable`을 포함하여 브라우저 환경 API 타입 지원

* **`module`** / **`moduleResolution`**: 모듈 시스템 및 모듈 해석 방식
  - `ESNext` / `bundler` 조합으로 Vite 등 번들러 환경에 최적화된 ESM 방식 사용

* **`jsx`**: JSX 변환 방식
  - `react-jsx`로 설정하여 React 17+ 자동 JSX 변환 사용 (`import React` 불필요)

* **`strict`** / **`noUnusedLocals`** / **`noUnusedParameters`**: 엄격한 타입 검사
  - `true`로 설정하여 타입 안전성 강화 및 미사용 변수·파라미터 오류 처리

* **`noEmit`**: 컴파일 결과물 생성 여부 제어
  - `true`로 설정하여 TypeScript는 타입 체크만 수행하고 파일은 생성하지 않음
  - 실제 빌드(`.js` 파일 생성)는 Vite 번들러가 담당

* **`esModuleInterop`** / **`skipLibCheck`**: 호환성 설정
  - `esModuleInterop: true`로 CommonJS 모듈을 default import 방식으로 사용 가능
  - `skipLibCheck: true`로 외부 라이브러리 타입 정의 파일의 오류 검사 생략

* **`resolveJsonModule`**: `.json` 파일 import 허용
  - `true`로 설정하여 TypeScript 코드에서 JSON 파일을 직접 import 가능

* **`declaration`** / **`declarationMap`**: TypeScript 타입 정의 파일(`.d.ts`) 생성 설정
  - `true`로 설정되어 있으나, `noEmit: true`이므로 실제 `.d.ts` 파일은 생성되지 않음
  - 타입 정의 파일 생성이 필요한 경우 별도 빌드 도구(예: `vite-plugin-dts`) 사용 필요

* **`paths`**: 경로 별칭(alias) 설정
  - `@/*`를 `./src/*`로 매핑하여 절대 경로처럼 짧고 명확한 import 경로 사용 가능

* **`include`**: 컴파일 대상 파일 패턴
  - `src`로 설정하여 `src` 폴더 하위의 모든 파일 포함

* **`exclude`**: 컴파일에서 제외할 파일/폴더
  - `node_modules`, `dist` 폴더 제외하여 불필요한 컴파일 방지
:::







## ESLint, Prettier 설정 공유 관련
---
* 모든 리모트 애플리케이션에서 공통으로 사용하기 위하여 **공유 라이브러리 패키지에** **ESLint와 Prettier 설정** 파일을 만들고, 처음부터 `*.js` 파일로 생성하여 빌드 과정을 거치지 않고 바로 사용할 수 있도록 합니다.
  - `package.json` 파일의 **ESLint, Prettier** 부분
  ```json
  {
    "exports": {
      //...
      // highlight-start
      "./config/eslint": {
        "types": "./dist/config/eslint/index.d.ts",
        "import": "./dist/config/eslint/index.mjs",
        "require": "./dist/config/eslint/index.js"
      },
      "./config/prettier": {
        "types": "./dist/config/prettier/index.d.ts",
        "import": "./dist/config/prettier/index.mjs",
        "require": "./dist/config/prettier/index.js"
      },
      "./config/eslint/base": "./dist/config/eslint/base.js",
      "./config/eslint/react": "./dist/config/eslint/react.js"
      // highlight-end
    },
  }
  ```
* `package.json` 에 다음과 같이 관련 패키지가 설치 되어야합니다.
  - `eslint-plugin-react` 패키지는 `eslint` 버전 10.x 에서는 사용할 수 없습니다. 따라서 9.x 버전을 사용합니다.
  - `dependencies` 필드에 설치하는 이유는 remote 앱이 npm install @nic/mf-lib-shared 하면 플러그인도 자동 설치되도록 하기 위해서입니다. `devDependencies` 필드에 설치하면 플러그인이 설치되지 않습니다.
  ```json
  "dependencies": {
    "@eslint/js": "^9.39.1",
    "globals": "^17.4.0", // ESLint에서 전역 변수(global variables) 목록을 제공하는 패키지입니다.
    "typescript-eslint": "^8.57.1",
    "eslint-plugin-prettier": "^5.5.5",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    ...기존 의존성
  }
  ```
* 각 리포트 앱에서 사용할 때는 다음과 같이 사용합니다.
  ```tsx
  // eslint.config.ts
  import { defineConfig, globalIgnores } from "eslint/config";
  import nextVitals from "eslint-config-next/core-web-vitals";
  import nextTs from "eslint-config-next/typescript";
  // highlight-start
  import { react } from "@nic/mf-lib-shared/eslint";
  // highlight-end

  const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
      // Default ignores of eslint-config-next:
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ]),
    // highlight-start
    ...react,
    // highlight-end
  ]);

  export default eslintConfig;
  ```
  ```tsx
  // prettier.config.mjs
  import sharedConfig from "@nic/mf-lib-shared/config/prettier";

  /**
  * Prettier 설정
  * 공통 라이브러리의 Prettier 설정을 가져와 사용
  *
  * @type {import('prettier').Config}
  */
  export default {
    ...sharedConfig,
    // 필요시 이 앱에만 적용할 추가 설정
    // printWidth: 100,
  };
  ```








## 배포를 위한 설정 수정
---
* `@nic/mf-lib-shared` 패키지를 사용하는 앱에서 설치할 때 npm은 해당 레포지토리를 그대로 다운로드합니다. 그리고 package.json의 main, exports 필드가 모두 dist/를 가리키고 있기 때문에 `dist/`가 git에 없으면 리모트 앱에서 `npm install` 시 패키지를 찾을 수 없어 에러가 납니다. 따라서 `dist/` 폴더를 git에 추가하여 배포할 수 있도록 합니다.
* `.gitignore` 파일에 `dist/` 폴더 부분에 주석처리하여 dist폴더도 배포 되게 적용.








## Shadcn/ui 공유 라이브러리에 적용
---
* 각각의 리모트 앱에서 사용할 UI 컴포넌트를 공유 라이브러리(@rm/monorepo-mf-shared-library)에서 가져와 사용할 수 있게합니다. 이는 각각의 리모트 앱에서 Shadcn/ui 컴포넌트를 설치하는 것보다 훨씬 효율적입니다.


### 1. Shadcn/ui 사용을 위한 의존성 설치
* 공유 라이브러리(@rm/monorepo-mf-shared-library)에 Shadcn/ui 컴포넌트를 적용하기 위하여 다음과 같이 몇가지 설치를 진행합니다.
```sh
# 공유 라이브러리 루트에서
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add -D tailwindcss @base-ui/react
```
* 이 4개는 런타임에 필요한 의존성입니다.

| 패키지 | 역할 |
| :--- | :--- |
| class-variance-authority (cva) | 컴포넌트 variant (variant, size 등) 타입 안전하게 정의 |
| clsx | 조건부 className 병합 유틸 |
| tailwind-merge | Tailwind 클래스 충돌 해결 (px-2 px-4 → px-4) |
| lucide-react | 아이콘 컴포넌트 라이브러리 |


* TailwindCSS를 설치하기 위하여 다음과 같이 설치를 진행합니다. 빌드 시 필요합니다.

| 패키지 | 역할 |
| :--- | :--- |
| tailwindcss | 공유 라이브러리의 styles/tokens.css, styles/base.css 등을 **빌드할 때** 필요 |
| @base-ui/react | Headless UI 프리미티브 — Button, Select 등 접근성(a11y) 기반 컴포넌트 |




### 2. cn 유틸리티 생성
* `monorepo-mf-shared-library/lib/components/shadcn/lib/utils/index.ts` 파일을 생성합니다.
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```


### 3. tsconfig.json 경로설정
* shadcn이 생성하는 컴포넌트의 경로 패턴을 해석하기 위하여 다음과 같이 설정합니다.
```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/lib/*": ["./lib/components/shadcn/lib/*"],
      "@/components/*": ["./lib/components/shadcn/components/*"],
      "@/hooks/*": ["./lib/components/shadcn/hooks/*"]
    }
    // ...
  }
}
```
* baseUrl: "." 은 paths가 모노레포 루트가 아닌 패키지 자신의 폴더를 기준으로 경로를 해석하도록 앵커를 재설정하기 위해 필요합니다. 모노레포의 tsconfig.base.json에도 baseUrl이 설정되어있으므로 baseUrl을 설정하지 않으면 전체 모노레포 루트를 시작 경로로 인식하게 됩니다.



### 4. components.json 추가(shadcn CLI용)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-vega",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "lib/styles/index.css", // 공유라이브러리 styles 위치치
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components", // 공유라이브러리 tsconfig.json 경로설정에 따라 설정
    "utils": "@/lib/utils", // 공유라이브러리 tsconfig.json 경로설정에 따라 설정
    "ui": "@/components/ui", // 공유라이브러리 tsconfig.json 경로설정에 따라 설정
    "lib": "@/lib", // 공유라이브러리 tsconfig.json 경로설정에 따라 설정
    "hooks": "@/hooks" // 공유라이브러리 tsconfig.json 경로설정에 따라 설정
  }
}
```
* 추 후 공유 라이브러리에 **shadcn/ui** 컴포넌트를 설치하려면 공유 라이브러리 루트에서 다음 명령어를 실행하면 됩니다.
  ```sh
  cd packages/monorepo-mf-shared-library
  pnpm dlx shadcn@latest add button card input
  ```
  * `pnpm dlx`는 `npx`와 같은 역할을 하는 명령어입니다.



### 5. 기존 설치된 shadcn/ui 컴포넌트 이동
* 만약 기존에 이미 설치된 **shadcn/ui** 컴포넌트가 있다면, 공유 라이브러리 `lib/components/shadcn/components/ui` 폴더로 이동시킵니다.
* 이동시킨 후 모든 UI 컴포넌트를 export 하는 `index.ts` 파일을 `lib/components/shadcn/components/ui` 폴더 내부에 생성하고 다음과 같이 입력합니다.
  ```ts
  export * from "./alert-dialog"
  export * from "./badge"
  export * from "./button"
  export * from "./card"
  export * from "./combobox"
  export * from "./dropdown-menu"
  export * from "./field"
  export * from "./input"
  export * from "./input-group"
  export * from "./label"
  export * from "./select"
  export * from "./separator"
  export * from "./textarea"
  ```

* 또한 `lib/components/index.ts` 파일에 다음과 같이 shadcn/ui 컴포넌트를 export 하는 코드를 추가합니다.
  ```ts
  // shadcn components export
  export * from "./shadcn/components/ui/index";
  export * from "./shadcn/lib/utils/index";
  ```



### 6. Tailwind 스캔 경로 설정
* **Tailwind v4의 클래스 스캔 방식**
  - Tailwind CSS v4 (@tailwindcss/vite)는 @import 'tailwindcss'가 선언된 CSS 파일을 기준으로, 해당 Vite 프로젝트의 소스 파일들을 자동으로 스캔합니다. 기본적으로 스캔 범위는 해당 앱의 프로젝트 루트 이하입니다.
  - 따라서 shadcn/ui 컴포넌트는 공유 라이브러리에 위치해 있으므로, 사용하는 각각의 리모트 앱에서는 shadcn 컴포넌트가 사용하는 Tailwind class를 스캔하지 못합니다.
* 그래서 각 리모트 앱에서는 공유 라이브러리의 Tailwind 스캔 경로를 다음과 같이 설정해줘야 합니다.
  ```css
  @source "../../../../packages/monorepo-mf-shared-library/lib";
  ```
  - 하지만 이렇게 하면 모든 리모트 앱에 넣어줘야하는 번거로움이 있습니다. 따라서 이미 각 리모트 앱에서 제공하고 있는 **bridge.tsx** 파일내부 코드의 공유 라이브러리 `micro-frontend.css` 파일을 통해서 제공하도록 합니다.
    - 공유 라이브러리의 `lib/styles/micro-frontend.css` 파일의 내부 코드에서 아래쪽 부분에 다음 코드를 추가합니다.
    ```css
    /* 공유 라이브러리 UI 컴포넌트(shadcn) Tailwind 스캔 */
    /* 각 리모트앱에서 shadcn 컴포넌트를 사용할 때 사용하는 shadcn class을 읽지 못하므로 다음 경로에서 스캔하도록 설정정 */
    @source "../components";
    ```
    - 이렇게 하면 각 리모트 앱에서는 공유 라이브러리의 Tailwind 스캔 경로를 설정하지 않아도 되고 **bridge.tsx** 파일을 통해 적용됩니다.


### 7. 각 앱에서 UI 컴포넌트 사용하기
* 각 앱에서 다음과 같이 shadcn/ui 컴포넌트를 사용할 수 있습니다.
  ```tsx
  import { Button } from "@rm/monorepo-mf-shared-library/components/ui"
  ```
  

### 8. tsc-alias를 사용하여 빌드 후 경로 별칭을 자동으로 상대 경로로 변환
* 공유 라이브러리의 빌드 결과물 dist/ 안의 JS 파일에 alias로 설정된 경로(예: @/lib/utils)가 그대로 남아있고, 호스트 앱, 리모트 앱의 Vite가 해당 경로를 찾지 못하는 문제가 있을 수 있습니다. 이를 해결하기 위하여 tsc-alias를 사용하여 빌드 후 경로 별칭을 자동으로 상대 경로로 변환합니다.
  ```sh
  # 공유 라이브러리 루트에서 설치
  pnpm add -D tsc-alias
  ```
  - tsc-alias는 TypeScript 컴파일러의 경로 별칭을 자동으로 상대 경로로 변환해주는 플러그인입니다.
  - 이를 사용하면 공유 라이브러리의 빌드 결과물 dist/ 안의 JS 파일에 alias로 설정된 경로(예: @/lib/utils)가 그대로 남아있고, 호스트 앱, 리모트 앱의 Vite가 해당 경로를 찾지 못하는 문제가 해결됩니다.
  - 이를 사용하기 위해서는 공유 라이브러리의 `package.json` 파일에 다음과 같이 추가합니다.
  ```json
  "scripts": {
		// ...
		"build": "tsc && tsc-alias",
		// ...
	},
  ```
  * 이제 공유 라이브러리를 다시 빌드하고 각 앱에서 UI 컴포넌트를 사용할 때 문제없이 사용할 수 있습니다.






