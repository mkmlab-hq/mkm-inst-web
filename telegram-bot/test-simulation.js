/**
 * MKM Lab 텔레그램 봇 테스트 시뮬레이션
 * 
 * 새로운 페르소나 규칙 시스템을 테스트하기 위한 시뮬레이션 스크립트
 */

const { PersonaAnalyzer } = require('./src/persona-analyzer');
const { PersonaRules } = require('./src/persona-rules');

class BotSimulation {
  constructor() {
    this.personaAnalyzer = new PersonaAnalyzer();
    this.personaRules = new PersonaRules();
    this.userState = {
      currentPersona: null,
      lastPersonaResult: null,
      environmentalContext: null,
      location: null
    };
  }

  // 시뮬레이션 시작
  async runSimulation() {
    console.log('🤖 MKM Lab 텔레그램 봇 시뮬레이션 시작\n');
    
    await this.simulateWelcome();
    await this.simulatePhotoAnalysis();
    await this.simulateTextAnalysis();
    await this.simulateLocationSharing();
    await this.simulateDispositionAnalysis();
    await this.simulatePersonaEvolution();
    await this.simulateComprehensiveAnalysis();
    
    console.log('\n✅ 시뮬레이션 완료!');
  }

  // 환영 메시지 시뮬레이션
  async simulateWelcome() {
    console.log('📱 사용자: /start');
    console.log('🤖 봇: 안녕하세요! MKM Lab 건강 페르소나 분석 봇입니다.');
    console.log('   당신의 건강을 위한 맞춤형 분석과 조언을 제공해드립니다.');
    console.log('   사진을 보내거나 건강 관련 메시지를 입력해보세요!\n');
    await this.delay(1000);
  }

  // 사진 분석 시뮬레이션
  async simulatePhotoAnalysis() {
    console.log('📱 사용자: [사진 전송]');
    console.log('🤖 봇: 📸 사진을 받았습니다! 얼굴 분석을 시작합니다...');
    
    await this.delay(3000);
    
    // 얼굴 특징 데이터 시뮬레이션
    const facialData = {
      eyes: 'bright',
      mouth: 'firm',
      forehead: 'high',
      jaw: 'strong',
      overall: 'confident'
    };

    // 환경 데이터 시뮬레이션
    const envData = {
      weather: 'sunny',
      time: 'morning',
      season: 'spring'
    };

    // 종합 페르소나 분석
    const result = this.personaAnalyzer.analyzePersona(facialData, null, envData);
    const formatted = this.personaAnalyzer.formatPersonaResult(result);
    
    console.log('🤖 봇:', formatted.text.replace(/\*/g, ''));
    
    // 기질별 맞춤 조언
    const dispositionAdvice = this.personaAnalyzer.getDispositionBasedAdvice(result.scores);
    if (dispositionAdvice) {
      console.log('🤖 봇: 💡 기질별 맞춤 조언');
      console.log('   ' + dispositionAdvice.replace(/\*/g, ''));
    }

    // 사용자 상태 업데이트
    this.userState.currentPersona = result.persona.code;
    this.userState.lastPersonaResult = result;
    
    console.log('');
    await this.delay(2000);
  }

  // 텍스트 분석 시뮬레이션
  async simulateTextAnalysis() {
    console.log('📱 사용자: 건강한 생활을 위해 체계적으로 운동하고 있어요. 분석적인 접근으로 건강을 관리하고 싶어요.');
    console.log('🤖 봇: 🔍 메시지를 분석하여 당신의 건강 페르소나를 찾아보겠습니다...');
    
    await this.delay(2000);
    
    // 환경 데이터 준비
    const envData = {
      weather: 'sunny',
      time: 'afternoon',
      season: 'spring'
    };

    // 종합 페르소나 분석
    const result = this.personaAnalyzer.analyzePersona(
      null, 
      '건강한 생활을 위해 체계적으로 운동하고 있어요. 분석적인 접근으로 건강을 관리하고 싶어요.',
      envData
    );
    const formatted = this.personaAnalyzer.formatPersonaResult(result);
    
    console.log('🤖 봇:', formatted.text.replace(/\*/g, ''));
    
    // 기질별 맞춤 조언
    const dispositionAdvice = this.personaAnalyzer.getDispositionBasedAdvice(result.scores);
    if (dispositionAdvice) {
      console.log('🤖 봇: 💡 기질별 맞춤 조언');
      console.log('   ' + dispositionAdvice.replace(/\*/g, ''));
    }

    // 페르소나 진화 추적
    const evolution = this.personaAnalyzer.trackPersonaEvolution('user123', result, this.userState.lastPersonaResult);
    if (!evolution.isFirstTime && Object.keys(evolution.changes).length > 0) {
      console.log('🤖 봇: 🔄 페르소나 진화 감지');
      console.log('   ' + evolution.message);
      Object.keys(evolution.changes).forEach(key => {
        const change = evolution.changes[key];
        console.log(`   • ${key}: ${change > 0 ? '+' : ''}${change}`);
      });
    }

    // 사용자 상태 업데이트
    this.userState.previousPersonaResult = this.userState.lastPersonaResult;
    this.userState.lastPersonaResult = result;
    
    console.log('');
    await this.delay(2000);
  }

  // 위치 공유 시뮬레이션
  async simulateLocationSharing() {
    console.log('📱 사용자: [위치 정보 공유 - 서울]');
    console.log('🤖 봇: 📍 위치 정보를 받았습니다! 환경 데이터를 분석하는 중...');
    
    await this.delay(2000);
    
    // 환경 컨텍스트 시뮬레이션
    const context = {
      weather: {
        condition: 'sunny',
        temperature: 22,
        humidity: 65,
        description: '맑음'
      },
      cultural: {
        region: '서울',
        language: '한국어',
        timezone: 'Asia/Seoul'
      },
      economic: {
        currency: 'KRW',
        gdp_per_capita: 35000
      },
      geopolitical: {
        country: '대한민국',
        stability: 'high'
      }
    };

    this.userState.environmentalContext = context;
    this.userState.location = { lat: 37.5665, lon: 126.9780 };

    console.log('🤖 봇: 🌍 환경 분석 완료!');
    console.log('   📍 위치: 서울, 대한민국');
    console.log('   🌤️ 날씨: 맑음, 22°C');
    console.log('   💰 경제: 안정적인 경제 환경');
    console.log('   🏛️ 정치: 안정적인 정치 환경');
    
    console.log('');
    await this.delay(2000);
  }

  // 기질 분석 시뮬레이션
  async simulateDispositionAnalysis() {
    console.log('📱 사용자: /disposition');
    
    if (!this.userState.lastPersonaResult) {
      console.log('🤖 봇: 📊 기질 분석을 보려면 먼저 페르소나 분석을 진행해주세요.');
      return;
    }

    const scores = this.userState.lastPersonaResult.scores;
    const personaRules = this.personaAnalyzer.personaRules;
    
    console.log('🤖 봇: 🧠 기질 분석 결과');
    console.log('');
    
    Object.keys(scores).forEach(indicator => {
      const score = scores[indicator];
      const indicatorInfo = personaRules.dispositionIndicators[indicator];
      
      console.log(`   ${indicatorInfo.name}`);
      console.log(`   점수: ${score}/100`);
      
      if (score >= 70) {
        console.log(`   특징: ${indicatorInfo.indicators.join(', ')}`);
      } else if (score <= 30) {
        console.log(`   특징: ${indicatorInfo.opposites.join(', ')}`);
      } else {
        console.log('   특징: 균형잡힌 성향');
      }
      console.log('');
    });
    
    await this.delay(2000);
  }

  // 페르소나 진화 시뮬레이션
  async simulatePersonaEvolution() {
    console.log('📱 사용자: /evolution');
    
    if (!this.userState.lastPersonaResult) {
      console.log('🤖 봇: 🔄 페르소나 진화를 추적하려면 먼저 페르소나 분석을 진행해주세요.');
      return;
    }

    const evolution = this.personaAnalyzer.trackPersonaEvolution(
      'user123', 
      this.userState.lastPersonaResult, 
      this.userState.previousPersonaResult
    );

    console.log('🤖 봇: 🔄 페르소나 진화 추적');
    console.log('');
    console.log(`   ${evolution.message}`);
    console.log('');

    if (evolution.isFirstTime) {
      console.log('   첫 번째 분석이므로 변화 추적을 시작합니다.');
    } else if (Object.keys(evolution.changes).length > 0) {
      console.log('   변화된 기질:');
      Object.keys(evolution.changes).forEach(key => {
        const change = evolution.changes[key];
        const direction = change > 0 ? '증가' : '감소';
        console.log(`   • ${key}: ${Math.abs(change)}점 ${direction}`);
      });
    } else {
      console.log('   페르소나가 안정적으로 유지되고 있습니다.');
    }
    
    console.log('');
    await this.delay(2000);
  }

  // 종합 분석 시뮬레이션
  async simulateComprehensiveAnalysis() {
    console.log('📱 사용자: 종합적인 건강 분석을 받고 싶어요.');
    console.log('🤖 봇: 🎯 종합 건강 분석을 시작합니다...');
    
    await this.delay(2000);
    
    if (!this.userState.lastPersonaResult || !this.userState.environmentalContext) {
      console.log('🤖 봇: 종합 분석을 위해서는 페르소나와 환경 정보가 필요합니다.');
      return;
    }

    const persona = this.userState.lastPersonaResult.persona;
    const scores = this.userState.lastPersonaResult.scores;
    const context = this.userState.environmentalContext;

    console.log('🤖 봇: 🎯 종합 건강 분석 결과');
    console.log('');
    console.log(`   페르소나: ${persona.name} (${persona.koreanName})`);
    console.log(`   현재 위치: 서울, 대한민국`);
    console.log(`   날씨: ${context.weather.description}, ${context.weather.temperature}°C`);
    console.log('');
    console.log('   💡 맞춤형 건강 조언:');
    
    // 페르소나별 조언
    const advice = this.personaAnalyzer.getHealthAdvice(persona.code, 'general');
    console.log(`   • ${advice}`);
    
    // 기질별 조언
    const dispositionAdvice = this.personaAnalyzer.getDispositionBasedAdvice(scores);
    if (dispositionAdvice) {
      console.log(`   • ${dispositionAdvice.split('\n')[0]}`);
    }
    
    // 날씨별 조언
    if (context.weather.condition === 'sunny') {
      console.log('   • 맑은 날씨에 실외 활동을 추천합니다.');
    }
    
    console.log('');
    await this.delay(2000);
  }

  // 지연 함수
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 규칙 시스템 테스트
  testPersonaRules() {
    console.log('🧪 페르소나 규칙 시스템 테스트\n');
    
    // 얼굴 분석 테스트
    console.log('1. 얼굴 분석 테스트:');
    const facialData = {
      eyes: 'deep',
      mouth: 'soft',
      forehead: 'high',
      jaw: 'round',
      overall: 'thoughtful'
    };
    const facialScores = this.personaRules.analyzeFacialFeatures(facialData);
    console.log('   얼굴 특징:', facialData);
    console.log('   분석 결과:', facialScores);
    console.log('');

    // 텍스트 분석 테스트
    console.log('2. 텍스트 분석 테스트:');
    const text = '분석적이고 체계적으로 건강을 관리하고 싶어요. 깊이 있는 사색을 통해 내면의 평화를 찾고 있어요.';
    const textScores = this.personaRules.analyzeText(text);
    console.log('   텍스트:', text);
    console.log('   분석 결과:', textScores);
    console.log('');

    // 환경 분석 테스트
    console.log('3. 환경 분석 테스트:');
    const envData = {
      weather: 'rainy',
      time: 'evening',
      season: 'autumn'
    };
    const envScores = this.personaRules.analyzeEnvironment(envData);
    console.log('   환경 데이터:', envData);
    console.log('   분석 결과:', envScores);
    console.log('');

    // 종합 분석 테스트
    console.log('4. 종합 분석 테스트:');
    const result = this.personaRules.determinePersona(facialScores, textScores, envScores);
    console.log('   최종 페르소나:', result.persona.name);
    console.log('   신뢰도:', Math.round(result.confidence * 100) + '%');
    console.log('   최종 점수:', result.scores);
    console.log('');
  }
}

// 시뮬레이션 실행
async function runTests() {
  const simulation = new BotSimulation();
  
  console.log('🚀 MKM Lab 텔레그램 봇 테스트 시작\n');
  
  // 규칙 시스템 테스트
  simulation.testPersonaRules();
  
  // 봇 시뮬레이션
  await simulation.runSimulation();
}

// 테스트 실행
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { BotSimulation }; 