# 🔑 MKM Lab AI 텔레그램 봇 API 키 설정 가이드 (Google AI 기반)

## 🎯 목표: "압도적인 첫인상"을 위한 완벽한 Google AI 설정

이 가이드는 MKM Lab AI 텔레그램 봇의 **데이터 드림스케이프** 기능을 완벽하게 작동시키기 위한 Google AI API 키 설정 방법을 안내합니다.

---

## 📋 필요한 API 키 목록

### 1. **텔레그램 봇 토큰** (필수)
- **용도**: 텔레그램 봇 기본 기능
- **비용**: 무료
- **설정 시간**: 5분

### 2. **Google AI Gemini Pro Vision API 키** (핵심)
- **용도**: 데이터 드림스케이프 이미지 생성
- **비용**: Google Cloud 크레딧 활용 (매우 저렴)
- **설정 시간**: 15분

### 3. **OpenWeatherMap API 키** (선택)
- **용도**: 날씨 기반 맞춤 추천
- **비용**: 무료 (월 1,000회 호출)
- **설정 시간**: 5분

---

## 🚀 단계별 설정 가이드

### Step 1: 텔레그램 봇 토큰 설정

#### 1.1 BotFather에서 봇 생성
1. 텔레그램에서 [@BotFather](https://t.me/botfather) 검색
2. `/newbot` 명령어 입력
3. 봇 이름 입력 (예: "MKM Lab AI 페르소나")
4. 봇 사용자명 입력 (예: "mkmlab_persona_bot")
5. **토큰 복사** (예: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### 1.2 환경 변수 설정
```bash
# .env 파일에 추가
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### Step 2: Google AI Gemini Pro Vision API 키 설정 (핵심)

#### 2.1 Google Cloud 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 방문
2. 새 프로젝트 생성 (예: "mkm-persona-diary")
3. 프로젝트 선택

#### 2.2 Vertex AI API 활성화
1. [API 및 서비스 > 라이브러리](https://console.cloud.google.com/apis/library) 방문
2. "Vertex AI API" 검색 및 활성화
3. "Generative Language API" 검색 및 활성화

#### 2.3 서비스 계정 생성
1. [IAM 및 관리 > 서비스 계정](https://console.cloud.google.com/iam-admin/serviceaccounts) 방문
2. "서비스 계정 만들기" 클릭
3. 계정 이름 입력 (예: "mkm-ai-generator")
4. 설명 입력: "MKM Lab AI 이미지 생성용 서비스 계정"

#### 2.4 API 키 생성
1. 생성된 서비스 계정 클릭
2. "키" 탭 선택
3. "키 추가 > 새 키 만들기" 클릭
4. JSON 형식 선택
5. **JSON 파일 다운로드** (API 키 정보 포함)

#### 2.5 환경 변수 설정
```bash
# .env 파일에 추가
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
# 또는 JSON 파일 경로 설정
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
```

#### 2.6 비용 관리 설정
```bash
# Google Cloud 사용량 제한 설정 (선택사항)
GOOGLE_AI_USAGE_LIMIT=1000  # 월 최대 이미지 생성 수
```

### Step 3: OpenWeatherMap API 키 설정 (선택)

#### 3.1 API 키 발급
1. [OpenWeatherMap](https://openweathermap.org/api) 방문
2. "Get API key" 클릭
3. 무료 계정 생성
4. **API 키 복사** (예: `1234567890abcdef...`)

#### 3.2 환경 변수 설정
```bash
# .env 파일에 추가
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

---

## 🔧 환경 변수 파일 설정

### .env 파일 생성
```bash
# 프로젝트 루트에 .env 파일 생성
touch .env
```

### .env 파일 내용
```env
# 텔레그램 봇 토큰 (필수)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Google AI Gemini Pro Vision API 키 (핵심)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# OpenWeatherMap API 키 (선택)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# 개발 모드
NODE_ENV=development

# 로그 레벨
LOG_LEVEL=info

# 이미지 생성 품질 설정
IMAGE_QUALITY=hd
IMAGE_SIZE=1024x1024

# Google AI 설정
GOOGLE_AI_MODEL=gemini-pro-vision
GOOGLE_AI_TEMPERATURE=0.7
```

---

## ✅ 설정 검증 방법

### 1. 봇 연결 테스트
```bash
# 봇 실행
npm start

# 텔레그램에서 봇 검색 후 /start 명령어 테스트
```

### 2. Google AI 이미지 생성 테스트
```bash
# 드림스케이프 기능 테스트
node test-dreamscape-features.js
```

### 3. Google AI API 키 유효성 검증
```bash
# Google AI API 연결 테스트
curl -H "Authorization: Bearer $GOOGLE_AI_API_KEY" \
     https://generativelanguage.googleapis.com/v1beta/models
```

---

## 💰 비용 관리 전략

### Google AI API 비용 최적화

#### 1. **이미지 생성 비용**
- **Google AI Gemini Pro Vision**: 매우 저렴한 비용 구조
- **Google Cloud 크레딧**: 신규 사용자 무료 크레딧 제공
- **월 1,000장 생성 시**: 약 $5-10 (OpenAI 대비 80% 절약)
- **월 100장 생성 시**: 약 $0.5-1

#### 2. **비용 제한 설정**
```javascript
// src/data-dreamscape-generator.js에 추가
const DAILY_LIMIT = 100;  // 일일 생성 제한
const MONTHLY_LIMIT = 2000;  // 월간 생성 제한
```

#### 3. **사용량 모니터링**
```bash
# Google Cloud 사용량 확인
gcloud auth application-default login
gcloud billing accounts list
```

### 무료 티어 활용
- **Google Cloud**: 신규 사용자 무료 크레딧
- **OpenWeatherMap**: 월 1,000회 무료
- **텔레그램 봇**: 완전 무료

---

## 🚨 보안 주의사항

### 1. **API 키 보안**
```bash
# .env 파일을 .gitignore에 추가
echo ".env" >> .gitignore

# .env.example 파일 생성 (템플릿용)
cp .env .env.example
# 실제 키 값들을 제거하고 플레이스홀더로 교체
```

### 2. **환경 변수 관리**
```bash
# 프로덕션 환경에서는 환경 변수 직접 설정
export TELEGRAM_BOT_TOKEN="your_token"
export GOOGLE_AI_API_KEY="your_key"
```

### 3. **키 순환 정책**
- **월 1회**: API 키 재생성
- **보안 이벤트 시**: 즉시 키 재생성
- **접근 권한 관리**: 필요한 권한만 부여

---

## 🔍 문제 해결

### 일반적인 오류 및 해결방법

#### 1. **"Google AI API 키가 설정되지 않았습니다"**
```bash
# .env 파일 확인
cat .env

# 환경 변수 로드 확인
node -e "require('dotenv').config(); console.log(process.env.GOOGLE_AI_API_KEY)"
```

#### 2. **"텔레그램 봇 토큰이 유효하지 않습니다"**
```bash
# 봇 토큰 재확인
# BotFather에서 /mybots 명령어로 토큰 확인
```

#### 3. **"Google AI API 호출 한도 초과"**
```bash
# Google Cloud 사용량 확인
# 결제 정보 확인
# 사용량 제한 설정 확인
```

#### 4. **"Google Cloud 프로젝트 설정 오류"**
```bash
# 프로젝트 ID 확인
gcloud config get-value project

# 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID
```

---

## 📊 성능 최적화

### 1. **이미지 생성 속도 개선**
```javascript
// 병렬 처리 설정
const CONCURRENT_REQUESTS = 5;  // 동시 요청 수 제한
const REQUEST_TIMEOUT = 30000;  // 30초 타임아웃
```

### 2. **캐싱 전략**
```javascript
// 생성된 이미지 캐싱
const IMAGE_CACHE_DURATION = 24 * 60 * 60 * 1000;  // 24시간
```

### 3. **폴백 시스템 강화**
```javascript
// API 실패 시 폴백 이미지 제공
const FALLBACK_IMAGES = {
  'P1': 'https://via.placeholder.com/1024x1024/1e3a8a/ffffff?text=Visionary+Leader+%28Google+AI%29',
  'P2': 'https://via.placeholder.com/1024x1024/059669/ffffff?text=Balanced+Builder+%28Google+AI%29',
  // ...
};
```

---

## 🎯 초기 배포 체크리스트

### ✅ 필수 설정 완료
- [ ] 텔레그램 봇 토큰 설정
- [ ] Google AI Gemini Pro Vision API 키 설정
- [ ] Google Cloud 프로젝트 설정
- [ ] .env 파일 생성 및 보안 설정
- [ ] 봇 연결 테스트 완료
- [ ] Google AI 이미지 생성 테스트 완료

### ✅ 기능 검증 완료
- [ ] /dreamscape 명령어 작동 확인
- [ ] /logo 명령어 작동 확인
- [ ] /styles 명령어 작동 확인
- [ ] 폴백 시스템 작동 확인
- [ ] 에러 처리 확인

### ✅ 보안 검증 완료
- [ ] .env 파일 .gitignore 등록
- [ ] API 키 노출 방지
- [ ] 환경 변수 보안 설정
- [ ] 접근 권한 최소화

---

## 🚀 다음 단계

### 1. **즉시 실행**
```bash
# 봇 실행
npm start

# 텔레그램에서 봇 테스트
# 사진 전송 → /dreamscape → 결과 확인
```

### 2. **사용자 피드백 수집**
- 이미지 품질 피드백
- 사용자 경험 개선점
- 추가 기능 요청사항

### 3. **성능 모니터링**
- Google AI API 사용량 추적
- 비용 관리
- 서버 성능 모니터링

---

**🎭 "내면의 초상을, Google AI의 시선으로 재창조하다"**

이제 Google AI API 키 설정만으로 **압도적인 첫인상**을 선사할 수 있습니다! 