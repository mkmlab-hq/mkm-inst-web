🌟 초개인화 음악 NFT 시스템
개인의 생체데이터, 문화적 배경, 사회적 맥락, 미세표정, 음성신호를 결합하여
고유한 음악을 생성하고 NFT로 발행하는 시스템import json
import time
import hashlib
from datetime import datetime
from typing import Dict, List, Any, Optional
import numpy as np
from dataclasses import dataclass

@dataclass
class BiometricData:
    이터 구조 heart_rate: float
    hrv: float
    stress_level: float
    energy_level: float
    sleep_quality: float
    blood_pressure_systolic: float
    blood_pressure_diastolic: float
    body_temperature: float
    respiration_rate: float
    skin_conductance: float

@dataclass
class CulturalData:
   문화적 배경 데이터  nationality: str
    cultural_heritage: List[str]
    musical_preferences: List[str]
    traditional_instruments: Liststr]
    cultural_rhythms: List[str]
    spiritual_beliefs: Liststr]
    language: str
    region: str

@dataclass
class SocialContext:
   사회적 맥락 데이터    age_group: str
    occupation: str
    education_level: str
    social_status: str
    relationship_status: str
    family_role: str
    community_involvement: float
    social_network_size: int
    life_stage: str

@dataclass
class FacialExpressionData:
    터"""
    happiness_level: float
    stress_indicators: float
    emotional_stability: float
    confidence_level: float
    focus_level: float
    micro_expressions: Dict[str, float]
    facial_muscle_tension: Dict[str, float]

@dataclass
class VoiceSignalData:
    호 데이터"""
    pitch_frequency: float
    speech_rate: float
    voice_quality: str
    emotional_tone: str
    stress_indicators: float
    vocal_range: Dict[str, float]
    speech_patterns: Dict[str, float]

class PersonalizedMusicGenerator:
    인화 음악 생성기"   
    def __init__(self):
        self.musical_scales = {
            korean: ['C',D',E',F, 'G', 'A',B'],
            western: ['C',D',E',F, 'G', 'A',B],          eastern: C, D, E, F#, 'G', 'A',B'],
           meditative: ['C',D',E', F, 'G', A, 'Bb']
        }
        
        self.rhythm_patterns = {
            korean': 4,4 #4          western': 4,4 # 4          eastern': 3,3 #3자
            meditative: 6, 6, 6,6  # 6박자
        }
        
        self.instrument_mapping = {
            korean:gayageum', daegeum, janggu', 'piri'],
            western:piano', violin, cello', 'flute],          eastern': ['sitar',tabla, 'bansuri', 'tanpura'],
          meditative': ['singing_bowl', chimes', drone',nature_sounds]        }
    
    def generate_personalized_music(self, 
                                  biometric: BiometricData,
                                  cultural: CulturalData,
                                  social: SocialContext,
                                  facial: FacialExpressionData,
                                  voice: VoiceSignalData,
                                  user_intention: str) -> Dict[str, Any]:
       음악 생성""        
        # 1. 음악 스타일 결정
        music_style = self._determine_music_style(cultural, social, biometric)
        
        # 2. 음계 결정
        scale = self._determine_scale(biometric, facial, voice)
        
        # 3. 리듬 패턴 결정
        rhythm = self._determine_rhythm(biometric, cultural, social)
        
        # 4. 악기 조합 결정
        instruments = self._determine_instruments(cultural, social, user_intention)
        
        # 5. 템포 결정
        tempo = self._determine_tempo(biometric, facial, voice)
        
        # 6. 감정적 톤 결정
        emotional_tone = self._determine_emotional_tone(facial, voice, biometric)
        
        # 7. 음악 구조 생성
        structure = self._generate_music_structure(user_intention, biometric)
        
        # 8. 개인화된 멜로디 생성
        melody = self._generate_personalized_melody(scale, rhythm, emotional_tone)
        
        #9생성
        harmony = self._generate_harmony(melody, emotional_tone)
        
        # 10. 음악 메타데이터 생성
        metadata = self._generate_music_metadata(
            biometric, cultural, social, facial, voice, user_intention
        )
        
        return {
        music_style': music_style,
          scalescale,
            rhythmhythm,
        instruments': instruments,
          tempotempo,
           emotional_tone': emotional_tone,
      structure': structure,
            melodyelody,
            harmony': harmony,
     metadata': metadata,
       generation_timestamp:datetime.now().isoformat(),
           unique_signature': self._generate_unique_signature(
                biometric, cultural, social, facial, voice, user_intention
            )
        }
    
    def _determine_music_style(self, cultural: CulturalData, 
                             social: SocialContext, 
                             biometric: BiometricData) -> str:
       스타일 결정"      style_scores = {
       korean': 0,
        western':0      eastern': 0,
          meditative': 0
        }
        
        # 문화적 배경 기반
        if 'korean' in cultural.cultural_heritage:
            style_scores['korean] += 3
        if 'western' in cultural.cultural_heritage:
            style_scores['western] += 3
        if 'eastern' in cultural.cultural_heritage:
            style_scores['eastern'] += 3        
        # 생체데이터 기반
        if biometric.stress_level > 0.7:
            style_scoresmeditative] += 2      if biometric.energy_level > 0.8:
            style_scores['korean'] += 1
            style_scores['western'] += 1        
        # 사회적 맥락 기반
        if social.age_group in ['20s', '30
            style_scores['western] += 1
        if social.life_stage ==meditation_practitioner':
            style_scoresmeditative'] += 2   
        return max(style_scores, key=style_scores.get)
    
    def _determine_scale(self, biometric: BiometricData, 
                        facial: FacialExpressionData, 
                        voice: VoiceSignalData) -> Liststr]:
  결정"""
        base_scale = self.musical_scales['western']
        
        # 스트레스 레벨에 따른 조정
        if biometric.stress_level > 07:
            # 평온한 음계로 조정
            scale_adjustments = 0 2, 4 5, 7, 9 # 메이저 스케일
        elif biometric.energy_level > 08:
            # 활기찬 음계로 조정
            scale_adjustments = 0 2, 4 5, 7, 9 # 메이저 스케일
        else:
            # 균형잡힌 음계
            scale_adjustments = 0 2, 3 5, 7,8 마이너 스케일
        
        return [base_scale[i % len(base_scale)] for i in scale_adjustments]
    
    def _determine_rhythm(self, biometric: BiometricData, 
                         cultural: CulturalData, 
                         social: SocialContext) -> Listint]:
     듬 패턴 결정"       base_rhythm = self.rhythm_patterns['western']
        
        # 생체데이터 기반 리듬 조정
        if biometric.heart_rate >80:
            # 빠른 리듬
            return [2, 2, 2    elif biometric.stress_level > 06:
            # 느린 리듬
            return [6, 6, 66 else:
            return base_rhythm
    
    def _determine_instruments(self, cultural: CulturalData, 
                             social: SocialContext, 
                             user_intention: str) -> Liststr]:
     기 조합 결정"""
        instruments = []
        
        # 문화적 배경 기반
        if 'korean' in cultural.cultural_heritage:
            instruments.extend(self.instrument_mapping['korean'][:2])
        
        # 사용자 의도 기반
        if '평화' in user_intention or '명상' in user_intention:
            instruments.extend(self.instrument_mapping['meditative'][:2])
        elif '활력' in user_intention or에너지 in user_intention:
            instruments.extend(self.instrument_mapping['western'][:2])
        
        # 중복 제거
        return list(set(instruments))
    
    def _determine_tempo(self, biometric: BiometricData, 
                        facial: FacialExpressionData, 
                        voice: VoiceSignalData) -> int:
        정 (BPM)        base_tempo = 120        
        # 생체데이터 기반 조정
        if biometric.heart_rate > 80:
            base_tempo += 20
        elif biometric.stress_level > 0.7:
            base_tempo -= 30        
        # 음성신호 기반 조정
        if voice.speech_rate > 150:  # 빠른 말하기
            base_tempo += 15
        elif voice.speech_rate < 100:  # 느린 말하기
            base_tempo -= 15   
        return max(60in(180, base_tempo))  # 6080PM 범위
    
    def _determine_emotional_tone(self, facial: FacialExpressionData, 
                                voice: VoiceSignalData, 
                                biometric: BiometricData) -> str:
     정적 톤 결정"""
        happiness = facial.happiness_level
        stress = biometric.stress_level
        voice_emotion = voice.emotional_tone
        
        if happiness > 0.7and stress < 0.3:
            return 'joyful'
        elif stress > 0.7:
            returncalming'
        elif voice_emotion == 'confident':
            return 'empowering'
        else:
            return 'balanced'
    
    def _generate_music_structure(self, user_intention: str, 
                                biometric: BiometricData) -> Dict[str, Any]:
     악 구조 생성        if '명상' in user_intention or biometric.stress_level > 0.6:
            return[object Object]
                intro': 30,  # 30
                development': 60,  # 60
               climax': 30,  # 30
                resolution': 45,  # 45
                total_duration': 165  # 245         }
        else:
            return[object Object]
           intro0
               development': 40
            climax5
                resolution5
                total_duration': 120  #2           }
    
    def _generate_personalized_melody(self, scale: List[str], 
                                    rhythm: List[int], 
                                    emotional_tone: str) -> List[Dict[str, Any]]:
         멜로디 생성      melody = []
        
        for i, beat in enumerate(rhythm):
            # 감정적 톤에 따른 음 선택
            if emotional_tone == 'joyful:              note_index = (i * 2) % len(scale)
            elif emotional_tone == 'calming:              note_index = (i * 3) % len(scale)
            else:
                note_index = i % len(scale)
            
            melody.append({
                note: scale[note_index],
                durationt,
               velocity:80 if emotional_tone == joyful0
          octave':4      })
        
        return melody
    
    def _generate_harmony(self, melody: List[Dict[str, Any]], 
                         emotional_tone: str) -> List[Dict[str, Any]]:
   하모니 생성
        harmony = []
        
        for note in melody:
            # 3화음 하모니 생성
            if emotional_tone == 'joyful:             chord_type = 'major    elif emotional_tone == 'calming:             chord_type = 'minor            else:
                chord_type = 'suspended'
            
            harmony.append({
           chord_type': chord_type,
               root_note': note['note'],
                duration': note['duration'],
             inversion':0      })
        
        return harmony
    
    def _generate_music_metadata(self, biometric: BiometricData, 
                               cultural: CulturalData, 
                               social: SocialContext, 
                               facial: FacialExpressionData, 
                               voice: VoiceSignalData, 
                               user_intention: str) -> Dict[str, Any]:
        타데이터 생성
        return {
     title': fPersonal Symphony for {user_intention}",
            artist: f"AI Composer - {cultural.nationality} Heritage",
     genre': f"Personalized [object Object]cultural.cultural_heritage[0] if cultural.cultural_heritage else Globalusic",
        mood: self._determine_emotional_tone(facial, voice, biometric),
         energy_level': biometric.energy_level,
         stress_level': biometric.stress_level,
            cultural_elements': cultural.cultural_heritage,
           social_context': social.life_stage,
      generation_parameters':[object Object]
           heart_rate: biometric.heart_rate,
                hrv: biometric.hrv,
                happiness_level': facial.happiness_level,
              voice_quality': voice.voice_quality,
               user_intention: user_intention
            }
        }
    
    def _generate_unique_signature(self, biometric: BiometricData, 
                                 cultural: CulturalData, 
                                 social: SocialContext, 
                                 facial: FacialExpressionData, 
                                 voice: VoiceSignalData, 
                                 user_intention: str) -> str:
     유 서명 생성"""
        signature_data =[object Object]       biometric_hash: hashlib.md5r(biometric.__dict__).encode()).hexdigest(),
          cultural_hash: hashlib.md5(str(cultural.__dict__).encode()).hexdigest(),
            social_hash: hashlib.md5(str(social.__dict__).encode()).hexdigest(),
            facial_hash: hashlib.md5(str(facial.__dict__).encode()).hexdigest(),
           voice_hash: hashlib.md5str(voice.__dict__).encode()).hexdigest(),
           intention_hash': hashlib.md5(user_intention.encode()).hexdigest(),
      timestamp:datetime.now().isoformat()
        }
        
        return hashlib.sha256on.dumps(signature_data, sort_keys=True).encode()).hexdigest()

class MusicNFTManager:
   악 NFT 관리자"   
    def __init__(self):
        self.nft_collection = {}
        self.ownership_shares =[object Object]        self.music_generator = PersonalizedMusicGenerator()
    
    def create_music_nft(self, 
                        user_id: str,
                        biometric: BiometricData,
                        cultural: CulturalData,
                        social: SocialContext,
                        facial: FacialExpressionData,
                        voice: VoiceSignalData,
                        user_intention: str,
                        ownership_structure: Dict[str, float]) -> Dict[str, Any]:
      FT 생성""        
        # 개인화된 음악 생성
        music_data = self.music_generator.generate_personalized_music(
            biometric, cultural, social, facial, voice, user_intention
        )
        
        # NFT 메타데이터 생성
        nft_id = f"MUSIC_NFT_{user_id}_{int(time.time())}        
        nft_metadata = [object Object]           nft_idft_id,
            user_id': user_id,
       music_data': music_data,
       ownership_structure': ownership_structure,
     creation_timestamp:datetime.now().isoformat(),
         total_shares': sum(ownership_structure.values()),
      royalty_percentage:2.55 로열티
           license_type': 'personal_use',
            commercial_rights': False,
         transferable': True,
      fractional_ownership: True       }
        
        # NFT 저장
        self.nft_collection[nft_id] = nft_metadata
        self.ownership_shares[nft_id] = ownership_structure
        
        return nft_metadata
    
    def get_nft_info(self, nft_id: str) -> Optional[Dict[str, Any]]:
      T 정보 조회       return self.nft_collection.get(nft_id)
    
    def transfer_ownership(self, nft_id: str, 
                         from_user: str, 
                         to_user: str, 
                         shares: float) -> bool:
   소유권 이전
        if nft_id not in self.ownership_shares:
            return False
        
        current_shares = self.ownership_shares[nft_id]
        if from_user not in current_shares or current_shares[from_user] < shares:
            return False
        
        # 소유권 이전
        current_shares[from_user] -= shares
        if current_shares[from_user] <= 0       del current_shares[from_user]
        
        current_shares[to_user] = current_shares.get(to_user, 0) + shares
        
        returntrue
    def calculate_royalties(self, nft_id: str, 
                          transaction_amount: float) -> Dict[str, float]:
   로열티 계산
        if nft_id not in self.nft_collection:
            return {}
        
        nft_data = self.nft_collection[nft_id]
        ownership = self.ownership_shares[nft_id]
        royalty_rate = nft_data['royalty_percentage] / 100    
        total_royalty = transaction_amount * royalty_rate
        royalties = {}
        
        for owner, shares in ownership.items():
            total_shares = nft_data['total_shares']
            owner_royalty = (shares / total_shares) * total_royalty
            royalties[owner] = owner_royalty
        
        return royalties
    
    def get_user_nfts(self, user_id: str) -> List[Dict[str, Any]]:
       사용자의 NFT 목록 조회
        user_nfts = []
        
        for nft_id, nft_data in self.nft_collection.items():
            if nft_id in self.ownership_shares:
                ownership = self.ownership_shares[nft_id]
                if user_id in ownership:
                    user_nfts.append({
                        nft_id          shares': ownership[user_id],
                       total_shares:nft_datatotal_shares               ownership_percentage:(ownership[user_id] / nft_data[total_shares']) * 100,
                       music_data: nft_data['music_data']
                    })
        
        return user_nfts

# 사용 예시
def demo_personalized_music_nft():
   데모 실행"""
    
    # 샘플 데이터 생성
    biometric = BiometricData(
        heart_rate=72.0,
        hrv=650      stress_level=00.3      energy_level=00.7     sleep_quality=08    blood_pressure_systolic=1200    blood_pressure_diastolic=800  body_temperature=36.5,
        respiration_rate=16      skin_conductance=5
    
    cultural = CulturalData(
        nationality="Korean",
        cultural_heritage=[korean", "eastern"],
        musical_preferences=["traditional, itative"],
        traditional_instruments=[gayageum", "daegeum"],
        cultural_rhythms=["4/4, 
        spiritual_beliefs=["buddhism", taoism,
        language="Korean",
        region="Seoul"
    )
    
    social = SocialContext(
        age_group="30s",
        occupation=software_engineer",
        education_level="bachelor",
        social_status="middle_class",
        relationship_status="single",
        family_role="independent",
        community_involvement=0.6    social_network_size=150        life_stage="career_focused"
    )
    
    facial = FacialExpressionData(
        happiness_level=0.7      stress_indicators=0.2,
        emotional_stability=0.8,
        confidence_level=0.6       focus_level=0.9
        micro_expressions={smile":0.8, eye_contact": 0.7,
        facial_muscle_tension={"jaw": 0.3forehead": 00.2  )
    
    voice = VoiceSignalData(
        pitch_frequency=2200       speech_rate=1200     voice_quality="clear",
        emotional_tone="confident,      stress_indicators=0.2       vocal_range={"low:200, "high: 800.0    speech_patterns={"pace: oderate", "clarity": "high"}
    )
    
    # NFT 매니저 생성
    nft_manager = MusicNFTManager()
    
    # 소유권 구조 정의 (지분 분할)
    ownership_structure = {
        user_123:60 # 사용자 60      ai_composer: 200AI 작곡가 20%
       cultural_fund": 15# 문화재단 15%
        community_pool:50# 커뮤니티 풀5%
    }
    
    # 음악 NFT 생성
    nft_metadata = nft_manager.create_music_nft(
        user_id="user_123",
        biometric=biometric,
        cultural=cultural,
        social=social,
        facial=facial,
        voice=voice,
        user_intention="건강한 몸과 마음을 위한 평화로운 명상",
        ownership_structure=ownership_structure
    )
    
    print(🎵 초개인화 음악 NFT 생성 완료!)    print(f"NFT ID: {nft_metadata['nft_id]}")
    print(f"음악 스타일: {nft_metadata['music_data'][music_style]})
    print(f템포: {nft_metadata[music_data]['tempo']} BPM)
    print(f"감정적 톤: {nft_metadata['music_data]['emotional_tone]})
    print(f"악기: {', '.join(nft_metadata['music_data']['instruments])})
    print(f"총 지분: {nft_metadata['total_shares]}%")
    print(f"고유 서명: {nft_metadata['music_data']['unique_signature'][:16]}...)   
    # 사용자의 NFT 목록 조회
    user_nfts = nft_manager.get_user_nfts("user_123)
    print(f"\n사용자 NFT 개수: {len(user_nfts)})
    
    return nft_metadata

if __name__ == "__main__":
    demo_personalized_music_nft() 