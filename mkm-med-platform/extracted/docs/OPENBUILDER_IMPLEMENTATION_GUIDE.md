# 🚀 카카오 i 오픈빌더 MVP 구현 - 실시간 가이드

## 📍 현재 상태: 구현 시작 준비 완료

### 🎯 즉시 실행 단계
**Phase 1: 오픈빌더 프로젝트 생성 및 설정**

---

## 1️⃣ 카카오 i 오픈빌더 프로젝트 생성

### 📱 접속 및 프로젝트 생성
1. **카카오 i 오픈빌더 접속**: https://i.kakao.com/openbuilder
2. **새 프로젝트 생성**:
   - 프로젝트명: `MKM Lab 문진 챗봇`
   - 설명: `MKM Lab 하이터치 사전 문진 시스템`
   - 카테고리: `의료/건강`

### 🛠️ 기본 설정
```json
{
  "project_name": "MKM Lab 문진 챗봇",
  "description": "MKM Lab 하이터치 사전 문진 시스템",
  "category": "의료/건강",
  "webhook_url": "https://your-domain.com/api/v1/kakao/webhook",
  "fallback_message": "죄송합니다. 다시 시도해주세요. 문제가 계속되면 '직원 도움'을 요청해주세요."
}
```

---

## 2️⃣ 환영 및 동의 블록 구현

### 🎬 Block 1: 환영 인사 & 개인정보 동의 (`welcome_greeting`)

#### 카드 메시지 구성
```json
{
  "simpleText": {
    "text": "안녕하세요! 😊\n\nMKM Lab 문진 서비스에 오신 것을 환영합니다.\n\n진료 전 사전 문진을 통해 원장님께 더 정확한 진료를 받으실 수 있도록 도와드리겠습니다."
  }
}
```

#### 기본 카드 메시지
```json
{
  "basicCard": {
    "title": "MKM Lab 문진 서비스",
    "description": "빠르고 정확한 사전 문진을 통해\n더 나은 진료를 받으실 수 있습니다.",
    "thumbnail": {
      "imageUrl": "https://your-domain.com/images/mkmlogo-card.png"
    },
    "buttons": [
      {
        "action": "block",
        "label": "문진 시작하기",
        "blockId": "consent_agreement"
      },
      {
        "action": "block",
        "label": "직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

### 🎬 Block 2: 개인정보 동의 (`consent_agreement`)

#### 동의 텍스트 카드
```json
{
  "basicCard": {
    "title": "개인정보 수집 및 이용 동의",
    "description": "📋 수집항목: 이름, 나이, 증상 정보\n🎯 목적: 진료 전 사전 문진\n⏰ 보관기간: 1년\n🔒 안전한 암호화 보관\n\n문진 서비스 이용을 위해 동의가 필요합니다.",
    "thumbnail": {
      "imageUrl": "https://your-domain.com/images/mkmlogo-privacy.png"
    },
    "buttons": [
      {
        "action": "block",
        "label": "동의합니다",
        "blockId": "basic_info_name"
      },
      {
        "action": "block",
        "label": "더 자세히 알고 싶어요",
        "blockId": "privacy_details"
      },
      {
        "action": "block",
        "label": "직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 3️⃣ 기본 정보 수집 블록 구현

### 🎬 Block 3: 이름 입력 (`basic_info_name`)

#### 텍스트 입력 블록
```json
{
  "simpleText": {
    "text": "문진을 시작하겠습니다! 😊\n\n먼저 성함을 알려주세요.\n(예: 홍길동)"
  }
}
```

#### 엔티티 설정
```json
{
  "entity": {
    "name": "user_name",
    "type": "sys.text",
    "required": true,
    "validation": {
      "min_length": 2,
      "max_length": 10
    }
  }
}
```

### 🎬 Block 4: 나이 선택 (`basic_info_age`)

#### 나이 선택 카드
```json
{
  "basicCard": {
    "title": "나이 선택",
    "description": "해당하는 연령대를 선택해주세요.",
    "buttons": [
      {
        "action": "block",
        "label": "20대",
        "blockId": "symptoms_selection",
        "extra": {"age_group": "20대"}
      },
      {
        "action": "block",
        "label": "30대",
        "blockId": "symptoms_selection",
        "extra": {"age_group": "30대"}
      },
      {
        "action": "block",
        "label": "40대",
        "blockId": "symptoms_selection",
        "extra": {"age_group": "40대"}
      },
      {
        "action": "block",
        "label": "50대",
        "blockId": "symptoms_selection",
        "extra": {"age_group": "50대"}
      },
      {
        "action": "block",
        "label": "60대",
        "blockId": "symptoms_selection",
        "extra": {"age_group": "60대"}
      },
      {
        "action": "block",
        "label": "70대 이상",
        "blockId": "symptoms_selection",
        "extra": {"age_group": "70대 이상"}
      }
    ]
  }
}
```

---

## 4️⃣ 증상 선택 블록 구현

### 🎬 Block 5: 주요 증상 선택 (`symptoms_selection`)

#### 증상 선택 카드
```json
{
  "basicCard": {
    "title": "주요 증상 선택",
    "description": "#{user_name}님, 어떤 증상으로 내원하시나요?\n해당하는 증상을 선택해주세요.",
    "buttons": [
      {
        "action": "block",
        "label": "🦴 허리/어깨/무릎 통증",
        "blockId": "symptom_pain_detail",
        "extra": {"symptom_type": "musculoskeletal"}
      },
      {
        "action": "block",
        "label": "🤕 삐끗/멍/타박상",
        "blockId": "symptom_injury_detail",
        "extra": {"symptom_type": "injury"}
      },
      {
        "action": "block",
        "label": "🍽️ 소화불량/속쓰림",
        "blockId": "symptom_digestive_detail",
        "extra": {"symptom_type": "digestive"}
      },
      {
        "action": "block",
        "label": "🤯 두통/어지럼증",
        "blockId": "symptom_neurological_detail",
        "extra": {"symptom_type": "neurological"}
      },
      {
        "action": "block",
        "label": "😴 피로/스트레스",
        "blockId": "symptom_fatigue_detail",
        "extra": {"symptom_type": "fatigue"}
      },
      {
        "action": "block",
        "label": "직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 5️⃣ 상세 정보 입력 블록 구현

### 🎬 Block 6: 증상 상세 입력 (`symptom_detail`)

#### 텍스트 입력 블록
```json
{
  "simpleText": {
    "text": "선택하신 증상에 대해 조금 더 자세히 알려주세요.\n\n예시:\n- 언제부터 아팠는지\n- 어떤 상황에서 더 아픈지\n- 통증 정도 (1-10점)\n- 기타 특이사항\n\n편하게 말씀해주세요."
  }
}
```

### 🎬 Block 7: 추가 정보 입력 (`additional_info`)

#### 선택사항 입력 블록
```json
{
  "basicCard": {
    "title": "추가 정보 (선택사항)",
    "description": "다른 증상이나 전달하고 싶은 내용이 있으시면 알려주세요.\n\n없으시면 '없음'을 선택해주세요.",
    "buttons": [
      {
        "action": "block",
        "label": "추가 정보 입력하기",
        "blockId": "additional_input"
      },
      {
        "action": "block",
        "label": "없음",
        "blockId": "confirmation_summary"
      }
    ]
  }
}
```

---

## 6️⃣ 확인 및 완료 블록 구현

### 🎬 Block 8: 입력 내용 확인 (`confirmation_summary`)

#### 확인 카드
```json
{
  "basicCard": {
    "title": "입력 내용 확인",
    "description": "📝 이름: #{user_name}\n📅 나이: #{age_group}\n🏥 주요 증상: #{symptom_type}\n📋 상세 내용: #{symptom_detail}\n\n위 내용이 맞나요?",
    "buttons": [
      {
        "action": "block",
        "label": "네, 맞습니다",
        "blockId": "webhook_submit"
      },
      {
        "action": "block",
        "label": "수정하고 싶어요",
        "blockId": "basic_info_name"
      },
      {
        "action": "block",
        "label": "직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

### 🎬 Block 9: 웹훅 제출 (`webhook_submit`)

#### 웹훅 호출 블록
```json
{
  "webhook": {
    "url": "https://your-domain.com/api/v1/kakao/webhook",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_TOKEN"
    },
    "body": {
      "userRequest": {
        "user": {
          "id": "#{userKey}"
        },
        "utterance": "#{userMessage}"
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
  }
}
```

### 🎬 Block 10: 완료 안내 (`completion_notice`)

#### 완료 메시지 카드
```json
{
  "basicCard": {
    "title": "문진 완료! 🎉",
    "description": "#{user_name}님의 문진이 완료되었습니다.\n\n✅ 원장님께 전달 완료\n✅ 진료 시 참고 예정\n\n진료실로 오시면 더 정확한 진료를 받으실 수 있습니다.",
    "thumbnail": {
      "imageUrl": "https://your-domain.com/images/mkmlogo-success.png"
    },
    "buttons": [
      {
        "action": "block",
        "label": "새로운 문진 시작",
        "blockId": "welcome_greeting"
      },
      {
        "action": "webLink",
        "label": "MKM Lab 안내",
        "webLinkUrl": "https://your-domain.com"
      }
    ]
  }
}
```

---

## 7️⃣ 지원 블록 구현

### 🎬 Block 11: 직원 도움 (`staff_help`)

#### 도움 요청 카드
```json
{
  "basicCard": {
    "title": "직원 도움 요청",
    "description": "직원이 도와드리겠습니다! 😊\n\n📞 전화: 02-1234-5678\n🏥 방문: 서울시 강남구 MKM Lab\n⏰ 운영시간: 09:00-18:00\n\n잠시만 기다려주세요.",
    "thumbnail": {
      "imageUrl": "https://your-domain.com/images/mkmlogo-help.png"
    },
    "buttons": [
      {
        "action": "block",
        "label": "문진 계속하기",
        "blockId": "welcome_greeting"
      },
      {
        "action": "webLink",
        "label": "전화 걸기",
        "webLinkUrl": "tel:02-1234-5678"
      }
    ]
  }
}
```

---

## 🧪 구현 완료 체크리스트

### Phase 1: 기본 설정 ✅
- [ ] 카카오 i 오픈빌더 프로젝트 생성
- [ ] 웹훅 URL 설정
- [ ] 기본 설정 완료

### Phase 2: 핵심 블록 구현 ✅
- [ ] Block 1: 환영 인사 (`welcome_greeting`)
- [ ] Block 2: 개인정보 동의 (`consent_agreement`)
- [ ] Block 3: 이름 입력 (`basic_info_name`)
- [ ] Block 4: 나이 선택 (`basic_info_age`)
- [ ] Block 5: 증상 선택 (`symptoms_selection`)
- [ ] Block 6: 증상 상세 입력 (`symptom_detail`)
- [ ] Block 7: 추가 정보 입력 (`additional_info`)
- [ ] Block 8: 입력 내용 확인 (`confirmation_summary`)
- [ ] Block 9: 웹훅 제출 (`webhook_submit`)
- [ ] Block 10: 완료 안내 (`completion_notice`)
- [ ] Block 11: 직원 도움 (`staff_help`)

### Phase 3: 테스트 및 검증 ✅
- [ ] 전체 플로우 테스트
- [ ] 웹훅 연동 테스트
- [ ] 데이터 저장 확인
- [ ] 사용자 경험 확인

---

## 🚀 구현 시작!

이제 위의 가이드에 따라 카카오 i 오픈빌더에서 실제 구현을 시작하겠습니다.

**다음 단계**: 카카오 i 오픈빌더 접속 → 프로젝트 생성 → 첫 번째 블록 생성

구현 진행 상황을 실시간으로 보고드리겠습니다! 🎯
