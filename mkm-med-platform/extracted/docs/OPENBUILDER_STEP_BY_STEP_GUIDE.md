# 🎯 카카오 i 오픈빌더 구현 단계별 가이드

## 🚀 Phase 1: 프로젝트 설정 및 첫 번째 블록 구현

### Step 1: 카카오 i 오픈빌더 접속 및 설정

#### 1-1. 오픈빌더 접속
```
1. https://i.kakao.com/openbuilder 접속
2. 카카오 계정으로 로그인
3. "챗봇 만들기" 또는 "새 시나리오" 클릭
```

#### 1-2. 시나리오 생성
```
시나리오명: MKM Lab 문진 챗봇
설명: 병원 방문 환자를 위한 사전 문진 서비스
카테고리: 의료/헬스케어
```

#### 1-3. 기본 설정
```
언어: 한국어
타임존: Asia/Seoul
응답 시간: 3초 이내
```

---

## 🎬 Step 2: 환영 인사 블록 구현

### 2-1. 시작 블록 설정
```
블록명: welcome_greeting
블록 유형: 스킬 응답
설명: 환영 인사 및 MKM Lab 브랜딩
```

### 2-2. JSON 응답 설정
**스킬 응답 → JSON 입력 모드**에서 다음 코드 입력:

```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "basicCard": {
          "title": "🏥 MKM Lab 문진 서비스",
          "description": "안녕하세요! 진료를 위한 간단한 사전 문진을 도와드리겠습니다.\n\n직원이 옆에서 언제든 도와드릴 수 있으니 편안하게 진행해 주세요.",
          "thumbnail": {
            "imageUrl": "https://your-domain.com/images/mkmlogo-card.png",
            "fixedRatio": true
          },
          "buttons": [
            {
              "action": "block",
              "label": "📋 문진 시작하기",
              "blockId": "consent_detail"
            }
          ]
        }
      }
    ]
  }
}
```

### 2-3. 블록 연결 설정
- **다음 블록**: `consent_detail` (생성 예정)
- **폴백 블록**: `staff_help` (생성 예정)

---

## 🎬 Step 3: 개인정보 동의 블록 구현

### 3-1. 동의 블록 생성
```
블록명: consent_detail
블록 유형: 텍스트 + 빠른 답장
설명: 개인정보 수집 및 이용 동의
```

### 3-2. 텍스트 메시지 설정
```
📋 개인정보 수집 및 이용 동의

• 수집 목적: 진료 및 문진 서비스 제공
• 수집 항목: 이름, 나이, 증상 정보
• 보관 기간: 진료 완료 후 1년
• 제3자 제공: 담당 의료진에게만 제공

개인정보 수집 및 이용에 동의하시겠습니까?
```

### 3-3. 빠른 답장 설정
```
버튼 1: ✅ 동의합니다
→ 액션: 블록 이동
→ 대상 블록: basic_info_name

버튼 2: 🙋‍♀️ 직원 도움 요청
→ 액션: 블록 이동  
→ 대상 블록: staff_help

버튼 3: ❓ 더 자세한 설명
→ 액션: 블록 이동
→ 대상 블록: privacy_details
```

---

## 🎬 Step 4: 기본 정보 수집 블록 구현

### 4-1. 이름 입력 블록
```
블록명: basic_info_name
블록 유형: 텍스트 + 빠른 답장
설명: 환자 이름 입력
```

**텍스트 메시지:**
```
👤 먼저 성함을 알려주세요.

아래 버튼을 눌러 말씀해주시거나,
직접 입력해주셔도 됩니다.
```

**빠른 답장:**
```
버튼 1: 🎤 음성으로 말하기
→ 액션: 메시지 전송
→ 메시지: "음성으로 이름 입력"

버튼 2: 🙋‍♀️ 직원 도움 요청
→ 액션: 블록 이동
→ 대상 블록: staff_help
```

### 4-2. 나이 선택 블록
```
블록명: basic_info_age
블록 유형: 텍스트 + 빠른 답장
설명: 환자 연령대 선택
```

**텍스트 메시지:**
```
🎂 연세를 알려주세요.

해당하는 연령대를 선택해주세요.
```

**빠른 답장:**
```
버튼 1: 20대 → 다음 블록: symptom_selection
버튼 2: 30대 → 다음 블록: symptom_selection
버튼 3: 40대 → 다음 블록: symptom_selection
버튼 4: 50대 → 다음 블록: symptom_selection
버튼 5: 60대 → 다음 블록: symptom_selection
버튼 6: 70대 이상 → 다음 블록: symptom_selection
버튼 7: 🙋‍♀️ 직원 도움 요청 → 다음 블록: staff_help
```

---

## 🎬 Step 5: 증상 선택 블록 구현

### 5-1. 주요 증상 선택 블록
```
블록명: symptom_selection
블록 유형: 텍스트 + 빠른 답장
설명: 주요 증상 선택 (5가지)
```

**텍스트 메시지:**
```
💭 오늘 가장 불편하신 증상을 선택해주세요.

해당하는 증상을 눌러주세요.
```

**빠른 답장:**
```
버튼 1: ① 허리/어깨/무릎 통증
→ 다음 블록: symptom_detail_pain

버튼 2: ② 삐끗/멍/타박상
→ 다음 블록: symptom_detail_injury

버튼 3: ③ 소화불량/속쓰림
→ 다음 블록: symptom_detail_digest

버튼 4: ④ 두통/어지럼증
→ 다음 블록: symptom_detail_headache

버튼 5: ⑤ 피로/스트레스
→ 다음 블록: symptom_detail_fatigue

버튼 6: ⑥ 기타 증상
→ 다음 블록: symptom_detail_other

버튼 7: 🙋‍♀️ 직원 도움 요청
→ 다음 블록: staff_help
```

---

## 🎬 Step 6: 증상 상세 입력 블록 구현

### 6-1. 통증 상세 블록 (예시)
```
블록명: symptom_detail_pain
블록 유형: 텍스트 + 빠른 답장
설명: 통증 증상 상세 입력
```

**텍스트 메시지:**
```
🩹 허리/어깨/무릎 통증에 대해 자세히 알려주세요.

• 언제부터 아프셨나요?
• 어떤 상황에서 더 아픈가요?
• 통증의 정도는 어떤가요? (1-10점)

편하게 말씀해주세요.
```

**빠른 답장:**
```
버튼 1: 🎤 음성으로 설명
→ 액션: 메시지 전송
→ 메시지: "음성으로 증상 설명"

버튼 2: 🙋‍♀️ 직원 도움 요청
→ 다음 블록: staff_help
```

**다음 블록**: `additional_info` (추가 정보 입력)

---

## 🎬 Step 7: 완료 블록 구현

### 7-1. 입력 내용 확인 블록
```
블록명: confirmation
블록 유형: 스킬 응답
설명: 입력 내용 확인 및 최종 검토
```

**JSON 응답:**
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "basicCard": {
          "title": "✅ 입력 내용 확인",
          "description": "입력하신 내용을 확인해주세요.\n\n👤 성함: [입력된 이름]\n🎂 연세: [선택된 나이]\n💭 주요 증상: [선택된 증상]\n📝 상세 내용: [입력된 내용]\n\n내용이 맞으시면 '확인 완료'를 눌러주세요.",
          "thumbnail": {
            "imageUrl": "https://your-domain.com/images/mkmlogo-card.png",
            "fixedRatio": true
          },
          "buttons": [
            {
              "action": "block",
              "label": "✅ 확인 완료",
              "blockId": "completion"
            },
            {
              "action": "block",
              "label": "✏️ 수정하기",
              "blockId": "basic_info_name"
            }
          ]
        }
      }
    ],
    "quickReplies": [
      {
        "action": "block",
        "label": "🙋‍♀️ 직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

### 7-2. 문진 완료 블록
```
블록명: completion
블록 유형: 스킬 응답
설명: 문진 완료 안내 및 접수 정보
```

**JSON 응답:**
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "basicCard": {
          "title": "🎉 문진 완료!",
          "description": "문진이 성공적으로 완료되었습니다.\n\n📋 접수 정보\n• 접수 번호: [자동 생성]\n• 접수 시간: [현재 시간]\n• 예상 대기 시간: 약 15분\n\n원장님께 브리핑이 전달되었습니다.\n진료실 앞에서 기다려주세요.",
          "thumbnail": {
            "imageUrl": "https://your-domain.com/images/mkmlogo-card.png",
            "fixedRatio": true
          }
        }
      }
    ]
  }
}
```

---

## 🎬 Step 8: 지원 블록 구현

### 8-1. 직원 도움 요청 블록
```
블록명: staff_help
블록 유형: 텍스트 + 빠른 답장
설명: 직원 도움 요청 처리
```

**텍스트 메시지:**
```
🙋‍♀️ 직원을 호출하고 있습니다...

잠시만 기다려주세요.
직원이 곧 도와드리겠습니다.

(직원 호출 시간: [현재 시간])
```

**빠른 답장:**
```
버튼 1: ↩️ 이전으로 돌아가기
→ 액션: 이전 블록으로 이동

버튼 2: 🔄 다시 시도
→ 액션: 현재 블록 새로고침
```

---

## 🔧 Step 9: 웹훅 연동 설정

### 9-1. 웹훅 URL 설정
```
웹훅 URL: https://your-domain.com/api/v1/kakao/webhook
메서드: POST
Content-Type: application/json
```

### 9-2. 데이터 전송 설정
**completion 블록에서 웹훅 호출 설정:**
```json
{
  "version": "2.0",
  "template": {
    "outputs": [...],
    "context": {
      "values": [
        {
          "name": "patient_name",
          "lifeSpan": 5,
          "params": {
            "name": "{{user_name}}"
          }
        },
        {
          "name": "patient_age", 
          "lifeSpan": 5,
          "params": {
            "age": "{{user_age}}"
          }
        },
        {
          "name": "symptoms",
          "lifeSpan": 5,
          "params": {
            "symptoms": "{{selected_symptoms}}",
            "details": "{{symptom_details}}"
          }
        }
      ]
    }
  }
}
```

---

## ✅ Step 10: 테스트 및 검증

### 10-1. 기능 테스트 체크리스트
- [ ] 환영 인사 블록 정상 출력
- [ ] 개인정보 동의 버튼 작동
- [ ] 이름 입력 기능 작동
- [ ] 나이 선택 버튼 작동
- [ ] 증상 선택 버튼 작동
- [ ] 상세 입력 기능 작동
- [ ] 확인 및 완료 기능 작동
- [ ] 직원 도움 요청 기능 작동
- [ ] 웹훅 API 호출 성공

### 10-2. 사용자 경험 테스트
- [ ] 텍스트 가독성 확인
- [ ] 버튼 크기 적절성
- [ ] 응답 속도 확인
- [ ] 에러 처리 확인

---

## 🚀 구현 완료 후 결과

### 예상 결과물
1. **완전 작동하는 카카오톡 챗봇**
2. **백엔드 API와 완전 연동**
3. **하이터치 지원 시스템**
4. **실시간 데이터 처리**

### 성공 지표
- [ ] 전체 시나리오 오류 없이 완주
- [ ] 웹훅 API 정상 호출
- [ ] Firestore 데이터 저장 확인
- [ ] 원장 브리핑 자동 생성

---

**🎯 준비 완료!** 

이제 카카오 i 오픈빌더에 접속하여 단계별로 구현을 시작하겠습니다!

**실제 MVP 챗봇이 세상에 나올 순간입니다!** 🚀
