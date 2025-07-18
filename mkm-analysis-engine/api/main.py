from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from google.cloud import bigquery
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from ai_music_generator import AIMusicGenerator, VoiceAnalysisData, BiometricData, CulturalData, SocialContext
from voice_analyzer import VoiceAnalyzer
from dataclasses import asdict

# FastAPI 앱 생성
app = FastAPI(
    title="MKM Lab AI 어드바이저 API",
    description="BigQuery 기반 통합 지식 브레인을 활용한 AI 어드바이저",
    version="2.0.0"
)

# BigQuery 설정
PROJECT_ID = "persona-diary-service"
DATASET_ID = "intelligence"
TABLE_ID = "vectorized_papers"

# BigQuery 클라이언트
client = bigquery.Client(project=PROJECT_ID)

# AI 음악 생성기 및 음성 분석기 초기화
ai_music_generator = AIMusicGenerator()
voice_analyzer = VoiceAnalyzer()

class AdvisorRequest(BaseModel):
    question: str
    persona_code: Optional[str] = None
    context: Optional[str] = None

class AdvisorResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[dict]
    persona_insight: Optional[str] = None

class VoiceAnalysisRequest(BaseModel):
    audio_data: str  # Base64 encoded audio
    user_context: Optional[Dict[str, Any]] = None

class VoiceAnalysisResponse(BaseModel):
    pitch_frequency: float
    speech_rate: float
    voice_quality: str
    emotional_tone: str
    stress_indicators: float
    jitter: float
    shimmer: float
    hnr: float
    vocal_range: Dict[str, float]
    speech_patterns: Dict[str, float]
    confidence: float
    recommendations: Dict[str, Any]

class MusicGenerationRequest(BaseModel):
    voice_analysis: VoiceAnalysisData
    biometric: BiometricData
    cultural: CulturalData
    social: SocialContext
    user_intention: str

class MusicGenerationResponse(BaseModel):
    music_style: str
    tempo: int
    scale: List[str]
    instruments: List[Dict[str, Any]]
    ai_music_data: Dict[str, Any]
    metadata: Dict[str, Any]
    unique_signature: str

class HealthResponse(BaseModel):
    status: str
    message: str
    bigquery_status: str
    knowledge_count: int

def get_knowledge_data():
    """BigQuery에서 지식 데이터 로드"""
    try:
        query = f"""
        SELECT * FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
        LIMIT 100
        """
        query_job = client.query(query)
        results = query_job.result()
        
        data = []
        for row in results:
            row_dict = dict(row.items())
            data.append(row_dict)
        
        return data
    except Exception as e:
        print(f"BigQuery 데이터 로드 오류: {e}")
        return []

def vectorize_text(text: str) -> List[float]:
    """텍스트를 벡터로 변환 (간단한 시뮬레이션)"""
    # 실제로는 더 정교한 임베딩 모델을 사용해야 함
    import hashlib
    hash_obj = hashlib.md5(text.encode())
    hash_hex = hash_obj.hexdigest()
    
    # 해시를 기반으로 384차원 벡터 생성
    np.random.seed(int(hash_hex[:8], 16))
    vector = np.random.rand(384).tolist()
    return vector

def find_relevant_sources(question: str, knowledge_data: List[dict], top_k: int = 3):
    """질문과 관련된 지식 소스 찾기"""
    if not knowledge_data:
        return []
    
    question_vector = vectorize_text(question)
    
    similarities = []
    for item in knowledge_data:
        if 'vector' in item and item['vector']:
            # 벡터 유사도 계산
            try:
                item_vector = item['vector'][:384]  # 384차원으로 맞춤
                if len(item_vector) == 384:
                    similarity = cosine_similarity(
                        [question_vector], 
                        [item_vector]
                    )[0][0]
                    similarities.append((similarity, item))
            except:
                continue
    
    # 유사도 순으로 정렬
    similarities.sort(key=lambda x: x[0], reverse=True)
    
    # 상위 k개 반환
    return [item for _, item in similarities[:top_k]]

def generate_advisor_response(question: str, relevant_sources: List[dict], persona_code: Optional[str] = None) -> str:
    """AI 어드바이저 응답 생성"""
    
    if not relevant_sources:
        return "죄송합니다. 현재 질문에 대한 관련 정보를 찾을 수 없습니다. 다른 방식으로 질문해 주시거나, 더 구체적으로 말씀해 주세요."
    
    # 관련 소스 정보 수집
    source_info = []
    for source in relevant_sources:
        title = source.get('title', '제목 없음')
        summary = source.get('summary', '요약 없음')
        source_type = source.get('source_type', '알 수 없음')
        source_info.append(f"• {title} ({source_type}): {summary}")
    
    # 페르소나별 맞춤 응답
    persona_insights = {
        'P1': "당신의 혁신적 사고와 리더십 성향을 고려할 때, ",
        'P2': "균형 잡힌 접근 방식을 선호하는 당신에게는, ",
        'P3': "활동적이고 탐험적인 성향의 당신에게는, ",
        'P4': "신중하고 보호적인 성향의 당신에게는, "
    }
    
    persona_prefix = persona_insights.get(persona_code, "")
    
    # 응답 생성
    response = f"""{persona_prefix}질문하신 내용에 대해 다음과 같이 답변드립니다:

📚 **통합 지식 브레인 기반 답변:**

{question}에 대한 답변은 다음과 같습니다:

🔍 **관련 지식 소스:**
{chr(10).join(source_info)}

💡 **핵심 통찰:**
위의 지식 데이터를 종합하여, 당신의 상황에 가장 적합한 해결책을 제시합니다. 

🎯 **실행 가능한 조언:**
1. 단계별 접근 방식을 권장합니다
2. 개인적 특성을 고려한 맞춤형 전략을 제시합니다
3. 지속적인 모니터링과 조정이 중요합니다

이 답변은 MKM Lab의 통합 지식 브레인에서 추출한 최신 연구 데이터와 임상 경험을 바탕으로 생성되었습니다."""

    return response

@app.get("/", response_model=HealthResponse)
async def health_check():
    """API 상태 확인"""
    try:
        knowledge_data = get_knowledge_data()
        bigquery_status = "연결됨" if knowledge_data else "연결 실패"
        knowledge_count = len(knowledge_data)
    except:
        bigquery_status = "연결 실패"
        knowledge_count = 0
    
    return HealthResponse(
        status="healthy",
        message="MKM Lab AI 어드바이저 API가 정상 작동 중입니다",
        bigquery_status=bigquery_status,
        knowledge_count=knowledge_count
    )

@app.post("/ask-advisor/", response_model=AdvisorResponse)
async def ask_advisor(request: AdvisorRequest):
    """AI 어드바이저에게 질문"""
    try:
        # 지식 데이터 로드
        knowledge_data = get_knowledge_data()
        
        if not knowledge_data:
            raise HTTPException(status_code=500, detail="지식 데이터를 로드할 수 없습니다")
        
        # 관련 소스 찾기
        relevant_sources = find_relevant_sources(request.question, knowledge_data)
        
        # 응답 생성
        answer = generate_advisor_response(
            request.question, 
            relevant_sources, 
            request.persona_code
        )
        
        # 신뢰도 계산 (간단한 시뮬레이션)
        confidence = min(0.95, 0.7 + len(relevant_sources) * 0.1)
        
        # 소스 정보 정리
        sources = []
        for source in relevant_sources:
            sources.append({
                "title": source.get('title', '제목 없음'),
                "source_type": source.get('source_type', '알 수 없음'),
                "url": source.get('url', ''),
                "summary": source.get('summary', '')[:200] + "..."
            })
        
        return AdvisorResponse(
            answer=answer,
            confidence=confidence,
            sources=sources,
            persona_insight=f"페르소나 {request.persona_code} 기반 맞춤 응답" if request.persona_code else None
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"어드바이저 오류: {str(e)}")

@app.get("/knowledge-stats/")
async def get_knowledge_stats():
    """지식 데이터 통계"""
    try:
        knowledge_data = get_knowledge_data()
        
        # 소스 타입별 통계
        source_types = {}
        for item in knowledge_data:
            source_type = item.get('source_type', 'unknown')
            source_types[source_type] = source_types.get(source_type, 0) + 1
        
        return {
            "total_count": len(knowledge_data),
            "source_types": source_types,
            "last_updated": "2025-07-17"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"통계 조회 오류: {str(e)}")

@app.post("/analyze-voice/", response_model=VoiceAnalysisResponse)
async def analyze_voice(request: VoiceAnalysisRequest):
    """음성 분석"""
    import base64
    try:
        audio_data = base64.b64decode(request.audio_data)
        analysis_result = voice_analyzer.analyze_voice(audio_data, request.user_context)
        recommendations = voice_analyzer.get_voice_based_recommendations(analysis_result)
        result_dict = asdict(analysis_result)
        
        return VoiceAnalysisResponse(
            pitch_frequency=result_dict["pitch_frequency"],
            speech_rate=result_dict["speech_rate"],
            voice_quality=result_dict["voice_quality"],
            emotional_tone=result_dict["emotional_tone"],
            stress_indicators=result_dict["stress_indicators"],
            jitter=result_dict["jitter"],
            shimmer=result_dict["shimmer"],
            hnr=result_dict["hnr"],
            vocal_range=result_dict["vocal_range"],
            speech_patterns=result_dict["speech_patterns"],
            confidence=result_dict["confidence"],
            recommendations=recommendations
        )
    except Exception as e:
        fallback = voice_analyzer._generate_fallback_analysis()
        recommendations = voice_analyzer.get_voice_based_recommendations(fallback)
        fallback_dict = asdict(fallback)
        
        return VoiceAnalysisResponse(
            pitch_frequency=fallback_dict["pitch_frequency"],
            speech_rate=fallback_dict["speech_rate"],
            voice_quality=fallback_dict["voice_quality"],
            emotional_tone=fallback_dict["emotional_tone"],
            stress_indicators=fallback_dict["stress_indicators"],
            jitter=fallback_dict["jitter"],
            shimmer=fallback_dict["shimmer"],
            hnr=fallback_dict["hnr"],
            vocal_range=fallback_dict["vocal_range"],
            speech_patterns=fallback_dict["speech_patterns"],
            confidence=fallback_dict["confidence"],
            recommendations=recommendations
        )

@app.post("/generate-music/", response_model=MusicGenerationResponse)
async def generate_music(request: MusicGenerationRequest):
    """AI 음악 생성"""
    try:
        # 개인화된 음악 생성
        music_data = ai_music_generator.generate_personalized_music(
            request.voice_analysis,
            request.biometric,
            request.cultural,
            request.social,
            request.user_intention
        )
        
        return MusicGenerationResponse(
            music_style=music_data['music_style'],
            tempo=music_data['tempo'],
            scale=music_data['scale'],
            instruments=music_data['instruments'],
            ai_music_data=music_data['ai_music_data'],
            metadata=music_data['metadata'],
            unique_signature=music_data['unique_signature']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"음악 생성 오류: {str(e)}")

@app.post("/voice-to-music/")
async def voice_to_music(audio_file: UploadFile = File(...), user_intention: str = "meditation"):
    """음성에서 음악까지 통합 처리"""
    try:
        # 1. 음성 파일 읽기
        audio_data = await audio_file.read()
        
        # 2. 음성 분석
        analysis_result = voice_analyzer.analyze_voice(audio_data)
        
        # 3. 기본 데이터 생성 (실제로는 사용자 데이터에서 가져와야 함)
        biometric = BiometricData(
            heart_rate=70.0,
            hrv=50.0,
            stress_level=analysis_result.stress_indicators,
            energy_level=1.0 - analysis_result.stress_indicators,
            sleep_quality=0.7
        )
        
        cultural = CulturalData(
            nationality="Korean",
            cultural_heritage=["korean"],
            traditional_instruments=["gayageum", "daegeum"],
            spiritual_beliefs=["meditation"]
        )
        
        social = SocialContext(
            age_group="30s",
            occupation="professional",
            education_level="university",
            social_status="middle",
            life_stage="career_focused"
        )
        
        # 4. AI 음악 생성
        music_data = ai_music_generator.generate_personalized_music(
            analysis_result,
            biometric,
            cultural,
            social,
            user_intention
        )
        
        # 5. 통합 결과 반환
        return {
            "voice_analysis": {
                "pitch_frequency": analysis_result.pitch_frequency,
                "speech_rate": analysis_result.speech_rate,
                "emotional_tone": analysis_result.emotional_tone,
                "stress_indicators": analysis_result.stress_indicators,
                "confidence": analysis_result.confidence
            },
            "music_generation": {
                "music_style": music_data['music_style'],
                "tempo": music_data['tempo'],
                "scale": music_data['scale'],
                "instruments": [inst['name'] for inst in music_data['instruments']],
                "ai_generated": music_data['ai_music_data'].get('success', False),
                "unique_signature": music_data['unique_signature']
            },
            "recommendations": voice_analyzer.get_voice_based_recommendations(analysis_result)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"통합 처리 오류: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 