# Personalized Music NFT System
# Combines biometric data, cultural background, social context, facial expressions, and voice signals
# to generate unique music and issue as NFT with fractional ownership

import json
import time
import hashlib
from datetime import datetime
from typing import Dict, List, Any, Optional
import numpy as np
from dataclasses import dataclass

@dataclass
class BiometricData:
   ric data structure heart_rate: float
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
    """Cultural background data"  nationality: str
    cultural_heritage: List[str]
    musical_preferences: List[str]
    traditional_instruments: Liststr]
    cultural_rhythms: List[str]
    spiritual_beliefs: Liststr]
    language: str
    region: str

@dataclass
class SocialContext:
   ocial context data    age_group: str
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
    ""Facial expression data"""
    happiness_level: float
    stress_indicators: float
    emotional_stability: float
    confidence_level: float
    focus_level: float
    micro_expressions: Dict[str, float]
    facial_muscle_tension: Dict[str, float]

@dataclass
class VoiceSignalData:
 Voice signal data"""
    pitch_frequency: float
    speech_rate: float
    voice_quality: str
    emotional_tone: str
    stress_indicators: float
    vocal_range: Dict[str, float]
    speech_patterns: Dict[str, float]

class PersonalizedMusicGenerator:
 Personalized music generator"   
    def __init__(self):
        self.musical_scales = {
            korean: ['C',D',E',F, 'G', 'A',B'],
            western: ['C',D',E',F, 'G', 'A',B],          eastern: C, D, E, F#, 'G', 'A',B'],
           meditative: ['C',D',E', F, 'G', A, 'Bb']
        }
        
        self.rhythm_patterns = {
            korean': 4, 4, 4, 4],  # 4/4time
            western': 4, 4, 4, 4],  # 4/4time
            eastern': 3, 3, 3, 3],  # 3/4time
            meditative: 6 6# 6/8 time
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
 erate personalized music""        
        # 1ermine music style
        music_style = self._determine_music_style(cultural, social, biometric)
        
        # 2. Determine scale
        scale = self._determine_scale(biometric, facial, voice)
        
        # 3. Determine rhythm pattern
        rhythm = self._determine_rhythm(biometric, cultural, social)
        
        # 4. Determine instrument combination
        instruments = self._determine_instruments(cultural, social, user_intention)
        
        # 5. Determine tempo
        tempo = self._determine_tempo(biometric, facial, voice)
        
        # 6. Determine emotional tone
        emotional_tone = self._determine_emotional_tone(facial, voice, biometric)
        
        #7te music structure
        structure = self._generate_music_structure(user_intention, biometric)
        
        # 8. Generate personalized melody
        melody = self._generate_personalized_melody(scale, rhythm, emotional_tone)
        
        # 9. Generate harmony
        harmony = self._generate_harmony(melody, emotional_tone)
        
        # 10ate music metadata
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
        ermine music style"      style_scores = {
       korean': 0,
        western':0      eastern': 0,
          meditative': 0
        }
        
        # Cultural background based
        if 'korean' in cultural.cultural_heritage:
            style_scores['korean] += 3
        if 'western' in cultural.cultural_heritage:
            style_scores['western] += 3
        if 'eastern' in cultural.cultural_heritage:
            style_scores['eastern'] += 3        
        # Biometric data based
        if biometric.stress_level > 0.7:
            style_scoresmeditative] += 2      if biometric.energy_level > 0.8:
            style_scores['korean'] += 1
            style_scores['western'] += 1        
        # Social context based
        if social.age_group in ['20s', '30
            style_scores['western] += 1
        if social.life_stage ==meditation_practitioner':
            style_scoresmeditative'] += 2   
        return max(style_scores, key=style_scores.get)
    
    def _determine_scale(self, biometric: BiometricData, 
                        facial: FacialExpressionData, 
                        voice: VoiceSignalData) -> List[str]:
  Determine musical scale"""
        base_scale = self.musical_scales['western']
        
        # Adjust based on stress level
        if biometric.stress_level > 0.7
            # Calm scale adjustment
            scale_adjustments = 025 9ajor scale
        elif biometric.energy_level > 08            # Energetic scale adjustment
            scale_adjustments = 025 9ajor scale
        else:
            # Balanced scale
            scale_adjustments = 0258or scale
        
        return [base_scale[i % len(base_scale)] for i in scale_adjustments]
    
    def _determine_rhythm(self, biometric: BiometricData, 
                         cultural: CulturalData, 
                         social: SocialContext) -> List[int]:
  ine rhythm pattern"       base_rhythm = self.rhythm_patterns['western']
        
        # Adjust based on biometric data
        if biometric.heart_rate >80            # Fast rhythm
            return [2, 2, 2    elif biometric.stress_level > 0.6            # Slow rhythm
            return [6, 6, 66 else:
            return base_rhythm
    
    def _determine_instruments(self, cultural: CulturalData, 
                             social: SocialContext, 
                             user_intention: str) -> List[str]:
  termine instrument combination"""
        instruments = []
        
        # Cultural background based
        if 'korean' in cultural.cultural_heritage:
            instruments.extend(self.instrument_mapping['korean'][:2])
        
        # User intention based
        if 'peace' in user_intention or 'meditation' in user_intention:
            instruments.extend(self.instrument_mapping['meditative'][:2      elif 'energy' in user_intention or vitality' in user_intention:
            instruments.extend(self.instrument_mapping['western'][:2])
        
        # Remove duplicates
        return list(set(instruments))
    
    def _determine_tempo(self, biometric: BiometricData, 
                        facial: FacialExpressionData, 
                        voice: VoiceSignalData) -> int:
        Determine tempo (BPM)        base_tempo = 120        
        # Adjust based on biometric data
        if biometric.heart_rate > 80:
            base_tempo += 20
        elif biometric.stress_level > 0.7:
            base_tempo -= 30        
        # Adjust based on voice signals
        if voice.speech_rate > 150:  # Fast speaking
            base_tempo += 15
        elif voice.speech_rate < 100:  # Slow speaking
            base_tempo -= 15   
        return max(60in(180, base_tempo))  # 60-180BPM range
    
    def _determine_emotional_tone(self, facial: FacialExpressionData, 
                                voice: VoiceSignalData, 
                                biometric: BiometricData) -> str:
  etermine emotional tone"""
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
       te music structure"    if 'meditation' in user_intention or biometric.stress_level > 0.6:
            return[object Object]
                intro 30ds
                development': 60ds
               climax': 30ds
                resolution': 45ds
                total_duration': 165  # 2:45
            }
        else:
            return[object Object]
           intro0
               development': 40
            climax5
                resolution5
                total_duration': 120  # 2:00
            }
    
    def _generate_personalized_melody(self, scale: List[str], 
                                    rhythm: List[int], 
                                    emotional_tone: str) -> List[Dict[str, Any]]:
 erate personalized melody      melody = []
        
        for i, beat in enumerate(rhythm):
            # Select notes based on emotional tone
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
 nerate harmony"
        harmony = []
        
        for note in melody:
            # Generate 3-note harmony
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
       ate music metadata
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
        e unique signature"""
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
    ""Music NFT manager"   
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
     eate music NFT""        
        # Generate personalized music
        music_data = self.music_generator.generate_personalized_music(
            biometric, cultural, social, facial, voice, user_intention
        )
        
        # Generate NFT metadata
        nft_id = f"MUSIC_NFT_{user_id}_{int(time.time())}"
        nft_metadata = [object Object]           nft_idft_id,
            user_id': user_id,
       music_data': music_data,
       ownership_structure': ownership_structure,
     creation_timestamp:datetime.now().isoformat(),
         total_shares': sum(ownership_structure.values()),
      royalty_percentage': 2.5,  # 2.5% royalty
           license_type': 'personal_use',
            commercial_rights': False,
         transferable': True,
      fractional_ownership: True       }
        
        # Store NFT
        self.nft_collection[nft_id] = nft_metadata
        self.ownership_shares[nft_id] = ownership_structure
        
        return nft_metadata
    
    def get_nft_info(self, nft_id: str) -> Optional[Dict[str, Any]]:
     FT info       return self.nft_collection.get(nft_id)
    
    def transfer_ownership(self, nft_id: str, 
                         from_user: str, 
                         to_user: str, 
                         shares: float) -> bool:
 Transfer ownership
        if nft_id not in self.ownership_shares:
            return False
        
        current_shares = self.ownership_shares[nft_id]
        if from_user not in current_shares or current_shares[from_user] < shares:
            return False
        
        # Transfer ownership
        current_shares[from_user] -= shares
        if current_shares[from_user] <= 0       del current_shares[from_user]
        
        current_shares[to_user] = current_shares.get(to_user, 0) + shares
        
        returntrue
    def calculate_royalties(self, nft_id: str, 
                          transaction_amount: float) -> Dict[str, float]:
  alculate royalties
        if nft_id not in self.nft_collection:
            return {}
        
        nft_data = self.nft_collection[nft_id]
        ownership = self.ownership_shares[nft_id]
        royalty_rate = nft_data['royalty_percentage'] / 100
        total_royalty = transaction_amount * royalty_rate
        royalties = {}
        
        for owner, shares in ownership.items():
            total_shares = nft_data['total_shares']
            owner_royalty = (shares / total_shares) * total_royalty
            royalties[owner] = owner_royalty
        
        return royalties
    
    def get_user_nfts(self, user_id: str) -> List[Dict[str, Any]]:
       et user's NFT list
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

def demo_personalized_music_nft():
   Demo execution"""
    
    # Create sample data
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
    
    # Create NFT manager
    nft_manager = MusicNFTManager()
    
    # Define ownership structure (fractional ownership)
    ownership_structure = {
        user_123: 60# User 60      ai_composer': 20.0  # AI composer 20%
       cultural_fund':15ultural foundation 15%
        community_pool': 5.0  # Community pool5%
    }
    
    # Create music NFT
    nft_metadata = nft_manager.create_music_nft(
        user_id="user_123",
        biometric=biometric,
        cultural=cultural,
        social=social,
        facial=facial,
        voice=voice,
        user_intention="Peaceful meditation for healthy body and mind",
        ownership_structure=ownership_structure
    )
    
    print("🎵 Personalized Music NFT Created Successfully!)    print(f"NFT ID: {nft_metadata['nft_id]}")
    print(fMusic Style: {nft_metadata['music_data'][music_style]}")
    print(f"Tempo: {nft_metadata[music_data]['tempo']} BPM")
    print(fEmotional Tone: {nft_metadata['music_data]['emotional_tone']}")
    print(f"Instruments: {', '.join(nft_metadata['music_data']['instruments])}")
    print(f"Total Shares: {nft_metadata['total_shares]}%")
    print(fUnique Signature: {nft_metadata['music_data']['unique_signature'][:16]}...")
    
    # Get user's NFT list
    user_nfts = nft_manager.get_user_nfts("user_123    print(fundefinednUser NFT Count: {len(user_nfts)})
    
    return nft_metadata

if __name__ == "__main__":
    demo_personalized_music_nft() 