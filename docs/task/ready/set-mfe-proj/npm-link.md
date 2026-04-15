---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "npm link 개발임시연결"
---

# npm link를 활용한 개발환경 연결 방법




## 공유 라이브러리에 `npm link` 등록
---
* `@axiom/mf-lib-shared` 패키지에 `npm link` 등록을 합니다.
    ```sh
    cd mf-lib-shared
    npm run build       # 최초 1회 빌드 필요
    npm link            # 글로벌 심볼릭 링크 생성
    npm ls -g --depth=0 # 등록된 npm link 목록 확인
    ```

* `@axiom/mf-app-main` (Host 앱) 프로젝트에서 링크 연결을 합니다.
    ```sh
    cd mf-app-main
    npm link @axiom/mf-lib-shared   # node_modules/@axiom/mf-lib-shared → 로컬 소스 연결
    ```
* 심볼릭 링크 연결이 모두 되었으면 개발 시 워크플로우 진행과정을 아래와 같이 진행합니다.
    ```sh
    # mf-lib-shared 터미널에서 watch 모드 실행
    npm run dev   # tsup --watch (소스 변경 시 자동 재빌드)
    # mf-app-main은 그냥 실행
    npm run dev
    ```
    - `mf-lib-shared` 소스를 수정하면 → tsup --watch가 자동 재빌드 → `mf-app-main`에 즉시 반영됩니다. push/install 불필요.
    
* 개발 완료 후 원복
    ```sh
    cd mf-app-main
    npm unlink @axiom/mf-lib-shared   # 링크 해제
    npm install                      # 원래 GitHub 버전 재설치
    ```





