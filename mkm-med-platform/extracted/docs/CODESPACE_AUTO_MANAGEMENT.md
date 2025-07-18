# MKM Lab Codespace 자동 관리 시스템

## 🎯 목표
- 5분 이상 비활성 상태 시 자동으로 Codespace 정지 경고
- 10분 이상 비활성 상태 시 자동 정지 실행
- 비용 절약 및 효율적인 리소스 관리

## 📋 구현 방안

### 1단계: VS Code 설정 기반 자동화 (즉시 적용 가능)

#### 1.1 VS Code Settings 설정
```json
{
  "workbench.settings.enableNaturalLanguageSearch": false,
  "extensions.autoUpdate": false,
  "codespaces.defaultExtensions": [
    "ms-vscode.vscode-json"
  ],
  "codespaces.timeout": 300,
  "editor.autoSave": "afterDelay",
  "editor.autoSaveDelay": 1000,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000
}
```

#### 1.2 자동 저장 및 정리 스크립트
- 작업 중단 감지 시 자동 파일 저장
- Git commit 및 push 실행
- Codespace 정지 명령 실행

### 2단계: 백그라운드 모니터링 스크립트

#### 2.1 활동 감지 스크립트 (`codespace-monitor.js`)
```javascript
// 마우스, 키보드, 파일 수정 등의 활동 감지
// 5분 경고, 10분 자동 정지
```

#### 2.2 시스템 통합
- Bash 스크립트로 시스템 시작 시 자동 실행
- 백그라운드에서 지속적 모니터링
- 활동 감지 및 정지 명령 실행

### 3단계: VS Code Extension 개발 (고도화)

#### 3.1 전용 Extension 기능
- 실시간 활동 모니터링
- 사용자 친화적 알림 시스템
- 커스터마이징 가능한 타임아웃 설정

## 🚀 즉시 구현 가능한 솔루션

### Auto-Stop Script 배포
1. 시스템 시작 시 자동 실행되는 모니터링 스크립트
2. 비활성 감지 및 경고/정지 시스템
3. 작업 상태 자동 저장 및 복구

### 사용법
```bash
# 설치
./install-codespace-monitor.sh

# 수동 실행
./start-monitor.sh

# 설정 변경
nano ~/.codespace-config
```

## 📊 예상 효과
- **비용 절약**: 50-70% 컴퓨팅 시간 단축
- **자동화**: 수동 개입 없이 자동 관리
- **안전성**: 작업 손실 방지 및 자동 백업

## ⚡ 우선순위 구현 순서
1. **즉시**: Bash 기반 모니터링 스크립트
2. **단기**: VS Code Extension 개발
3. **장기**: GitHub Codespaces API 연동 고도화
