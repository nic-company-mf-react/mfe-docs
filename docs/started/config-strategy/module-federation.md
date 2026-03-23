---
sidebar_position: 1
displayed_sidebar: "startDocSidebar"
title: "Module Federation 관련"
---

# Module Federation







<!--## Module Federation-->
---
[Module Federation 설정 옵션: https://module-federation.io/configure/index.html](https://module-federation.io/configure/index.html)






## Module Federation 이란?
---

* **Vite(Micro Frontend)** 에서 모듈 페더레이션(Module Federation)을 구현하는 플러그인입니다.
* **모듈 페더레이션**은 여러 개의 독립적인 빌드 결과물을 런타임에 동적으로 공유하고 로드할 수 있게 해주는 기술입니다.
* 기능
  - 여러 독립적인 애플리케이션 사이에서 코드를 공유할 수 있습니다
  - 런타임에 다른 애플리케이션의 모듈을 동적으로 로드할 수 있습니다
  - 마이크로 프론트엔드 아키텍처를 구현하는 데 도움이 됩니다
  - 각 애플리케이션을 독립적으로 배포하면서도 코드 공유가 가능합니다








## Federation 라이브러리 사용 선택
---

:::info 어떤 것을 선택해야 할까?
* **@originjs/vite-plugin-federation**을 선택하는 경우:
  - ✅ 간단한 설정을 원할 때
  - ✅ 이미 많은 레퍼런스가 필요할 때
  - ✅ 안정성을 최우선으로 할 때
  - [npm 링크: https://www.npmjs.com/package/@originjs/vite-plugin-federation](https://www.npmjs.com/package/@originjs/vite-plugin-federation)
  - [공식 문서 링크: https://webpack.js.org/concepts/module-federation/](https://webpack.js.org/concepts/module-federation/)
* **@module-federation/vite**을 선택하는 경우:
	- ✅ 당연히 **Vite**를 사용하는 프로젝트일 때
  - ✅ 최신 기능이 필요할 때
  - ✅ 더 세밀한 제어가 필요할 때
  - ✅ Webpack Module Federation과의 호환성이 필요할 때
  - ✅ 공식 지원을 원할 때
  - ✅ 런타임 동적 로딩이 필요할 때
  - [npm 링크: https://www.npmjs.com/package/@module-federation/vite](https://www.npmjs.com/package/@module-federation/vite)
  - [공식 문서 링크: https://module-federation.io/practice/overview.html](https://module-federation.io/practice/overview.html)
:::

기본 컨셉은 여러 개의 독립된 애플리케이션 또는 모듈이 하나의 큰 애플리케이션처럼 동작할 수 있도록 하는 것입니다. **Module Federation**은 **Micro Frontend** 아키텍처를 구축하는 용도로 런타임에 통합되어 각 서비스 앱이 서로 코드를 공유하는 기능입니다.

#### ◉ 장점

- **모듈 공유**: 독립된 각 서비스 앱 간에 모듈을 공유할 수 있습니다. 이것은 코드 중복을 줄이고, 유지보수 및 업데이트를 단순화합니다.
- **MFE 아키텍처**: Module Federation을 사용하면 여러 마이크로 프론트엔드를 하나의 큰 애플리케이션으로 통합할 수 있습니다.
- **동적 모듈 로딩**: 필요에 따라 모듈을 동적으로 로드할 수 있습니다. 이는 초기 로딩 시간을 줄이고, 성능을 향상시킵니다.
- **병렬 로딩**: Module Federation은 병렬로 여러 모듈을 로드할 수 있습니다.
- **독립성 유지**: 각 마이크로 프론트엔드는 독립적으로 개발, 테스트 및 배포될 수 있습니다.
- **유연성**: Module Federation을 사용하면 동적으로 모듈을 교환하고 업데이트할 수 있습니다.

#### ◉ 단점 (Micro Frontend와 비슷함)

- **복잡성**: Module Federation은 구현 및 설정이 다소 복잡할 수 있습니다.
- **네트워크 오버헤드**: 여러 독립된 애플리케이션 또는 모듈을 통합할 때, Module Federation은 추가적인 네트워크 오버헤드를 초래할 수 있습니다.
- **보안 취약성**: 모듈을 동적으로 로드하고 공유하는 기능을 제공하므로, 보안 취약성이 발생할 수 있습니다.
- **종속성 관리**: 여러 독립된 애플리케이션 또는 모듈 간의 종속성 관리가 복잡해질 수 있습니다.
- **설정 및 디버깅**: Module Federation을 구성하고 디버깅하는 과정은 다소 복잡할 수 있습니다.

