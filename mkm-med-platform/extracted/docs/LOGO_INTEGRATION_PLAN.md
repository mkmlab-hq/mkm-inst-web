# MKM 로고 적용 계획서

## 개요
MKM Lab 브랜드 아이덴티티 강화를 위해 `mkmlogo.png`를 전체 서비스에 통합 적용

## 로고 파일 배치 계획

### 1. 파일 구조
```
/workspaces/mkmlab-v3/
├── public/images/
│   ├── mkmlogo.png           # 메인 웹서비스용
│   ├── mkmlogo-small.png     # 작은 사이즈 (32x32)
│   └── mkmlogo-favicon.ico   # 파비콘용
├── frontend/public/images/
│   ├── mkmlogo.png           # Vue.js 앱용
│   └── mkmlogo-small.png
└── molly-note-app/public/images/
    ├── mkmlogo.png           # Laravel 앱용
    └── mkmlogo-small.png
```

### 2. 적용 위치별 계획

#### A. 웹 서비스 (메인)
- **위치**: `/index.html`, `/src/` 컴포넌트
- **용도**: 
  - 헤더 로고 (200x60px)
  - 로그인 페이지 중앙 로고 (300x100px)
  - 푸터 로고 (150x50px)
- **구현**: HTML/CSS/JavaScript

#### B. 프론트엔드 앱 (Vue.js)
- **위치**: `/frontend/src/components/`, `/frontend/src/views/`
- **용도**:
  - 네비게이션 바 (180x50px)
  - 대시보드 사이드바 (120x40px)
  - 로딩 스크린 (200x80px)
- **구현**: Vue 컴포넌트

#### C. Laravel 앱 (molly-note-app)
- **위치**: `/molly-note-app/resources/views/`
- **용도**:
  - 관리자 대시보드 헤더
  - 원장용 인터페이스 상단
  - 인증 페이지들
- **구현**: Blade 템플릿

#### D. 카카오톡 챗봇
- **위치**: `/functions/src/routes/kakao.js`
- **용도**:
  - 챗봇 프로필 이미지
  - 메시지 내 이미지 첨부
  - 카드형 메시지 헤더
- **구현**: 카카오톡 API 이미지 URL

#### E. 원장용 브리핑 시스템
- **위치**: `/functions/src/routes/doctor-briefing.js`
- **용도**:
  - 이메일 헤더 로고
  - PDF 브리핑 문서 상단
  - 문자 메시지 첨부 이미지
- **구현**: 이메일 템플릿, PDF 생성

## 구현 단계

### Phase 1: 로고 파일 준비 및 배치
1. ✅ 디렉토리 생성 완료
2. ⏳ 원본 로고 파일 업로드 대기
3. ⏳ 다양한 크기로 리사이즈 (자동화)
4. ⏳ 파비콘 생성 (자동화)

### Phase 2: 웹 서비스 적용
1. ⏳ 메인 index.html 헤더 로고 추가
2. ⏳ CSS 스타일 적용
3. ⏳ 반응형 디자인 구현

### Phase 3: 프론트엔드 앱 적용
1. ⏳ Vue.js 컴포넌트 업데이트
2. ⏳ 네비게이션 바 로고 추가
3. ⏳ 대시보드 사이드바 로고 추가

### Phase 4: Laravel 앱 적용
1. ⏳ Blade 템플릿 업데이트
2. ⏳ 관리자 인터페이스 로고 추가
3. ⏳ 인증 페이지 로고 추가

### Phase 5: 백엔드 시스템 적용
1. ⏳ 카카오톡 챗봇 프로필 이미지 설정
2. ⏳ 브리핑 이메일 템플릿 로고 추가
3. ⏳ PDF 생성 시 로고 삽입

## 기술적 고려사항

### 1. 이미지 최적화
- **WebP 변환**: 웹 성능 향상
- **레이지 로딩**: 필요 시에만 로드
- **CDN 적용**: 빠른 로딩 속도

### 2. 브랜딩 가이드라인
- **색상**: 다크모드/라이트모드 대응
- **크기**: 최소 크기 및 여백 규칙
- **위치**: 일관된 배치 원칙

### 3. 접근성
- **Alt 텍스트**: "MKM Lab 로고"
- **고대비 버전**: 시각 장애인 대응
- **스크린 리더**: 적절한 마크업

## 자동화 스크립트

### 로고 처리 자동화
```bash
# 이미지 리사이즈 및 최적화
convert mkmlogo.png -resize 200x60 mkmlogo-header.png
convert mkmlogo.png -resize 32x32 mkmlogo-small.png
convert mkmlogo.png -resize 16x16 mkmlogo-favicon.ico
```

### 배포 자동화
```bash
# 모든 public 디렉토리에 로고 복사
cp public/images/mkmlogo.png frontend/public/images/
cp public/images/mkmlogo.png molly-note-app/public/images/
```

## 성공 지표

### 1. 기술적 지표
- [ ] 모든 페이지에 로고 표시
- [ ] 로딩 시간 3초 이하 유지
- [ ] 모바일 반응형 정상 작동

### 2. 브랜딩 지표
- [ ] 일관된 브랜드 경험 제공
- [ ] 사용자 브랜드 인지도 향상
- [ ] 전문성 및 신뢰도 증대

## 다음 단계

1. **로고 파일 업로드**: `mkmlogo.png` 파일을 프로젝트에 추가
2. **자동화 스크립트 실행**: 이미지 처리 및 배치
3. **코드 구현**: 각 서비스별 로고 적용
4. **테스트**: 전체 서비스에서 로고 표시 확인
5. **배포**: 프로덕션 환경 적용

---

**현재 상태**: Phase 1 디렉토리 생성 완료, 로고 파일 업로드 대기 중
**예상 완료 시간**: 로고 파일 업로드 후 30분 내
**책임자**: GitHub Copilot (자동화 구현)
