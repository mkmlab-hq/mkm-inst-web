# 🎯 카카오 i 오픈빌더 실제 구현 템플릿

## 📋 구현 단계별 복사-붙여넣기 가이드

### 🔧 Phase 1: 프로젝트 생성 및 설정

#### 1-1. 프로젝트 기본 정보
```
프로젝트명: MKM Lab 문진 챗봇
설명: MKM Lab 하이터치 사전 문진 시스템
카테고리: 의료/건강
```

#### 1-2. 웹훅 설정
```
웹훅 URL: http://localhost:5001/mkmlab-v3/us-central1/api/api/v1/kakao/webhook
Fallback 메시지: 죄송합니다. 다시 시도해주세요. 문제가 계속되면 '직원 도움'을 요청해주세요.
```

---

### 🎬 Phase 2: 핵심 블록 구현

#### Block 1: 환영 인사 (`welcome_greeting`)

**블록 유형**: 기본 카드

**제목**:
```
MKM Lab 문진 서비스
```

**설명**:
```
안녕하세요! 😊

MKM Lab 문진 서비스에 오신 것을 환영합니다.

진료 전 사전 문진을 통해 원장님께 더 정확한 진료를 받으실 수 있도록 도와드리겠습니다.
```

**썸네일 이미지 URL**:
```
https://your-domain.com/images/mkmlogo-card.png
```

**버튼 1**:
```
라벨: 문진 시작하기
액션: 블록 호출
대상 블록: consent_agreement
```

**버튼 2**:
```
라벨: 직원 도움 요청
액션: 블록 호출
대상 블록: staff_help
```

---

#### Block 2: 개인정보 동의 (`consent_agreement`)

**블록 유형**: 기본 카드

**제목**:
```
개인정보 수집 및 이용 동의
```

**설명**:
```
📋 수집항목: 이름, 나이, 증상 정보
🎯 목적: 진료 전 사전 문진
⏰ 보관기간: 1년
🔒 안전한 암호화 보관

문진 서비스 이용을 위해 동의가 필요합니다.
```

**썸네일 이미지 URL**:
```
https://your-domain.com/images/mkmlogo-privacy.png
```

**버튼 1**:
```
라벨: 동의합니다
액션: 블록 호출
대상 블록: basic_info_name
```

**버튼 2**:
```
라벨: 더 자세히 알고 싶어요
액션: 블록 호출
대상 블록: privacy_details
```

**버튼 3**:
```
라벨: 직원 도움 요청
액션: 블록 호출
대상 블록: staff_help
```

---

#### Block 3: 이름 입력 (`basic_info_name`)

**블록 유형**: 텍스트 입력

**메시지**:
```
문진을 시작하겠습니다! 😊

먼저 성함을 알려주세요.
(예: 홍길동)
```

**엔티티 설정**:
```
엔티티명: user_name
유형: sys.text
필수: 예
최소 길이: 2
최대 길이: 10
```

**다음 블록**: `basic_info_age`

---

#### Block 4: 나이 선택 (`basic_info_age`)

**블록 유형**: 기본 카드

**제목**:
```
나이 선택
```

**설명**:
```
#{user_name}님, 해당하는 연령대를 선택해주세요.
```

**버튼 1**:
```
라벨: 20대
액션: 블록 호출
대상 블록: symptoms_selection
추가 정보: {"age_group": "20대"}
```

**버튼 2**:
```
라벨: 30대
액션: 블록 호출
대상 블록: symptoms_selection
추가 정보: {"age_group": "30대"}
```

**버튼 3**:
```
라벨: 40대
액션: 블록 호출
대상 블록: symptoms_selection
추가 정보: {"age_group": "40대"}
```

**버튼 4**:
```
라벨: 50대
액션: 블록 호출
대상 블록: symptoms_selection
추가 정보: {"age_group": "50대"}
```

**버튼 5**:
```
라벨: 60대
액션: 블록 호출
대상 블록: symptoms_selection
추가 정보: {"age_group": "60대"}
```

**버튼 6**:
```
라벨: 70대 이상
액션: 블록 호출
대상 블록: symptoms_selection
추가 정보: {"age_group": "70대 이상"}
```

---

#### Block 5: 주요 증상 선택 (`symptoms_selection`)

**블록 유형**: 기본 카드

**제목**:
```
주요 증상 선택
```

**설명**:
```
#{user_name}님, 어떤 증상으로 내원하시나요?
해당하는 증상을 선택해주세요.
```

**버튼 1**:
```
라벨: 🦴 허리/어깨/무릎 통증
액션: 블록 호출
대상 블록: symptom_detail
추가 정보: {"symptom_type": "허리/어깨/무릎 통증"}
```

**버튼 2**:
```
라벨: 🤕 삐끗/멍/타박상
액션: 블록 호출
대상 블록: symptom_detail
추가 정보: {"symptom_type": "삐끗/멍/타박상"}
```

**버튼 3**:
```
라벨: 🍽️ 소화불량/속쓰림
액션: 블록 호출
대상 블록: symptom_detail
추가 정보: {"symptom_type": "소화불량/속쓰림"}
```

**버튼 4**:
```
라벨: 🤯 두통/어지럼증
액션: 블록 호출
대상 블록: symptom_detail
추가 정보: {"symptom_type": "두통/어지럼증"}
```

**버튼 5**:
```
라벨: 😴 피로/스트레스
액션: 블록 호출
대상 블록: symptom_detail
추가 정보: {"symptom_type": "피로/스트레스"}
```

**버튼 6**:
```
라벨: 직원 도움 요청
액션: 블록 호출
대상 블록: staff_help
```

---

### 📝 Phase 3: 상세 블록 구현

#### Block 6: 증상 상세 입력 (`symptom_detail`)

**블록 유형**: 텍스트 입력

**메시지**:
```
#{symptom_type} 증상에 대해 조금 더 자세히 알려주세요.

예시:
- 언제부터 아팠는지
- 어떤 상황에서 더 아픈지
- 통증 정도 (1-10점)
- 기타 특이사항

편하게 말씀해주세요.
```

**엔티티 설정**:
```
엔티티명: symptom_detail
유형: sys.text
필수: 예
최소 길이: 5
최대 길이: 500
```

**다음 블록**: `additional_info`

---

#### Block 7: 추가 정보 입력 (`additional_info`)

**블록 유형**: 기본 카드

**제목**:
```
추가 정보 (선택사항)
```

**설명**:
```
다른 증상이나 전달하고 싶은 내용이 있으시면 알려주세요.

없으시면 '없음'을 선택해주세요.
```

**버튼 1**:
```
라벨: 추가 정보 입력하기
액션: 블록 호출
대상 블록: additional_input
```

**버튼 2**:
```
라벨: 없음
액션: 블록 호출
대상 블록: confirmation_summary
추가 정보: {"additional_info": "없음"}
```

---

#### Block 8: 추가 정보 텍스트 입력 (`additional_input`)

**블록 유형**: 텍스트 입력

**메시지**:
```
추가로 전달하고 싶은 내용을 자유롭게 적어주세요.
```

**엔티티 설정**:
```
엔티티명: additional_info
유형: sys.text
필수: 예
최소 길이: 1
최대 길이: 300
```

**다음 블록**: `confirmation_summary`

---

#### Block 9: 입력 내용 확인 (`confirmation_summary`)

**블록 유형**: 기본 카드

**제목**:
```
입력 내용 확인
```

**설명**:
```
📝 이름: #{user_name}
📅 나이: #{age_group}
🏥 주요 증상: #{symptom_type}
📋 상세 내용: #{symptom_detail}
📄 추가 정보: #{additional_info}

위 내용이 맞나요?
```

**버튼 1**:
```
라벨: 네, 맞습니다
액션: 블록 호출
대상 블록: webhook_submit
```

**버튼 2**:
```
라벨: 수정하고 싶어요
액션: 블록 호출
대상 블록: basic_info_name
```

**버튼 3**:
```
라벨: 직원 도움 요청
액션: 블록 호출
대상 블록: staff_help
```

---

#### Block 10: 웹훅 제출 (`webhook_submit`)

**블록 유형**: 웹훅

**웹훅 URL**: `http://localhost:5001/mkmlab-v3/us-central1/api/api/v1/kakao/webhook`

**요청 방식**: POST

**요청 헤더**:
```
Content-Type: application/json
```

**요청 본문**:
```json
{
  "userRequest": {
    "user": {
      "id": "#{userKey}"
    },
    "utterance": "문진 완료"
  },
  "data": {
    "name": "#{user_name}",
    "age": "#{age_group}",
    "symptom_type": "#{symptom_type}",
    "symptom_detail": "#{symptom_detail}",
    "additional_info": "#{additional_info}",
    "timestamp": "#{timestamp}"
  }
}
```

**성공 시 다음 블록**: `completion_notice`
**실패 시 다음 블록**: `error_retry`

---

#### Block 11: 완료 안내 (`completion_notice`)

**블록 유형**: 기본 카드

**제목**:
```
문진 완료! 🎉
```

**설명**:
```
#{user_name}님의 문진이 완료되었습니다.

✅ 원장님께 전달 완료
✅ 진료 시 참고 예정

진료실로 오시면 더 정확한 진료를 받으실 수 있습니다.
```

**썸네일 이미지 URL**:
```
https://your-domain.com/images/mkmlogo-success.png
```

**버튼 1**:
```
라벨: 새로운 문진 시작
액션: 블록 호출
대상 블록: welcome_greeting
```

**버튼 2**:
```
라벨: MKM Lab 안내
액션: 웹 링크
링크 URL: https://your-domain.com
```

---

### 🛠️ Phase 4: 지원 블록 구현

#### Block 12: 직원 도움 (`staff_help`)

**블록 유형**: 기본 카드

**제목**:
```
직원 도움 요청
```

**설명**:
```
직원이 도와드리겠습니다! 😊

📞 전화: 02-1234-5678
🏥 방문: 서울시 강남구 MKM Lab
⏰ 운영시간: 09:00-18:00

잠시만 기다려주세요.
```

**썸네일 이미지 URL**:
```
https://your-domain.com/images/mkmlogo-help.png
```

**버튼 1**:
```
라벨: 문진 계속하기
액션: 블록 호출
대상 블록: welcome_greeting
```

**버튼 2**:
```
라벨: 전화 걸기
액션: 웹 링크
링크 URL: tel:02-1234-5678
```

---

#### Block 13: 개인정보 상세 설명 (`privacy_details`)

**블록 유형**: 기본 카드

**제목**:
```
개인정보 처리방침 상세
```

**설명**:
```
📋 수집하는 개인정보
- 이름, 나이, 증상 정보

🎯 수집 목적
- 진료 전 사전 문진
- 맞춤형 진료 서비스 제공

⏰ 보관 및 이용 기간
- 1년 (의료법 기준)

🔒 개인정보 보호
- 암호화 저장
- 접근 권한 제한
- 안전한 전송

동의하시면 문진을 시작하겠습니다.
```

**버튼 1**:
```
라벨: 동의합니다
액션: 블록 호출
대상 블록: basic_info_name
```

**버튼 2**:
```
라벨: 처음으로 돌아가기
액션: 블록 호출
대상 블록: welcome_greeting
```

---

#### Block 14: 오류 재시도 (`error_retry`)

**블록 유형**: 기본 카드

**제목**:
```
일시적인 오류가 발생했습니다
```

**설명**:
```
죄송합니다. 일시적인 오류가 발생했습니다.

잠시 후 다시 시도해주세요.
문제가 계속되면 직원 도움을 요청해주세요.
```

**버튼 1**:
```
라벨: 다시 시도
액션: 블록 호출
대상 블록: webhook_submit
```

**버튼 2**:
```
라벨: 직원 도움 요청
액션: 블록 호출
대상 블록: staff_help
```

**버튼 3**:
```
라벨: 처음부터 다시 시작
액션: 블록 호출
대상 블록: welcome_greeting
```

---

## 🎯 구현 순서

### 1단계: 기본 설정
1. 카카오 i 오픈빌더 프로젝트 생성
2. 웹훅 URL 설정
3. 기본 설정 완료

### 2단계: 핵심 블록 생성 (Block 1-5)
1. `welcome_greeting` 생성
2. `consent_agreement` 생성
3. `basic_info_name` 생성
4. `basic_info_age` 생성
5. `symptoms_selection` 생성

### 3단계: 상세 블록 생성 (Block 6-11)
1. `symptom_detail` 생성
2. `additional_info` 생성
3. `additional_input` 생성
4. `confirmation_summary` 생성
5. `webhook_submit` 생성
6. `completion_notice` 생성

### 4단계: 지원 블록 생성 (Block 12-14)
1. `staff_help` 생성
2. `privacy_details` 생성
3. `error_retry` 생성

### 5단계: 연결 및 테스트
1. 모든 블록 연결 확인
2. 전체 플로우 테스트
3. 웹훅 연동 테스트

---

## 🚀 지금 시작하세요!

위의 템플릿을 카카오 i 오픈빌더에서 **복사-붙여넣기**하여 바로 구현할 수 있습니다.

**다음 단계**: 카카오 i 오픈빌더 접속 → 프로젝트 생성 → Block 1부터 순차적으로 생성

구현 완료 후 진행 상황을 보고해주세요! 🎯
