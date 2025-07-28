# AI 차트 어시스턴트 상세 명세서 v1.0

## 📱 **"한의원 진료 환경 최적화를 위한 스마트 솔루션"**

### 📅 문서 정보
- **버전**: v1.0 (2025년 7월 28일)
- **작성자**: MKM Lab UX/UI 팀
- **목적**: 사용자 인터페이스 및 하드웨어 구성 최적화

---

## 🎯 **제1장 - 하드웨어 구성 분석**

### 1.1 하드웨어 옵션 비교

#### 1.1.1 태블릿 방식 (권장)

**✅ 장점**
- **휴대성**: 진료실 이동 시 편리
- **직관적 조작**: 터치 인터페이스로 빠른 입력
- **공간 효율성**: 원장실 공간 절약
- **환자 접근성**: 환자와 함께 화면 공유 가능
- **멀티태스킹**: 다른 앱과 동시 사용 가능

**❌ 단점**
- **화면 크기**: 작은 화면으로 복잡한 정보 표시 제한
- **배터리**: 장시간 사용 시 배터리 관리 필요
- **보안**: 분실/도난 위험
- **성능**: 고사양 분석 시 성능 제한

#### 1.1.2 원장실 PC 일체형 방식

**✅ 장점**
- **성능**: 고사양 하드웨어로 빠른 처리
- **화면 크기**: 대형 모니터로 정보 표시 최적화
- **보안**: 고정 설치로 보안성 우수
- **안정성**: 전원 공급 안정적
- **확장성**: 외부 장치 연결 용이

**❌ 단점**
- **휴대성**: 진료실 이동 불가
- **공간 점유**: 원장실 공간 차지
- **환자 접근성**: 환자와 화면 공유 어려움
- **유연성**: 고정된 위치로 사용 제한

### 1.2 최종 권장사항: **하이브리드 태블릿 방식**

#### 1.2.1 하드웨어 구성
```
주요 장비:
- iPad Pro 12.9" (2024) 또는 Samsung Galaxy Tab S9 Ultra
- Apple Pencil 2세대 또는 S Pen
- 키보드 케이스 (선택사항)
- 스탠드 마운트 (진료실 고정용)

보조 장비:
- 원장실 PC (데이터 백업 및 관리용)
- 클라우드 동기화 시스템
- 보안 케이스 및 도난 방지 장치
```

#### 1.2.2 설치 위치
- **진료실**: 태블릿 + 스탠드 마운트
- **원장실**: PC (관리 및 백업용)
- **대기실**: 환자용 정보 키오스크 (선택사항)

---

## 📱 **제2장 - 메뉴 구성 및 기능**

### 2.1 메인 대시보드

#### 2.1.1 상단 네비게이션
```
┌─────────────────────────────────────────────────────────┐
│ [MKM Lab] 환자 관리 | AI 분석 | 차트 관리 | 설정 | 도움말 │
└─────────────────────────────────────────────────────────┘
```

#### 2.1.2 환자 목록 섹션
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 환자 검색: [검색창] [필터] [정렬]                    │
├─────────────────────────────────────────────────────────┤
│ 📋 오늘 진료 예정 (3명)                                 │
│ ├─ 김철수 (10:00) - 재진료 - [진료시작]                │
│ ├─ 이영희 (11:30) - 초진료 - [진료시작]                │
│ └─ 박민수 (14:00) - 재진료 - [진료시작]                │
├─────────────────────────────────────────────────────────┤
│ 📊 최근 진료 통계                                      │
│ ├─ 이번 주: 25명 진료                                  │
│ ├─ AI 분석: 18건 완료                                  │
│ └─ 차트 작성: 22건 완료                                │
└─────────────────────────────────────────────────────────┘
```

### 2.2 환자 진료 화면

#### 2.2.1 환자 정보 헤더
```
┌─────────────────────────────────────────────────────────┐
│ 👤 김철수 (M, 35세) | 📞 010-1234-5678 | 🏠 서울시 강남구 │
│ 📅 최초 방문: 2024.01.15 | 🔄 방문 횟수: 8회            │
│ 🏥 진료 이력: [이력보기] | 📋 차트: [차트보기]          │
└─────────────────────────────────────────────────────────┘
```

#### 2.2.2 AI 분석 메뉴
```
┌─────────────────────────────────────────────────────────┐
│ 🤖 AI 진료 보조 분석                                    │
├─────────────────────────────────────────────────────────┤
│ 📸 [얼굴 분석] - rPPG 생체신호 측정 (15초)              │
│ ├─ 심박수, 혈압, 스트레스 지수 자동 측정                │
│ └─ 얼굴 가이드선으로 정확한 촬영 지원                   │
├─────────────────────────────────────────────────────────┤
│ 🎤 [음성 분석] - 음성 패턴 및 감정 상태 분석            │
│ ├─ 음성 톤, 피치, 속도 분석                             │
│ └─ 스트레스 수준 및 감정 상태 평가                      │
├─────────────────────────────────────────────────────────┤
│ 👅 [설진 분석] - 혀 상태 및 체질 분석                   │
│ ├─ 혀 색상, 균열, 코팅 분석                             │
│ └─ MKM-12 체질 분류 자동화                              │
├─────────────────────────────────────────────────────────┤
│ 🔄 [통합 분석] - 모든 데이터 종합 분석                  │
│ ├─ AI 페르소나 생성                                    │
│ └─ 맞춤형 건강 솔루션 제안                              │
└─────────────────────────────────────────────────────────┘
```

#### 2.2.3 SOAP 차트 작성
```
┌─────────────────────────────────────────────────────────┐
│ 📋 SOAP 차트 작성                                       │
├─────────────────────────────────────────────────────────┤
│ S (Subjective) - 주관적 증상                           │
│ [음성 인식] [키보드 입력] [AI 보조 작성]                │
│                                                         │
│ O (Objective) - 객관적 소견                             │
│ [AI 분석 결과 자동 입력] [수동 보완]                    │
│                                                         │
│ A (Assessment) - 진단 및 평가                           │
│ [AI 진단 제안] [체질 분류] [증상 분석]                  │
│                                                         │
│ P (Plan) - 치료 계획                                   │
│ [처방 제안] [생활 관리] [재진료 계획]                   │
├─────────────────────────────────────────────────────────┤
│ 📋 [차트 미리보기] [클립보드 복사] [인쇄]               │
└─────────────────────────────────────────────────────────┘
```

### 2.3 설정 및 관리 메뉴

#### 2.3.1 시스템 설정
```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ 시스템 설정                                          │
├─────────────────────────────────────────────────────────┤
│ 🔐 보안 설정                                            │
│ ├─ 생체 인증 (지문/얼굴)                                │
│ ├─ 자동 로그아웃 시간 설정                               │
│ └─ 데이터 암호화 설정                                   │
├─────────────────────────────────────────────────────────┤
│ 📊 AI 분석 설정                                         │
│ ├─ 분석 정확도 우선순위                                 │
│ ├─ 자동 분석 활성화                                     │
│ └─ 분석 결과 저장 기간                                  │
├─────────────────────────────────────────────────────────┤
│ 🔄 동기화 설정                                          │
│ ├─ 클라우드 동기화 주기                                 │
│ ├─ 오프라인 모드 설정                                   │
│ └─ 백업 설정                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 **제3장 - 데이터 이동 기술 구현**

### 3.1 클라우드 동기화 시스템

#### 3.1.1 아키텍처
```
태블릿 (진료실) ←→ 클라우드 서버 ←→ PC (원장실)
     ↓              ↓              ↓
  로컬 캐시    실시간 동기화    백업 저장소
```

#### 3.1.2 동기화 프로토콜
```python
# 실시간 동기화 시스템
class SyncManager:
    def __init__(self):
        self.cloud_server = "https://mkm-sync-server.com"
        self.local_cache = LocalCache()
        self.encryption = AES256Encryption()
    
    def sync_patient_data(self, patient_id: str):
        """환자 데이터 실시간 동기화"""
        # 1. 로컬 변경사항 감지
        local_changes = self.local_cache.get_changes(patient_id)
        
        # 2. 클라우드에 암호화하여 전송
        encrypted_data = self.encryption.encrypt(local_changes)
        response = self.upload_to_cloud(encrypted_data)
        
        # 3. 다른 디바이스에 변경 알림
        self.notify_other_devices(patient_id, response['sync_id'])
        
        # 4. 동기화 상태 업데이트
        self.update_sync_status(patient_id, 'synced')
    
    def handle_offline_mode(self):
        """오프라인 모드 처리"""
        # 로컬 캐시에서 데이터 제공
        # 네트워크 복구 시 자동 동기화
        pass
```

### 3.2 데이터 이동 시나리오

#### 3.2.1 진료실 → 원장실 이동
```
1. 진료실에서 환자 진료 완료
   ↓
2. SOAP 차트 작성 및 AI 분석 완료
   ↓
3. 자동 클라우드 동기화 (실시간)
   ↓
4. 원장실 PC에서 즉시 데이터 확인 가능
   ↓
5. 원장 검토 및 승인
   ↓
6. 최종 차트 저장 및 인쇄
```

#### 3.2.2 다중 진료실 환경
```
진료실 A ←→ 클라우드 서버 ←→ 진료실 B
    ↓              ↓              ↓
  태블릿 A      중앙 관리      태블릿 B
    ↓              ↓              ↓
  환자 데이터    실시간 동기화   환자 데이터
```

### 3.3 보안 및 암호화

#### 3.3.1 데이터 암호화
```python
# AES-256 암호화 구현
class DataEncryption:
    def __init__(self):
        self.key = self.generate_secure_key()
        self.cipher = AES.new(self.key, AES.MODE_GCM)
    
    def encrypt_patient_data(self, data: Dict) -> bytes:
        """환자 데이터 암호화"""
        json_data = json.dumps(data, ensure_ascii=False)
        encrypted_data, tag = self.cipher.encrypt_and_digest(
            json_data.encode('utf-8')
        )
        return encrypted_data + tag
    
    def decrypt_patient_data(self, encrypted_data: bytes) -> Dict:
        """환자 데이터 복호화"""
        tag = encrypted_data[-16:]  # GCM 태그
        ciphertext = encrypted_data[:-16]
        decrypted_data = self.cipher.decrypt_and_verify(ciphertext, tag)
        return json.loads(decrypted_data.decode('utf-8'))
```

#### 3.3.2 접근 제어
```python
# 역할 기반 접근 제어 (RBAC)
class AccessControl:
    def __init__(self):
        self.roles = {
            'doctor': ['read', 'write', 'analyze'],
            'nurse': ['read', 'write'],
            'admin': ['read', 'write', 'delete', 'manage'],
            'patient': ['read_own']
        }
    
    def check_permission(self, user_role: str, action: str, data_id: str) -> bool:
        """권한 확인"""
        if action in self.roles.get(user_role, []):
            return True
        return False
```

### 3.4 오프라인 지원

#### 3.4.1 로컬 캐시 시스템
```python
# 로컬 캐시 관리
class LocalCache:
    def __init__(self):
        self.cache_db = SQLiteDatabase('local_cache.db')
        self.max_cache_size = 1 * 1024 * 1024 * 1024  # 1GB
    
    def store_patient_data(self, patient_id: str, data: Dict):
        """환자 데이터 로컬 저장"""
        # 캐시 크기 확인
        if self.get_cache_size() > self.max_cache_size:
            self.cleanup_old_data()
        
        # 데이터 저장
        self.cache_db.insert('patients', {
            'patient_id': patient_id,
            'data': json.dumps(data),
            'timestamp': datetime.now(),
            'sync_status': 'pending'
        })
    
    def get_patient_data(self, patient_id: str) -> Dict:
        """환자 데이터 로컬 조회"""
        result = self.cache_db.select('patients', 
                                    where={'patient_id': patient_id})
        if result:
            return json.loads(result[0]['data'])
        return None
```

---

## 📊 **제4장 - 사용자 경험 최적화**

### 4.1 태블릿 최적화 UI/UX

#### 4.1.1 터치 인터페이스 최적화
```
- 버튼 크기: 최소 44px × 44px (Apple HIG 기준)
- 터치 영역: 충분한 여백 확보
- 제스처 지원: 스와이프, 핀치 줌, 롱프레스
- 키보드 최적화: 가상 키보드 레이아웃 조정
```

#### 4.1.2 반응형 디자인
```css
/* 태블릿 최적화 CSS */
@media (min-width: 768px) and (max-width: 1024px) {
  .patient-card {
    width: calc(50% - 20px);
    margin: 10px;
  }
  
  .analysis-button {
    width: 100%;
    height: 60px;
    font-size: 18px;
  }
  
  .soap-section {
    padding: 15px;
    margin: 10px 0;
  }
}
```

### 4.2 성능 최적화

#### 4.2.1 로딩 최적화
```javascript
// 지연 로딩 구현
class LazyLoader {
    constructor() {
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { threshold: 0.1 }
        );
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadContent(entry.target);
            }
        });
    }
    
    loadContent(element) {
        // 필요한 데이터만 로드
        const patientId = element.dataset.patientId;
        this.fetchPatientData(patientId).then(data => {
            element.innerHTML = this.renderPatientCard(data);
        });
    }
}
```

#### 4.2.2 캐싱 전략
```javascript
// 서비스 워커를 통한 오프라인 지원
class ServiceWorkerManager {
    constructor() {
        this.cacheName = 'mkm-chart-assistant-v1';
        this.cacheUrls = [
            '/',
            '/static/js/app.js',
            '/static/css/style.css',
            '/static/images/icons/'
        ];
    }
    
    async cacheResources() {
        const cache = await caches.open(this.cacheName);
        await cache.addAll(this.cacheUrls);
    }
    
    async serveFromCache(request) {
        const cache = await caches.open(this.cacheName);
        const response = await cache.match(request);
        return response || fetch(request);
    }
}
```

---

## 🔧 **제5장 - 구현 계획**

### 5.1 개발 단계

#### 5.1.1 Phase 1: 기본 기능 (2주)
- [ ] 태블릿 UI 기본 구조
- [ ] 환자 목록 및 검색
- [ ] 기본 SOAP 차트 작성
- [ ] 로컬 데이터 저장

#### 5.1.2 Phase 2: AI 분석 (3주)
- [ ] 얼굴 분석 (rPPG) 통합
- [ ] 음성 분석 모듈
- [ ] 설진 분석 기능
- [ ] AI 결과 표시

#### 5.1.3 Phase 3: 동기화 (2주)
- [ ] 클라우드 동기화 시스템
- [ ] 오프라인 지원
- [ ] 데이터 암호화
- [ ] 다중 디바이스 지원

#### 5.1.4 Phase 4: 최적화 (1주)
- [ ] 성능 최적화
- [ ] UI/UX 개선
- [ ] 보안 강화
- [ ] 테스트 및 검증

### 5.2 기술 스택

#### 5.2.1 프론트엔드
- **프레임워크**: Vue.js 3 + TypeScript
- **UI 라이브러리**: Vuetify 3
- **상태 관리**: Pinia
- **PWA**: Service Worker
- **오프라인**: IndexedDB

#### 5.2.2 백엔드
- **API**: FastAPI
- **데이터베이스**: PostgreSQL + Redis
- **클라우드**: Google Cloud Platform
- **암호화**: AES-256
- **동기화**: WebSocket + REST API

#### 5.2.3 배포
- **컨테이너**: Docker
- **웹 서버**: Nginx
- **SSL**: Let's Encrypt
- **모니터링**: Prometheus + Grafana

---

## 📋 **제6장 - 성공 지표**

### 6.1 사용성 지표
- **작업 완료 시간**: SOAP 차트 작성 50% 단축
- **사용자 만족도**: 4.5/5.0 이상
- **오류율**: 1% 미만
- **학습 곡선**: 30분 내 기본 기능 숙지

### 6.2 기술적 지표
- **응답 시간**: 평균 2초 이내
- **동기화 속도**: 실시간 (1초 이내)
- **오프라인 지원**: 100% 기능 사용 가능
- **보안**: 보안 취약점 0개

### 6.3 비즈니스 지표
- **진료 효율성**: 30% 향상
- **차트 품질**: 40% 향상
- **환자 만족도**: 25% 향상
- **운영 비용**: 20% 절감

---

**"태블릿 기반 하이브리드 시스템으로 한의원 진료 환경을 혁신하는 MKM Lab AI 차트 어시스턴트"**

**본 명세서는 사용자 피드백과 기술 발전에 따라 지속적으로 업데이트됩니다.** 