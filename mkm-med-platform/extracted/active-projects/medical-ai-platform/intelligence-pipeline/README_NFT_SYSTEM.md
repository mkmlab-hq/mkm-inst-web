# 🎨 MKM Lab 페르소나 다이어리 NFT 시스템

## 📋 개요

MKM Lab의 혁신적인 **페르소나 다이어리 NFT 시스템**은 웨어러블 기기 데이터, 날씨, 경제, 문화적 요소를 융합하여 사용자만의 고유한 디지털 아트를 생성하고 NFT로 발행하는 시스템입니다.

## 🌟 핵심 특징

### **1. 데이터 융합 아트 생성**
- **웨어러블 데이터**: 심박수, 수면품질, 스트레스 수준, 에너지 레벨
- **외부 요인**: 실시간 날씨, 경제 지표, 문화적 트렌드
- **12체질 기반**: 개인화된 색상 팔레트와 시각적 패턴

### **2보안 및 개인정보보호**
- **데이터 암호화**: 민감한 생체 데이터 암호화 저장
- **익명화 처리**: 개인정보보호법 준수
- **감사 로그**: 모든 활동 기록 및 추적
- **사용자 동의**: 명시적 동의 기반 처리

### **3 법적 준수**
- **의료법 준수**: AI는 의사 보조 도구임을 명시
- **개인정보보호법**: 2555보관, 사용자 권리 보장
- **면책조항**: 모든 결과물에 법적 고지 포함

### **4. 비즈니스 모델**
- **소유권 분할**: MKM Lab 50% + 사용자 50%
- **로열티 시스템**: 2차 거래 시 5로열티
- **프리미엄 가격**: 99,000(PRO 플랜)

## 🚀 설치 및 설정

### **1. 환경 설정**
```bash
# 환경 변수 파일 복사
cp env_example.txt .env

# 필요한 패키지 설치
pip install -r requirements.txt
```

### **2. 환경 변수 설정**
`.env` 파일에서 다음 항목들을 설정하세요:

```env
# 블록체인 설정
BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
NFT_CONTRACT_ADDRESS=your-nft-contract-address-here
PRIVATE_KEY=your-private-key-here
MKM_LAB_WALLET_ADDRESS=your-mkm-lab-wallet-address-here

# 외부 API 키
WEATHER_API_KEY=your-openweathermap-api-key-here

# 시스템 설정
NFT_PRICE=9900ROYALTY_PERCENTAGE=5``

## 📖 사용법

### **1NFT 생성**
```python
from integrated_persona_nft_system import IntegratedPersonaNFTSystem

# 시스템 초기화
nft_system = IntegratedPersonaNFTSystem()

# 사용자 동의 상세
consent_details = {
 nft_creation: True,
    data_collection:true
 data_sharing": False,
  marketing_use": false}

# NFT 생성
result = nft_system.create_persona_nft(
    user_id="user_12345,
    persona_code="A3,  # 태음인
    user_consent_details=consent_details
)

if result["success"]:
    print(f"✅ NFT 생성 완료!")
    print(f"   Token ID: {result[nft_data][token_id]}")
    print(f"   소유권: MKM Lab 50용자 50%")
    print(f"   로열티: 5)
```

### **2. 사용자 NFT 조회**
```python
# 사용자의 NFT 목록 조회
user_nfts = nft_system.get_user_nfts("user_12345)
print(f"사용자 NFT 개수: {len(user_nfts)}")
```

### **3 통계 조회**
```python
# 전체 NFT 통계
stats = nft_system.get_nft_statistics()
print(f총 생성된 NFT: [object Object]stats['total_nfts_created]}개)
print(f"총 수익: {stats[revenue_generated]:,}원)
print(f페르소나분포: {stats['persona_distribution']}")
```

## 🔧 시스템 아키텍처

### **주요 모듈**
1`integrated_persona_nft_system.py`**: 메인 통합 시스템2. **`nft_persona_generator.py`**: NFT 생성 및 시각화
3t_security_manager.py`**: 보안 및 개인정보보호
4. **`enhanced_data_collectors.py`**: 데이터 수집
5. **`integrated_vectorization_pipeline.py`**: 데이터 처리

### **데이터 흐름**
```
웨어러블 데이터 → 외부 요인 데이터 → 보안 처리 → 시각화 생성 → NFT 민팅 → 블록체인 저장
```

## 🎨 페르소나 색상 팔레트

### **12체질별 색상**
- **A1-A3(태음인)**: 깊은 남색 ~ 부드러운 회색
- **C1-C3 (소음인)**: 활기찬 빨강 ~ 따뜻한 주황
- **R1-R3 (소양인)**: 신선한 초록 ~ 밝은 초록
- **V1V3(태양인)**: 신비로운 보라 ~ 부드러운 보라

## 🔒 보안 기능

### **데이터 보호**
- **암호화**: Fernet 암호화로 민감 데이터 보호
- **익명화**: 직접 식별 정보 해시화
- **범위화**: 생체 데이터 범위별 분류

### **감사 및 추적**
- **활동 로그**: 모든 NFT 생성 활동 기록
- **동의 관리**: 사용자 동의 상태 추적
- **보관 기간**: 2555 자동 로그 관리

## ⚖️ 법적 준수

### **개인정보보호법**
- 사용자 동의 기반 처리
- 데이터 접근/수정/삭제 권리 보장
- 2555일 보관 기간 준수

### **의료법**
- AI는 의사 보조 도구임을 명시
- 전문의 상담 권장 문구 포함
- 진단 대신 분석 용어 사용

## 💰 비즈니스 모델

### **수익 구조**
- **1판매**: 99000 (PRO 플랜)
- **2차 거래 로열티**: 5
- **소유권 분할**: MKM Lab 50 + 사용자 50%

### **가치 제안**
- **개인화**: 사용자 고유 데이터 기반
- **희소성**: 하나뿐인 디지털 아트
- **투명성**: 블록체인 기반 소유권
- **수익성**: 2 거래 수익 공유

## 🚀 향후 로드맵

### **Phase 1 (현재)**
- ✅ 기본 NFT 생성 시스템
- ✅ 보안 및 개인정보보호
- ✅ 법적 준수 시스템

### **Phase 2 (예정)**
- 🔄 실제 블록체인 연동
- 🔄 IPFS 저장소 연동
- 🔄 웨어러블 기기 API 연동

### **Phase3 (예정)**
- 🔄 마켓플레이스 구축
- 🔄 커뮤니티 기능
- 🔄 AI 기반 가격 예측

## 📞 지원 및 문의

- **기술 지원**: tech@mkmlab.com
- **개인정보보호**: privacy@mkmlab.com
- **비즈니스 문의**: business@mkmlab.com

## 📄 라이선스

이 프로젝트는 MKM Lab의 독점 소프트웨어입니다. 무단 사용 및 배포를 금지합니다.

---

**MKM Lab 페르소나 다이어리 NFT 시스템 v1.0**  
*혁신적인 디지털 자산과 개인화된 건강 관리의 융합* 