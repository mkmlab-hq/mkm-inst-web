import json
import time
from datetime import datetime
import hashlib

class UserParticipatoryNFT:
    def __init__(self):
        print("🎨 사용자 참여형 NFT 시스템 초기화...")
        
        # 명상형 카운트다운 설정
        self.meditation_prompts = [
            오늘 하루를 돌아보며 가장 기억에 남는 순간은 무엇인가요?,
            지금 이 순간, 당신의 마음은 어떤 상태인가요?,
            오늘 하루 동안 가장 감사했던 것은 무엇인가요?,
            내일의 나에게 전하고 싶은 메시지가 있나요?,
            지금 당신의 몸과 마음이 가장 필요로 하는 것은 무엇인가요?"
        ]
        
        # 감정 상태 키워드
        self.emotion_keywords = [
            "평온", "기쁨", "감사", "희망", "사랑", "열정성취",
            "피로", "스트레스", "걱정", "불안", "슬픔분노",
        ]
        
        print(✅ 사용자 참여형 NFT 시스템 준비 완료")
    
    def generate_meditation_experience(self, user_id, persona_code, wearable_data):
        print(f"🧘 명상형 경험 생성 시작 - {persona_code}")
        
        # 페르소나별 맞춤 프롬프트 선택
        persona_prompts = {
            "A1": "당신의 리더십과 비전을 생각하며...",
            "A2": "균형과 안정을 찾는 과정에서...",
            "A3": "깊은 사색과 내면의 탐구를 통해...",
            "C1": "활기찬 에너지와 창의성을 느끼며...",
            "C2": "따뜻한 마음과 공감의 순간을...",
            "C3": "열정과 도전의 의지를 확인하며...",
            "R1": "새로운 경험과 탐험의 기쁨을...",
            "R2": "성장과 변화의 순간을 느끼며...",
            "R3": "적응과 유연성의 힘을 확인하며...",
            "V1": "비전과 꿈을 향한 여정에서...",
            "V2": "깊이 있는 통찰과 지혜를...",
            "V3": "창의적 영감과 직관을 느끼며..."
        }
        
        base_prompt = persona_prompts.get(persona_code, "당신의 고유한 특성을 느끼며...")
        
        # 생체 데이터 기반 추가 프롬프트
        if wearable_data.get('stress_level', 0) > 0.7:
            base_prompt += "스트레스가 높은 상태에서 평온을 찾는 과정을..."
        elif wearable_data.get('energy_level', 0) > 0.8:
            base_prompt += "활력이 넘치는 상태에서 그 에너지를 활용하는 방법을..."
        elif wearable_data.get('sleep_quality', 0) < 0.5:
            base_prompt += "휴식과 회복이 필요한 상태에서..."   
        return {
            "meditation_prompt": base_prompt,
            "countdown_duration": 15,
            "user_id": user_id,
            "persona_code": persona_code,
            "timestamp": datetime.now().isoformat()
        }
    
    def collect_user_reflection(self, user_id, reflection_text, emotion_state):
        print(f"💭 사용자 소회 수집: {user_id}")
        
        # 감정 상태 분석
        detected_emotions = []
        for emotion in self.emotion_keywords:
            if emotion in reflection_text:
                detected_emotions.append(emotion)
        
        # 텍스트 길이 및 복잡성 분석
        text_length = len(reflection_text)
        complexity_score = min(text_length / 100, 10) # 10자 기준 정규화
        
        reflection_data = {
            "user_id": user_id,
            "reflection_text": reflection_text,
            "emotion_state": emotion_state,
            "detected_emotions": detected_emotions,
            "text_length": text_length,
            "complexity_score": complexity_score,
            "timestamp": datetime.now().isoformat()
        }
        
        return reflection_data
    
    def create_participatory_nft_metadata(self, nft_data, reflection_data, wearable_data, external_data):
        print("📝 참여형 NFT 메타데이터 생성...")
        
        # 기존 메타데이터 확장
        participatory_metadata = nft_data.copy()
        
        # 사용자 참여 섹션 추가
        participatory_metadata["user_participation"] = [
            {
                "text": reflection_data["reflection_text"],
                "emotion_state": reflection_data["emotion_state"],
                "detected_emotions": reflection_data["detected_emotions"],
                "complexity_score": reflection_data["complexity_score"]
            },
            {
                "meditation_experience": {
                    "duration": 5,
                    "persona_alignment": True,
                    "biometric_sync": True
                }
            }
        ]
        
        # 개인적 스토리 생성
        participatory_metadata["personal_story"] = self.generate_personal_story(
            reflection_data, wearable_data, external_data
        )
        
        # 스토리텔링 강화
        participatory_metadata["story"] = self.create_enhanced_story(
            nft_data, reflection_data, wearable_data, external_data
        )
        
        # 문화적 맥락 추가
        participatory_metadata["cultural_context"] = self.add_cultural_context(
            external_data, reflection_data
        )
        
        return participatory_metadata
    
    def generate_personal_story(self, reflection_data, wearable_data, external_data):
        story_elements = []
        
        # 감정 기반 스토리 요소
        emotions = reflection_data["detected_emotions"]
        if emotions:
            primary_emotion = emotions[0]
            story_elements.append(f"오늘 당신의 마음은 '{primary_emotion}'의 상태였습니다.")
        
        # 생체 데이터 기반 스토리 요소
        if wearable_data.get('stress_level', 0) > 0.7:
            story_elements.append("스트레스가 높은 상태에서도 당신은 내면의 평온을 찾으려 노력했습니다.")
        elif wearable_data.get('energy_level', 0) > 0.8:
            story_elements.append("활력이 넘치는 하루를 보내며 새로운 가능성을 발견했습니다.")
        
        # 외부 환경 기반 스토리 요소
        weather = external_data.get('weather', {}).get('description', '')
        if weather:
            story_elements.append(f"{weather} 날씨가 당신의 하루에 특별한 의미를 더했습니다.")
        
        # 사용자 소회 기반 스토리 요소
        reflection = reflection_data["reflection_text"]
        if len(reflection) > 10:
            story_elements.append("당신의 소회는 깊이 있는 성찰을 보여줍니다.")
        
        return " ".join(story_elements)
    
    def create_enhanced_story(self, nft_data, reflection_data, wearable_data, external_data):
        base_story = nft_data.get("description", "")
        
        # 사용자 참여 요소 추가
        user_story = f"""
당신의 페르소나 다이어리 NFT가 완성되었습니다.

🎭 페르소나: {nft_data.get('name', 'Unknown')}
�� 당신의 소회:{reflection_data['reflection_text'][:10]}...
❤️ 감정 상태: {', '.join(reflection_data['detected_emotions'][:3])}
📊 생체 신호: 심박수 {wearable_data.get('heart_rate', 0)} bpm, 스트레스 {wearable_data.get('stress_level', 0):.2f}
🌍 환경: {external_data.get('weather', {}).get('description', '알 수 없음')}

이 NFT는 당신만의 고유한 순간을 담고 있습니다.
"""   
        return user_story
    
    def add_cultural_context(self, external_data, reflection_data):
        cultural_context = {
            "season": self.get_current_season(),
            "time_of_day": self.get_time_of_day(),
            "cultural_significance": {}
        }
        
        # 계절별 문화적 의미
        season = cultural_context["season"]
        season_meanings = {
            "spring": "새로운 시작과 성장의 계절",
            "summer": "활력과 열정이 넘치는 계절",
            "autumn": "수확과 성찰의 계절",
            "winter": "휴식과 내면 탐구의 계절"
        }
        cultural_context["cultural_significance"][season] = season_meanings.get(season, "")
        
        # 시간대별 의미
        time_of_day = cultural_context["time_of_day"]
        time_meanings = {
            "morning": "새로운 하루의 시작",
            "afternoon": "활동과 성취의 시간",
            "evening": "하루를 마무리하는 시간",
            "night": "내면과의 대화 시간"
        }
        cultural_context["cultural_significance"]["time"] = time_meanings.get(time_of_day, "")
        
        return cultural_context
    
    def get_current_season(self):
        month = datetime.now().month
        if month in [3, 4]:
            return "spring"
        elif month in [6, 7]:
            return "summer"
        elif month in [9, 10, 11]:
            return "autumn"
        else:
            return "winter" 
    def get_time_of_day(self):
        hour = datetime.now().hour
        if 5 <= hour < 12:
            return "morning"
        elif 12 < hour < 17:
            return "afternoon"
        elif 17 < hour < 21:
            return "evening"
        else:
            return "night"
    
    def save_participatory_nft(self, participatory_metadata, user_id):
        filename = f"participatory_nfts/user_{user_id}_participatory_nft.json"        
        # 디렉토리 생성
        import os
        os.makedirs("participatory_nfts", exist_ok=True)
        
        # 저장
        with open(filename, 'w', encoding="utf-8") as f:
            json.dump(participatory_metadata, f, ensure_ascii=False, indent=2)
        
        print(f"💾 참여형 NFT 저장 완료: {filename}")
        return filename

# 사용 예시
if __name__ == "__main__":
    participatory_nft = UserParticipatoryNFT()
    
    # 테스트 데이터
    user_id = "user_12345"
    persona_code = "A3"
    wearable_data = {
        "heart_rate": 75,
        "stress_level": 0.3,
        "sleep_quality": 0.8,
        "energy_level": 0.7
    }
    external_data = {
        "weather": {"description": "맑음"},
        "temperature": 22
    }
    
    # 명상형 경험 생성
    meditation_exp = participatory_nft.generate_meditation_experience(
        user_id, persona_code, wearable_data
    )
    print(f"명상 프롬프트: {meditation_exp['meditation_prompt']}")
    
    # 사용자 소회 수집 (시뮬레이션)
    reflection_text = "오늘은 정말 평온한 하루였어요. 새로운 아이디어가 떠올라서 기분이 좋았습니다."
    emotion_state = ["평온", "기쁨", "희망"]
    
    reflection_data = participatory_nft.collect_user_reflection(
        user_id, reflection_text, emotion_state
    )
    print(f"감지된 감정: {reflection_data['detected_emotions']}")
    
    # 기존 NFT 데이터 (시뮬레이션)
    nft_data = {
        "name": "Persona Diary NFT - A3",
        "description": "당신만의 고유한 페르소나 다이어리 NFT입니다."
    }
    
    # 참여형 NFT 메타데이터 생성
    participatory_metadata = participatory_nft.create_participatory_nft_metadata(
        nft_data, reflection_data, wearable_data, external_data
    )
    
    print("\n=== 참여형 NFT 메타데이터 ===")
    print(f"개인적 스토리: {participatory_metadata['user_participation'][0]['personal_story']}")
    print(f"문화적맥락: {participatory_metadata['cultural_context']['cultural_significance']}")
    
    # 저장
    participatory_nft.save_participatory_nft(participatory_metadata, user_id) 