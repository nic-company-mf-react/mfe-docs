---
sidebar_position: 1
displayed_sidebar: 'apiDocSidebar'
title: '⋮ useClientState(작업중)'
---

# useClientState


## useClientState()
---

`useClientState()` 훅은 **Zustand** 로 구현된 **클라이언트 전역 상태**를, **문자열 키(`key`)** 로 구획해 읽고 쓰는 훅 함수입니다. **REST API·TanStack Query 캐시와는 별개**인, 브라우저 안에서만 의미 있는 값(예: UI 플래그, 마법사 단계, 호스트·리모트 간 공유가 필요한 클라이언트 데이터)을 둘 때 사용합니다.

* 내부적으로 단일 스토어에 `key`별로 값을 저장하며, **`initial` 옵션**으로 해당 키에 값이 아직 없을 때만 초기값(또는 lazy 초기화 함수)을 적용합니다.
* 반환값은 **`data`**, 값을 갱신하는 **`setData`**(함수형 업데이트 지원), 그리고 **`reset`**(`initial`이 있으면 그 초기값으로 되돌리고, 없으면 해당 키를 제거)입니다.
* **Module Federation** 환경에서는 host·remote가 서로 다른 **Zustand 인스턴스**를 쓰면 스토어가 갈라질 수 있으므로, 필요 시 **`shared`에서 `zustand`를 singleton** 으로 맞추는 것이 좋습니다. - 공통영역


