import json
import time
from datetime import datetime
from typing import Dict, List, Optional

class SacredPersonaMVP:
    신성한 페르소나 시스템 MVP
    15초의 정성 개념을 기반으로 한 완전한 페르소나 다이어리 시스템
     
    def __init__(self):
        print("🌟 신성한 페르소나 시스템 MVP 초기화...")
        
        # MVP 전략 설정 (사상체질/12체질 제외)
        self.mvp_config = {
            "enable_sasang_constitution": False,  # MVP에서는 비활성화
            "enable_12_constitution": False,      # MVP에서는 비활성화
            "focus_on_persona": True,             # 페르소나 중심
            "enable_sacred_meditation": True,     # 15초의 정성 활성화
            "enable_wearable_integration": True, # 웨어러블 통합
            "enable_nft_generation": True         # NFT 생성
        }
        
        # 명상형 카운트다운 메시지 (3초마다 변경)
        self.meditation_messages = [
            "오늘의 소원을 빌어보세요...",
            "당신의 염원을 담아주세요...",
            "고요히 자신에게 집중하세요...",
            "마음의 거울을 들여다보세요...",
            "내면의 평온을 찾아보세요..."
        ]
        
        # 페르소나별 맞춤 명상 가이드
        self.persona_meditation_guides = {
            "DYNAMIC": {
                "theme": "리더십과 비전",
                "messages": [
                    "당신의 비전을 생각하며...",
                    "리더로서의 사명을 느끼며...",
                    "미래를 향한 의지를 확인하며..."
                ]
            },
            "CALM": {
                "theme": "균형과 안정",
                "messages": [
                    "균형을 찾는 과정에서...",
                    "안정감을 느끼며...",
                    "조화로운 상태를 확인하며..."
                ]
            },
            "BALANCED": {
                "theme": "조화와 균형",
                "messages": [
                    "조화로운 상태를 느끼며...",
                    "균형을 유지하며...",
                    "안정된 마음을 확인하며..."
                ]
            },
            "ADAPTIVE": {
                "theme": "적응과 유연성",
                "messages": [
                    "적응의 지혜를 느끼며...",
                    "유연성의 힘을 확인하며...",
                    "조화로운 변화를 경험하며..."
                ]
            }
        }
        
        print("✅ 신성한 페르소나 시스템 MVP 준비 완료")
    
    def create_complete_sacred_experience(self, user_id: str, user_data: Dict) -> Dict:
       
        완전한 '15초의 정성' 경험 생성
               print(f"🌟 {user_id}님을 위한 완전한 신성한 경험 생성...")
        
        #1단계: 페르소나 분석 (MVP - 기본 페르소나만)
        persona_result = self._analyze_basic_persona(user_data)
        
        # 2단계: 명상 세션 생성
        meditation_session = self._create_sacred_meditation_session(
            user_id=user_id,
            persona_code=persona_result["persona_code"],
            wearable_data=user_data.get("wearable_data", {}),
            user_intention=user_data.get("user_intention", "")
        )
        
        # 3단계: 사용자 참여형 NFT 메타데이터 생성
        nft_metadata = self._create_sacred_nft_metadata(
            persona_result, meditation_session, user_data
        )
        
        # 4단계: 인사이트 생성
        insights = self._generate_sacred_insights(
            persona_result, meditation_session, user_data
        )
        
        # 5단계: 통합 결과 생성
        complete_experience = {
            "user_id": user_id,
       "session_id": meditation_session["timestamp"],
           "persona_analysis": persona_result,
     "meditation_session": meditation_session,
           "nft_metadata": nft_metadata,
            "sacred_insights": insights,
            "mvp_config": self.mvp_config,
      "timestamp":datetime.now().isoformat()
        }
        
        return complete_experience
    
    def _analyze_basic_persona(self, user_data: Dict) -> Dict:
                MVP 전략에 따른 기본 페르소나 분석 (사상체질/12체질 제외)
       
        print("🎭 기본 페르소나 분석 (MVP 모드)...")
        
        # 웨어러블 데이터 기반 기본 분석
        wearable_data = user_data.get("wearable_data", {})
        
        # 생체 신호 기반 페르소나 분류
        stress_level = wearable_data.get("stress_level", 0.5)
        energy_level = wearable_data.get("energy_level", 0.5)
        heart_rate = wearable_data.get("heart_rate", 70)
        hrv = wearable_data.get("hrv", 50)
        
        # 기본 페르소나 분류 (MVP - 4 기본 유형)
        if energy_level > 0.7 and stress_level < 0.4:
            persona_code = "DYNAMIC" # 활기찬
            persona_name = "The Dynamic Soul"
            persona_description = "활력이 넘치고 긍정적인 에너지를 가진 페르소나"
        elif stress_level > 0.6 and energy_level < 0.4:
            persona_code = "CALM"  # 평온한
            persona_name = "The Calm Soul"
            persona_description = "평온하고 안정적인 마음 상태의 페르소나"
        elif hrv > 60 and heart_rate < 65:
            persona_code = "BALANCED"  # 균형잡힌
            persona_name = "The Balanced Soul"
            persona_description = "균형잡힌 생체 신호를 보이는 페르소나"
        else:
            persona_code = "ADAPTIVE"  # 적응하는
            persona_name = "The Adaptive Soul"
            persona_description = "변화에 유연하게 적응하는 페르소나"
        return {
         "persona_code": persona_code,
         "persona_name": persona_name,
  "persona_description": persona_description,
            "analysis_method": "biometric_based",
           "confidence_score":0.85,
            "mvp_mode": True,
           "biometric_data": {
             "stress_level": stress_level,
             "energy_level": energy_level,
           "heart_rate": heart_rate,
         "hrv": hrv
            }
        }
    
    def _create_sacred_meditation_session(self, user_id: str, persona_code: str, 
                                        wearable_data: Dict, user_intention: str = "") -> Dict:
                사용자별 맞춤형 '15초의 정성' 세션 생성
               print(f"🌟 {user_id}님을 위한15초의 정성' 세션 생성...")
        
        # 페르소나별 맞춤 가이드 선택
        persona_guide = self.persona_meditation_guides.get(persona_code, {
           "theme": "일반적인 명상",
           "messages": ["당신의 고유한 특성을 느끼며..."]
        })
        
        # 생체 데이터 기반 추가 가이드
        additional_guidance = self._generate_biometric_guidance(wearable_data)
        
        # 사용자 의도 기반 맞춤 메시지
        intention_message = self._generate_intention_message(user_intention)
        
        #15초 카운트다운 메시지 시퀀스 생성
        countdown_messages = self._create_countdown_sequence(persona_guide, additional_guidance, intention_message)
        
        # 정성 수준 계산
        sacred_value = self._calculate_sacred_value(user_intention, wearable_data)
        
        session_data = {
            "user_id": user_id,
         "persona_code": persona_code,
           "session_type": "sacred_meditation",
          "duration": 15,
          "theme": persona_guide["theme"],
      "countdown_messages": countdown_messages,
           "user_intention": user_intention,
            "biometric_context": wearable_data,
      "timestamp":datetime.now().isoformat(),
         "sacred_value": sacred_value
        }
        
        return session_data
    
    def _generate_biometric_guidance(self, wearable_data: Dict) -> str:
        
        생체 데이터 기반 추가 명상 가이드 생성
              stress_level = wearable_data.get("stress_level", 0.5)
        energy_level = wearable_data.get("energy_level", 0.5)
        sleep_quality = wearable_data.get("sleep_quality", 0.5)
        
        if stress_level > 0.7:
            return "스트레스가 높은 상태에서 평온을 찾는 과정을..."
        elif energy_level > 0.8:
            return "활력이 넘치는 상태에서 그 에너지를 활용하는 방법을..."
        elif sleep_quality < 0.5:
            return "휴식과 회복이 필요한 상태에서..."
        else:
            return "균형잡힌 상태에서 더욱 깊은 평온을..."
    
    def _generate_intention_message(self, user_intention: str) -> str:
        
        사용자 의도 기반 맞춤 메시지 생성
               if not user_intention:
            return "당신의 마음이 원하는 것을 생각하며..."
        intention_keywords = {
            "건강": "건강한 몸과 마음을 위한 염원을...",
            "평화": "내면의 평화를 찾는 과정에서...",
            "성공": "성공을 향한 의지를 확인하며...",
             "사랑": "사랑의 에너지를 느끼며...",
             "감사": "감사하는 마음을 담아...",
            "희망": "희망의 빛을 느끼며...",
            "치유": "치유의 에너지를 받으며...",
            "성장": "성장의 순간을 경험하며..."
        }
        
        for keyword, message in intention_keywords.items():
            if keyword in user_intention:
                return message
        
        return f"{user_intention}에 대한 염원을 담아..."
    
    def _create_countdown_sequence(self, persona_guide: Dict, additional_guidance: str, 
                                 intention_message: str) -> List[Dict]:
        
       15초 카운트다운 메시지 시퀀스 생성
         messages = []
        
        #3초마다 메시지 변경 (총 5개 메시지)
        for i in range(5):
            if i == 0:
                message = "오늘의 소원을 빌어보세요..."
            elif i == 1:
                message = persona_guide["messages"][0] if "messages" in persona_guide and persona_guide["messages"] else "당신의 고유한 특성을 느끼며..."
            elif i == 2:
                message = additional_guidance
            elif i == 3:
                message = intention_message
            else:
                message = "고요히 자신에게 집중하세요..."
            
            messages.append({
             "time": 3,
                "message": message
            })
        
        return messages
    
    def _calculate_sacred_value(self, user_intention: str, wearable_data: Dict) -> float:
        
        사용자의 '정성' 수준을 수치화
              sacred_score = 0.5값
        
        # 의도의 깊이
        if user_intention:
            sacred_score += 0.2        
        # 생체 데이터의 안정성
        stress_level = wearable_data.get("stress_level", 0.5)
        if stress_level < 0.5:  # 낮은 스트레스
            sacred_score += 0.1        
        # 심박 변이성 (HRV) - 안정적일수록 높은 점수
        hrv = wearable_data.get("hrv", 50)
        if hrv > 50:  # 높은 HRV
            sacred_score += 0.1        
        # 수면 품질
        sleep_quality = wearable_data.get("sleep_quality", 0.5)
        if sleep_quality > 0.7:  # 좋은 수면
            sacred_score += 0.1   
        return min(sacred_score, 1.0 # 최대 1  
    def _create_sacred_nft_metadata(self, persona_result: Dict, 
                                  meditation_session: Dict, user_data: Dict) -> Dict:
     
        신성한 NFT 메타데이터 생성
       
        print("🎨 신성한 NFT 메타데이터 생성...")
        
        # 기본 NFT 데이터
        base_nft_data = {
           "name": f"15 - {persona_result['persona_name']}",
            "description": f"당신의 {persona_result['persona_name']} 페르소나가 담긴 신성한 순간",
        "image_url": "generated_sacred_image.png",
           "external_url": "https://persona-diary.com/nft",
           "attributes": []
        }
        
        # 신성한 속성 추가
        sacred_attributes = [
           {"trait_type": "페르소나",
              "value": persona_result["persona_name"],
                "description": "페르소나"
            },
           {"trait_type": "정성 수준",
             "value": f"{meditation_session.get('sacred_value', 0.5):.1%}",
                "description": "15초간 쏟은 정성의 깊이"
            },
           {"trait_type": "명상 테마",
      "value": meditation_session.get("theme", "일반"),
                "description": "명상 세션의 테마"
            },
           {"trait_type": "사용자 의도",
                "value": user_data.get("user_intention", "일반"),
                "description": "명상 시 담은 의도"
            },
           {"trait_type": "생체 신호",
               "value": "안정적" if persona_result["biometric_data"]["stress_level"] < 0.5 else "활동적",
                "description": "명상 시 생체 신호 상태"
            }
        ]
        
        base_nft_data["attributes"] = sacred_attributes
        
        return base_nft_data
    
    def _generate_sacred_insights(self, persona_result: Dict, 
                                meditation_session: Dict, user_data: Dict) -> Dict:
               신성한 인사이트 생성
       
        print(🧠 신성한 인사이트 생성...)
        
        insights = {
           "persona_insights": [
                {"title": f"{persona_result['persona_name']}의 특성",
                "description": persona_result["persona_description"],
                    "recommendations": self._generate_persona_recommendations(persona_result)
                }
            ],
         "meditation_insights": [
                  {"title": "15초의 정성 분석",
                    "description": f"당신의 {meditation_session['theme']} 명상 세션에 대한 분석",
                 "sacred_value": meditation_session.get("sacred_value", 0.5),
                  "quality_score": self._calculate_meditation_quality(meditation_session)
                }
            ],
            "wellness_insights": [
                    {"title": "웰니스 인사이트",
                    "description": "생체 신호 기반 건강 조언",
                 "recommendations": self._generate_wellness_recommendations(user_data)
                }
            ]
        }
        
        return insights
    
    def _generate_persona_recommendations(self, persona_result: Dict) -> List[str]:
               페르소나별 맞춤 추천사항 생성
       persona_code = persona_result["persona_code"]
        
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
        
        return recommendations_map.get(persona_code, 
            ["개인화된 추천을 위해 더 많은 데이터가 필요합니다."])    def _calculate_meditation_quality(self, meditation_session: Dict) -> float:
              명상 품질 점수 계산
              base_score = 0.7        
        # 정성 수준 반영
        sacred_value = meditation_session.get("sacred_value", 0.5)
        base_score += sacred_value * 0.2        
        # 생체 데이터 안정성 반영
        biometric_data = meditation_session.get("biometric_context", {})
        stress_level = biometric_data.get("stress_level", 0.5)
        if stress_level < 0.4:
            base_score += 0.1   
        return min(base_score, 1.0)
    def _generate_wellness_recommendations(self, user_data: Dict) -> List[str]:
               웰니스 추천사항 생성
      wearable_data = user_data.get("wearable_data", {})
        recommendations = []
        
        # 스트레스 관리
        stress_level = wearable_data.get("stress_level", 0.5)
        if stress_level > 0.6:
            recommendations.append("스트레스 수준이 높습니다. 깊은 호흡이나 명상을 통해 스트레스를 관리해보세요")
        
        # 수면 품질
        sleep_quality = wearable_data.get("sleep_quality", 0.5)
        if sleep_quality < 0.6:
            recommendations.append("수면 품질을 개선하기 위해 규칙적인 수면 시간을 유지하고 스크린 사용을 줄여보세요")
        
        # 에너지 관리
        energy_level = wearable_data.get("energy_level", 0.5)
        if energy_level < 0.4:
            recommendations.append("에너지 수준이 낮습니다. 적절한 운동과 영양 섭취를 통해 에너지를 증진해보세요")
        
        if not recommendations:
            recommendations.append("전반적으로 건강한 상태를 유지하고 있습니다. 현재의 웰빙 루틴을 계속 유지해보세요")
        
        return recommendations
    
    def get_mvp_status(self) -> Dict:
        
        MVP 구현 상태 반환
        
        return {
            "mvp_version": "1.0.0",
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

# 사용 예시
if __name__ == "__main__":
    # 시스템 초기화
    sacred_system = SacredPersonaMVP()
    
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
    
    # 완전한 신성한 경험 생성
    complete_experience = sacred_system.create_complete_sacred_experience(
      "user_123", user_data
    )
    
    print(🌟생성된 완전한 신성한 경험:)
    print(json.dumps(complete_experience, indent=2, ensure_ascii=False))
    
    # MVP 상태 확인
    mvp_status = sacred_system.get_mvp_status()
    print("\n📊 MVP 구현 상태:")
    print(json.dumps(mvp_status, indent=2, ensure_ascii=False)) 