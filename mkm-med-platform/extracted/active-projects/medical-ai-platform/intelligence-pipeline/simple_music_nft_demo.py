import time
import hashlib
import json
from datetime import datetime
from typing import Dict, List, Any

class SimpleMusicNFTSystem:
    def __init__(self):
        self.musical_scales = {
            korean: ['C',D',E',F, 'G', 'A',B'],
            western: ['C',D',E',F, 'G', 'A',B],          eastern: C, D, E, F#, 'G', 'A',B'],
           meditative: ['C',D',E', F, 'G', A, 'Bb']
        }
        
        self.instruments = {
            korean:gayageum', daegeum, janggu', 'piri'],
            western:piano', violin, cello', 'flute],          eastern': ['sitar',tabla, 'bansuri', 'tanpura'],
          meditative': ['singing_bowl', chimes', drone',nature_sounds]        }
    
    def generate_personalized_music(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
 erate personalized music based on user data"""
        # Determine music style
        style = self._determine_style(user_data)
        
        # Determine scale
        scale = self._determine_scale(user_data)
        
        # Determine tempo
        tempo = self._determine_tempo(user_data)
        
        # Determine instruments
        instruments = self._determine_instruments(user_data)
        
        # Generate melody
        melody = self._generate_melody(scale, user_data)
        
        # Create unique signature
        signature = self._generate_signature(user_data)
        
        return {
          stylestyle,
          scalescale,
          tempotempo,
        instruments': instruments,
            melodyelody,
      signature': signature,
      timestamp:datetime.now().isoformat()
        }
    
    def _determine_style(self, user_data: Dict[str, Any]) -> str:
        ermine music style based on cultural background and stress level""        cultural = user_data.get(cultural_heritage',       stress_level = user_data.get(stress_level', 0.5)
        
        if stress_level > 0.7:
            return 'meditative'
        elif 'korean' in cultural:
            return 'korean'
        elif 'eastern' in cultural:
            returneastern'
        else:
            return western'
    
    def _determine_scale(self, user_data: Dict[str, Any]) -> List[str]:
  Determine musical scale based on emotional state      stress_level = user_data.get(stress_level', 00.5      energy_level = user_data.get(energy_level', 0.5)
        
        base_scale = self.musical_scales['western']
        
        if stress_level > 0.7
            # Calm scale - minor
            return [base_scale[0ase_scale[2ase_scale[3ase_scale[5ase_scale[7ase_scale8, base_scale10       elif energy_level > 08            # Energetic scale - major
            return [base_scale[0ase_scale[2ase_scale[4ase_scale[5ase_scale[7ase_scale9, base_scale[11 else:
            # Balanced scale
            return base_scale
    
    def _determine_tempo(self, user_data: Dict[str, Any]) -> int:
        ermine tempo based on heart rate and stress level"""
        heart_rate = user_data.get(heart_rate', 70      stress_level = user_data.get(stress_level', 0.5)
        
        base_tempo = 120     if heart_rate > 80:
            base_tempo += 20
        elif stress_level > 0.7:
            base_tempo -=30        return max(60in(180base_tempo))
    
    def _determine_instruments(self, user_data: Dict[str, Any]) -> List[str]:
  ermine instruments based on cultural background and intention"      style = self._determine_style(user_data)
        intention = user_data.get('intention', '')
        
        instruments = self.instruments[style][:2]  # First 2 instruments
        
        if 'meditation' in intention.lower() or 'peace' in intention.lower():
            instruments.extend(self.instruments['meditative'][:1])
        
        return list(set(instruments))  # Remove duplicates
    
    def _generate_melody(self, scale: List[str], user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        erate melody based on scale and user data      melody = []
        emotional_tone = user_data.get('emotional_tone', 'balanced')
        
        # Generate 8-note melody
        for i in range(8      if emotional_tone == 'joyful:              note_index = (i * 2) % len(scale)
            elif emotional_tone == 'calming:              note_index = (i * 3) % len(scale)
            else:
                note_index = i % len(scale)
            
            melody.append({
                note: scale[note_index],
               duration5
               velocity:80 if emotional_tone == joyful0
          octave':4      })
        
        return melody
    
    def _generate_signature(self, user_data: Dict[str, Any]) -> str:
        e unique signature for the music"""
        data_string = json.dumps(user_data, sort_keys=True)
        return hashlib.sha256(data_string.encode()).hexdigest()[:16ss MusicNFTManager:
    def __init__(self):
        self.nft_collection =[object Object]        self.music_generator = SimpleMusicNFTSystem()
    
    def create_music_nft(self, user_id: str, user_data: Dict[str, Any], 
                        ownership_structure: Dict[str, float]) -> Dict[str, Any]:
       Create a music NFT"""
        # Generate personalized music
        music_data = self.music_generator.generate_personalized_music(user_data)
        
        # Create NFT metadata
        nft_id = f"MUSIC_NFT_{user_id}_{int(time.time())}"
        nft_metadata = [object Object]           nft_idft_id,
            user_id': user_id,
       music_data': music_data,
       ownership_structure': ownership_structure,
         total_shares': sum(ownership_structure.values()),
      royalty_percentage': 2.5  creation_timestamp:datetime.now().isoformat()
        }
        
        # Store NFT
        self.nft_collection[nft_id] = nft_metadata
        
        return nft_metadata
    
    def get_nft_info(self, nft_id: str) -> Dict[str, Any]:
et NFT information       return self.nft_collection.get(nft_id, {})
    
    def get_user_nfts(self, user_id: str) -> List[Dict[str, Any]]:
       et user's NFT list
        user_nfts = []
        
        for nft_id, nft_data in self.nft_collection.items():
            if nft_data[user_id'] == user_id:
                user_nfts.append(nft_data)
        
        return user_nfts

def demo_personalized_music_nft():
    """Demo the personalized music NFT system"""
    
    # Sample user data
    user_data = {
        heart_rate: 72.0     stress_level': 0.3     energy_level': 0.7,
        cultural_heritage': [korean', 'eastern'],
       emotional_tone': calming',
    intention': 'Peaceful meditation for healthy body and mind',
       age_group': '30s',
     occupation': software_engineer
    }  
    # Ownership structure (fractional ownership)
    ownership_structure = {
       user_123 600,      # User 60      ai_composer': 20.0,   # AI composer 20%
       cultural_fund': 15.0, # Cultural foundation 15%
        community_pool': 5.0  # Community pool5%
    }
    
    # Create NFT manager
    nft_manager = MusicNFTManager()
    
    # Create music NFT
    nft_metadata = nft_manager.create_music_nft(
        user_id="user_123
        user_data=user_data,
        ownership_structure=ownership_structure
    )
    
    print("🎵 Personalized Music NFT Created Successfully!)    print(f"NFT ID: {nft_metadata['nft_id]}")
    print(fMusic Style: {nft_metadata['music_data][yle]}")
    print(f"Tempo: {nft_metadata[music_data]['tempo']} BPM")
    print(fEmotional Tone: {user_data['emotional_tone']}")
    print(f"Instruments: {', '.join(nft_metadata['music_data']['instruments])}")
    print(f"Total Shares: {nft_metadata['total_shares]}%")
    print(fUnique Signature: {nft_metadata['music_data']['signature']}")
    
    # Get user's NFT list
    user_nfts = nft_manager.get_user_nfts("user_123    print(fundefinednUser NFT Count: {len(user_nfts)})   # Show detailed music data
    print(f"\n🎼 Generated Music Details:")
    print(fScale: {', '.join(nft_metadata['music_data']['scale])})    print(fMelody:[object Object]len(nft_metadata[music_data]['melody'])} notes)    for i, note in enumerate(nft_metadata[music_data]['melody'][:4):
        print(f"  Note {i+1: {note[note']} (duration: [object Object]note['duration']}s, velocity:[object Object]note['velocity']}))
    
    return nft_metadata

if __name__ == "__main__":
    demo_personalized_music_nft() 