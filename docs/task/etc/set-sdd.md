---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "SDD 개발 방법론 관련"
---

# SDD (Spec Driven Development) 개발 방법론 관련

:::info <span class="admonition-title">Spec-Driven Development (SDD)</span>란?
* **Spec-Driven Development(SDD)** 는 잘 작성된 소프트웨어 요구사항 명세(Specification)를 프롬프트로 사용하여, AI 코딩 에이전트를 통해 실행 가능한 코드를 생성하는 개발 패러다임입니다. Medium 2025년에 등장한 용어로, 흔히 **"Vibe Coding"의 반대편**에 위치하는 방법론이라고 이해하면 됩니다.
* **핵심 아이디어**  
SDD에서는 코드가 아니라 **명세(Specification)가 소스 오브 트루스(source of truth)** 가 됩니다. Medium 즉, AI에게 "알림 시스템 만들어줘"라고 대충 던지는 게 아니라, 무엇을 만들 것인지 구조화된 문서로 먼저 정의한 뒤 AI가 그 명세에 따라 코드를 생성하도록 하는 것입니다.
* **Vibe Coding과의 차이**  
Vibe Coding은 프롬프트를 주고 코드를 받은 뒤, 반복적으로 수정 요청을 하는 방식입니다. 프로토타입에는 잘 동작하지만 본격적인 프로덕션 앱에서는 한계가 있습니다. Zencoder Docs SDD는 이 모델을 뒤집어서, 포괄적인 명세를 먼저 제공하여 AI가 무엇을 만들어야 하는지, 왜 중요한지, 그리고 무엇을 만들지 말아야 하는지까지 완전한 그림을 받도록 합니다. Zencoder Docs
* **SDD의 워크플로우**  
Amazon의 Kiro IDE를 예로 들면, AI가 프롬프트를 세 가지 문서로 분해합니다. Requirements(사용자 스토리 형태의 기능 상세), Design(전체 아키텍처, 데이터 모델 등 기술 정보), Tasks(요구사항의 하위 집합을 구현하는 작업 목록)입니다. Frontendatscale
명세는 단순한 PRD(제품 요구사항 문서)가 아닙니다. 입출력 매핑, 사전/사후 조건, 불변 조건, 제약사항, 인터페이스 타입, 통합 계약, 상태 머신 등 소프트웨어의 외부 동작을 명시적으로 정의해야 합니다. Medium
* **SDD의 세 가지 수준**  
SDD는 크게 세 가지 패턴으로 나뉩니다. Spec-First는 코딩 전에 명세를 작성해 AI를 가이드하되 코드가 여전히 주요 결과물인 접근법이고, Spec-Anchored는 거버넌스 레이어와 감독 체크포인트를 추가하며, Spec-as-Source는 가장 급진적으로 명세 자체가 소스 코드가 되는 방식입니다. Augment Code
* **대표 도구들**  
현재 SDD를 지원하는 주요 도구로는 Amazon Kiro(VS Code 기반 IDE), GitHub Spec Kit(오픈소스 CLI 도구로 GitHub 스타 84,700개 이상) Augment Code, Intent, OpenSpec, BMAD-METHOD 등이 있고, Cursor의 .cursorrules도 경량 SDD 접근법으로 활용됩니다.
* **장단점**  
    - 장점:  
        - 팀 간 가정을 초기에 드러내어, 방향 전환 비용이 스프린트 단위가 아니라 키 입력 몇 번 수준이 됩니다. Microsoft Developer
        - AI가 생성한 코드의 품질과 일관성이 크게 향상됩니다.
        - 코드 리뷰가 명세 → 계획 → 태스크 → 구현 순서로 체계화됩니다.
    - 한계:  
        - UI 중심 작업에서는 비시각적 명세가 크게 도움이 안 되고, 작은 버그 수정이나 소규모 기능에 전체 명세를 작성하는 건 과도합니다. Frontendatscale
        - 아직 모범 사례가 확립되지 않은 단계이며, 앱 전체에 하나의 스팩을 둘 것인지, 기능별로 나눌 것인지, 프/백엔드별로 분리할 것인지 등 시행착오가 필요합니다. 
:::
:::info <span class="admonition-title">SDD</span> AI 코딩 도구
* **Claude Code** — 세션 간 지속적인 컨텍스트를 원할 때 특히 유용합니다. 메모리 파일과 규칙이 시작 시 로드되어 긴 프로젝트에서 드리프트를 줄여줍니다. Evangelist Apps
* **Cursor** — Plan Mode가 코드 작성 전에 상세한 구현 계획을 만들고, 명확화 질문을 던진 후, 검토 가능한 계획을 생성합니다. 이것이 SDD와 깔끔하게 맞아떨어집니다. Evangelist Apps
* **Kiro (Amazon)** — VS Code 포크로, Spec Mode에서 요구사항 → 설계 → 태스크 3단계 마크다운 문서를 자동 생성합니다.
:::








## 폐쇄망 SDD 셋업 방법
---
* **VS Code + Ollama + Continue.dev** (오픈소스, 무료)
    - VS Code, Ollama, Continue 확장을 사용하면 소비자 하드웨어에서 구독 비용 없이 완전한 프라이버시로 로컬 AI 코딩 어시스턴트를 구축할 수 있습니다. 코드가 절대 머신을 떠나지 않고, 오프라인으로 작동하며, 폐쇄망 환경에서도 사용 가능합니다







## 실제 셋업
---
* **1) Ollama 바이너리**
    - ollama.com/download 에서 OS별 설치 파일 다운로드 및 설치 (standalone) - 오프라인 설치 때 필요.


* **2) LLM 모델 파일 (GGUF 포맷)**
    - 인터넷 환경에서 다음과 같이 설치를 진행하면 `C:\Users\{사용자명}\.ollama\models\`에 설치가 됨. 추후 models폴더를 오프라인 환경으로 가져가야함.
    ```sh
    ollama pull qwen2.5-coder:7b        # 채팅/리팩토링용 (~4.5GB)
    ollama pull qwen2.5-coder:1.5b      # 자동완성용 (~1GB)
    ollama pull deepseek-r1:32b          # 복잡한 추론용 (~20GB, GPU 필요)
    ollama pull nomic-embed-text         # 코드베이스 검색용
    ```
    


* **3) VS Code 확장** 설치
    - VSCode 공식 마켓플레이스 : [https://marketplace.visualstudio.com/](https://marketplace.visualstudio.com/)
    - 대안 VSCode 확장 마켓 : [https://open-vsx.org/](https://open-vsx.org/)
    - Continue.dev 확장 (.vsix) - marketplace에서 오프라인용 .vsix 파일 다운로드
    - VSCode에서 Continue.dev 확장을 설치한다.
    - Continue 설정 파일에서 로컬 Ollama를 연결합니다:
        -  C:\Users\{사용자명}\.continue\config.yaml
    ```yaml
    name: Air-Gapped Frontend Assistant
    version: 1.0.0
    schema: v1
    models:
    - name: Qwen2.5 Coder 7B
        provider: ollama
        model: qwen2.5-coder:7b
        roles: [chat, edit, apply]
    # 2. 복잡한 추론/설계 검토 - DeepSeek R1
    - name: DeepSeek R1 32B
        provider: ollama
        model: deepseek-r1:32b
        apiBase: http://localhost:11434
        roles:
        - chat
        defaultCompletionOptions:
        contextLength: 8192
        temperature: 0.6
    - name: Qwen2.5 Coder 1.5B
        provider: ollama
        model: qwen2.5-coder:1.5b
        roles: [autocomplete]
    - name: Nomic Embed
        provider: ollama
        model: nomic-embed-text
        roles: [embed]
    context:
    - provider: code
    - provider: docs
    - provider: diff
    - provider: terminal
    - provider: codebase
    ```
    :::tip model 사용팁
    * 메모리 문제로 "DeepSeek R1 32B" 모델 사용이 어려운 경우 한단계 낮은 모델을 설치하는것도 좋을듯.
        - `ollama pull deepseek-r1:14b`
        ```yaml
        # 추론 - 32B 대신 14B 또는 8B로 변경
        - name: DeepSeek R1 14B
            provider: ollama
            model: deepseek-r1:14b
            roles: [chat]
        ```
    * ollama 모델 관련 명령어.
    ```sh
    # 현재 로드된 모델 확인
    ollama ps

    # 안 쓰는 모델 내리기
    ollama stop deepseek-r1:32b
    ```
    :::

* **4) VS Code 설정**
    - VSCode 설치
        - ZIP (Portable Mode, 권장) 설치 과정 자체가 없어서 폐쇄망에 가장 적합합니다. 다운로드 경로: https://code.visualstudio.com/download
여기서 Windows 기준으로 .zip 버전을 받으세요. (User Installer, System Installer 말고 ZIP 선택)
    - zip말도 exe를 받고 싶다면 exe파일을 받으면 됨.
    - .vscode/settings.json 파일 생성 및 외부 연결 시도 막는 부분 세팅
    ```json
    {
        "update.mode": "none",
        "telemetry.telemetryLevel": "off",
        "extensions.autoUpdate": false,
        "extensions.autoCheckUpdates": false
    }
    ```


* **5) node.js standalone**
    - https://nodejs.org/en/download 에서 Windows Binary (.zip) 파일을 받아서 설치한다.
    - zip 압축 해제
    ```sh
    node-v22.x.x-win-x64/
    ├── node.exe          ← Node.js 실행 파일
    ├── npm.cmd           ← npm 명령어
    ├── npx.cmd
    ├── node_modules/
    │   └── npm/
    └── ...
    ```
    - 환경변수 PATH에 추가 - 압축 푼 폴더 경로를 시스템 PATH에 추가하면 어디서든 node, npm 명령어를 쓸 수 있어요.






## Continue.dev 설정파일 세팅 내용
---
* `config.yaml` 파일 세팅 내용
```yaml
name: react-app-boilerplate Frontend Assistant
version: 1.0.0
schema: v1
models:
  # 1. 채팅 / 리팩토링용 (JS, TS, React 특화)
  - name: FE Chat (Qwen 7B)
    provider: ollama
    model: qwen2.5-coder:7b
    roles:
      - chat
      - edit
      - apply
    keepAlive: 1800                  # 30분 메모리 유지
    defaultCompletionOptions:
      temperature: 0.5
      contextLength: 8192
      maxTokens: 4096


  # 2. 복잡한 추론 / 설계용
  - name: Reasoning (DeepSeek 14B)
    provider: ollama
    model: deepseek-r1:14b
    roles:
      - chat
      - edit
    keepAlive: 1800
    defaultCompletionOptions:
      temperature: 0.6
      contextLength: 8192
      maxTokens: 4096


  # 3. 자동완성 전용 (빠른 응답 최우선)
  - name: Autocomplete (Qwen 1.5B)
    provider: ollama
    model: qwen2.5-coder:1.5b
    roles:
      - autocomplete
    keepAlive: 3600                  # 자동완성은 자주 쓰므로 1시간 유지
    autocompleteOptions:
      debounceDelay: 400             # 타이핑 후 400ms 대기
      maxPromptTokens: 1024
      multilineCompletions: auto
      onlyMyCode: true               # 사내 코드만 참조
    defaultCompletionOptions:
      temperature: 0.1               # 낮을수록 예측 가능한 완성
      contextLength: 2048


  # 4. 코드베이스 임베딩 / 검색용
  - name: Embeddings
    provider: ollama
    model: nomic-embed-text
    roles:
      - embed
    embedOptions:
      maxChunkSize: 512
      maxBatchSize: 4


# ─────────────────────────────────────────
# 컨텍스트 프로바이더
# ─────────────────────────────────────────
context:
  - provider: code          # 현재 선택 코드
  - provider: diff          # Git diff
  - provider: folder        # 현재 폴더 구조
  - provider: codebase      # 전체 코드베이스 검색 (임베딩 활용)
  - provider: terminal      # 터미널 출력 참조
  - provider: open          # 현재 열린 파일들

# ─────────────────────────────────────────
# 프론트엔드 개발 규칙 (AI 응답 품질 향상)
# ─────────────────────────────────────────
rules:
  - 항상 TypeScript를 기본으로 사용하고 any 타입 사용을 최소화해
  - React 함수형 컴포넌트와 Hooks 패턴을 사용해
  - 코드 설명은 한국어로, 코드 자체는 영어로 작성해
  - 접근성(a11y)을 고려한 HTML 시맨틱 태그를 사용해
  - 금융 데이터는 반드시 포맷팅 함수를 거쳐서 표시해
  - 에러 처리와 로딩 상태를 항상 포함해


# ─────────────────────────────────────────
# 커스텀 슬래시 커맨드 (프론트엔드 특화)
# ─────────────────────────────────────────
prompts:
  - name: component
    description: React 컴포넌트 생성
    prompt: |
      아래 요구사항으로 React + TypeScript 컴포넌트를 생성해줘.
      - Props 타입 정의 포함
      - 접근성(aria 속성) 포함
      - 에러/로딩 상태 처리 포함
      - JSDoc 주석 포함

  - name: test
    description: 단위 테스트 생성
    prompt: |
      이 컴포넌트/함수에 대한 Jest + React Testing Library 테스트를 작성해줘.
      - 정상 케이스, 엣지 케이스, 에러 케이스 포함
      - 사용자 인터랙션 테스트 포함

  - name: review
    description: 코드 리뷰
    prompt: |
      아래 관점에서 코드 리뷰해줘:
      1. 버그 가능성
      2. 성능 문제
      3. 보안 취약점 (XSS, 민감정보 노출 등)
      4. 금융 도메인 규정 준수 여부
      5. 개선 제안

  - name: refactor
    description: 리팩토링
    prompt: |
      이 코드를 리팩토링해줘.
      가독성, 재사용성, 성능을 개선하되 동작은 유지해줘.
      변경 이유도 함께 설명해줘.
```




## 사용 서버 세팅 관련 내용
---
3~5명 팀 환경이면 동시 요청 처리와 모델 상주가 핵심입니다. 한 가지만 확인하겠습니다.월 5~10만원 (팀 나눠서 부담)

결론: Hetzner CX42 (월 €18 ≈ ₩27,000)
3~5명이 나누면 1인당 월 ₩5,400~9,000 수준입니다.

구성 아키텍처
```
[팀원 A - VS Code + Continue.dev] ─┐
[팀원 B - VS Code + Continue.dev] ─┤─── HTTPS (인터넷) ───► [Hetzner CX42]
[팀원 C - VS Code + Continue.dev] ─┤                         Ollama 서버
[팀원 D - VS Code + Continue.dev] ─┘                         RAM 16GB
                                                              8 vCPU
        ↓ 자동완성 + 임베딩은                                  NVMe 160GB
        각자 로컬 PC에서 실행
```
역할 분리 전략 (3~5명 동시 사용 핵심)

|역할 | 실행위치 | 모델 | 이유 | 
| :--- | :--- | :--- | :--- | 
| 자동완성 | 각자 로컬 PC | qwen2.5-coder:1.5b | 동시 요청 시 서버 부하 방지 | 
| 임베딩 | 각자 로컬 PC | nomic-embed-text | 가벼워서 로컬 충분 | 
| 채팅/리팩토링 | 중앙 서버 | qwen2.5-coder:7b | 팀 공유 | 
| 설계/추론 | 중앙 서버 | deepseek-r1:14b | 팀 공유 | 

> 자동완성은 로컬에서 처리하면 서버 동시 요청이 "채팅 요청"만 남아 3~5명도 감당 가능합니다.


서버 세팅 순서

1단계: Hetzner CX42 서버 생성
```
hetzner.com → New Server
- Location: Helsinki
- OS: Ubuntu 22.04
- Type: CX42 (8 vCPU, 16GB RAM, 160GB NVMe)
- 월 €18 (~₩27,000)
- SSH Key 등록
```

2단계: 서버 초기 설정
```bash
ssh root@[서버IP]

# 업데이트
apt update && apt upgrade -y

# Swap 8GB 추가 (deepseek-r1:14b 로딩 여유분)
fallocate -l 8G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
echo 'vm.swappiness=10' >> /etc/sysctl.conf
sysctl -p

# 방화벽
ufw allow ssh
ufw allow 443/tcp
ufw enable
```

3단계: Ollama 설치 및 팀 사용 최적화
```bash
curl -fsSL https://ollama.ai/install.sh | sh

sudo systemctl edit ollama --force
```
```ini
ini[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
Environment="OLLAMA_MAX_LOADED_MODELS=2"
Environment="OLLAMA_NUM_PARALLEL=3"
Environment="OLLAMA_KEEP_ALIVE=30m"
Environment="OLLAMA_NUM_THREADS=6"
```
```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama

# 모델 설치
ollama pull qwen2.5-coder:7b
ollama pull deepseek-r1:14b
```

4단계: Nginx + 팀원 IP 화이트리스트
```bash
apt install nginx -y

# Self-signed 인증서 (폐쇄망 재현)
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout /etc/ssl/private/ollama.key \
  -out /etc/ssl/certs/ollama.crt \
  -subj "/CN=ollama-team-server"
```
```nginx
# /etc/nginx/conf.d/ollama.conf

server {
    listen 443 ssl;

    ssl_certificate     /etc/ssl/certs/ollama.crt;
    ssl_certificate_key /etc/ssl/private/ollama.key;

    # ★ 팀원 공인 IP 화이트리스트 (폐쇄망 재현 핵심)
    allow [팀원A_IP]/32;
    allow [팀원B_IP]/32;
    allow [팀원C_IP]/32;
    allow [팀원D_IP]/32;
    allow [팀원E_IP]/32;
    deny  all;

    location / {
        proxy_pass         http://127.0.0.1:11434;
        proxy_read_timeout 300s;
        proxy_buffering    off;
        proxy_cache        off;
        
        # 동시 연결 제한 (서버 보호)
        limit_conn addr 3;
    }
}

# 동시 연결 제한 설정
limit_conn_zone $binary_remote_addr zone=addr:10m;
```

```bash
nginx -t && systemctl reload nginx
```

5단계: 각 팀원 PC 로컬 모델 설치  
팀원 전원이 각자 PC에서 실행:  

```bash
# 각자 PC에서 (Windows/Mac/Linux)
ollama pull qwen2.5-coder:1.5b   # 자동완성
ollama pull nomic-embed-text      # 임베딩
```

6단계: 팀 공용 config.yaml   
이 파일을 팀 Git 저장소에 올려두고 팀원 전체가 공유합니다.   

```yaml
# ~/.continue/config.yaml

name: Financial FE SDD Team Practice
version: 1.0.0
schema: v1

models:

  # 채팅 / 리팩토링 → 중앙 서버
  - name: FE Chat (Qwen 7B) [서버]
    provider: ollama
    model: qwen2.5-coder:7b
    apiBase: https://[서버IP]
    roles:
      - chat
      - edit
      - apply
    keepAlive: 1800
    requestOptions:
      verifySsl: false
      timeout: 120
    defaultCompletionOptions:
      temperature: 0.5
      contextLength: 8192
      maxTokens: 4096

  # 설계 / 추론 → 중앙 서버
  - name: Reasoning (DeepSeek 14B) [서버]
    provider: ollama
    model: deepseek-r1:14b
    apiBase: https://[서버IP]
    roles:
      - chat
    keepAlive: 1800
    requestOptions:
      verifySsl: false
      timeout: 300
    defaultCompletionOptions:
      temperature: 0.6
      contextLength: 8192
      maxTokens: 4096

  # 자동완성 → 각자 로컬 PC
  - name: Autocomplete (1.5B) [로컬]
    provider: ollama
    model: qwen2.5-coder:1.5b
    apiBase: http://localhost:11434
    roles:
      - autocomplete
    keepAlive: 3600
    autocompleteOptions:
      debounceDelay: 400
      maxPromptTokens: 1024
      multilineCompletions: auto
      onlyMyCode: true
    defaultCompletionOptions:
      temperature: 0.1
      contextLength: 2048

  # 임베딩 → 각자 로컬 PC
  - name: Embeddings [로컬]
    provider: ollama
    model: nomic-embed-text
    apiBase: http://localhost:11434
    roles:
      - embed
    embedOptions:
      maxChunkSize: 512
      maxBatchSize: 4

context:
  - provider: code
  - provider: diff
  - provider: folder
  - provider: codebase
  - provider: terminal
  - provider: open

rules:
  - TypeScript 기본 사용, any 타입 금지
  - React 함수형 컴포넌트 + Hooks 패턴
  - 금융 데이터(금액/계좌/날짜)는 반드시 포맷팅 함수 사용
  - 접근성 aria 속성 포함
  - 에러/로딩 상태 항상 포함
  - 코드 설명은 한국어, 코드는 영어

prompts:
  - name: sdd-component
    description: SDD 명세 기반 컴포넌트 생성
    prompt: |
      아래 명세로 React + TypeScript 컴포넌트를 생성해줘.
      명세: {{{ input }}}
      - Props 인터페이스 정의
      - 금융 데이터 포맷팅 포함
      - 에러/로딩 상태 처리
      - 접근성(aria) 속성
      - JSDoc 주석

  - name: sdd-test
    description: SDD 명세 기반 테스트 생성
    prompt: |
      Jest + React Testing Library로 테스트 작성해줘.
      - 정상/에러/로딩 케이스
      - 금융 데이터 포맷 검증
      - 접근성 테스트

  - name: review
    description: 금융권 기준 코드 리뷰
    prompt: |
      금융권 기준으로 코드 리뷰해줘:
      1. 보안 취약점 (XSS, 민감정보 노출)
      2. 금융 데이터 처리 오류 가능성
      3. 접근성 준수 여부
      4. TypeScript 타입 안전성
      5. 성능 문제
```

팀원 온보딩 체크리스트  
서버 세팅 후 팀원에게 공유할 내용입니다.  
□ 1. 자기 공인 IP 확인 → 서버 관리자(나)에게 전달
      https://whatismyip.com

□ 2. 로컬 Ollama 설치
      https://ollama.ai/download

□ 3. 로컬 모델 설치
      ollama pull qwen2.5-coder:1.5b
      ollama pull nomic-embed-text

□ 4. VS Code Continue.dev 확장 설치

□ 5. config.yaml을 Git에서 받아
      ~/.continue/config.yaml 에 복사

□ 6. VS Code 재시작 → Continue 패널에서 모델 연결 확인

비용 최종 정리  

| 항목 | 비용 |
| Hetzner CX42 | €18/월 (~₩27,000) |
| 1인당 부담 (5명) | ₩5,400/월 |
| 1인당 부담 (3명) | ₩9,000/월 |

예산 ₩10만원 이내에서 5명이 실제 금융권 폐쇄망 구조와 동일한 환경을 쓸 수 있습니다. 실제 프로젝트 투입 직전에는 한 달만 CX52(32GB RAM, €38)로 업그레이드하면 deepseek-r1:32b까지 테스트할 수 있습니다.







## 검색 프롬프트
---
그럼 내가 개인적으로 이런 형식의 프로젝트를 구현해 보기 위하여 AI 서버용으로 하나 dothome.co.kr에서 구입하여 운용하고 싶다. 그리고 거기에 ollama 를 세팅해서 해당 서버를 통해서 AI 개발을 하고 싶다. 방법을 알려줘. 아니면 많이 사용하는 서버를 추천해줘도 돼

핵심은 나중에 금융권 프로젝트를 진행할 때 SDD 방법론으로 프론트엔드 개발용 테스트를 위한 환경을 미리 해보기 위한 것이니까 그것을 참조해서 다시 알려줘

질문: 테스트 환경을 혼자 쓸건가요, 팀과 함께 쓸건가요?
답변: 혼자 (3~5인 개발 환경 시뮬레이션)

질문: 서버 비용 예산은 어느 정도로 생각하세요?
답변: 월 3만원 이하 (최저 비용)