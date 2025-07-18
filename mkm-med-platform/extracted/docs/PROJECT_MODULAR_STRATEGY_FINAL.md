# [MKM Lab 공식 문서] 모듈러 아키텍처 최종 설계도 (v1.2)

---

### **문서 정보**

* **문서 버전**: 1.2 (MVP 전략 반영)
* **최초 작성일**: 2025-07-08
* **최종 수정일**: 2025-07-08
* **작성자**: @아테나 (Project Chief Architect)
* **상태**: **확정 (Confirmed)**

### **변경 이력 (Revision History)**

| 버전 | 수정일 | 작성자 | 주요 변경 사항 |
| :--- | :--- | :--- | :--- |
| 1.0 | 2025-07-08 | @아테나 | 모듈러 아키텍처 전략 초안 작성 |
| 1.1 | 2025-07-08 | @아테나 | 실행 방안 구체화, 워크플로우 강화, 리스크 관리 항목 추가 |
| 1.2 | 2025-07-08 | @아테나 | 'Effortless Experience' MVP 전략 반영, 개발 우선순위 재설정 |

---

## **1. 비전 선언문: "Athena-Prime-Protocol v7.2 - The Effortless Experience"**

### **1.1 핵심 비전**

> **"인공지능의 힘으로 의료진의 행정업무 부담을 제거하고, 완전자동화된 건강관리 솔루션을 통해 환자 중심의 의료 서비스를 실현한다."**

### **1.2 MVP 철학: "Effortless Experience"**

* **Effortless for Healthcare Providers** - 의료진은 단 한 번의 설정으로 모든 행정업무가 자동화됨
* **Effortless for Patients** - 환자는 자연스러운 일상 속에서 건강관리가 이루어짐
* **Effortless for System** - 모든 프로세스가 AI 기반으로 완전자동화됨

### **1.3 핵심 가치 루프 (Core Value Loop)**

1. **문제 인식** → 의료진의 행정업무 과부하, 환자의 건강관리 부담
2. **솔루션 제공** → AI 기반 완전자동화 시스템 
3. **즉시 가치** → 업무시간 80% 단축, 환자 만족도 95% 향상
4. **지속적 개선** → AI 학습을 통한 서비스 품질 자동 향상
5. **생태계 확장** → 의료기관 → 환자 → 보험사 → 정부 네트워크 구축

---

## **2. MVP 개발 우선순위 원칙**

### **2.1 Must Have (핵심 필수 기능)**

| 순위 | 모듈 | 기능 | 비즈니스 가치 |
| :--- | :--- | :--- | :--- |
| 1 | 홈페이지 | 의료진 온보딩, 서비스 소개 | 고객 유입의 관문 |
| 2 | 의료진 대시보드 | 환자 리스트, 기본 관리 | 핵심 사용자 경험 |
| 3 | 환자 프로필 | 기본 정보, 생체형 분류 | 개인화 서비스 기반 |
| 4 | AI 상담 엔진 | 기본 상담, 추천 시스템 | 차별화 핵심 기능 |

### **2.2 Should Have (중요하지만 후순위)**

* AI 전문의 위원회 (Advanced AI Features)
* 고급 분석 리포트
* 의료기관 연동 API
* 실시간 알림 시스템

### **2.3 Could Have (추가 개발 고려)**

* 웨어러블 디바이스 연동
* 음성 인식 인터페이스
* 다국어 지원
* 소셜 기능

### **2.4 Won't Have (현재 버전에서 제외)**

* **복잡한 의료기기 통합** - 규제 복잡성 높음
* **보험 청구 자동화** - 법적 검토 필요
* **의료 영상 AI 분석** - 별도 전문성 요구
* **전자의무기록(EMR) 완전 통합** - 기술적 복잡도 높음
* **블록체인 기반 의료 데이터** - 현재 시장 성숙도 부족

---

## **3. 모듈러 아키텍처 핵심 설계**

### **3.1 시스템 아키텍처 개요**

```
┌─────────────────────────────────────────────────────────────┐
│                    MKM Lab v3 Ecosystem                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer (Vue 3 + Vite + TypeScript)               │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │ Home Portal │ Medical UI  │ Patient UI  │ Admin Panel │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  API Gateway & Service Layer (Firebase Functions)          │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │ Auth Service│ AI Engine   │ Data Service│ Notification│ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (Firestore + PGlite + External APIs)          │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │ User Data   │ AI Models   │ Health Data │ System Logs │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **3.2 모듈별 구조**

#### **A. Frontend Modules**

```typescript
src/
├── modules/
│   ├── home/              // 홈페이지 모듈
│   │   ├── components/
│   │   ├── views/
│   │   └── router.ts
│   ├── medical/           // 의료진 대시보드
│   │   ├── components/
│   │   ├── views/
│   │   └── router.ts
│   ├── patient/           // 환자 인터페이스
│   │   ├── components/
│   │   ├── views/
│   │   └── router.ts
│   └── ai/                // AI 상담 엔진
│       ├── components/
│       ├── services/
│       └── models/
├── shared/                // 공통 컴포넌트
│   ├── components/
│   ├── composables/
│   ├── utils/
│   └── types/
└── core/                  // 핵심 시스템
    ├── router/
    ├── store/
    └── plugins/
```

#### **B. Backend Modules (Firebase Functions)**

```javascript
functions/
├── modules/
│   ├── auth/              // 인증 및 권한 관리
│   ├── ai/                // AI 엔진 로직
│   ├── data/              // 데이터 관리
│   ├── notification/      // 알림 시스템
│   └── analytics/         // 분석 및 리포팅
├── shared/                // 공통 유틸리티
│   ├── validators/
│   ├── helpers/
│   └── constants/
└── core/                  // 핵심 설정
    ├── database/
    ├── security/
    └── monitoring/
```

### **3.3 데이터 모델 설계**

#### **핵심 엔티티**

```typescript
// 사용자 (의료진)
interface MedicalUser {
  id: string;
  email: string;
  profile: {
    name: string;
    specialization: string;
    license: string;
    hospital: string;
  };
  patients: string[];
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

// 환자
interface Patient {
  id: string;
  medicalProviderId: string;
  profile: PatientProfile;
  biotype: BiotypeResult;
  healthData: HealthData[];
  aiConsultations: AIConsultation[];
  createdAt: Date;
  updatedAt: Date;
}

// AI 상담 결과
interface AIConsultation {
  id: string;
  patientId: string;
  type: 'initial' | 'follow_up' | 'recommendation';
  input: ConsultationInput;
  output: ConsultationOutput;
  aiModel: string;
  confidence: number;
  timestamp: Date;
}
```

---

## **4. 개발 실행 전략**

### **4.1 Sprint 기반 개발 계획**

#### **Sprint 1 (1-2주): 기반 구조**
- [ ] 프로젝트 초기 설정 (Vite + Vue 3 + TypeScript)
- [ ] Firebase 설정 및 기본 인증
- [ ] 모듈러 아키텍처 기반 구조 구축
- [ ] 기본 라우팅 및 상태 관리

#### **Sprint 2 (3-4주): 홈페이지 & 온보딩**
- [ ] 홈페이지 디자인 및 구현
- [ ] 의료진 회원가입/로그인 플로우
- [ ] 서비스 소개 페이지
- [ ] 기본 대시보드 레이아웃

#### **Sprint 3 (5-6주): 환자 관리 기본 기능**
- [ ] 환자 등록 및 프로필 관리
- [ ] 생체형 분류 설문 시스템
- [ ] 기본 환자 리스트 뷰
- [ ] 데이터 입력 폼

#### **Sprint 4 (7-8주): AI 엔진 통합**
- [ ] Google Gemini API 통합
- [ ] 기본 AI 상담 로직
- [ ] 추천 시스템 기초
- [ ] 결과 표시 인터페이스

### **4.2 기술 스택 확정**

#### **Frontend**
- **Framework**: Vue 3 + Composition API
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: Pinia
- **HTTP Client**: Axios

#### **Backend**
- **Platform**: Firebase
- **Functions**: Node.js 18 + TypeScript
- **Database**: Firestore + PGlite (로컬 캐싱)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage

#### **AI Integration**
- **Primary**: Google Gemini 1.5 Pro
- **Backup**: OpenAI GPT-4
- **Voice**: Google Speech-to-Text/Text-to-Speech

### **4.3 성능 최적화 전략**

#### **Frontend 최적화**
- Code Splitting (모듈별 lazy loading)
- 이미지 최적화 (WebP, Progressive JPEG)
- PWA 구현 (Service Worker, 오프라인 지원)
- Bundle 크기 최소화

#### **Backend 최적화**
- Firestore 쿼리 최적화
- Firebase Functions 콜드 스타트 최소화
- 캐싱 전략 (Redis/PGlite)
- API 응답 압축

---

## **5. 품질 보증 및 테스트 전략**

### **5.1 테스트 피라미드**

```
        ┌─────────────┐
        │     E2E     │ ← Cypress (핵심 플로우)
        └─────────────┘
       ┌─────────────────┐
       │   Integration   │ ← Jest + Firebase Test
       └─────────────────┘
    ┌─────────────────────────┐
    │        Unit Tests       │ ← Vitest (컴포넌트, 함수)
    └─────────────────────────┘
```

### **5.2 코드 품질 관리**

#### **Linting & Formatting**
```json
{
  "scripts": {
    "lint": "eslint src --ext .vue,.js,.ts",
    "format": "prettier --write src",
    "type-check": "vue-tsc --noEmit"
  }
}
```

#### **Pre-commit Hooks**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: eslint
        name: ESLint
        entry: npm run lint
        language: system
      - id: type-check
        name: TypeScript Check
        entry: npm run type-check
        language: system
```

### **5.3 모니터링 및 오류 추적**

- **Frontend**: Sentry (에러 추적)
- **Backend**: Firebase Monitoring + Custom Logs
- **Performance**: Lighthouse CI
- **Security**: Firebase Security Rules + OWASP 체크리스트

---

## **6. 보안 및 규정 준수**

### **6.1 데이터 보안**

#### **개인정보 보호**
- GDPR, PIPEDA 준수
- 데이터 암호화 (저장/전송)
- 개인정보 익명화 처리
- 사용자 동의 관리

#### **의료 데이터 보안**
- HIPAA 가이드라인 준수
- 접근 권한 최소화 원칙
- 감사 로그 (Audit Trail)
- 정기 보안 감사

### **6.2 Firebase Security Rules**

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 의료진만 자신의 환자 데이터 접근
    match /patients/{patientId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.medicalProviderId;
    }
    
    // 사용자는 자신의 프로필만 수정
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

---

## **7. 배포 및 운영 전략**

### **7.1 CI/CD 파이프라인**

#### **GitHub Actions 워크플로우**
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test
      - name: Build
        run: npm run build
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
```

### **7.2 환경 관리**

- **Development**: 로컬 개발 (Firebase Emulator)
- **Staging**: 테스트 환경 (Firebase Staging Project)
- **Production**: 운영 환경 (Firebase Production Project)

### **7.3 모니터링 대시보드**

#### **주요 메트릭**
- 사용자 활성도 (DAU, MAU)
- 시스템 성능 (응답시간, 에러율)
- 비즈니스 메트릭 (신규 가입, 상담 수)
- AI 성능 (정확도, 만족도)

---

## **8. 리스크 관리 및 대응 방안**

### **8.1 기술적 리스크**

| 리스크 | 확률 | 영향도 | 대응 방안 |
| :--- | :--- | :--- | :--- |
| AI API 장애 | 중간 | 높음 | 다중 AI 공급자, 폴백 시스템 |
| Firebase 비용 초과 | 높음 | 중간 | 사용량 모니터링, 자동 알림 |
| 데이터 손실 | 낮음 | 높음 | 정기 백업, 복제 데이터베이스 |
| 보안 침해 | 낮음 | 높음 | 다층 보안, 정기 감사 |

### **8.2 사업적 리스크**

| 리스크 | 확률 | 영향도 | 대응 방안 |
| :--- | :--- | :--- | :--- |
| 규제 변경 | 중간 | 높음 | 법무 자문, 규정 모니터링 |
| 경쟁사 출현 | 높음 | 중간 | 차별화 기능, 빠른 반복 개발 |
| 시장 수용성 부족 | 중간 | 높음 | MVP 검증, 사용자 피드백 |

---

## **9. 결론 및 다음 단계**

### **9.1 핵심 성공 요소**

1. **모듈러 아키텍처 완전 구현** - 확장성과 유지보수성 확보
2. **MVP 우선순위 엄격 준수** - 핵심 기능에 집중, 빠른 시장 출시
3. **AI 차별화 기능 완성** - 경쟁 우위 확보
4. **사용자 경험 최적화** - Effortless Experience 구현
5. **지속적 학습 및 개선** - 데이터 기반 의사결정

### **9.2 즉시 실행 항목 (Next Actions)**

#### **개발팀 (우선순위 순)**
1. **모듈러 프로젝트 구조 설정** (3일)
2. **Firebase 환경 구축** (2일)
3. **홈페이지 와이어프레임 작성** (3일)
4. **의료진 온보딩 플로우 설계** (5일)

#### **기획팀**
1. **MVP 기능 명세서 작성** (5일)
2. **사용자 여정 지도 완성** (3일)
3. **경쟁 분석 업데이트** (3일)

### **9.3 성공 지표 (KPI)**

#### **기술적 지표**
- 페이지 로딩 속도: < 2초
- API 응답 시간: < 500ms
- 시스템 가용성: > 99.9%
- 코드 커버리지: > 80%

#### **사업적 지표**
- 의료진 가입자 수: 100명 (Beta)
- 환자 등록 수: 1,000명 (Beta)
- 일일 활성 사용자: 50명 (Beta)
- 사용자 만족도: > 4.5/5.0

---

### **문서 승인 및 확인**

- [x] **Chief Architect (@아테나)**: 기술 아키텍처 검토 완료
- [ ] **Project Manager**: 일정 및 리소스 확인
- [ ] **Product Owner**: 비즈니스 요구사항 검토
- [ ] **QA Lead**: 테스트 전략 검토
- [ ] **DevOps Engineer**: 인프라 및 배포 전략 검토

---

**문서 관리 정보**
- 다음 검토 예정일: 2025-07-15
- 관련 문서: `DEVELOPMENT_PROTOCOL.md`, `MKM_COMPLETE_CONSTITUTION_v4.0_MODULAR.md`
- 문의사항: athena@mkmlab.ai

---

*이 문서는 MKM Lab의 공식 기술 전략 문서입니다. 모든 개발진은 반드시 숙지하고 준수해야 합니다.*
