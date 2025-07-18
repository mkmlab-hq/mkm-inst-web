# 🔧 환경변수 설정 가이드

## 📋 필수 API 키 설정

### 1. 텔레그램 봇 토큰 발급
1. **텔레그램에서 @BotFather 찾기**
2. **`/newbot` 명령어 실행**
3. **봇 이름 입력**: `MKM Lab 페르소나 다이어리`
4. **봇 사용자명 입력**: `mkmlab_persona_bot` (또는 원하는 이름)
5. **토큰 복사**: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2. Google AI API 키 발급
1. **Google Cloud Console 접속**: https://console.cloud.google.com/
2. **프로젝트 생성 또는 선택**
3. **API 및 서비스 > 라이브러리**
4. **Gemini API 활성화**
5. **API 및 서비스 > 사용자 인증 정보**
6. **사용자 인증 정보 만들기 > API 키**
7. **API 키 복사**

### 3. OpenWeatherMap API 키 발급
1. **OpenWeatherMap 가입**: https://openweathermap.org/
2. **API 키 발급**
3. **API 키 복사**

## 🔧 .env 파일 설정

```bash
# 1. .env 파일 생성
cp env.example .env

# 2. .env 파일 편집
nano .env
```

### .env 파일 내용:
```env
# 텔레그램 봇 설정
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=mkmlab_persona_bot

# Google AI API 설정
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# 날씨 API 설정
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here

# 시스템 설정
NODE_ENV=production
PORT=8080

# 로깅 설정
LOG_LEVEL=info
LOG_FILE=bot.log

# 보안 설정 (랜덤 생성)
ENCRYPTION_KEY=your_random_encryption_key_here
JWT_SECRET=your_random_jwt_secret_here
```

## 🔐 보안 키 생성

### 암호화 키 생성:
```bash
# Node.js에서 랜덤 키 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### JWT 시크릿 생성:
```bash
# Node.js에서 랜덤 시크릿 생성
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## ✅ 설정 확인

### 1. 환경변수 확인:
```bash
npm run lint
```

### 2. 테스트 실행:
```bash
npm test
```

### 3. 개발 모드 실행:
```bash
npm run dev
```

## 🚨 주의사항

1. **API 키 보안**: .env 파일을 절대 Git에 커밋하지 마세요
2. **토큰 관리**: API 키를 안전한 곳에 백업하세요
3. **환경 분리**: 개발/테스트/프로덕션 환경을 분리하세요

## 🔗 유용한 링크

- **텔레그램 봇 API**: https://core.telegram.org/bots/api
- **Google AI Gemini**: https://ai.google.dev/
- **OpenWeatherMap API**: https://openweathermap.org/api
- **Google Cloud Console**: https://console.cloud.google.com/

---

**설정 완료 후 `npm run deploy`로 배포를 시작하세요! 🚀** 