---
sidebar_position: 1
displayed_sidebar: "taskDocSidebar"
title: "Oracle Cloud 환경구성"
---

# Oracle Cloud 환경구성


## PC에서 ssh 접속

* 키 파일에 권한 주기
```powershell
 icacls "C:\redsky\work\oracle_key\ssh-key-2026-04-06.key" /inheritance:r /grant:r "PC_NIC:R"
```

* ssh 키를 이용하여 ssh 접속을 합니다.
```powershell
ssh -i C:\redsky\work\oracle_key\ssh-key-2026-04-06.key opc@158.179.171.131
```

* Oracle Linux 접속된 서버 실행 (꽤 오래 걸림) 
    - 안될수도 있음 업데이트는 필수가 아니라고함 그래서 건너띔
```powershell
sudo dnf update -y
```

* ollama 설치
```powershell
sudo dnf install zstd -y # 먼저 zstd 설치
curl -fsSL https://ollama.com/install.sh | sh
```

