import json
import time
from datetime import datetime
from typing import Dict, List, Optional

from sacred_meditation_system import SacredMeditationSystem
from user_participatory_nft import UserParticipatoryNFT
from knowledge_quality_classifier import KnowledgeQualityClassifier
from knowledge_graph_builder import KnowledgeGraphBuilder

class IntegratedSacredPersonaSystem:
     신성한 페르소나 시스템
    15초의 정성 개념을 기반으로 한 완전한 페르소나 다이어리 시스템
    """
     
    def __init__(self):
        print("🌟 통합 신성한 페르소나 시스템 초기화...")
        
        # 하위 시스템 초기화
        self.sacred_meditation = SacredMeditationSystem()
        self.participatory_nft = UserParticipatoryNFT()
        self.nft_generator = NFTPersonaGenerator()
        self.knowledge_classifier = KnowledgeQualityClassifier()
        self.knowledge_graph = KnowledgeGraphBuilder()
        
        # MVP 전략 설정 (사상체질/12체질 제외)
        self.mvp_config = {
            "enable_sasang_constitution": False,  # MVP에서는 비활성화
            "enable_12_constitution": False,      # MVP에서는 비활성화
            "focus_on_persona": True,             # 페르소나 중심
            "enable_sacred_meditation": True,     # 15초의 정성 활성화
            "enable_wearable_integration": True, # 웨어러블 통합
            "enable_nft_generation": True         # NFT 생성
        }
        
        print(✅ 통합 신성한 페르소나 시스템 준비 완료")
    
    def create_complete_sacred_experience(self, user_id: str, user_data: Dict) -> Dict:
       
        완전한 '15초의 정성' 경험 생성
               print(f🌟 {user_id}님을 위한 완전한 신성한 경험 생성...")
        
        #1단계: 페르소나 분석 (MVP - 기본 페르소나만)
        persona_result = self._analyze_basic_persona(user_data)
        
        # 2한 명상 세션 생성
        meditation_session = self.sacred_meditation.create_sacred_meditation_session(
            user_id=user_id,
            persona_code=persona_result["persona_code"],
            wearable_data=user_data.get("wearable_data", {}),
            user_intention=user_data.get("user_intention", "")
        )
        
        # 3단계: 사용자 참여형 NFT 메타데이터 생성
        nft_metadata = self._create_sacred_nft_metadata(
            persona_result, meditation_session, user_data
        )
        
        #4단계: 지식 그래프 기반 인사이트 생성
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
            "timestamp": datetime.now().isoformat()
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
            persona_code = "CALM" # 평온한
            persona_name = "The Calm Soul"
            persona_description = "평온하고 안정적인 마음 상태의 페르소나"
        elif hrv > 60 and heart_rate < 65:
            persona_code = "BALANCED" # 균형잡힌
            persona_name = "The Balanced Soul"
            persona_description = "균형잡힌 생체 신호를 보이는 페르소나"
        else:
            persona_code = "ADAPTIVE" # 적응하는
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
            {
                "trait_type": "페르소나",
                "value": persona_result["persona_name"],
                "description": "페르소나"
            },
            {
                "trait_type": "정성 수준",
                "value": f"{meditation_session.get('sacred_value', 0.5):.1%}",
                "description": "15초간 쏟은 정성의 깊이"
            },
            {
                "trait_type": "명상 테마",
                "value": meditation_session.get("theme", "일반"),
                "description": "명상 세션의 테마"
            },
            {
                "trait_type": "사용자 의도",
                "value": user_data.get("user_intention", "일반"),
                "description": "명상 시 담은 의도"
            },
            {
                "trait_type": "생체 신호",
                "value": "안정적" if persona_result["biometric_data"]["stress_level"] < 0.5 else "활동적",
                "description": "명상 시 생체 신호 상태"
            }
        ]
        
        base_nft_data["attributes"] = sacred_attributes
        
        # 사용자 참여 데이터 추가
        if user_data.get("user_reflection"):
            reflection_data = self.participatory_nft.collect_user_reflection(
                user_id=user_data.get("user_id"),
                reflection_text=user_data["user_reflection"],
                emotion_state=user_data.get("emotion_state", "중립")
            )
            
            participatory_metadata = self.participatory_nft.create_participatory_nft_metadata(
                base_nft_data, reflection_data, 
                user_data.get("wearable_data", {}), 
                user_data.get("external_data", {})
            )
            
            return participatory_metadata
        
        return base_nft_data
    
    def _generate_sacred_insights(self, persona_result: Dict, 
                                meditation_session: Dict, user_data: Dict) -> Dict:
        
        지식 그래프 기반 신성한 인사이트 생성
       
        print(🧠 신성한 인사이트 생성...")
        
        # 지식 그래프에서 관련 정보 검색
        knowledge_context = self.knowledge_graph.search_relevant_knowledge(
            persona_result["persona_code"],
            meditation_session["theme"],
            user_data.get("user_intention", "")
        )
        
        # 품질 분류된 인사이트 생성
        insights = {
            "persona_insights": [
                {
                    "title": f"{persona_result['persona_name']}의 특성",
                    "description": persona_result["persona_description"],
                    "recommendations": self._generate_persona_recommendations(persona_result)
                }
            ],
            "meditation_insights": [
                {
                    "title": "15초의 정성 분석",
                    "description": f"당신의 {meditation_session['theme']} 명상 세션에 대한 분석",
                    "sacred_value": meditation_session.get("sacred_value", 0.5),
                    "quality_score": self._calculate_meditation_quality(meditation_session)
                }
            ],
            "wellness_insights": [
                {
                    "title": "웰니스 인사이트",
                    "description": "생체 신호 기반 건강 조언",
                    "recommendations": self._generate_wellness_recommendations(user_data)
                }
            ],
            "knowledge_context": knowledge_context
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
            ["개인화된 추천을 위해 더 많은 데이터가 필요합니다."])
    
    def _calculate_meditation_quality(self, meditation_session: Dict) -> float:
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
    
    def process_user_feedback(self, user_id: str, session_id: str, 
                            feedback_data: Dict) -> Dict:
                사용자 피드백 처리 및 시스템 개선
               print(f💭 {user_id}님의 피드백 처리...")
        
        # 명상 피드백 처리
        meditation_feedback = self.sacred_meditation.collect_meditation_feedback(
            user_id, {"timestamp": session_id}, feedback_data
        )
        
        # 시스템 개선 데이터 수집
        improvement_data = {
            "user_id": user_id,
            "session_id": session_id,
            "meditation_feedback": meditation_feedback,
            "overall_satisfaction": feedback_data.get("satisfaction", 0),
            "feature_requests": feedback_data.get("feature_requests", []),
            "improvement_suggestions": feedback_data.get("suggestions", []),
            "timestamp": datetime.now().isoformat()
        }
        
        return improvement_data
    
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
                "12constitution": "MVP에서 제외 (Phase 2 예정)",
                "advanced_medical_analysis": "MVP에서 제외 (Phase 3)"
            },
            "next_phases": {
                "phase_2": "고급 의료 인사이트",
                "phase_3": "고급 의료 인사이트",
                "phase_4": "고급 의료 인사이트"
            }
        }

# 사용 예시
if __name__ == "__main__":
    # 시스템 초기화
    sacred_system = IntegratedSacredPersonaSystem()
    
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
    print("\n📊 MVP 구현 상태:)
    print(json.dumps(mvp_status, indent=2, ensure_ascii=False)) 