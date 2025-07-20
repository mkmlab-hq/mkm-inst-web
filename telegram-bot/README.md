# 🎭 Persona Diary Telegram Bot v2.0.0

**Your Hyper-Personalized AI Health Advisor**

페르소나 다이어리 텔레그램 봇은 당신만을 위한 **초개인화 건강 솔루션**을 제공하는 AI 페르소나 분석 봇입니다.

## 🌟 핵심 가치

- 🎯 **초개인화** - 당신만의 고유한 건강 페르소나
- 🔬 **과학적** - rPPG 기술 기반 생체 신호 분석
- 🤖 **AI 기반** - RAG 기술로 맞춤형 건강 상담
- 🌍 **통합적** - 날씨, 환경, 개인 데이터 융합

## 🎭 분석 방법

- 📹 **영상 분석** (추천) - 15초 영상으로 rPPG 생체 신호 분석
- 📸 **사진 분석** - 얼굴 사진으로 AI 특징 분석
- 🎤 **음성 분석** - 음성 메시지로 패턴 분석
- 💬 **텍스트 분석** - 건강 관련 메시지로 분석

## 🎵 AI 음악 솔루션

- 🌿 **오행 음악 솔루션** - 목(木), 화(火), 토(土), 금(金), 수(水) 기반 맞춤 음악
- 🧠 **감마파 음악 솔루션** - 40Hz 감마파 주파수 최적화 음악

## 🤖 AI 어드바이저

분석 후 "상담하기", "질문하기" 등으로 AI 어드바이저와 상담하여 맞춤 솔루션을 받을 수 있습니다.

## 🚀 시작하기

### 환경 설정

1. 환경 변수 파일 생성:
```bash
cp env.example .env
```

2. 필요한 환경 변수 설정:
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8080
```

### 설치 및 실행

```bash
npm install
npm start
```

### 개발 모드

```bash
npm run dev
```

## 📋 주요 명령어

### 기본 명령어
- `/start` - 시작 메시지
- `/help` - 도움말 보기
- `/analyze` - 페르소나 분석 시작

### 분석 관련
- `/persona` - 페르소나 정보 보기
- `/weather` - 날씨 정보 확인
- `/advice` - 건강 조언 받기
- `/environment` - 환경 기반 추천

### 음악 솔루션
- `/music` - AI 음악 솔루션
- `/five-elements` - 오행 음악 추천
- `/gamma-frequency` - 감마파 음악 추천

### 다이어리 기능
- `/diary` - 페르소나 다이어리
- `/write` - 다이어리 작성
- `/read` - 다이어리 읽기
- `/stats` - 다이어리 통계
- `/search` - 다이어리 검색

### 이미지 생성
- `/image` - 기본 페르소나 이미지 생성
- `/dreamscape` - 데이터 드림스케이프 생성
- `/logo` - 나만의 로고 완성
- `/limited` - 한정판 이미지 생성

### 특별 기능
- `/events` - 한정판 이벤트 보기
- `/event` - 이벤트 대시보드
- `/disposition` - 기질 분석 보기
- `/evolution` - 페르소나 진화 추적

## 🎯 건강 페르소나

- **P1: The Visionary Leader (비전 리더)** - 창의성과 리더십
- **P2: The Balanced Builder (균형 조성가)** - 안정성과 체계성
- **P3: The Dynamic Explorer (동적 탐험가)** - 에너지와 탐험
- **P4: The Mindful Guardian (마음챙김 수호자)** - 직관과 평온

## 🌟 특별 기능

- 🌌 **데이터 드림스케이프** (AI 고유 미학)
- 🎨 **페르소나 로고 생성** (개인 브랜딩)
- 🎭 **한정판 이벤트** 참여로 특별 페르소나 획득
- 🧠 **5차원 기질 분석** (사고형, 내향형, 주도형, 실용형, 안정형)
- 🔄 **페르소나 진화 추적**으로 변화 패턴 분석
- 🌍 **환경 지능 통합** (날씨, 문화, 경제, 정치)
- 📖 **페르소나 다이어리** (개인화된 일기 작성)

## 🎵 음악 솔루션 상세

### 오행 음악 솔루션
- **목(木)** - 창의성과 성장 촉진
- **화(火)** - 에너지와 열정 증진
- **토(土)** - 안정감과 균형 조성
- **금(金)** - 정리와 완성 촉진
- **수(水)** - 지혜와 직관 향상

### 감마파 음악 솔루션
- **40Hz 감마파 주파수** 최적화
- **집중력 및 인지 능력** 향상
- **창의성 증진**
- **학습 능력 향상**

## 🏗️ 기술 스택

- **Node.js** - 서버 런타임
- **node-telegram-bot-api** - 텔레그램 봇 API
- **Google AI Gemini Pro Vision** - AI 이미지 생성
- **Google Cloud Natural Language** - 텍스트 분석
- **RAG (Retrieval-Augmented Generation)** - 지식 기반 응답

## 🚀 배포

### Cloud Run 배포

```bash
# Docker 이미지 빌드
docker build -t persona-diary-bot .

# Cloud Run에 배포
gcloud run deploy persona-diary-bot \
  --image persona-diary-bot \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated
```

### 환경 변수 설정 (Cloud Run)

- `TELEGRAM_BOT_TOKEN`
- `GOOGLE_AI_API_KEY`
- `GEMINI_API_KEY`
- `PORT` (기본값: 8080)

## 📊 API 엔드포인트

- `GET /health` - 헬스체크
- `GET /` - 서비스 정보
- `POST /send-analysis-result` - 분석 결과 수신

## 🔒 보안 및 개인정보

- 모든 개인 데이터는 로컬 저장
- 의료법 준수 (웰니스 서비스)
- 면책조항 포함

## 📝 라이선스

MIT License

## 🤝 기여

MKM Lab에서 개발 및 유지보수

---

**철학**: "내면의 초상을, AI의 시선으로 재창조하다"

*본 서비스는 웰니스 참고용이며, 의료적 진단이나 치료를 대체하지 않습니다.* # 강제 배포 트리거 07/21/2025 04:09:51
