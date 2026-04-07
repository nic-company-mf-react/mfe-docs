---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "Shadcn/ui컴포넌트추가방법"
---

# Shadcn/ui 컴포넌트 추가 방법
공유 라이브러리(mfe-lib-shared)는 기본 UI 컴포넌트로 [Shadcn/ui](https://ui.shadcn.com/)를 사용합니다.  
따라서 없는 UI 컴포넌트가 있으면 추가하여 사용할 수 있습니다. 다음은 Shadcn/ui 컴포넌트 추가 방법을 안내합니다.






## 진행 단계
---

### 1. shadcn CLI로 Accordion 컴포넌트 추가
* 공유 라이브러리(mfe-lib-shared) 루트 디렉토리에서 다음을 실행합니다.
    ```sh
    npx shadcn@latest add accordion
    ```
* `components.json`의 alias 설정에 따라 파일이 자동으로 아래 위치에 생성됩니다.
    ```sh
    src/components/shadcn/ui/accordion.tsx   ← 자동 생성됨
    ```

### 2. `src/components/shadcn/ui/index.ts` - export 추가
```ts
// 추가
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';
```

### 3. `src/components/index.ts` - export 추가
```ts
// 추가
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './shadcn/ui/accordion';
```

### 4. `src/index.ts` - 최상위 export 추가
```ts
// 추가
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/shadcn/ui/accordion';
```

### 5. 빌드
```sh
npm run build
```



