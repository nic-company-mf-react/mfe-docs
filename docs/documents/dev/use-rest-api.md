---
sidebar_position: 1
displayed_sidebar: "documentDocSidebar"
title: "데이터 가져오기"
---


# 데이터 가져오기

:::info 작업 내용
* 각 업무(domain) **화면 컴포넌트**에서 **mfe-app-boilerplate**가 제공하는 **useApi()** 훅을 통해 **REST API**를 호출하여 데이터를 가져오는 방법을 설명합니다.
:::

:::tip 데이터 조회, 업데이트 방법의 차이
* **useApi()** 함수는 **클라이언트 환경**에서 `GET, POST` method 타입으로 **데이터를 조회**하고 결과 데이터를 활용하는 용도로 사용합니다. 그 외 `POST, PUT, PATCH, DELETE` method 타입으로 서버의 **데이터를 변경, 업데이트하는 용도**로 사용할 때는 **useApiMutation()** 함수를 사용해야 합니다. 이와 같이 데이터 조회, 업데이트 방법의 차이가 있는것은 **TanStack Query(React Query)** 의 특성을 그대로 반영한 것입니다.
:::








## 데이터 조회
---

🔗 [**useApi()** API 문서 바로가기]()

* `useApi()` 함수는 `GET, POST` method 타입으로 **데이터를 조회**하고 결과 데이터를 활용하는 용도로 사용합니다.


### account(계좌)업무 폴더 구조
* 개발 할 업무가 **계좌(account)** 업무라고 가정한다면 다음과 같이 폴더구조를 구성하고, 그 하위 구조를 만듭니다.
```sh
# 내가 작업할 업무가 "계좌(account)" 업무라고 가정한다면
# 아래와 같은 account 기본 폴더구조를 가진다.
src
  ├─ ...
  ├─ ...
  ├─ domains
  │  ├─ ...
// highlight-start
  │  ├─ account # account폴더를 생성
  │  │  ├─ api
  │  │  │  └─ url.ts
  │  │  ├─ components
  │  │  │  └─ AccountList.tsx # 계좌 리스트 컴포넌트(가정)
  │  │  ├─ pages
  │  │  │  ├─ AccountIndex.tsx  # 계좌메인화면(가정)
  │  │  │  └─ AccountUsage.tsx  # 계좌이용내역화면(가정)
  │  │  ├─ router
  │  │  │  └─ index.tsx
  │  │  ├─ store
  │  │  └─ types
  │  │     └─ index.ts
// highlight-end
  │  └─ ...
```


### 계좌메인(AccountIndex.tsx)에서 데이터 조회
* 아래와 같은 방법으로 데이터를 조회하면 화면에 진입 시 바로 데이터를 조회합니다. 만약 화면에 진입 시 데이터를 조회하지 않고, 특정 이벤트가 발생했을 때 데이터를 조회하고 싶다면, `useApi()` 훅의 `enabled` 옵션을 사용하면 됩니다. `enabled` 옵션 사용 방법은 아래쪽에 따로 설명합니다.

```tsx showLineNumbers
// src/domains/account/pages/AccountIndex.tsx

import React from 'react';
// highlight-start
import { useApi } from '@company/mfe-lib-shared/hooks';
// highlight-end
// IAccountLists(계좌목록). response 타입을 types 폴더에 선언하고 사용합니다.
import type { IAccountLists } from '@/domains/account/types';

// 페이지 컴포넌트의 Props 타입 정의
export interface IAccountIndexProps {
  // test?: string;
}

// 페이지 컴포넌트 함수 (계좌메인)
export default function AccountIndex({}: IAccountIndexProps): React.ReactNode {
  // 내부 API 호출(/api/account/lists)
  // highlight-start
  const {
    data: accountListsData,
    error: accountListsError,
    isLoading: accountListsLoading,
  } = useApi<IAccountLists[]>('/api/account/lists');
  // highlight-end

  return (
    <div>
      {
        accountListsLoading
          ? 'Loading...'
          : accountListsError
            ? 'Error: ' + JSON.stringify(accountListsError)
            : JSON.stringify(accountListsData || [], null, 2) || 'No data'
      }
    </div>
  );
}
```
