# MKM Lab 텔레그램 봇 - Cloud Build 배포 가이드

## 🚀 Cloud Build 설정

### 1. 소스 저장소 설정

**저장소 제공업체**: GitHub  
**저장소**: `mkmlab-hq/mkm-inst-web`  
**브랜치**: `main`  
**디렉토리**: `telegram-bot/`

### 2. 환경 변수 설정

Cloud Run 서비스에 다음 환경 변수를 설정해야 합니다:

```bash
# 필수 환경 변수
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
NODE_ENV=production
PORT=8080

# AI 기능용 (선택사항)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENWEATHER_API_KEY=your-openweather-api-key-here
ENABLE_REAL_API_CALLS=true
USE_VERTEX_AI=false
```

### 3. Cloud Build 트리거 설정

1. **트리거 이름**: `mkm-telegram-bot-deploy`
2. **이벤트**: Push to a branch
3. **소스**: `main` 브랜치
4. **빌드 구성**: `cloudbuild.yaml` 사용

### 4. 배포 단계

1. **Docker 이미지 빌드**
2. **Artifact Registry에 푸시**
3. **Cloud Run에 배포**

## 📋 배포 확인 사항

### ✅ 필수 확인 항목

- [ ] `TELEGRAM_BOT_TOKEN` 환경 변수 설정
- [ ] Cloud Build API 활성화
- [ ] Artifact Registry API 활성화
- [ ] Cloud Run API 활성화
- [ ] 적절한 IAM 권한 설정

### 🔧 배포 후 확인

1. **헬스체크**: `https://your-service-url/health`
2. **봇 상태**: 텔레그램에서 `/start` 명령어 테스트
3. **로그 확인**: Cloud Run 로그에서 에러 확인

## 🛠️ 로컬 테스트

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집하여 실제 값 입력

# 로컬 실행
npm start
```

## 📊 모니터링

- **Cloud Run 메트릭**: CPU, 메모리, 요청 수
- **Cloud Build 로그**: 빌드 과정 및 에러
- **텔레그램 봇 로그**: 사용자 상호작용

## 🔄 자동 배포

GitHub에 코드를 푸시하면 자동으로:
1. Cloud Build가 트리거됨
2. Docker 이미지가 빌드됨
3. Artifact Registry에 저장됨
4. Cloud Run에 배포됨

## 🚨 문제 해결

### 일반적인 문제들

1. **환경 변수 누락**: Cloud Run 서비스 설정에서 환경 변수 확인
2. **권한 문제**: IAM 역할 및 권한 확인
3. **빌드 실패**: Cloud Build 로그에서 에러 확인
4. **봇 응답 없음**: 텔레그램 봇 토큰 유효성 확인 