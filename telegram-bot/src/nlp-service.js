const language = require('@google-cloud/language');

class NLPService {
  constructor() {
    this.client = new language.LanguageServiceClient();
    console.log('🤖 Google Cloud Natural Language API 클라이언트 초기화 완료');
  }

  /**
   * 텍스트의 의도(Intent)를 분석
   */
  async analyzeIntent(text) {
    try {
      const document = {
        content: text,
        type: 'PLAIN_TEXT',
      };

      // 엔티티 분석
      const [entityResult] = await this.client.analyzeEntities({ document });
      
      // 구문 분석
      const [syntaxResult] = await this.client.analyzeSyntax({ document });
      
      // 감정 분석
      const [sentimentResult] = await this.client.analyzeSentiment({ document });

      // 의도 분류 (우리 서비스에 특화된 규칙)
      const intent = this.classifyIntent(text, entityResult.entities, sentimentResult.documentSentiment);

      return {
        intent,
        entities: entityResult.entities,
        syntax: syntaxResult.tokens,
        sentiment: sentimentResult.documentSentiment,
        confidence: this.calculateConfidence(entityResult.entities, sentimentResult.documentSentiment)
      };
    } catch (error) {
      console.error('❌ NLP 분석 오류:', error);
      return {
        intent: 'UNKNOWN',
        entities: [],
        syntax: [],
        sentiment: { score: 0, magnitude: 0 },
        confidence: 0
      };
    }
  }

  /**
   * 우리 서비스에 특화된 의도 분류
   */
  classifyIntent(text, entities, sentiment) {
    const lowerText = text.toLowerCase();
    
    // 명령어 패턴
    if (text.startsWith('/')) {
      return 'COMMAND';
    }

    // 건강 증상 호소
    const symptomPatterns = [
      /(아프|아픔|통증|불편|나쁘|좋지 않|문제|증상)/,
      /(복통|설사|변비|소화|위|장|배|속|구역|메스꺼움)/,
      /(두통|어지럼|현기증|어깨|허리|관절|근육)/,
      /(기침|콧물|재채기|목|인후|호흡|숨|가래)/,
      /(열|체온|오한|발열|감기|독감)/,
      /(알레르기|피부|발진|가려움|붓기)/
    ];

    if (symptomPatterns.some(pattern => pattern.test(lowerText))) {
      return 'SYMPTOM_COMPLAINT';
    }

    // 건강 상태 표현
    const healthStatePatterns = [
      /(피로|힘들|지치|쉽지 않|어렵)/,
      /(스트레스|긴장|불안|걱정|우울)/,
      /(수면|잠|불면|잠들|깨)/,
      /(식사|먹|음식|식단|영양)/,
      /(운동|활동|걷|뛰|달리)/,
      /(에너지|활력|기운|힘|건강)/
    ];

    if (healthStatePatterns.some(pattern => pattern.test(lowerText))) {
      return 'HEALTH_STATE';
    }

    // 질문 의도
    const questionPatterns = [
      /(어떻게|왜|무엇|어떤|도움|조언|상담)/,
      /(개선|나아지|좋아지|회복|치유)/,
      /(예방|관리|케어|돌봄)/
    ];

    if (questionPatterns.some(pattern => pattern.test(lowerText))) {
      return 'HEALTH_QUESTION';
    }

    // 날씨 관련
    if (lowerText.includes('날씨') || lowerText.includes('비') || lowerText.includes('맑음')) {
      return 'WEATHER_QUERY';
    }

    // 친목 대화
    if (lowerText.includes('안녕') || lowerText.includes('고마워') || lowerText.includes('감사')) {
      return 'SOCIAL_GREETING';
    }

    // 엔티티 기반 분류
    const healthEntities = entities.filter(entity => 
      entity.type === 'PERSON' || 
      entity.type === 'OTHER' ||
      entity.metadata && entity.metadata.wikipedia_url
    );

    if (healthEntities.length > 0) {
      return 'HEALTH_REFERENCE';
    }

    return 'GENERAL_CONVERSATION';
  }

  /**
   * 신뢰도 계산
   */
  calculateConfidence(entities, sentiment) {
    let confidence = 0.5; // 기본값

    // 엔티티가 많을수록 신뢰도 증가
    if (entities.length > 0) {
      confidence += Math.min(entities.length * 0.1, 0.3);
    }

    // 감정 강도가 높을수록 신뢰도 증가
    if (sentiment.magnitude > 1.0) {
      confidence += Math.min(sentiment.magnitude * 0.1, 0.2);
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * 건강 관련 엔티티 추출
   */
  extractHealthEntities(entities) {
    const healthEntities = {
      symptoms: [],
      bodyParts: [],
      conditions: [],
      medications: [],
      activities: []
    };

    entities.forEach(entity => {
      const name = entity.name.toLowerCase();
      
      // 증상
      if (this.isSymptom(name)) {
        healthEntities.symptoms.push(entity.name);
      }
      // 신체 부위
      else if (this.isBodyPart(name)) {
        healthEntities.bodyParts.push(entity.name);
      }
      // 질환
      else if (this.isCondition(name)) {
        healthEntities.conditions.push(entity.name);
      }
      // 약물
      else if (this.isMedication(name)) {
        healthEntities.medications.push(entity.name);
      }
      // 활동
      else if (this.isActivity(name)) {
        healthEntities.activities.push(entity.name);
      }
    });

    return healthEntities;
  }

  /**
   * 증상 여부 판단
   */
  isSymptom(text) {
    const symptoms = [
      '복통', '설사', '변비', '두통', '어지럼', '현기증',
      '기침', '콧물', '재채기', '열', '오한', '발열',
      '피로', '스트레스', '불면', '구역', '메스꺼움'
    ];
    return symptoms.some(symptom => text.includes(symptom));
  }

  /**
   * 신체 부위 여부 판단
   */
  isBodyPart(text) {
    const bodyParts = [
      '머리', '목', '어깨', '팔', '손', '가슴', '배', '허리', '다리', '발',
      '눈', '코', '입', '귀', '심장', '폐', '간', '위', '장'
    ];
    return bodyParts.some(part => text.includes(part));
  }

  /**
   * 질환 여부 판단
   */
  isCondition(text) {
    const conditions = [
      '감기', '독감', '고혈압', '당뇨', '알레르기', '염증'
    ];
    return conditions.some(condition => text.includes(condition));
  }

  /**
   * 약물 여부 판단
   */
  isMedication(text) {
    const medications = [
      '약', '진통제', '소화제', '비타민', '영양제'
    ];
    return medications.some(med => text.includes(med));
  }

  /**
   * 활동 여부 판단
   */
  isActivity(text) {
    const activities = [
      '운동', '걷기', '달리기', '수영', '요가', '명상', '수면', '식사'
    ];
    return activities.some(activity => text.includes(activity));
  }

  /**
   * 감정 상태 분석
   */
  analyzeEmotionalState(sentiment) {
    const score = sentiment.score;
    const magnitude = sentiment.magnitude;

    if (score > 0.3) {
      return 'POSITIVE';
    } else if (score < -0.3) {
      return 'NEGATIVE';
    } else {
      return 'NEUTRAL';
    }
  }

  /**
   * 긴급도 평가
   */
  assessUrgency(intent, entities, sentiment) {
    let urgency = 1; // 기본값 (1-5, 5가 가장 긴급)

    // 의도별 긴급도
    if (intent === 'SYMPTOM_COMPLAINT') {
      urgency = 3;
    } else if (intent === 'HEALTH_QUESTION') {
      urgency = 2;
    }

    // 긴급 증상 키워드
    const emergencyKeywords = ['심한', '갑작스러운', '급한', '위험', '심장', '호흡'];
    const hasEmergencyKeyword = emergencyKeywords.some(keyword => 
      entities.some(entity => entity.name.includes(keyword))
    );

    if (hasEmergencyKeyword) {
      urgency = Math.max(urgency, 4);
    }

    // 감정 강도
    if (sentiment.magnitude > 2.0) {
      urgency = Math.max(urgency, 3);
    }

    return Math.min(urgency, 5);
  }
}

module.exports = NLPService; 