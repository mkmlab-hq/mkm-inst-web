# 🌐 **MKM Inst Web**

## 📋 **프로젝트 개요**

MKM Lab의 웹 인터페이스로, AI 분석 결과를 시각화하고 사용자 친화적인 대시보드를 제공합니다.

## 🏗️ **기술 스택**

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI, Framer Motion
- **Deployment**: Vercel
- **Documentation**: Storybook

## 📁 **프로젝트 구조**

```
mkm-inst-web/
├── 📁 src/                     # 소스 코드
│   ├── 📁 app/                 # Next.js 13+ App Router
│   │   ├── 📁 analysis/        # 분석 페이지
│   │   ├── 📁 components/      # 페이지별 컴포넌트
│   │   └── 📁 test-camera/     # 카메라 테스트 페이지
│   ├── 📁 components/          # 재사용 컴포넌트
│   │   ├── 📁 ui/             # 기본 UI 컴포넌트
│   │   └── 📁 features/       # 기능별 컴포넌트
│   ├── 📁 lib/                 # 유틸리티 함수
│   ├── 📁 hooks/               # 커스텀 훅
│   └── 📁 types/               # TypeScript 타입 정의
├── 📁 public/                  # 정적 파일
├── 📁 docs/                    # 프로젝트 문서
├── 📄 package.json            # Node.js 의존성
├── 📄 next.config.js          # Next.js 설정
├── 📄 tailwind.config.js      # Tailwind CSS 설정
└── 📄 README.md               # 이 파일
```

## 🚀 **빠른 시작**

### **환경 설정**

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 설정 추가
```

### **개발 서버 실행**

```bash
# 개발 모드로 실행
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

### **빌드 및 배포**

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Vercel 배포
vercel --prod
```

## 🔧 **개발 가이드**

### **코딩 표준**
- **TypeScript**: 엄격한 타입 체크
- **React**: 함수형 컴포넌트, 훅 사용
- **CSS**: Tailwind CSS 우선 사용
- **테스트**: Jest + React Testing Library

### **Git Flow**
```bash
# 기능 개발
git checkout -b feature/analysis-dashboard

# 개발 완료 후
git push origin feature/analysis-dashboard
# → GitHub에서 PR 생성
```

## 📱 **주요 페이지**

### **분석 대시보드**
- `/analysis` - AI 분석 결과 시각화
- `/test-camera` - 카메라 기능 테스트

### **컴포넌트**
- `VideoUpload` - 비디오 업로드 컴포넌트
- `AnalysisResult` - 분석 결과 표시 컴포넌트
- `SacredMeditation` - 명상 관련 컴포넌트

## 🧪 **테스트**

```bash
# 전체 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage

# E2E 테스트 (Cypress)
npm run cypress:open
```

## 📚 **문서**

- [Storybook](http://localhost:6006) - 컴포넌트 문서
- [공통 문서](../shared/docs/) - MKM Lab 공통 문서
- [API 문서](./docs/API.md)

## 🎨 **디자인 시스템**

### **색상 팔레트**
- Primary: `#3B82F6` (Blue)
- Secondary: `#10B981` (Green)
- Accent: `#F59E0B` (Yellow)
- Neutral: `#6B7280` (Gray)

### **타이포그래피**
- Heading: Inter, sans-serif
- Body: Inter, sans-serif
- Code: JetBrains Mono, monospace

## 🤝 **기여하기**

1. 이슈 생성 또는 기존 이슈 확인
2. 기능 브랜치 생성
3. 코드 작성 및 테스트
4. Storybook에 컴포넌트 등록
5. PR 생성 및 코드 리뷰
6. 승인 후 머지

## 📄 **라이선스**

MKM Lab 내부 프로젝트입니다.

---

**개발팀**: MKM Lab Frontend Team  
**문의**: [GitHub Issues](https://github.com/mkm-lab/mkm-inst-web/issues)
