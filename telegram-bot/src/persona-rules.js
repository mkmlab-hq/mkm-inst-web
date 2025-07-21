/**
 * MKM Lab 페르소나 부여 규칙 시스템
 * 
 * 이 시스템은 얼굴 분석, 텍스트 분석, 환경 데이터를 종합하여
 * 사용자에게 최적화된 건강 페르소나를 부여하는 규칙을 정의합니다.
 */

class PersonaRules {
  constructor() {
    // 1. 핵심 기질 지표 정의 (0-100점 척도)
    this.dispositionIndicators = {
      thinking: {
        name: '사고형 vs 감성형',
        description: '논리적 사고와 감정적 판단의 균형',
        indicators: ['논리적', '분석적', '객관적', '체계적', '이성적'],
        opposites: ['감성적', '직관적', '주관적', '자유분방', '감정적']
      },
      introversion: {
        name: '내향형 vs 외향형',
        description: '에너지 충전 방식과 사회적 상호작용 선호도',
        indicators: ['내성적', '조용한', '깊이있는', '독립적', '사색적'],
        opposites: ['외향적', '활발한', '사교적', '협력적', '표현적']
      },
      driving: {
        name: '주도형 vs 협력형',
        description: '목표 달성 방식과 리더십 스타일',
        indicators: ['주도적', '결단력있는', '도전적', '독립적', '목표지향적'],
        opposites: ['협력적', '배려하는', '조화로운', '팀워크', '포용적']
      },
      practical: {
        name: '실용형 vs 이상형',
        description: '현실 문제 해결과 비전 추구의 균형',
        indicators: ['실용적', '현실적', '효율적', '구체적', '실행력있는'],
        opposites: ['이상적', '비전있는', '창의적', '혁신적', '미래지향적']
      },
      stable: {
        name: '안정형 vs 변화형',
        description: '루틴 선호와 새로운 도전에 대한 태도',
        indicators: ['안정적', '규칙적', '신뢰할수있는', '꾸준한', '예측가능한'],
        opposites: ['변화적', '적응력있는', '새로운', '유연한', '도전적인']
      }
    };

    // 2. 얼굴 분석 기반 특징 매핑 규칙
    this.facialAnalysisRules = {
      // 눈 관련 특징
      eyes: {
        bright: { thinking: +15, practical: +10 },
        deep: { introversion: +20, thinking: +10 },
        wide: { introversion: -15, driving: +10 },
        narrow: { introversion: +15, stable: +10 },
        expressive: { introversion: -20, driving: +15 }
      },
      // 입 관련 특징
      mouth: {
        firm: { driving: +15, practical: +10 },
        soft: { introversion: +10, stable: +15 },
        wide: { introversion: -15, driving: +10 },
        small: { introversion: +15, stable: +10 }
      },
      // 이마 관련 특징
      forehead: {
        high: { thinking: +20, practical: +10 },
        broad: { thinking: +15, driving: +10 },
        narrow: { introversion: +10, stable: +15 }
      },
      // 턱 관련 특징
      jaw: {
        strong: { driving: +20, practical: +15 },
        soft: { introversion: +10, stable: +15 },
        square: { driving: +15, practical: +10 },
        round: { introversion: +10, stable: +15 }
      },
      // 전체적인 인상
      overall: {
        energetic: { introversion: -20, driving: +20, stable: -15 },
        calm: { introversion: +15, stable: +20, driving: -10 },
        confident: { driving: +20, practical: +15, introversion: -10 },
        thoughtful: { thinking: +20, introversion: +15, practical: +10 }
      }
    };

    // 3. 텍스트 분석 기반 특징 매핑 규칙
    this.textAnalysisRules = {
      // 키워드별 점수 매핑
      keywords: {
        // 사고형 지표
        '분석': { thinking: +15, practical: +10 },
        '논리': { thinking: +20, practical: +15 },
        '체계': { thinking: +15, stable: +10 },
        '객관': { thinking: +15, practical: +10 },
        
        // 내향형 지표
        '깊이': { introversion: +20, thinking: +10 },
        '사색': { introversion: +20, thinking: +15 },
        '조용': { introversion: +15, stable: +10 },
        '독립': { introversion: +15, driving: +10 },
        
        // 주도형 지표
        '주도': { driving: +20, practical: +15 },
        '결단': { driving: +20, practical: +10 },
        '도전': { driving: +20, stable: -15 },
        '목표': { driving: +15, practical: +15 },
        
        // 실용형 지표
        '실용': { practical: +20, stable: +15 },
        '효율': { practical: +20, stable: +10 },
        '현실': { practical: +20, stable: +15 },
        '구체': { practical: +15, stable: +10 },
        
        // 안정형 지표
        '안정': { stable: +20, practical: +15 },
        '규칙': { stable: +20, practical: +15 },
        '신뢰': { stable: +20, practical: +10 },
        '꾸준': { stable: +20, practical: +10 }
      },
      
      // 문장 패턴 분석
      patterns: {
        questionPattern: { thinking: +10, introversion: +5 },
        commandPattern: { driving: +15, practical: +10 },
        descriptivePattern: { introversion: +10, thinking: +5 },
        emotionalPattern: { introversion: -10, driving: +5 }
      }
    };

    // 4. 환경 데이터 기반 조정 규칙
    this.environmentRules = {
      weather: {
        sunny: { introversion: -5, driving: +5 },
        rainy: { introversion: +10, stable: +5 },
        cloudy: { introversion: +5, stable: +5 },
        stormy: { stable: -10, driving: +10 }
      },
      time: {
        morning: { driving: +10, practical: +5 },
        afternoon: { practical: +10, stable: +5 },
        evening: { introversion: +10, stable: +5 },
        night: { introversion: +15, thinking: +5 }
      },
      season: {
        spring: { driving: +10, stable: -5 },
        summer: { introversion: -5, driving: +10 },
        autumn: { introversion: +10, stable: +5 },
        winter: { introversion: +15, stable: +10 }
      }
    };

    // 5. 페르소나 정의 (기질 점수 조합 기반)
    this.personaDefinitions = {
      'P1': {
        code: 'P1',
        name: 'The Visionary Leader',
        koreanName: '비전 리더',
        description: '창의적이고 혁신적인 건강 혁신가',
        dispositionRange: {
          thinking: [60, 100],
          introversion: [0, 40],
          driving: [70, 100],
          practical: [40, 80],
          stable: [20, 60]
        },
        confidence: 0.9
      },
      'P2': {
        code: 'P2',
        name: 'The Balanced Builder',
        koreanName: '균형 조성가',
        description: '안정적이고 체계적인 건강 관리자',
        dispositionRange: {
          thinking: [50, 80],
          introversion: [30, 70],
          driving: [40, 70],
          practical: [70, 100],
          stable: [70, 100]
        },
        confidence: 0.9
      },
      'P3': {
        code: 'P3',
        name: 'The Dynamic Explorer',
        koreanName: '동적 탐험가',
        description: '활발하고 적응력 강한 건강 탐험가',
        dispositionRange: {
          thinking: [30, 70],
          introversion: [0, 40],
          driving: [60, 100],
          practical: [30, 70],
          stable: [20, 60]
        },
        confidence: 0.9
      },
      'P4': {
        code: 'P4',
        name: 'The Mindful Guardian',
        koreanName: '마음챙김 수호자',
        description: '신중하고 세심한 건강 수호자',
        dispositionRange: {
          thinking: [60, 100],
          introversion: [70, 100],
          driving: [20, 50],
          practical: [40, 80],
          stable: [60, 100]
        },
        confidence: 0.9
      }
    };
  }

  /**
   * 얼굴 분석 데이터를 기질 점수로 변환
   */
  analyzeFacialFeatures(facialData) {
    const scores = {
      thinking: 50,
      introversion: 50,
      driving: 50,
      practical: 50,
      stable: 50
    };

    // 얼굴 특징별 점수 적용
    Object.keys(facialData).forEach(feature => {
      const featureValue = facialData[feature];
      const rules = this.facialAnalysisRules[feature];
      
      if (rules && rules[featureValue]) {
        Object.keys(rules[featureValue]).forEach(indicator => {
          scores[indicator] = Math.max(0, Math.min(100, 
            scores[indicator] + rules[featureValue][indicator]
          ));
        });
      }
    });

    return scores;
  }

  /**
   * 텍스트를 기질 점수로 변환
   */
  analyzeText(text) {
    const scores = {
      thinking: 50,
      introversion: 50,
      driving: 50,
      practical: 50,
      stable: 50
    };

    const lowerText = (text || '').toLowerCase();

    // 키워드 매칭
    Object.keys(this.textAnalysisRules.keywords).forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const adjustments = this.textAnalysisRules.keywords[keyword];
        Object.keys(adjustments).forEach(indicator => {
          scores[indicator] = Math.max(0, Math.min(100, 
            scores[indicator] + adjustments[indicator]
          ));
        });
      }
    });

    // 문장 패턴 분석
    if (lowerText.includes('?')) {
      scores.thinking += 10;
      scores.introversion += 5;
    }
    if (lowerText.includes('!')) {
      scores.driving += 10;
      scores.introversion -= 5;
    }

    return scores;
  }

  /**
   * 환경 데이터를 기질 점수로 변환
   */
  analyzeEnvironment(envData) {
    const scores = {
      thinking: 0,
      introversion: 0,
      driving: 0,
      practical: 0,
      stable: 0
    };

    // 날씨 영향
    if (envData.weather && this.environmentRules.weather[envData.weather]) {
      const weatherAdjustments = this.environmentRules.weather[envData.weather];
      Object.keys(weatherAdjustments).forEach(indicator => {
        scores[indicator] += weatherAdjustments[indicator];
      });
    }

    // 시간대 영향
    if (envData.time && this.environmentRules.time[envData.time]) {
      const timeAdjustments = this.environmentRules.time[envData.time];
      Object.keys(timeAdjustments).forEach(indicator => {
        scores[indicator] += timeAdjustments[indicator];
      });
    }

    // 계절 영향
    if (envData.season && this.environmentRules.season[envData.season]) {
      const seasonAdjustments = this.environmentRules.season[envData.season];
      Object.keys(seasonAdjustments).forEach(indicator => {
        scores[indicator] += seasonAdjustments[indicator];
      });
    }

    return scores;
  }

  /**
   * 종합 분석을 통한 페르소나 결정
   */
  determinePersona(facialScores, textScores, envScores) {
    // 가중 평균 계산 (얼굴: 50%, 텍스트: 30%, 환경: 20%)
    const finalScores = {};
    Object.keys(facialScores).forEach(indicator => {
      finalScores[indicator] = Math.round(
        facialScores[indicator] * 0.5 +
        textScores[indicator] * 0.3 +
        envScores[indicator] * 0.2
      );
    });

    // 각 페르소나와의 매칭 점수 계산
    const personaScores = {};
    Object.keys(this.personaDefinitions).forEach(personaCode => {
      const persona = this.personaDefinitions[personaCode];
      let matchScore = 0;
      let totalRange = 0;

      Object.keys(finalScores).forEach(indicator => {
        const score = finalScores[indicator];
        const range = persona.dispositionRange[indicator];
        const rangeCenter = (range[0] + range[1]) / 2;
        const rangeWidth = range[1] - range[0];
        
        // 점수가 범위 내에 있으면 높은 점수, 벗어나면 거리에 따라 감점
        if (score >= range[0] && score <= range[1]) {
          matchScore += 100;
        } else {
          const distance = Math.min(
            Math.abs(score - range[0]),
            Math.abs(score - range[1])
          );
          matchScore += Math.max(0, 100 - (distance * 2));
        }
        totalRange += 100;
      });

      personaScores[personaCode] = matchScore / totalRange;
    });

    // 가장 높은 매칭 점수의 페르소나 선택
    const bestPersona = Object.keys(personaScores).reduce((a, b) => 
      personaScores[a] > personaScores[b] ? a : b
    );

    return {
      persona: this.personaDefinitions[bestPersona],
      confidence: personaScores[bestPersona],
      scores: finalScores,
      allScores: personaScores
    };
  }

  /**
   * 페르소나 결과 포맷팅
   */
  formatPersonaResult(result) {
    const { persona, confidence, scores } = result;
    
    // 기질별 설명 생성
    const dispositionDescriptions = [];
    Object.keys(scores).forEach(indicator => {
      const score = scores[indicator];
      const indicatorInfo = this.dispositionIndicators[indicator];
      
      if (score >= 70) {
        dispositionDescriptions.push(`• ${indicatorInfo.indicators[0]} 성향이 강함 (${score}점)`);
      } else if (score <= 30) {
        dispositionDescriptions.push(`• ${indicatorInfo.opposites[0]} 성향이 강함 (${score}점)`);
      }
    });

    return {
      text: `🎯 *당신의 건강 페르소나*

*${persona.name} (${persona.koreanName})*
${persona.description}

*신뢰도: ${Math.round(confidence * 100)}%*

*기질 분석:*
${dispositionDescriptions.join('\n')}

💡 이 페르소나는 당신의 건강 관리 방향을 제시합니다.`,
      persona: persona,
      confidence: confidence,
      scores: scores
    };
  }
}

module.exports = { PersonaRules }; 