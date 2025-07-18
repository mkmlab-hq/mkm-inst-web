# 🚀 MKM Lab 베타 버전 핵심 가이드

## ⚡ **즉시 실행 사항**

### 📋 **1. 헌법 문서 확인 (필수 읽기)**
- **`PROJECT_MODULAR_STRATEGY_FINAL.md`** - 모듈러 아키텍처 최종 설계도
- **`MKM_COMPLETE_CONSTITUTION_v4.0_MODULAR.md`** - 통합 헌법 v4.0
- **`DEVELOPMENT_PROTOCOL.md`** - 개발 프로토콜 (모듈러 섹션 추가)

### 🎯 **2. 베타 버전 최우선 과제**

#### **[Tech-Debt-001] Storybook 환경 설정**
```bash
# Vue.js 3 프로젝트에 Storybook 설치
npm run storybook:init

# Atomic Design 폴더 구조 적용
src/components/
├── atoms/          # 기본 요소 (Button, Input, etc.)
├── molecules/      # 조합 요소 (SearchBox, etc.)
├── organisms/      # 복합 요소 (Header, Footer, etc.)
├── templates/      # 페이지 템플릿
└── pages/          # 완성된 페이지
```

#### **[Tech-Debt-002] Swagger 환경 설정**
```bash
# Firebase Functions에 OpenAPI 3.0 설정
npm install swagger-ui-express
npm install swagger-jsdoc

# 표준 오류 응답 형식 정의
{
  "error": {
    "code": 404,
    "message": "Patient not found."
  }
}
```

### 🔧 **3. 개발 워크플로우 (의무 준수)**

#### **브랜치 전략**
```bash
# 기능 개발 시작
git checkout -b feature/voice-analysis-module

# 개발 완료 후
git push origin feature/voice-analysis-module
# → GitHub에서 PR 생성
# → 코드 리뷰 (Storybook/Swagger 표준 확인)
# → merge 후 브랜치 삭제
```

#### **코드 리뷰 체크리스트**
- [ ] Storybook에 컴포넌트 등록되었는가?
- [ ] API에 OpenAPI 어노테이션이 있는가?
- [ ] 모듈이 독립적으로 테스트 가능한가?
- [ ] 표준 오류 응답 형식을 준수하는가?

### 📁 **4. 모듈 분류 및 명명 규칙**

#### **모듈 타입**
- **Core Module**: `core-auth`, `core-patient`
- **Feature Module**: `feature-voice-analysis`, `feature-face-scan`
- **Shared Module**: `shared-ui`, `shared-logger`

#### **파일 명명 규칙**
```
src/components/atoms/Button.vue
src/components/atoms/Button.stories.js
src/services/api/patientService.js
src/modules/voice-analysis/VoiceAnalyzer.vue
```

### 🎨 **5. UI 개발 표준 (Storybook)**

#### **컴포넌트 스토리 예시**
```javascript
// Button.stories.js
export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: { description: { component: 'Primary button component' } }
  }
}

export const Primary = {
  args: { label: 'Button', primary: true }
}
```

### 🌐 **6. API 개발 표준 (Swagger)**

#### **API 어노테이션 예시**
```javascript
/**
 * @swagger
 * /api/v1/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient data
 *       404:
 *         description: Patient not found
 */
```

### 🚨 **7. 의료 안전성 체크포인트**

#### **Core Module 개발 시**
- [ ] 개인정보 보호 조치 완료
- [ ] 의료 데이터 암호화 적용
- [ ] 에러 로깅 및 모니터링 설정

#### **Feature Module 개발 시**
- [ ] AI 분석 결과 검증 로직 포함
- [ ] 의료진 승인 워크플로우 구현
- [ ] 응급상황 대응 Circuit Breaker 패턴

### 📚 **8. 주요 문서 바로가기**

- 📋 **헌법**: `docs/MKM_COMPLETE_CONSTITUTION_v4.0_MODULAR.md`
- 🏗️ **아키텍처**: `docs/PROJECT_MODULAR_STRATEGY_FINAL.md`
- 🔧 **개발 가이드**: `DEVELOPMENT_PROTOCOL.md`
- 📝 **변경 이력**: `CHANGELOG.md`
- 📖 **문서 인덱스**: `docs/PROJECT_MASTER_INDEX.md`

### 💡 **9. 개발자 서약**

> **"모든 코드는 모듈이고, 모든 모듈은 생명을 구한다."**

우리는 레고 블록처럼 견고하고 독립적인 모듈을 통해 인류의 건강한 미래를 건설합니다.

---

**📅 업데이트**: 2025-07-08  
**📌 버전**: Beta v0.2.0  
**🎯 상태**: 모듈러 아키텍처 헌법 확정 완료

#### **[Core-Module-001] Header 네비게이션 구현 (완료)**
```bash
# Organisms 레벨 Header 컴포넌트 생성
frontend/src/components/organisms/TheHeader.vue

# Storybook 스토리 생성
frontend/src/components/organisms/TheHeader.stories.ts

# 메인 앱에 적용
frontend/src/App.vue
```

**구현 내용:**
- ✅ MKM Lab 로고 및 브랜딩
- ✅ 반응형 네비게이션 메뉴
- ✅ 모바일 햄버거 메뉴
- ✅ Storybook 스토리 문서화
- ✅ Atomic Design 체계 준수
