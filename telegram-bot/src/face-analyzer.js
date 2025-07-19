const { GoogleGenerativeAI } = require('@google/generative-ai');

class FaceAnalyzer {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  }

  async analyzeFace(photoBuffer) {
    try {
      console.log('🔍 얼굴 분석 시작...');
      
      // 이미지를 base64로 변환
      const base64Image = photoBuffer.toString('base64');
      
      // Gemini Pro Vision으로 얼굴 분석
      const prompt = `
        이 얼굴 사진을 분석하여 다음 항목들을 평가해주세요:
        
        1. 얼굴 형태 (둥근형, 각진형, 계란형, 하트형)
        2. 눈의 특징 (크기, 모양, 색상)
        3. 코의 특징 (크기, 모양)
        4. 입의 특징 (크기, 모양)
        5. 전체적인 인상 (친근함, 신뢰감, 지적함, 활발함)
        6. 추정 나이대
        7. 건강 상태 (피부톤, 눈빛, 전반적인 활력)
        
        각 항목을 1-10점 척도로 평가하고, JSON 형태로 응답해주세요.
        예시:
        {
          "face_shape": {"type": "계란형", "score": 8},
          "eyes": {"characteristics": "큰 눈, 밝은 눈빛", "score": 7},
          "nose": {"characteristics": "적당한 크기", "score": 6},
          "mouth": {"characteristics": "균형잡힌 입술", "score": 7},
          "overall_impression": {"type": "친근하고 신뢰감 있는", "score": 8},
          "estimated_age": "20대 후반",
          "health_indicator": {"skin_tone": "건강한", "vitality": 8}
        }
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      const analysisText = response.text();
      
      // JSON 파싱
      const analysis = this.parseAnalysisResult(analysisText);
      
      console.log('✅ 얼굴 분석 완료');
      return analysis;
      
    } catch (error) {
      console.error('❌ 얼굴 분석 오류:', error);
      return this.getFallbackAnalysis();
    }
  }

  parseAnalysisResult(text) {
    try {
      // JSON 부분 추출
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('JSON 파싱 실패');
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      return this.getFallbackAnalysis();
    }
  }

  getFallbackAnalysis() {
    return {
      face_shape: { type: "계란형", score: 6 },
      eyes: { characteristics: "평균적인 크기", score: 6 },
      nose: { characteristics: "균형잡힌", score: 6 },
      mouth: { characteristics: "적당한 크기", score: 6 },
      overall_impression: { type: "균형잡힌", score: 6 },
      estimated_age: "20대",
      health_indicator: { skin_tone: "보통", vitality: 6 }
    };
  }

  classifyPersona(analysis) {
    const scores = {
      visionary: 0,    // P1: 비전 리더
      balanced: 0,     // P2: 균형 조성가  
      dynamic: 0,      // P3: 동적 탐험가
      mindful: 0       // P4: 마음챙김 수호자
    };

    // 얼굴 형태 기반 점수
    const faceShape = analysis.face_shape?.type || '';
    if (faceShape.includes('각진') || faceShape.includes('사각')) {
      scores.visionary += 2;
      scores.dynamic += 1;
    } else if (faceShape.includes('둥근')) {
      scores.balanced += 2;
      scores.mindful += 1;
    } else if (faceShape.includes('계란')) {
      scores.visionary += 1;
      scores.balanced += 1;
    }

    // 눈의 특징 기반 점수
    const eyes = analysis.eyes?.characteristics || '';
    if (eyes.includes('큰') || eyes.includes('밝은')) {
      scores.visionary += 1;
      scores.dynamic += 1;
    } else if (eyes.includes('깊은') || eyes.includes('차분한')) {
      scores.mindful += 2;
    }

    // 전체적 인상 기반 점수
    const impression = analysis.overall_impression?.type || '';
    if (impression.includes('지적') || impression.includes('신뢰감')) {
      scores.visionary += 1;
      scores.balanced += 1;
    } else if (impression.includes('활발') || impression.includes('에너지')) {
      scores.dynamic += 2;
    } else if (impression.includes('친근') || impression.includes('평온')) {
      scores.mindful += 1;
      scores.balanced += 1;
    }

    // 최고 점수 페르소나 결정
    const maxScore = Math.max(...Object.values(scores));
    const personas = {
      visionary: 'P1',
      balanced: 'P2', 
      dynamic: 'P3',
      mindful: 'P4'
    };

    for (const [type, score] of Object.entries(scores)) {
      if (score === maxScore) {
        return {
          code: personas[type],
          name: this.getPersonaName(personas[type]),
          scores: scores,
          confidence: Math.min(maxScore / 5, 1.0) // 0-1 사이 신뢰도
        };
      }
    }

    return {
      code: 'P2',
      name: '균형 조성가',
      scores: scores,
      confidence: 0.5
    };
  }

  getPersonaName(code) {
    const names = {
      'P1': '비전 리더',
      'P2': '균형 조성가', 
      'P3': '동적 탐험가',
      'P4': '마음챙김 수호자'
    };
    return names[code] || '균형 조성가';
  }

  generateBasicAdvice(persona) {
    const adviceMap = {
      'P1': {
        title: '비전 리더를 위한 건강 조언',
        advice: [
          '창의적인 아이디어를 구체화하는 시간을 가져보세요',
          '리더십 스트레스를 관리하기 위해 명상이나 요가를 시도해보세요',
          '충분한 수면으로 두뇌 활동을 최적화하세요'
        ]
      },
      'P2': {
        title: '균형 조성가를 위한 건강 조언', 
        advice: [
          '규칙적인 생활 리듬을 유지하세요',
          '균형잡힌 식단으로 안정적인 에너지를 확보하세요',
          '스트레스 관리를 위해 산책이나 독서를 즐겨보세요'
        ]
      },
      'P3': {
        title: '동적 탐험가를 위한 건강 조언',
        advice: [
          '활동적인 운동으로 에너지를 발산하세요',
          '새로운 경험을 통해 스트레스를 해소하세요',
          '충분한 휴식으로 에너지를 재충전하세요'
        ]
      },
      'P4': {
        title: '마음챙김 수호자를 위한 건강 조언',
        advice: [
          '명상이나 요가로 내면의 평화를 찾아보세요',
          '자연과의 접촉을 통해 치유의 시간을 가져보세요',
          '감정을 표현하고 공유하는 시간을 만드세요'
        ]
      }
    };

    return adviceMap[persona.code] || adviceMap['P2'];
  }
}

module.exports = { FaceAnalyzer }; 