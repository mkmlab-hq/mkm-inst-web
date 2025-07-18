# 🔧 카카오 i 오픈빌더 JSON 템플릿 모음

## 📋 사용 가이드
이 파일은 카카오 i 오픈빌더에서 직접 복사하여 사용할 수 있는 JSON 템플릿들을 정리한 것입니다.

---

## 🎬 Block 1: 환영 인사 (welcome_greeting)

### 스킬 응답 JSON
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

---

## 🎬 Block 1-1: 개인정보 동의 (consent_detail)

### 텍스트 + 빠른 답장
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "📋 개인정보 수집 및 이용 동의\n\n• 수집 목적: 진료 및 문진 서비스 제공\n• 수집 항목: 이름, 나이, 증상 정보\n• 보관 기간: 진료 완료 후 1년\n• 제3자 제공: 담당 의료진에게만 제공\n\n개인정보 수집 및 이용에 동의하시겠습니까?"
        }
      }
    ],
    "quickReplies": [
      {
        "action": "block",
        "label": "✅ 동의합니다",
        "blockId": "basic_info_name"
      },
      {
        "action": "block", 
        "label": "🙋‍♀️ 직원 도움 요청",
        "blockId": "staff_help"
      },
      {
        "action": "block",
        "label": "❓ 더 자세한 설명",
        "blockId": "privacy_details"
      }
    ]
  }
}
```

---

## 🎬 Block 2: 기본 정보 - 이름 입력 (basic_info_name)

### 텍스트 + 빠른 답장
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "👤 먼저 성함을 알려주세요.\n\n아래 버튼을 눌러 말씀해주시거나,\n직접 입력해주셔도 됩니다."
        }
      }
    ],
    "quickReplies": [
      {
        "action": "message",
        "label": "🎤 음성으로 말하기",
        "messageText": "음성으로 이름 입력"
      },
      {
        "action": "block",
        "label": "🙋‍♀️ 직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 🎬 Block 2-1: 기본 정보 - 나이 선택 (basic_info_age)

### 텍스트 + 빠른 답장
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "🎂 연세를 알려주세요.\n\n해당하는 연령대를 선택해주세요."
        }
      }
    ],
    "quickReplies": [
      {
        "action": "block",
        "label": "20대",
        "blockId": "symptom_selection"
      },
      {
        "action": "block",
        "label": "30대",
        "blockId": "symptom_selection"
      },
      {
        "action": "block",
        "label": "40대",
        "blockId": "symptom_selection"
      },
      {
        "action": "block",
        "label": "50대",
        "blockId": "symptom_selection"
      },
      {
        "action": "block",
        "label": "60대",
        "blockId": "symptom_selection"
      },
      {
        "action": "block",
        "label": "70대 이상",
        "blockId": "symptom_selection"
      },
      {
        "action": "block",
        "label": "🙋‍♀️ 직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 🎬 Block 3: 주요 증상 선택 (symptom_selection)

### 텍스트 + 빠른 답장
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "💭 오늘 가장 불편하신 증상을 선택해주세요.\n\n해당하는 증상을 눌러주세요."
        }
      }
    ],
    "quickReplies": [
      {
        "action": "block",
        "label": "① 허리/어깨/무릎 통증",
        "blockId": "symptom_detail_pain"
      },
      {
        "action": "block",
        "label": "② 삐끗/멍/타박상",
        "blockId": "symptom_detail_injury"
      },
      {
        "action": "block",
        "label": "③ 소화불량/속쓰림",
        "blockId": "symptom_detail_digest"
      },
      {
        "action": "block",
        "label": "④ 두통/어지럼증",
        "blockId": "symptom_detail_headache"
      },
      {
        "action": "block",
        "label": "⑤ 피로/스트레스",
        "blockId": "symptom_detail_fatigue"
      },
      {
        "action": "block",
        "label": "⑥ 기타 증상",
        "blockId": "symptom_detail_other"
      },
      {
        "action": "block",
        "label": "🙋‍♀️ 직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 🎬 Block 4: 증상 상세 입력 - 통증 (symptom_detail_pain)

### 텍스트 + 빠른 답장
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "🩹 허리/어깨/무릎 통증에 대해 자세히 알려주세요.\n\n• 언제부터 아프셨나요?\n• 어떤 상황에서 더 아픈가요?\n• 통증의 정도는 어떤가요? (1-10점)\n\n편하게 말씀해주세요."
        }
      }
    ],
    "quickReplies": [
      {
        "action": "message",
        "label": "🎤 음성으로 설명",
        "messageText": "음성으로 증상 설명"
      },
      {
        "action": "block",
        "label": "🙋‍♀️ 직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 🎬 Block 5: 추가 정보 입력 (additional_info)

### 텍스트 + 빠른 답장
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "➕ 추가로 알려주실 내용이 있으신가요?\n\n• 현재 복용 중인 약물\n• 과거 병력이나 수술 경험\n• 알레르기가 있는 약물\n• 기타 증상이나 걱정되는 점\n\n없으시면 '건너뛰기'를 눌러주세요."
        }
      }
    ],
    "quickReplies": [
      {
        "action": "block",
        "label": "✅ 건너뛰기",
        "blockId": "confirmation"
      },
      {
        "action": "message",
        "label": "🎤 음성으로 설명",
        "messageText": "음성으로 추가 정보 입력"
      },
      {
        "action": "block",
        "label": "🙋‍♀️ 직원 도움 요청",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 🎬 Block 6: 입력 내용 확인 (confirmation)

### 스킬 응답 JSON
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "basicCard": {
          "title": "✅ 입력 내용 확인",
          "description": "입력하신 내용을 확인해주세요.\n\n👤 성함: {{name}}\n🎂 연세: {{age}}\n💭 주요 증상: {{symptom}}\n📝 상세 내용: {{detail}}\n➕ 추가 정보: {{additional}}\n\n내용이 맞으시면 '확인 완료'를 눌러주세요.",
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

---

## 🎬 Block 7: 문진 완료 안내 (completion)

### 스킬 응답 JSON
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "basicCard": {
          "title": "🎉 문진 완료!",
          "description": "문진이 성공적으로 완료되었습니다.\n\n📋 접수 정보\n• 접수 번호: {{receipt_number}}\n• 접수 시간: {{current_time}}\n• 예상 대기 시간: {{wait_time}}분\n\n원장님께 브리핑이 전달되었습니다.\n진료실 앞에서 기다려주세요.",
          "thumbnail": {
            "imageUrl": "https://your-domain.com/images/mkmlogo-card.png",
            "fixedRatio": true
          },
          "buttons": [
            {
              "action": "webLink",
              "label": "📱 진료 대기 현황 보기",
              "webLinkUrl": "https://your-domain.com/waiting-status"
            }
          ]
        }
      }
    ]
  }
}
```

---

## 🎬 Support Block: 직원 도움 요청 (staff_help)

### 텍스트 + 빠른 답장
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "🙋‍♀️ 직원을 호출하고 있습니다...\n\n잠시만 기다려주세요.\n직원이 곧 도와드리겠습니다.\n\n(직원 호출 시간: {{current_time}})"
        }
      }
    ],
    "quickReplies": [
      {
        "action": "block",
        "label": "↩️ 이전으로 돌아가기",
        "blockId": "{{previous_block}}"
      },
      {
        "action": "block",
        "label": "🔄 다시 시도",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 🎬 Support Block: 개인정보 상세 설명 (privacy_details)

### 텍스트 + 빠른 답장
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "📋 개인정보 처리방침 상세 안내\n\n🔒 수집하는 개인정보\n• 이름, 나이, 증상 정보\n• 추가 의료 정보 (선택사항)\n\n🎯 이용 목적\n• 진료 서비스 제공\n• 의료진 브리핑 자료\n• 진료 기록 관리\n\n📅 보관 기간\n• 진료 완료 후 1년간 보관\n• 법적 의무 보관 기간 준수\n\n🛡️ 보안 조치\n• 암호화 저장\n• 접근 권한 제한\n• 정기적 보안 점검\n\n궁금한 점이 있으시면 직원에게 문의하세요."
        }
      }
    ],
    "quickReplies": [
      {
        "action": "block",
        "label": "↩️ 동의 단계로 돌아가기",
        "blockId": "consent_detail"
      },
      {
        "action": "block",
        "label": "🙋‍♀️ 직원에게 문의",
        "blockId": "staff_help"
      }
    ]
  }
}
```

---

## 🔧 변수 및 파라미터 설정

### 사용자 정보 저장 변수
- `{{name}}`: 사용자 이름
- `{{age}}`: 사용자 나이
- `{{symptom}}`: 선택한 주요 증상
- `{{detail}}`: 증상 상세 내용
- `{{additional}}`: 추가 정보
- `{{receipt_number}}`: 접수 번호
- `{{current_time}}`: 현재 시간
- `{{wait_time}}`: 예상 대기 시간
- `{{previous_block}}`: 이전 블록 ID

### 웹훅 API 연동 설정
- **엔드포인트**: `https://your-domain.com/api/v1/kakao/webhook`
- **메서드**: POST
- **헤더**: `Content-Type: application/json`
- **인증**: API 키 또는 토큰 기반

---

## 🚀 카카오 i 오픈빌더 구현 순서

1. **프로젝트 생성**: "MKM Lab 문진 챗봇"
2. **블록 생성**: 위 JSON 템플릿 순서대로 블록 생성
3. **연결 설정**: 각 블록 간 연결 설정
4. **변수 설정**: 사용자 입력 데이터 저장 변수 설정
5. **웹훅 연동**: 최종 단계에서 백엔드 API 호출
6. **테스트**: 전체 시나리오 테스트
7. **배포**: 카카오톡 채널 연동

---

**📋 JSON 템플릿 준비 완료!**

이제 카카오 i 오픈빌더에서 복사하여 바로 사용할 수 있습니다.
