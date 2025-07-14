const { PersonaRules } = require('./persona-rules');

// 초개인화 건강 페르소나 분석기
class PersonaAnalyzer {
  constructor() {
    this.personaRules = new PersonaRules();
    
    // 기존 페르소나 정의 유지 (하위 호환성)
    this.personas = this.personaRules.personaDefinitions;
  }

  /**
   * 종합적인 페르소나 분석 (새로운 규칙 시스템 사용)
   */
  analyzePersona(facialData = null, textData = null, envData = null) {
    // 기본 점수 초기화
    const defaultScores = {
      thinking: 50,
      introversion: 50,
      driving: 50,
      practical: 50,
      stable: 50
    };

    // 얼굴 분석 점수
    const facialScores = facialData ? 
      this.personaRules.analyzeFacialFeatures(facialData) : 
      defaultScores;

    // 텍스트 분석 점수
    const textScores = textData ? 
      this.personaRules.analyzeText(textData) : 
      defaultScores;

    // 환경 분석 점수
    const envScores = envData ? 
      this.personaRules.analyzeEnvironment(envData) : 
      defaultScores;

    // 종합 분석을 통한 페르소나 결정
    const result = this.personaRules.determinePersona(facialScores, textScores, envScores);
    
    return result;
  }

  // 텍스트 기반 페르소나 분석 (기존 호환성 유지)
  analyzeFromText(text) {
    return this.analyzePersona(null, text, null);
  }

  // 랜덤 페르소나 생성 (기본값)
  getRandomPersona() {
    const codes = Object.keys(this.personas);
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    
    return {
      persona: this.personas[randomCode],
      confidence: 0.85 + Math.random() * 0.1, // 0.85-0.95
      scores: {
        thinking: 50 + Math.random() * 40 - 20,
        introversion: 50 + Math.random() * 40 - 20,
        driving: 50 + Math.random() * 40 - 20,
        practical: 50 + Math.random() * 40 - 20,
        stable: 50 + Math.random() * 40 - 20
      }
    };
  }

  // 페르소나 정보 포맷팅 (새로운 규칙 시스템 사용)
  formatPersonaResult(result) {
    return this.personaRules.formatPersonaResult(result);
  }

  // 간단한 건강 조언 생성 (기존 유지)
  getHealthAdvice(personaCode, topic = 'general') {
    const persona = this.personas[personaCode];
    if (!persona) return null;

    const adviceMap = {
      'exercise': {
        'P1': '창의적인 운동을 시도해보세요! 댄스, 클라이밍, 새로운 스포츠 등이 좋습니다.',
        'P2': '규칙적인 운동이 중요합니다. 걷기, 수영, 요가 등 안정적인 운동을 추천합니다.',
        'P3': '다양한 운동을 시도해보세요! 그룹 운동이나 새로운 활동이 적합합니다.',
        'P4': '마음챙김 운동을 해보세요. 요가, 타이치, 명상 등이 좋습니다.'
      },
      'diet': {
        'P1': '새로운 건강 식품을 탐색해보세요! 슈퍼푸드나 새로운 요리법을 시도해보세요.',
        'P2': '규칙적이고 균형 잡힌 식사를 하세요. 식사 시간을 정해두는 것이 좋습니다.',
        'P3': '다양한 영양소를 섭취하세요! 새로운 요리나 건강한 간식을 시도해보세요.',
        'P4': '따뜻하고 영양가 있는 식사를 하세요. 천천히 먹고 맛을 음미하세요.'
      },
      'stress': {
        'P1': '창작 활동으로 스트레스를 해소하세요! 예술, 글쓰기, 새로운 프로젝트가 도움이 됩니다.',
        'P2': '체계적으로 스트레스를 관리하세요. 일정 관리와 충분한 휴식이 중요합니다.',
        'P3': '사회적 활동으로 스트레스를 해소하세요! 친구들과의 만남이나 그룹 활동이 좋습니다.',
        'P4': '마음챙김과 명상으로 스트레스를 관리하세요. 조용한 시간을 가지는 것이 중요합니다.'
      },
      'general': {
        'P1': '새로운 건강 정보를 탐색하고 창의적인 방법으로 건강을 관리해보세요!',
        'P2': '규칙적이고 체계적인 건강 관리가 당신에게 가장 적합합니다.',
        'P3': '다양한 활동과 새로운 경험을 통해 건강을 관리해보세요!',
        'P4': '마음챙김과 내면의 평화를 통해 건강을 관리해보세요.'
      }
    };

    return adviceMap[topic]?.[personaCode] || adviceMap.general[personaCode];
  }

  /**
   * 기질별 맞춤 건강 조언 생성 (새로운 기능)
   */
  getDispositionBasedAdvice(scores, topic = 'general') {
    const advice = [];
    
    // 사고형 성향이 강한 경우
    if (scores.thinking >= 70) {
      advice.push('• 분석적 사고를 활용한 건강 관리가 적합합니다.');
      advice.push('• 건강 데이터를 체계적으로 기록하고 분석해보세요.');
    }
    
    // 내향형 성향이 강한 경우
    if (scores.introversion >= 70) {
      advice.push('• 조용하고 깊이 있는 건강 활동이 좋습니다.');
      advice.push('• 명상, 요가, 독서 등 혼자 할 수 있는 활동을 추천합니다.');
    }
    
    // 주도형 성향이 강한 경우
    if (scores.driving >= 70) {
      advice.push('• 목표 지향적인 건강 관리가 적합합니다.');
      advice.push('• 구체적인 목표를 세우고 단계별로 달성해보세요.');
    }
    
    // 실용형 성향이 강한 경우
    if (scores.practical >= 70) {
      advice.push('• 실용적이고 효율적인 건강 관리가 좋습니다.');
      advice.push('• 일상생활에 쉽게 통합할 수 있는 방법을 찾아보세요.');
    }
    
    // 안정형 성향이 강한 경우
    if (scores.stable >= 70) {
      advice.push('• 규칙적이고 안정적인 건강 관리가 적합합니다.');
      advice.push('• 꾸준한 루틴을 만들어 지속해보세요.');
    }

    return advice.length > 0 ? advice.join('\n') : '개인화된 건강 관리 방법을 찾아보세요.';
  }

  /**
   * 페르소나 진화 추적 (새로운 기능)
   */
  trackPersonaEvolution(userId, currentResult, previousResult = null) {
    if (!previousResult) {
      return {
        isFirstTime: true,
        message: '첫 번째 페르소나 분석입니다. 향후 변화를 추적해드리겠습니다.'
      };
    }

    const changes = {};
    const currentScores = currentResult.scores;
    const previousScores = previousResult.scores;
    
    Object.keys(currentScores).forEach(indicator => {
      const change = currentScores[indicator] - previousScores[indicator];
      if (Math.abs(change) >= 10) {
        changes[indicator] = change;
      }
    });

    if (Object.keys(changes).length === 0) {
      return {
        isFirstTime: false,
        message: '페르소나가 안정적으로 유지되고 있습니다.',
        changes: {}
      };
    }

    return {
      isFirstTime: false,
      message: '페르소나에 변화가 감지되었습니다.',
      changes: changes
    };
  }
}

module.exports = { PersonaAnalyzer }; 