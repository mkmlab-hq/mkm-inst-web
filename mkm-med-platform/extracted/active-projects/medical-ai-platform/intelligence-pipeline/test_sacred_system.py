import json
from datetime import datetime

def test_sacred_meditation_system():
    5성 시스템 테스트    
    print("🌟 15의 정성 시스템 테스트 시작...")
    
    # 샘플 사용자 데이터
    user_data = {
        "user_id": "user_123",
        "user_intention": "건강한 몸과 마음을 위한 염원",
        "user_reflection": "오늘은 정말 평온한 하루였습니다. 감사한 마음이 가득합니다.",
        "emotion_state": "감사",
        "wearable_data": {
            "stress_level": 0.3,
            "energy_level": 0.7,
            "sleep_quality": 0.8,
            "heart_rate": 72,
            "hrv": 65
        },
        "external_data": {
            "weather": {
                "description": "맑음",
                "temperature": 22
            }
        }
    }
    
    # 페르소나 분석 (MVP - 기본 페르소나만)
    persona_result = analyze_basic_persona(user_data)
    
    # 명상 세션 생성
    meditation_session = create_sacred_meditation_session(
        user_id=user_data["user_id"],
        persona_code=persona_result["persona_code"],
        wearable_data=user_data["wearable_data"],
        user_intention=user_data["user_intention"]
    )
    
    # NFT 메타데이터 생성
    nft_metadata = create_sacred_nft_metadata(
        persona_result, meditation_session, user_data
    )
    
    # 인사이트 생성
    insights = generate_sacred_insights(
        persona_result, meditation_session, user_data
    )
    
    # 통합 결과
    complete_experience = {
        "user_id": user_data["user_id"],
        "session_id": meditation_session["timestamp"],
        "persona_analysis": persona_result,
        "meditation_session": meditation_session,
        "nft_metadata": nft_metadata,
        "sacred_insights": insights,
        "mvp_config": {
            "enable_sasang_constitution": False,
            "enable_12_constitution": False,
            "focus_on_persona": True,
            "enable_sacred_meditation": True,
            "enable_wearable_integration": True,
            "enable_nft_generation": True
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return complete_experience

def analyze_basic_persona(user_data):
    MVP 전략에 따른 기본 페르소나 분석""    print("🎭 기본 페르소나 분석 (MVP 모드)...")
    
    wearable_data = user_data.get("wearable_data", {})
    stress_level = wearable_data.get("stress_level", 0.5)
    energy_level = wearable_data.get("energy_level", 0.5)
    heart_rate = wearable_data.get("heart_rate", 70)
    hrv = wearable_data.get("hrv", 50)
    
    # 기본 페르소나 분류 (MVP - 4 기본 유형)
    if energy_level > 0.7 and stress_level < 0.4:
        persona_code = "DYNAMIC"
        persona_name = "The Dynamic Soul"
        persona_description = "활력이 넘치고 긍정적인 에너지를 가진 페르소나"
    elif stress_level > 0.6 and energy_level < 0.4:
        persona_code = "CALM"
        persona_name = "The Calm Soul"
        persona_description = "평온하고 안정적인 마음 상태의 페르소나"
    elif hrv > 60 and heart_rate < 65:
        persona_code = "BALANCED"
        persona_name = "The Balanced Soul"
        persona_description = "균형잡힌 생체 신호를 보이는 페르소나"
    else:
        persona_code = "ADAPTIVE"
        persona_name = "The Adaptive Soul"
        persona_description = "변화에 유연하게 적응하는 페르소나"
    
    return {
        "persona_code": persona_code,
        "persona_name": persona_name,
        "persona_description": persona_description,
        "analysis_method": "biometric_based",
        "confidence_score": 0.85,
        "mvp_mode": True,
        "biometric_data": {
            "stress_level": stress_level,
            "energy_level": energy_level,
            "heart_rate": heart_rate,
            "hrv": hrv
        }
    }

def create_sacred_meditation_session(user_id, persona_code, wearable_data, user_intention):
  15초의 정성 세션 생성  print(f🌟 {user_id}님을 위한 15성 세션 생성...)
    
    # 페르소나별 맞춤 가이드
    persona_guides = {
        "DYNAMIC": {
            "theme": "리더십과 비전",
            "messages": ["당신의 비전을 생각하며...", "리더로서의 사명을 느끼며..."]
        },
        "CALM": {
            "theme": "균형과 안정",
            "messages": ["균형을 찾는 과정에서...", "을 느끼며..."]
        },
        "BALANCED": {
            "theme": "조화와 균형",
            "messages": ["조화로운 상태를 느끼며...", "유지하며..."]
        },
        "ADAPTIVE": {
            "theme": "적응과 유연성",
            "messages": ["적응의 지혜를 느끼며...", "유연성의 힘을 확인하며..."]
        }
    }
    
    persona_guide = persona_guides.get(persona_code, {
        "theme": "일반적인 명상",
        "messages": ["당신의 고유한 특성을 느끼며..."]
    })
    
    # 생체 데이터 기반 가이드
    stress_level = wearable_data.get("stress_level", 0.5)
    if stress_level > 0.7:
        additional_guidance = "스트레스가 높은 상태에서 평온을 찾는 과정을..."
    elif wearable_data.get("energy_level", 0.5) > 0.7:
        additional_guidance = "활력이 넘치는 상태에서 그 에너지를 활용하는 방법을..."
    else:
        additional_guidance = "균형잡힌 상태에서 더욱 깊은 평온을..."   
    # 정성 수준 계산
    sacred_score = 0.5
    if user_intention:
        sacred_score += 0.2
    if stress_level < 0.5:
        sacred_score += 0.1
    if wearable_data.get("hrv", 50) > 50:
        sacred_score += 0.1
    if wearable_data.get("sleep_quality", 0.5) > 0.7:
        sacred_score += 0.1    
    # 카운트다운 메시지 시퀀스
    countdown_messages = [
        {"time": 3, "message": "오늘의 소원을 빌어보세요..."},
        {"time": 3, "message": persona_guide["messages"][0]},
        {"time": 3, "message": additional_guidance},
        {"time": 3, "message": f"{user_intention}에 대한 염원을 담아..."},
        {"time": 3, "message": "고요히 자신에게 집중하세요..."}
    ]
    
    return {
        "user_id": user_id,
        "persona_code": persona_code,
        "session_type": "sacred_meditation",
        "duration": 15,
        "theme": persona_guide["theme"],
        "countdown_messages": countdown_messages,
        "user_intention": user_intention,
        "biometric_context": wearable_data,
        "timestamp": datetime.now().isoformat(),
        "sacred_value": min(sacred_score, 1.0)
    }

def create_sacred_nft_metadata(persona_result, meditation_session, user_data):
  한 NFT 메타데이터 생성"
    print("🎨 신성한 NFT 메타데이터 생성...)
    
    sacred_attributes = [
        {"trait_type": "페르소나", "value": persona_result["persona_name"], "description": "페르소나"},
        {"trait_type": "정성 수준", "value": f"{meditation_session.get('sacred_value', 0.5):0.1%}", "description": "15초간쏟은 정성의 깊이"},
        {"trait_type": "명상 테마", "value": meditation_session.get("theme", "일반"), "description": "명상 세션의 테마"},
        {"trait_type": "사용자 의도", "value": user_data.get("user_intention", "일반"), "description": "명상 시 담은 의도"},
        {"trait_type": "생체 신호", "value": "안정적" if persona_result["biometric_data"]["stress_level"] < 0.5 else "활동적", "description": "명상 시 생체 신호 상태"}
    ]
    
    return {
        "name": f"15 - {persona_result['persona_name']}",
        "description": f"당신의 {persona_result['persona_name']} 페르소나가 담긴 신성한 순간",
        "image_url": "generated_sacred_image.png",
        "external_url": "https://persona-diary.com/nft",
        "attributes": sacred_attributes
    }

def generate_sacred_insights(persona_result, meditation_session, user_data):
    신성한 인사이트 생성"
    print(🧠 신성한 인사이트 생성...)
    
    # 페르소나별 추천사항
    recommendations_map = {
        "DYNAMIC": [
            "활력이 넘치는 상태를 유지하기 위해 규칙적인 운동을 권장합니다.",
            "긍정적인 에너지를 활용하여 창의적인 활동에 참여해보세요.",
            "다른 사람들과의 소통을 통해 에너지를 나누어보세요."
        ],
        "CALM": [
            "평온한 상태를 유지하기 위해 명상이나 요가를 정기적으로 실천해보세요.",
            "자연과의 접촉을 통해 내면의 평화를 더욱 깊게 경험해보세요.",
            "스트레스 관리 기법을 학습하여 안정감을 유지해보세요."
        ],
        "BALANCED": [
            "균형잡힌 상태를 유지하기 위해 일정한 생활 리듬을 만들어보세요.",
            "다양한 활동을 조화롭게 조합하여 균형을 유지해보세요.",
            "정기적인 건강 체크를 통해 균형 상태를 모니터링해보세요."
        ],
        "ADAPTIVE": [
            "변화에 유연하게 대응하는 능력을 더욱 발전시켜보세요.",
            "새로운 경험을 통해 적응력을 향상시켜보세요.",
            "스트레스 상황에서도 유연성을 유지하는 기법을 연습해보세요."
        ]
    }
    
    recommendations = recommendations_map.get(persona_result["persona_code"], 
        ["개인화된 추천을 위해 더 많은 데이터가 필요합니다."])
    
    # 웰니스 추천사항
    wearable_data = user_data.get("wearable_data", {})
    wellness_recommendations = []
    
    if wearable_data.get("stress_level", 0.5) > 0.5:
        wellness_recommendations.append("스트레스 수준이 높습니다. 깊은 호흡이나 명상을 통해 스트레스를 관리해보세요")
    
    if wearable_data.get("sleep_quality", 0.5) > 0.5:
        wellness_recommendations.append("수면 품질을 개선하기 위해 규칙적인 수면 시간을 유지하고 스크린 사용을 줄여보세요")
    if not wellness_recommendations:
        wellness_recommendations.append("전반적으로 건강한 상태를 유지하고 있습니다. 현재의 웰빙 루틴을 계속 유지해보세요")    
    return {
        "persona_insights": [
            {
                "title": f"{persona_result['persona_name']}의 특성",
                "description": persona_result["persona_description"],
                "recommendations": recommendations
            }
        ],
        "meditation_insights": [
            {
                "title": "15초의 정성 분석",
                "description": f"당신의 {meditation_session['theme']} 명상 세션에 대한 분석",
                "sacred_value": meditation_session.get("sacred_value", 0.5),
                "quality_score": 0.85
            }
        ],
        "wellness_insights": [
            {
                "title": "웰니스 인사이트",
                "description": "생체 신호 기반 건강 조언",
                "recommendations": wellness_recommendations
            }
        ]
    }

if __name__ == "__main__":
    # 시스템 테스트 실행
    complete_experience = test_sacred_meditation_system()
    
    print("\n🌟 생성된 완전한 신성한 경험:")
    print(json.dumps(complete_experience, indent=2, ensure_ascii=False))
    
    # MVP 상태 확인
    mvp_status = {
        "mvp_version": 1.0,
        "core_features": {
            "basic_persona_analysis": "완료",
            "sacred_meditation": "완료",
            "nft_generation": "완료",
            "wearable_integration": "완료",
            "knowledge_insights": "완료"
        },
        "excluded_features": {
            "sasang_constitution": "MVP에서 제외 (Phase 2 예정)",
            "12_constitution": "MVP에서 제외 (Phase 2 예정)",
            "advanced_medical_analysis": "MVP에서 제외 (Phase 3)"
        },
        "next_phases": {
            "phase_2": "고급 의료 인사이트"
        }
    }
    
    print("\n📊 MVP 구현 상태:")
    print(json.dumps(mvp_status, indent=2, ensure_ascii=False)) 