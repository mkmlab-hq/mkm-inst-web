// 환경 지능 서비스 - 날씨, 문화, 경제, 지정학적 데이터 통합
const axios = require('axios');

class EnvironmentalIntelligence {
  constructor() {
    this.weatherService = null; // WeatherService 인스턴스 주입
    this.cache = new Map();
    this.cacheTTL = {
      weather: 30 * 60 * 1000, // 30분
      cultural: 24 * 60 * 60 * 1000, // 24시간
      economic: 60 * 60 * 1000, // 1시간
      geopolitical: 6 * 60 * 60 * 1000 // 6시간
    };
  }

  setWeatherService(weatherService) {
    this.weatherService = weatherService;
  }

  // 종합 환경 컨텍스트 수집
  async getComprehensiveContext(location, persona, timestamp = new Date()) {
    try {
      const [weather, cultural, economic, geopolitical] = await Promise.allSettled([
        this.getWeatherContext(location),
        this.getCulturalContext(location),
        this.getEconomicContext(location),
        this.getGeopoliticalContext(location)
      ]);

      return {
        weather: weather.status === 'fulfilled' ? weather.value : this.getFallbackWeather(),
        cultural: cultural.status === 'fulfilled' ? cultural.value : this.getFallbackCultural(),
        economic: economic.status === 'fulfilled' ? economic.value : this.getFallbackEconomic(),
        geopolitical: geopolitical.status === 'fulfilled' ? geopolitical.value : this.getFallbackGeopolitical(),
        timestamp: timestamp,
        location: location,
        fallback: weather.status === 'rejected' || cultural.status === 'rejected' || 
                 economic.status === 'rejected' || geopolitical.status === 'rejected'
      };
    } catch (error) {
      console.error('환경 컨텍스트 수집 오류:', error);
      return this.getFallbackContext(location, persona);
    }
  }

  // 날씨 컨텍스트
  async getWeatherContext(location) {
    if (!this.weatherService) {
      throw new Error('WeatherService not initialized');
    }

    const cacheKey = `weather_${location.lat}_${location.lon}`;
    const cached = this.getCachedData(cacheKey, 'weather');
    if (cached) return cached;

    const weather = await this.weatherService.getWeatherByLocation(location.lat, location.lon);
    const context = this.analyzeWeatherImpact(weather);
    
    this.setCachedData(cacheKey, context, 'weather');
    return context;
  }

  // 문화 컨텍스트
  async getCulturalContext(location) {
    const country = this.getCountryFromLocation(location);
    const cacheKey = `cultural_${country}`;
    const cached = this.getCachedData(cacheKey, 'cultural');
    if (cached) return cached;

    const context = this.getCulturalProfile(country);
    this.setCachedData(cacheKey, context, 'cultural');
    return context;
  }

  // 경제 컨텍스트
  async getEconomicContext(location) {
    const country = this.getCountryFromLocation(location);
    const cacheKey = `economic_${country}`;
    const cached = this.getCachedData(cacheKey, 'economic');
    if (cached) return cached;

    const context = this.getEconomicProfile(country);
    this.setCachedData(cacheKey, context, 'economic');
    return context;
  }

  // 지정학적 컨텍스트
  async getGeopoliticalContext(location) {
    const country = this.getCountryFromLocation(location);
    const cacheKey = `geopolitical_${country}`;
    const cached = this.getCachedData(cacheKey, 'geopolitical');
    if (cached) return cached;

    const context = this.getGeopoliticalProfile(country);
    this.setCachedData(cacheKey, context, 'geopolitical');
    return context;
  }

  // 날씨 영향 분석
  analyzeWeatherImpact(weather) {
    const impacts = {
      skincare: this.getSkincareRecommendations(weather),
      activities: this.getActivityRecommendations(weather),
      mood: this.getMoodRecommendations(weather),
      health: this.getHealthRecommendations(weather)
    };

    return {
      data: weather,
      impacts: impacts,
      riskLevel: this.calculateWeatherRisk(weather)
    };
  }

  // 스킨케어 추천
  getSkincareRecommendations(weather) {
    const recommendations = [];
    
    if (weather.uvIndex > 7) {
      recommendations.push({
        priority: 'high',
        category: 'sun_protection',
        products: ['SPF 50+ 선크림', '챙 넓은 모자', '선글라스'],
        timing: '외출 30분 전 도포',
        advice: '자외선 지수가 높습니다. 강력한 자외선 차단이 필요합니다.'
      });
    }
    
    if (weather.humidity < 30) {
      recommendations.push({
        priority: 'medium',
        category: 'hydration',
        products: ['히알루론산 세럼', '세라마이드 보습제'],
        frequency: '하루 2회',
        advice: '습도가 낮아 피부 건조함이 심할 수 있습니다.'
      });
    }

    if (weather.temperature > 30) {
      recommendations.push({
        priority: 'medium',
        category: 'cooling',
        products: ['시트 마스크', '알로에 젤', '미스트'],
        advice: '고온으로 인한 피부 자극을 예방하세요.'
      });
    }
    
    return recommendations;
  }

  // 활동 추천
  getActivityRecommendations(weather) {
    const recommendations = [];
    
    if (weather.temperature >= 20 && weather.temperature <= 25 && weather.condition === 'Clear') {
      recommendations.push({
        priority: 'high',
        category: 'outdoor',
        activities: ['산책', '자전거 타기', '피크닉', '가벼운 운동'],
        advice: '완벽한 날씨입니다! 야외 활동을 즐겨보세요.'
      });
    }
    
    if (weather.temperature < 10) {
      recommendations.push({
        priority: 'medium',
        category: 'indoor',
        activities: ['실내 운동', '요가', '명상', '독서'],
        advice: '추운 날씨입니다. 실내 활동을 추천합니다.'
      });
    }

    if (weather.condition === 'Rain') {
      recommendations.push({
        priority: 'medium',
        category: 'indoor',
        activities: ['홈 트레이닝', '스트레칭', '음악 감상', '창작 활동'],
        advice: '비 오는 날은 실내에서 즐길 수 있는 활동을 해보세요.'
      });
    }
    
    return recommendations;
  }

  // 기분 추천
  getMoodRecommendations(weather) {
    const recommendations = [];
    
    if (weather.condition === 'Rain' || weather.condition === 'Clouds') {
      recommendations.push({
        priority: 'medium',
        category: 'mood_boost',
        activities: ['따뜻한 차 마시기', '편안한 음악 듣기', '가족과 대화'],
        advice: '흐린 날씨는 기분이 우울할 수 있습니다. 따뜻한 활동으로 기분을 전환해보세요.'
      });
    }
    
    if (weather.temperature > 30) {
      recommendations.push({
        priority: 'medium',
        category: 'cooling',
        activities: ['시원한 음료', '가벼운 옷차림', '그늘에서 휴식'],
        advice: '더운 날씨로 인한 스트레스를 줄이기 위해 시원한 활동을 해보세요.'
      });
    }
    
    return recommendations;
  }

  // 건강 추천
  getHealthRecommendations(weather) {
    const recommendations = [];
    
    if (weather.airQuality > 100) {
      recommendations.push({
        priority: 'high',
        category: 'air_quality',
        advice: '대기질이 나쁩니다. 실외 활동을 줄이고 공기청정기를 사용하세요.',
        precautions: ['마스크 착용', '실내 운동', '창문 닫기']
      });
    }
    
    if (weather.humidity > 80) {
      recommendations.push({
        priority: 'medium',
        category: 'humidity',
        advice: '습도가 높아 곰팡이와 알레르기가 심해질 수 있습니다.',
        precautions: ['제습기 사용', '통풍', '청결 유지']
      });
    }
    
    return recommendations;
  }

  // 날씨 위험도 계산
  calculateWeatherRisk(weather) {
    let riskScore = 0;
    
    if (weather.uvIndex > 8) riskScore += 3;
    else if (weather.uvIndex > 6) riskScore += 2;
    else if (weather.uvIndex > 4) riskScore += 1;
    
    if (weather.airQuality > 150) riskScore += 3;
    else if (weather.airQuality > 100) riskScore += 2;
    else if (weather.airQuality > 50) riskScore += 1;
    
    if (weather.temperature > 35 || weather.temperature < -10) riskScore += 2;
    else if (weather.temperature > 30 || weather.temperature < -5) riskScore += 1;
    
    if (riskScore >= 5) return 'high';
    else if (riskScore >= 3) return 'medium';
    else return 'low';
  }

  // 문화 프로필
  getCulturalProfile(country) {
    const profiles = {
      'KR': {
        holidays: ['설날', '추석', '부처님 오신 날', '개천절'],
        dietary: ['김치', '인삼', '발효식품', '해조류'],
        beauty: ['글래스 스킨', '쿠션 메이크업', '시트 마스크', '에센스'],
        activities: ['등산', '배드민턴', '전통춤', '한국어 공부'],
        festivals: ['부산국제영화제', '전주한옥마을 축제', '제주 유채꽃 축제']
      },
      'US': {
        holidays: ['Thanksgiving', 'Christmas', 'Independence Day', 'Labor Day'],
        dietary: ['gluten-free', 'vegan', 'keto', 'organic'],
        beauty: ['natural', 'minimalist', 'glam', 'sustainable'],
        activities: ['outdoor sports', 'gym', 'yoga', 'hiking'],
        festivals: ['Coachella', 'SXSW', 'Comic-Con', 'Super Bowl']
      },
      'JP': {
        holidays: ['Golden Week', 'Obon', 'New Year', 'Coming of Age Day'],
        dietary: ['miso', 'seaweed', 'fermented foods', 'matcha'],
        beauty: ['skincare-first', 'natural makeup', 'whitening', 'anti-aging'],
        activities: ['walking', 'cycling', 'onsen', 'tea ceremony'],
        festivals: ['Cherry Blossom Festival', 'Gion Matsuri', 'Tanabata', 'Sapporo Snow Festival']
      },
      'GB': {
        holidays: ['Christmas', 'Easter', 'Bank Holidays', 'Guy Fawkes Night'],
        dietary: ['fish and chips', 'tea', 'scones', 'roast dinner'],
        beauty: ['classic', 'elegant', 'natural', 'heritage'],
        activities: ['football', 'cricket', 'gardening', 'pub visits'],
        festivals: ['Glastonbury', 'Edinburgh Fringe', 'Notting Hill Carnival', 'Chelsea Flower Show']
      }
    };

    return profiles[country] || profiles['US'];
  }

  // 경제 프로필
  getEconomicProfile(country) {
    const profiles = {
      'KR': {
        inflation: 2.5,
        unemployment: 3.2,
        costOfLiving: 75,
        currency: 'KRW',
        economicTrend: 'stable',
        recommendations: {
          budget: '50/30/20 원칙으로 예산 관리',
          investment: 'KOSPI 지수펀드 고려',
          savings: '급여의 20% 저축 목표'
        }
      },
      'US': {
        inflation: 3.1,
        unemployment: 3.8,
        costOfLiving: 100,
        currency: 'USD',
        economicTrend: 'growing',
        recommendations: {
          budget: '50/30/20 규칙 적용',
          investment: 'S&P 500 지수펀드',
          savings: '비상금 6개월치 확보'
        }
      },
      'JP': {
        inflation: 1.2,
        unemployment: 2.6,
        costOfLiving: 85,
        currency: 'JPY',
        economicTrend: 'stable',
        recommendations: {
          budget: '절약 중심의 생활',
          investment: '일본 국채 및 안정적 주식',
          savings: '장기 저축 계획'
        }
      }
    };

    return profiles[country] || profiles['US'];
  }

  // 지정학적 프로필
  getGeopoliticalProfile(country) {
    const profiles = {
      'KR': {
        stability: 'high',
        travelAdvisory: 'normal',
        currentIssues: ['북한 관계', '한미 동맹', '반도체 산업'],
        recommendations: {
          stress: '정치 뉴스 과다 노출 주의',
          activities: '일상에 집중, 취미 활동',
          support: '필요시 전문 상담 고려'
        }
      },
      'US': {
        stability: 'medium',
        travelAdvisory: 'normal',
        currentIssues: ['대선', '경제 정책', '국제 관계'],
        recommendations: {
          stress: '뉴스 소비량 조절',
          activities: '지역 사회 참여',
          support: '정치적 스트레스 관리'
        }
      },
      'JP': {
        stability: 'high',
        travelAdvisory: 'normal',
        currentIssues: ['인구 고령화', '경제 정책', '국제 협력'],
        recommendations: {
          stress: '일과 삶의 균형',
          activities: '전통 문화 체험',
          support: '워라밸 중시'
        }
      }
    };

    return profiles[country] || profiles['US'];
  }

  // 위치에서 국가 추출 (간단한 버전)
  getCountryFromLocation(location) {
    // 실제로는 Reverse Geocoding API를 사용해야 함
    // 여기서는 간단한 예시
    if (location.lat >= 33 && location.lat <= 39 && location.lon >= 124 && location.lon <= 132) {
      return 'KR';
    } else if (location.lat >= 25 && location.lat <= 50 && location.lon >= -125 && location.lon <= -65) {
      return 'US';
    } else if (location.lat >= 30 && location.lat <= 46 && location.lon >= 129 && location.lon <= 146) {
      return 'JP';
    } else {
      return 'US'; // 기본값
    }
  }

  // 캐시 관리
  getCachedData(key, type) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL[type]) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data, type) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now(),
      type: type
    });
  }

  // 폴백 데이터
  getFallbackWeather() {
    return {
      data: { temperature: 20, humidity: 50, uvIndex: 5, airQuality: 25, condition: 'Clear' },
      impacts: { skincare: [], activities: [], mood: [], health: [] },
      riskLevel: 'low'
    };
  }

  getFallbackCultural() {
    return {
      holidays: [],
      dietary: ['general'],
      beauty: ['natural'],
      activities: ['walking', 'exercise'],
      festivals: []
    };
  }

  getFallbackEconomic() {
    return {
      inflation: 2.0,
      unemployment: 4.0,
      costOfLiving: 80,
      currency: 'USD',
      economicTrend: 'stable',
      recommendations: {
        budget: '기본 예산 관리',
        investment: '안정적 투자',
        savings: '정기 저축'
      }
    };
  }

  getFallbackGeopolitical() {
    return {
      stability: 'medium',
      travelAdvisory: 'normal',
      currentIssues: [],
      recommendations: {
        stress: '일상에 집중',
        activities: '취미 활동',
        support: '필요시 상담'
      }
    };
  }

  getFallbackContext(location, persona) {
    return {
      weather: this.getFallbackWeather(),
      cultural: this.getFallbackCultural(),
      economic: this.getFallbackEconomic(),
      geopolitical: this.getFallbackGeopolitical(),
      timestamp: new Date(),
      location: location,
      fallback: true
    };
  }

  // 종합 추천 생성
  generateComprehensiveRecommendations(persona, context) {
    const recommendations = {
      immediate: [],
      lifestyle: [],
      health: [],
      cultural: [],
      economic: []
    };

    // 날씨 기반 추천
    if (context.weather.impacts.skincare.length > 0) {
      recommendations.immediate.push(...context.weather.impacts.skincare);
    }
    if (context.weather.impacts.activities.length > 0) {
      recommendations.lifestyle.push(...context.weather.impacts.activities);
    }

    // 문화 기반 추천
    if (context.cultural.activities) {
      recommendations.cultural.push({
        category: 'cultural_activities',
        activities: context.cultural.activities.slice(0, 3),
        advice: '현지 문화를 체험해보세요.'
      });
    }

    // 경제 기반 추천
    if (context.economic.recommendations) {
      recommendations.economic.push({
        category: 'financial_health',
        advice: context.economic.recommendations.budget,
        priority: context.economic.inflation > 5 ? 'high' : 'medium'
      });
    }

    // 지정학적 기반 추천
    if (context.geopolitical.recommendations) {
      recommendations.health.push({
        category: 'mental_health',
        advice: context.geopolitical.recommendations.stress,
        activities: context.geopolitical.recommendations.activities
      });
    }

    return recommendations;
  }
}

module.exports = { EnvironmentalIntelligence }; 