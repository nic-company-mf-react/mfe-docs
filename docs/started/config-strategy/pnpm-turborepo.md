---
sidebar_position: 1
displayed_sidebar: "startDocSidebar"
title: "Pnpm Workspaces, Turborepo 관련"
---

# Pnpm Workspaces, Turborepo



## pnpm Workspaces란?
---
**패키지 매니저 수준의 모노레포 관리 도구**입니다.  
여러 패키지(앱, 라이브러리)를 하나의 저장소에서 관리할 수 있게 해주는 pnpm의 내장 기능입니다.  
[pnpm workspaces 공식 문서: https://pnpm.io/workspaces](https://pnpm.io/workspaces)

**핵심 역할**
- 여러 패키지의 의존성을 한 번에 설치/관리
- 패키지 간 로컬 참조 (node_modules 심볼릭 링크)
- 중복 패키지 제거 — 같은 버전의 패키지는 루트에 한 번만 설치

**구조 예시**
```sh
my-app/
├── pnpm-workspace.yaml       # 워크스페이스 설정
├── package.json
├── apps/
│   ├── shell/                # 호스트 앱
│   ├── remote-auth/          # 마이크로 프론트엔드 A
│   └── remote-dashboard/     # 마이크로 프론트엔드 B
└── packages/
    ├── ui/                   # 공통 컴포넌트
    └── utils/                # 공통 유틸
```






## Turborepo란?
---
**빌드 오케스트레이션 도구**입니다.  
pnpm workspaces가 "패키지를 어떻게 구성하는가"라면, Turborepo는 "태스크를 어떻게 실행하는가"를 담당합니다.
[Turborepo 공식 문서: https://turbo.build/repo/docs](https://turbo.build/repo/docs)

쉽게 비유하자면, pnpm workspaces는 **공장의 부서 배치도**이고, Turborepo는 **각 부서가 언제, 어떤 순서로 일해야 하는지 지시하는 공장장**입니다.

예를 들어 `pnpm build`를 루트에서 실행하면, Turborepo는 패키지 간의 의존 관계를 파악해 **순서를 자동으로 결정**합니다.  
`ui` 패키지가 먼저 빌드되어야 `shell` 앱이 빌드될 수 있다면, Turborepo가 알아서 올바른 순서로 실행합니다.
또한 이미 빌드한 결과는 **캐시로 저장**해두기 때문에, 변경이 없는 패키지는 다시 빌드하지 않아 속도가 훨씬 빠릅니다.


**핵심 역할**
- 태스크 간 의존 순서 정의 (build → test 순서 등)
- 캐싱 — 변경되지 않은 패키지는 이전 결과 재사용
- 병렬 실행 — 의존 관계 없는 태스크는 동시에 실행
- Remote Cache — CI 환경에서도 캐시 공유 가능
```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],  // 의존 패키지 먼저 빌드
      "outputs": ["dist/**"]    // 캐싱할 결과물
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```







## Pnpm Workspaces와 Turborepo의 관계
---
**pnpm workspaces**  →  "패키지를 어떻게 연결할까?"  (패키지 매니저 레이어)  
**Turborepo**        →  "태스크를 어떻게 실행할까?"  (빌드 시스템 레이어)

|항목      | pnpm workspaces | Turborepo       |
|:-------- |:--------------- |:--------------- |
|역할      | 의존성 관리, 패키지 연결 | 태스크 실행, 빌드 최적화 |
|캐싱      | ❌              | ✅ (로컬 + 원격) |
|병렬 실행  | 기본적인 수준     | 의존 그래프 기반 최적화 |
|설정 난이도 | 낮음            | 중간             |
|필수 여부  | ✅ (기반 필수)  | 선택 사항          |

**Turborepo 없이 pnpm workspaces만** → ✅ 가능 (패키지 연결 + 기본 실행)  
**pnpm workspaces 없이 Turborepo만** → ❌ 불가능 (패키지 연결 수단이 없음)

|구성 | 가능 여부|설명|
|:-------- |:--------------- |:--------------- |
|pnpm workspaces만|✅|소규모에서 충분|
|pnpm workspaces + Turborepo|✅|가장 일반적인 조합|
|Turborepo만|❌|패키지 매니저 없이 동작 안 함|
|npm/yarn workspaces + Turborepo|✅|pnpm 대신 다른 패키지 매니저도 가능|



**결론은**  

결국 Turborepo는 항상 workspaces 위에서 동작하는 구조입니다.  
마이크로 프론트엔드 규모가 크지 않다면 pnpm workspaces만으로 시작하고, 나중에 필요할 때 Turborepo를 얹는 전략이 가장 좋습니다.








