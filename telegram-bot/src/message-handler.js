// 텔레그램 메시지 핸들러
const { WeatherService } = require('./weather-service');
const { EnvironmentalIntelligence } = require('./environmental-intelligence');
const { LimitedEditionEvents } = require('./limited-edition-events');
const { ImageGenerator } = require('./image-generator');
const DataDreamscapeGenerator = require('./data-dreamscape-generator');

class MessageHandler {
  constructor(bot, personaAnalyzer) {
    this.bot = bot;
    this.personaAnalyzer = personaAnalyzer;
    this.weatherService = new WeatherService();
    this.environmentalIntelligence = new EnvironmentalIntelligence();
    this.environmentalIntelligence.setWeatherService(this.weatherService);
    this.userStates = new Map(); // 사용자 상태 관리
    this.limitedEditionEvents = new LimitedEditionEvents(); // 한정판 이벤트 시스템
    this.imageGenerator = new ImageGenerator(); // AI 이미지 생성 시스템
    this.dreamscapeGenerator = new DataDreamscapeGenerator(); // 데이터 드림스케이프 생성 시스템
  }

  async handleMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    const userState = this.userStates.get(chatId) || {};

    console.log(`📨 메시지 수신: ${text.substring(0, 50)}...`);

    // 명령어 처리
    if (text.startsWith('/')) {
      await this.handleCommand(msg);
      return;
    }

    // 사진 처리
    if (msg.photo) {
      await this.handlePhoto(msg);
      return;
    }

    // 위치 정보 처리
    if (msg.location) {
      await this.handleLocation(msg);
      return;
    }

    // 일반 텍스트 메시지 처리
    await this.handleTextMessage(msg, userState);
  }

  async handleCommand(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;

    switch (text) {
      case '/start':
        await this.sendWelcomeMessage(chatId);
        break;
      
      case '/help':
        await this.sendHelpMessage(chatId);
        break;
      
      case '/analyze':
        await this.startAnalysis(chatId);
        break;
      
      case '/persona':
        await this.showPersonaInfo(chatId);
        break;
      
      case '/weather':
        await this.showWeatherOptions(chatId);
        break;
      
      case '/advice':
        await this.showAdviceOptions(chatId);
        break;
      
      case '/environment':
        await this.showEnvironmentOptions(chatId);
        break;
      
      case '/disposition':
        await this.showDispositionAnalysis(chatId);
        break;
      
      case '/evolution':
        await this.showPersonaEvolution(chatId);
        break;
      
      case '/events':
        await this.showLimitedEditionEvents(chatId);
        break;
      
      case '/event':
        await this.showEventDashboard(chatId);
        break;
      
      case '/image':
        await this.generatePersonaImage(chatId);
        break;
      
      case '/limited':
        await this.generateLimitedEditionImage(chatId);
        break;
      
      case '/dreamscape':
        await this.generateDreamscapeImage(chatId);
        break;
      
      case '/logo':
        await this.generatePersonaLogo(chatId);
        break;
      
      case '/styles':
        await this.showAvailableStyles(chatId);
        break;
      
      default:
        await this.bot.sendMessage(chatId, 
          '❓ 알 수 없는 명령어입니다.\n/help를 입력하여 사용법을 확인하세요.'
        );
    }
  }

  async handlePhoto(msg) {
    const chatId = msg.chat.id;
    const userState = this.userStates.get(chatId) || {};
    
    await this.bot.sendMessage(chatId, 
      '📸 사진을 받았습니다! 얼굴 분석을 시작합니다...'
    );

    // 사진 분석 시뮬레이션 (실제로는 얼굴 분석 API 호출)
    setTimeout(async () => {
      // 얼굴 특징 데이터 시뮬레이션
      const facialData = {
        eyes: ['bright', 'deep'][Math.floor(Math.random() * 2)],
        mouth: ['firm', 'soft'][Math.floor(Math.random() * 2)],
        forehead: ['high', 'broad'][Math.floor(Math.random() * 2)],
        jaw: ['strong', 'round'][Math.floor(Math.random() * 2)],
        overall: ['confident', 'thoughtful'][Math.floor(Math.random() * 2)]
      };

      // 환경 데이터 준비
      const envData = userState.environmentalContext ? {
        weather: userState.environmentalContext.weather?.condition || 'sunny',
        time: this.getCurrentTimeOfDay(),
        season: this.getCurrentSeason()
      } : null;

      // 종합 페르소나 분석
      const result = this.personaAnalyzer.analyzePersona(facialData, null, envData);
      const formatted = this.personaAnalyzer.formatPersonaResult(result);
      
      await this.bot.sendMessage(chatId, formatted.text, { parse_mode: 'Markdown' });
      
      // 기질별 맞춤 조언 추가
      const dispositionAdvice = this.personaAnalyzer.getDispositionBasedAdvice(result.scores);
      if (dispositionAdvice) {
        await this.bot.sendMessage(chatId, 
          `💡 *기질별 맞춤 조언*\n\n${dispositionAdvice}`,
          { parse_mode: 'Markdown' }
        );
      }
      
      // 사용자 상태 업데이트
      const previousResult = userState.lastPersonaResult;
      userState.currentPersona = result.persona.code;
      userState.lastPersonaResult = result;
      userState.lastAnalysis = new Date();
      this.userStates.set(chatId, userState);

      // 페르소나 진화 추적
      if (previousResult) {
        const evolution = this.personaAnalyzer.trackPersonaEvolution(chatId, result, previousResult);
        if (!evolution.isFirstTime && Object.keys(evolution.changes).length > 0) {
          await this.bot.sendMessage(chatId, 
            `🔄 *페르소나 진화 감지*\n\n${evolution.message}\n\n` +
            Object.keys(evolution.changes).map(key => 
              `• ${key}: ${evolution.changes[key] > 0 ? '+' : ''}${evolution.changes[key]}`
            ).join('\n'),
            { parse_mode: 'Markdown' }
          );
        }
      }

      // 환경 정보가 있으면 종합 추천 추가
      if (userState.environmentalContext) {
        await this.sendComprehensiveRecommendations(chatId, result.persona.code, userState.environmentalContext);
      } else if (userState.location) {
        await this.sendWeatherBasedRecommendation(chatId, result.persona.code, userState.location);
      }
    }, 3000);
  }

  async handleLocation(msg) {
    const chatId = msg.chat.id;
    const location = msg.location;

    await this.bot.sendMessage(chatId, 
      '📍 위치 정보를 받았습니다! 환경 데이터를 분석하는 중...'
    );

    try {
      const userState = this.userStates.get(chatId) || {};
      const currentLocation = { lat: location.latitude, lon: location.longitude };
      
      // 종합 환경 컨텍스트 수집
      const context = await this.environmentalIntelligence.getComprehensiveContext(
        currentLocation, 
        userState.currentPersona || 'P1'
      );

      // 사용자 상태 업데이트
      userState.location = currentLocation;
      userState.environmentalContext = context;
      this.userStates.set(chatId, userState);

      // 환경 정보 요약 메시지 전송
      await this.sendEnvironmentalSummary(chatId, context);

      // 페르소나가 있으면 종합 추천
      if (userState.currentPersona) {
        await this.sendComprehensiveRecommendations(chatId, userState.currentPersona, context);
      }
    } catch (error) {
      console.error('위치 처리 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 위치 정보 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  }

  async handleTextMessage(msg, userState) {
    const chatId = msg.chat.id;
    const text = msg.text;

    // 날씨 관련 키워드
    const weatherKeywords = ['날씨', '비', '맑음', '흐림', '더워', '추워', '습도', '기온'];
    const hasWeatherKeyword = weatherKeywords.some(keyword => text.includes(keyword));

    if (hasWeatherKeyword) {
      await this.handleWeatherQuery(chatId, text);
      return;
    }

    // 건강 관련 키워드가 포함된 경우 페르소나 분석
    const healthKeywords = ['건강', '운동', '식단', '스트레스', '수면', '피로', '활력', '에너지'];
    const hasHealthKeyword = healthKeywords.some(keyword => text.includes(keyword));

    if (hasHealthKeyword) {
      await this.bot.sendMessage(chatId, 
        '🔍 메시지를 분석하여 당신의 건강 페르소나를 찾아보겠습니다...'
      );

      setTimeout(async () => {
        // 환경 데이터 준비
        const envData = userState.environmentalContext ? {
          weather: userState.environmentalContext.weather?.condition || 'sunny',
          time: this.getCurrentTimeOfDay(),
          season: this.getCurrentSeason()
        } : null;

        // 종합 페르소나 분석
        const result = this.personaAnalyzer.analyzePersona(null, text, envData);
        const formatted = this.personaAnalyzer.formatPersonaResult(result);
        
        await this.bot.sendMessage(chatId, formatted.text, { parse_mode: 'Markdown' });
        
        // 기질별 맞춤 조언 추가
        const dispositionAdvice = this.personaAnalyzer.getDispositionBasedAdvice(result.scores);
        if (dispositionAdvice) {
          await this.bot.sendMessage(chatId, 
            `💡 *기질별 맞춤 조언*\n\n${dispositionAdvice}`,
            { parse_mode: 'Markdown' }
          );
        }
        
        // 사용자 상태 업데이트
        const previousResult = userState.lastPersonaResult;
        userState.currentPersona = result.persona.code;
        userState.lastPersonaResult = result;
        userState.lastAnalysis = new Date();
        this.userStates.set(chatId, userState);

        // 페르소나 진화 추적
        if (previousResult) {
          const evolution = this.personaAnalyzer.trackPersonaEvolution(chatId, result, previousResult);
          if (!evolution.isFirstTime && Object.keys(evolution.changes).length > 0) {
            await this.bot.sendMessage(chatId, 
              `🔄 *페르소나 진화 감지*\n\n${evolution.message}\n\n` +
              Object.keys(evolution.changes).map(key => 
                `• ${key}: ${evolution.changes[key] > 0 ? '+' : ''}${evolution.changes[key]}`
              ).join('\n'),
              { parse_mode: 'Markdown' }
            );
          }
        }

        // 환경 정보가 있으면 종합 추천 추가
        const updatedState = this.userStates.get(chatId);
        if (updatedState.environmentalContext) {
          await this.sendComprehensiveRecommendations(chatId, result.persona.code, updatedState.environmentalContext);
        } else if (updatedState.location) {
          await this.sendWeatherBasedRecommendation(chatId, result.persona.code, updatedState.location);
        }
      }, 2000);
    } else {
      // 일반적인 대화 응답
      await this.bot.sendMessage(chatId, 
        '안녕하세요! 건강이나 날씨에 대해 궁금한 것이 있으시면 언제든 말씀해주세요.\n\n' +
        '💡 *사용 가능한 명령어:*\n' +
        '/analyze - 페르소나 분석 시작\n' +
        '/disposition - 기질 분석 보기\n' +
        '/evolution - 페르소나 진화 추적\n' +
        '/weather - 날씨 정보 확인\n' +
        '/advice - 건강 조언 받기\n' +
        '/help - 도움말 보기',
        { parse_mode: 'Markdown' }
      );
    }
  }

  async handleWeatherQuery(chatId, text) {
    // 도시명 추출 시도
    const cityMatch = text.match(/(서울|부산|대구|인천|광주|대전|울산|제주|뉴욕|런던|파리|도쿄|베이징|시드니)/);
    
    if (cityMatch) {
      const cityName = cityMatch[1];
      await this.bot.sendMessage(chatId, 
        `🌤️ ${cityName}의 날씨 정보를 가져오는 중...`
      );

      try {
        const weather = await this.weatherService.getWeatherByCity(cityName);
        const weatherMessage = this.weatherService.formatWeatherMessage(weather);
        
        await this.bot.sendMessage(chatId, weatherMessage, { parse_mode: 'Markdown' });

        // 사용자 상태 업데이트
        const userState = this.userStates.get(chatId) || {};
        userState.weather = weather;
        this.userStates.set(chatId, userState);

        // 페르소나가 있으면 날씨 기반 추천
        if (userState.currentPersona) {
          await this.sendWeatherBasedRecommendation(chatId, userState.currentPersona, null, weather);
        }
      } catch (error) {
        console.error('날씨 조회 오류:', error);
        await this.bot.sendMessage(chatId, 
          '😔 날씨 정보를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
      }
    } else {
      await this.bot.sendMessage(chatId, 
        '🌤️ 날씨 정보를 확인하려면:\n\n' +
        '1. 📍 위치 정보를 공유해주세요 (📍 버튼 클릭)\n' +
        '2. 또는 도시명을 포함해서 메시지를 보내주세요\n' +
        '   예: "서울 날씨 어때?", "뉴욕 날씨 알려줘"'
      );
    }
  }

  async sendWeatherBasedRecommendation(chatId, personaCode, location, weather = null) {
    try {
      let currentWeather = weather;
      
      if (!currentWeather && location) {
        currentWeather = await this.weatherService.getWeatherByLocation(location.lat, location.lon);
      }

      if (!currentWeather) {
        currentWeather = this.weatherService.getDefaultWeather();
      }

      const activities = this.weatherService.getWeatherBasedActivity(currentWeather, personaCode);
      const healthAdvice = this.weatherService.getWeatherBasedHealthAdvice(currentWeather, personaCode);

      const recommendationText = `🌍 *${currentWeather.city} 날씨 기반 추천*

${healthAdvice}

*오늘 추천 활동:*
${activities.map(activity => `• ${activity}`).join('\n')}

💡 이 추천은 당신의 페르소나와 현재 날씨를 고려하여 제공됩니다!`;

      await this.bot.sendMessage(chatId, recommendationText, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('날씨 기반 추천 오류:', error);
    }
  }

  async sendWelcomeMessage(chatId) {
    const welcomeText = `🎉 *MKM Lab 건강 페르소나 봇에 오신 것을 환영합니다!*

저는 AI 기반 건강 분석 봇입니다. 당신의 고유한 건강 페르소나를 분석하고 **날씨, 문화, 경제, 정치까지 고려한** 종합적인 맞춤형 건강 조언을 제공합니다.

*주요 기능:*
• 🎯 건강 페르소나 분석
• 🌤️ 날씨 기반 맞춤 추천
• 🌍 환경 종합 분석 (문화, 경제, 정치)
• 💡 맞춤형 건강 조언
• 📸 사진 기반 분석
• 💬 대화 기반 분석

*사용법:*
• 사진을 보내면 자동으로 분석합니다
• 건강 관련 메시지를 보내면 페르소나를 분석합니다
• 📍 위치 정보를 공유하면 날씨 기반 추천을 받을 수 있습니다
• /analyze 명령어로 분석을 시작할 수 있습니다

지금 바로 건강에 대해 이야기해보세요! 😊`;

    await this.bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' });
  }

  async sendHelpMessage(chatId) {
    const helpText = `📚 *도움말*

*명령어 목록:*
/start - 시작 메시지
/help - 이 도움말 보기
/analyze - 페르소나 분석 시작
/weather - 날씨 정보 확인
/persona - 페르소나 정보 보기
/advice - 건강 조언 받기
/environment - 환경 기반 추천
/events - 한정판 이벤트 보기
/event - 이벤트 대시보드
/disposition - 기질 분석 보기
/evolution - 페르소나 진화 추적
/image - 기본 페르소나 이미지 생성
/dreamscape - 🌌 데이터 드림스케이프 생성
/logo - 🎨 나만의 로고 완성
/limited - 한정판 이미지 생성
/styles - 사용 가능한 스타일 목록

*사용 방법:*
1. 사진을 보내면 자동으로 분석됩니다
2. 건강 관련 메시지를 보내면 텍스트 기반 분석을 합니다
3. 📍 위치 정보를 공유하면 날씨 기반 추천을 받을 수 있습니다
4. 분석 결과에 따라 맞춤형 조언을 받을 수 있습니다

*건강 페르소나:*
• P1: The Visionary Leader (비전 리더)
• P2: The Balanced Builder (균형 조성가)
• P3: The Dynamic Explorer (동적 탐험가)
• P4: The Mindful Guardian (마음챙김 수호자)

*특별 기능:*
• 🌌 데이터 드림스케이프 (AI 고유 미학)
• 🎨 페르소나 로고 생성 (개인 브랜딩)
• 🎭 한정판 이벤트 참여로 특별 페르소나 획득
• 🧠 5차원 기질 분석 (사고형, 내향형, 주도형, 실용형, 안정형)
• 🔄 페르소나 진화 추적으로 변화 패턴 분석
• 🌍 환경 지능 통합 (날씨, 문화, 경제, 정치)

*이미지 생성 기능:*
• 기본 페르소나 이미지 (/image)
• 데이터 드림스케이프 (/dreamscape) - AI 고유의 미학
• 페르소나 로고 (/logo) - 개인 브랜딩용
• 한정판 이벤트 이미지 (/limited)

*철학:*
"내면의 초상을, AI의 시선으로 재창조하다"

궁금한 것이 있으시면 언제든 말씀해주세요! 😊`;

    await this.bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  async startAnalysis(chatId) {
    const analysisText = `🔍 *페르소나 분석을 시작합니다*

다음 중 하나를 선택해주세요:

1. 📸 *사진 보내기* - 얼굴 사진을 보내면 자동으로 분석합니다
2. 💬 *메시지 보내기* - 건강에 대해 이야기하면 텍스트 기반으로 분석합니다
3. 📍 *위치 정보 공유* - 날씨 기반 맞춤 추천을 받을 수 있습니다

예시 메시지:
• "요즘 피로하고 스트레스가 많아요"
• "운동을 시작하고 싶은데 어떤 것이 좋을까요?"
• "수면의 질을 개선하고 싶어요"
• "서울 날씨 어때?"

어떤 방법으로 분석하시겠습니까?`;

    await this.bot.sendMessage(chatId, analysisText, { parse_mode: 'Markdown' });
  }

  async showWeatherOptions(chatId) {
    const weatherText = `🌤️ *날씨 정보 확인*

다음 중 하나를 선택해주세요:

1. 📍 *위치 정보 공유* - 현재 위치의 날씨 정보를 확인합니다
2. 💬 *도시명 메시지* - 도시명을 포함해서 메시지를 보내주세요
   예: "서울 날씨 어때?", "뉴욕 날씨 알려줘"

*날씨 기반 추천 기능:*
• 현재 날씨에 맞는 활동 추천
• 페르소나별 맞춤 건강 조언
• 실시간 날씨 정보 제공

위치 정보를 공유하거나 도시명을 알려주세요!`;

    await this.bot.sendMessage(chatId, weatherText, { parse_mode: 'Markdown' });
  }

  async showPersonaInfo(chatId) {
    const personaText = `🎯 *건강 페르소나 소개*

*P1: The Visionary Leader (비전 리더)*
창의적이고 혁신적인 건강 혁신가
→ 새로운 건강 방법에 관심이 많고 리더십이 강함

*P2: The Balanced Builder (균형 조성가)*
안정적이고 체계적인 건강 관리자
→ 규칙적이고 실용적인 건강 관리에 적합

*P3: The Dynamic Explorer (동적 탐험가)*
활발하고 적응력 강한 건강 탐험가
→ 다양한 활동과 새로운 경험을 추구

*P4: The Mindful Guardian (마음챙김 수호자)*
신중하고 세심한 건강 수호자
→ 마음챙김과 내면의 평화를 중요시

당신의 페르소나를 알아보려면 /analyze를 입력하세요!`;

    await this.bot.sendMessage(chatId, personaText, { parse_mode: 'Markdown' });
  }

  async showAdviceOptions(chatId) {
    const userState = this.userStates.get(chatId);
    
    if (!userState.currentPersona) {
      await this.bot.sendMessage(chatId, 
        '먼저 페르소나 분석을 진행해주세요!\n/analyze 명령어를 입력하거나 건강에 대해 이야기해보세요.'
      );
      return;
    }

    const adviceText = `💡 *건강 조언 카테고리*

다음 중 관심 있는 주제를 선택해주세요:

• 🏃‍♂️ 운동
• 🍎 식단
• 😌 스트레스 관리
• 💤 수면
• 🎯 일반적인 건강 관리
• 🌤️ 날씨 기반 추천
• 🌍 환경 기반 추천

원하는 주제를 말씀해주시면 ${userState.currentPersona} 페르소나에 맞는 맞춤형 조언을 드리겠습니다!`;

    await this.bot.sendMessage(chatId, adviceText, { parse_mode: 'Markdown' });
  }

  async showEnvironmentOptions(chatId) {
    const userState = this.userStates.get(chatId);
    
    if (!userState.currentPersona) {
      await this.bot.sendMessage(chatId, 
        '먼저 페르소나 분석을 진행해주세요!\n/analyze 명령어를 입력하거나 건강에 대해 이야기해보세요.'
      );
      return;
    }

    const environmentText = `🌍 *환경 기반 추천*

현재 위치의 종합적인 환경 정보를 분석하여 맞춤형 추천을 제공합니다.

*분석 항목:*
• 🌤️ 날씨 (기온, 습도, 자외선, 대기질)
• 🎭 문화 (현지 활동, 축제, 전통)
• 💰 경제 (인플레이션, 실업률, 경제 동향)
• 🏛️ 정치 (안정성, 여행 권고)

*사용법:*
📍 위치 정보를 공유하면 자동으로 환경 분석이 시작됩니다.

현재 위치 정보가 있으면 종합 추천을 받을 수 있습니다!`;

    await this.bot.sendMessage(chatId, environmentText, { parse_mode: 'Markdown' });
  }

  async sendEnvironmentalSummary(chatId, context) {
    try {
      let summary = `🌍 *환경 정보 요약*\n\n`;
      
      // 날씨 정보
      if (context.weather.data) {
        const weather = context.weather.data;
        summary += `🌤️ *날씨*\n`;
        summary += `• 기온: ${weather.temperature}°C\n`;
        summary += `• 습도: ${weather.humidity}%\n`;
        summary += `• 자외선: ${weather.uvIndex}/11\n`;
        summary += `• 대기질: ${weather.airQuality}\n\n`;
      }
      
      // 문화 정보
      if (context.cultural.activities) {
        summary += `🎭 *문화 활동 추천*\n`;
        summary += `• ${context.cultural.activities.slice(0, 2).join(', ')}\n\n`;
      }
      
      // 경제 정보
      if (context.economic) {
        summary += `💰 *경제 상황*\n`;
        summary += `• 인플레이션: ${context.economic.inflation}%\n`;
        summary += `• 실업률: ${context.economic.unemployment}%\n`;
        summary += `• 경제 동향: ${context.economic.economicTrend}\n\n`;
      }
      
      // 지정학적 정보
      if (context.geopolitical) {
        summary += `🏛️ *정치적 안정성*\n`;
        summary += `• 안정성: ${context.geopolitical.stability}\n`;
        summary += `• 여행 권고: ${context.geopolitical.travelAdvisory}\n`;
      }
      
      await this.bot.sendMessage(chatId, summary, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('환경 요약 오류:', error);
    }
  }

  async sendComprehensiveRecommendations(chatId, personaCode, context) {
    try {
      const persona = this.personaAnalyzer.getPersonaByCode(personaCode);
      const recommendations = this.environmentalIntelligence.generateComprehensiveRecommendations(personaCode, context);
      
      let message = `🎯 *${persona.name}님을 위한 종합 추천*\n\n`;
      
      // 즉시 실행 가능한 추천
      if (recommendations.immediate.length > 0) {
        message += `⚡ *즉시 실행*\n`;
        recommendations.immediate.slice(0, 2).forEach(rec => {
          message += `• ${rec.advice}\n`;
        });
        message += '\n';
      }
      
      // 라이프스타일 추천
      if (recommendations.lifestyle.length > 0) {
        message += `🏃 *활동 추천*\n`;
        const activity = recommendations.lifestyle[0];
        message += `• ${activity.advice}\n`;
        message += `• 추천 활동: ${activity.activities.slice(0, 3).join(', ')}\n\n`;
      }
      
      // 문화 활동 추천
      if (recommendations.cultural.length > 0) {
        message += `🎭 *문화 체험*\n`;
        const cultural = recommendations.cultural[0];
        message += `• ${cultural.advice}\n`;
        message += `• 추천 활동: ${cultural.activities.join(', ')}\n\n`;
      }
      
      // 경제 조언
      if (recommendations.economic.length > 0) {
        message += `💰 *경제 조언*\n`;
        const economic = recommendations.economic[0];
        message += `• ${economic.advice}\n\n`;
      }
      
      // 정신 건강 조언
      if (recommendations.health.length > 0) {
        message += `🧠 *정신 건강*\n`;
        const health = recommendations.health[0];
        message += `• ${health.advice}\n`;
        if (health.activities) {
          message += `• 추천 활동: ${health.activities}\n`;
        }
      }
      
      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('종합 추천 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 종합 추천을 생성하는 중 오류가 발생했습니다.'
      );
    }
  }

  // 현재 시간대 반환
  getCurrentTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  // 현재 계절 반환
  getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  // 기질 분석 보기
  async showDispositionAnalysis(chatId) {
    const userState = this.userStates.get(chatId);
    
    if (!userState || !userState.lastPersonaResult) {
      await this.bot.sendMessage(chatId, 
        '📊 기질 분석을 보려면 먼저 페르소나 분석을 진행해주세요.\n\n' +
        '사진을 보내거나 건강 관련 메시지를 입력해보세요!'
      );
      return;
    }

    const scores = userState.lastPersonaResult.scores;
    const personaRules = this.personaAnalyzer.personaRules;
    
    let analysisText = '🧠 *기질 분석 결과*\n\n';
    
    Object.keys(scores).forEach(indicator => {
      const score = scores[indicator];
      const indicatorInfo = personaRules.dispositionIndicators[indicator];
      
      analysisText += `*${indicatorInfo.name}*\n`;
      analysisText += `점수: ${score}/100\n`;
      
      if (score >= 70) {
        analysisText += `특징: ${indicatorInfo.indicators.join(', ')}\n`;
      } else if (score <= 30) {
        analysisText += `특징: ${indicatorInfo.opposites.join(', ')}\n`;
      } else {
        analysisText += `특징: 균형잡힌 성향\n`;
      }
      analysisText += '\n';
    });

    await this.bot.sendMessage(chatId, analysisText, { parse_mode: 'Markdown' });
  }

  // 페르소나 진화 추적
  async showPersonaEvolution(chatId) {
    const userState = this.userStates.get(chatId);
    
    if (!userState || !userState.lastPersonaResult) {
      await this.bot.sendMessage(chatId, 
        '🔄 페르소나 진화를 추적하려면 먼저 페르소나 분석을 진행해주세요.\n\n' +
        '사진을 보내거나 건강 관련 메시지를 입력해보세요!'
      );
      return;
    }

    const evolution = this.personaAnalyzer.trackPersonaEvolution(
      chatId, 
      userState.lastPersonaResult, 
      userState.previousPersonaResult
    );

    let evolutionText = '🔄 *페르소나 진화 추적*\n\n';
    evolutionText += `${evolution.message}\n\n`;

    if (evolution.isFirstTime) {
      evolutionText += '첫 번째 분석이므로 변화 추적을 시작합니다.';
    } else if (Object.keys(evolution.changes).length > 0) {
      evolutionText += '*변화된 기질:*\n';
      Object.keys(evolution.changes).forEach(key => {
        const change = evolution.changes[key];
        const direction = change > 0 ? '증가' : '감소';
        evolutionText += `• ${key}: ${Math.abs(change)}점 ${direction}\n`;
      });
    } else {
      evolutionText += '페르소나가 안정적으로 유지되고 있습니다.';
    }

    await this.bot.sendMessage(chatId, evolutionText, { parse_mode: 'Markdown' });
  }

  /**
   * 한정판 이벤트 목록 표시
   */
  async showLimitedEditionEvents(chatId) {
    const activeEvents = this.limitedEditionEvents.getActiveEvents();
    
    if (activeEvents.length === 0) {
      await this.bot.sendMessage(chatId, 
        '🎭 현재 진행 중인 한정판 이벤트가 없습니다.\n곧 새로운 이벤트가 시작될 예정입니다!'
      );
      return;
    }

    let eventsText = `🎭 *한정판 이벤트*\n\n`;
    
    activeEvents.forEach(event => {
      eventsText += `*${event.name}*\n`;
      eventsText += `${event.description}\n`;
      eventsText += `📅 ${event.startDate.toLocaleDateString()} ~ ${event.endDate.toLocaleDateString()}\n`;
      eventsText += `🎨 ${event.themes.length}개 테마\n\n`;
    });

    eventsText += `자세한 정보를 보려면 /event 명령어를 입력하세요!`;

    await this.bot.sendMessage(chatId, eventsText, { parse_mode: 'Markdown' });
  }

  /**
   * 사용자 이벤트 대시보드 표시
   */
  async showEventDashboard(chatId) {
    const activeEvents = this.limitedEditionEvents.getActiveEvents();
    
    if (activeEvents.length === 0) {
      await this.bot.sendMessage(chatId, 
        '🎭 현재 진행 중인 한정판 이벤트가 없습니다.'
      );
      return;
    }

    // 첫 번째 활성 이벤트의 대시보드 표시
    const eventId = activeEvents[0].id;
    const dashboard = this.limitedEditionEvents.generateUserDashboard(chatId, eventId);
    
    if (!dashboard) {
      await this.bot.sendMessage(chatId, '이벤트 정보를 불러올 수 없습니다.');
      return;
    }

    let dashboardText = `🎭 *${dashboard.eventName}*\n\n`;
    dashboardText += `${dashboard.eventDescription}\n\n`;
    
    // 진행 상황
    dashboardText += `📊 *진행 상황*\n`;
    dashboardText += `• 친구 초대: ${dashboard.progress.inviteCount}명\n`;
    dashboardText += `• 봇 사용: ${dashboard.progress.usageCount}회\n`;
    dashboardText += `• 완료 테마: ${dashboard.progress.completedThemes}/${dashboard.progress.totalThemes}개\n`;
    dashboardText += `⏰ ${dashboard.timeRemaining}\n\n`;

    // 테마별 진행률
    dashboardText += `🎨 *테마별 진행률*\n`;
    dashboard.themes.forEach(theme => {
      const status = theme.completed ? '✅' : '⏳';
      const percentage = theme.progress.percentage;
      dashboardText += `${status} ${theme.name} (${percentage}%)\n`;
    });

    // 보상
    if (dashboard.rewards.length > 0) {
      dashboardText += `\n🏆 *획득한 보상*\n`;
      dashboard.rewards.forEach(reward => {
        dashboardText += `• ${reward}\n`;
      });
    }

    await this.bot.sendMessage(chatId, dashboardText, { parse_mode: 'Markdown' });
  }

  /**
   * 페르소나 이미지 생성
   */
  async generatePersonaImage(chatId) {
    const userState = this.userStates.get(chatId);
    
    if (!userState || !userState.currentPersona) {
      await this.bot.sendMessage(chatId, 
        '🎨 페르소나 이미지를 생성하려면 먼저 페르소나 분석을 진행해주세요!\n\n' +
        '사진을 보내거나 건강 관련 메시지를 입력해보세요!'
      );
      return;
    }

    await this.bot.sendMessage(chatId, 
      '🎨 당신만의 고유한 페르소나 이미지를 생성하고 있습니다...\n' +
      '잠시만 기다려주세요! (약 30초 소요)'
    );

    try {
      const userData = {
        environment: userState.environmentalContext,
        persona: userState.currentPersona,
        scores: userState.lastPersonaResult?.scores
      };

      const imageResult = await this.imageGenerator.generatePersonaImage(
        userState.currentPersona, 
        userData
      );

      if (imageResult.success) {
        await this.bot.sendPhoto(chatId, imageResult.imageUrl, {
          caption: `🎯 *${userState.currentPersona} 페르소나 이미지*\n\n` +
                   `스타일: ${imageResult.style}\n` +
                   `생성 시간: ${new Date().toLocaleString()}\n\n` +
                   `이 이미지는 당신의 고유한 건강 페르소나를 시각화한 것입니다!`,
          parse_mode: 'Markdown'
        });

        // 이미지 메타데이터 저장
        const metadata = this.imageGenerator.generateImageMetadata(
          userState.currentPersona, 
          null, 
          userData
        );
        userState.generatedImages = userState.generatedImages || [];
        userState.generatedImages.push({
          url: imageResult.imageUrl,
          metadata: metadata,
          generatedAt: new Date()
        });
        this.userStates.set(chatId, userState);

      } else {
        await this.bot.sendMessage(chatId, 
          '😔 이미지 생성 중 오류가 발생했습니다.\n' +
          '잠시 후 다시 시도해주세요.'
        );
      }
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 이미지 생성 중 오류가 발생했습니다.\n' +
        '잠시 후 다시 시도해주세요.'
      );
    }
  }

  /**
   * 한정판 이벤트 이미지 생성
   */
  async generateLimitedEditionImage(chatId) {
    const userState = this.userStates.get(chatId);
    
    if (!userState || !userState.currentPersona) {
      await this.bot.sendMessage(chatId, 
        '🎭 한정판 이미지를 생성하려면 먼저 페르소나 분석을 진행해주세요!\n\n' +
        '사진을 보내거나 건강 관련 메시지를 입력해보세요!'
      );
      return;
    }

    const activeEvents = this.limitedEditionEvents.getActiveEvents();
    if (activeEvents.length === 0) {
      await this.bot.sendMessage(chatId, 
        '🎭 현재 진행 중인 한정판 이벤트가 없습니다.\n' +
        '곧 새로운 이벤트가 시작될 예정입니다!'
      );
      return;
    }

    // 첫 번째 활성 이벤트의 첫 번째 테마 사용
    const eventId = activeEvents[0].id;
    const eventInfo = this.limitedEditionEvents.getEventInfo(eventId);
    const eventTheme = eventInfo.themes[0].id;

    await this.bot.sendMessage(chatId, 
      '🎭 한정판 페르소나 이미지를 생성하고 있습니다...\n' +
      '이 특별한 이미지는 오직 이벤트 기간 동안만 생성 가능합니다!\n' +
      '잠시만 기다려주세요! (약 45초 소요)'
    );

    try {
      const userData = {
        environment: userState.environmentalContext,
        persona: userState.currentPersona,
        scores: userState.lastPersonaResult?.scores,
        event: eventInfo
      };

      const imageResult = await this.imageGenerator.generateEventImage(
        eventTheme,
        userState.currentPersona, 
        userData
      );

      if (imageResult.success) {
        await this.bot.sendPhoto(chatId, imageResult.imageUrl, {
          caption: `🎭 *한정판 ${eventInfo.name} 페르소나*\n\n` +
                   `테마: ${eventInfo.themes[0].name}\n` +
                   `스타일: ${imageResult.style}\n` +
                   `생성 시간: ${new Date().toLocaleString()}\n\n` +
                   `✨ 이 특별한 이미지는 한정판 이벤트 전용입니다!`,
          parse_mode: 'Markdown'
        });

        // 한정판 이미지 메타데이터 저장
        const metadata = this.imageGenerator.generateImageMetadata(
          userState.currentPersona, 
          eventTheme, 
          userData
        );
        userState.limitedEditionImages = userState.limitedEditionImages || [];
        userState.limitedEditionImages.push({
          url: imageResult.imageUrl,
          metadata: metadata,
          eventTheme: eventTheme,
          generatedAt: new Date()
        });
        this.userStates.set(chatId, userState);

        // 이벤트 진행 상황 업데이트
        this.limitedEditionEvents.updateProgress(chatId, eventId, 'generate_limited_image');

      } else {
        await this.bot.sendMessage(chatId, 
          '😔 한정판 이미지 생성 중 오류가 발생했습니다.\n' +
          '잠시 후 다시 시도해주세요.'
        );
      }
    } catch (error) {
      console.error('한정판 이미지 생성 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 한정판 이미지 생성 중 오류가 발생했습니다.\n' +
        '잠시 후 다시 시도해주세요.'
      );
    }
  }

  /**
   * 데이터 드림스케이프 이미지 생성
   */
  async generateDreamscapeImage(chatId) {
    const userState = this.userStates.get(chatId);
    
    if (!userState || !userState.currentPersona) {
      await this.bot.sendMessage(chatId, 
        '🌌 데이터 드림스케이프를 생성하려면 먼저 페르소나 분석을 진행해주세요!\n\n' +
        '사진을 보내거나 건강 관련 메시지를 입력해보세요!'
      );
      return;
    }

    await this.bot.sendMessage(chatId, 
      '🌌 *내면의 초상을, AI의 시선으로 재창조*하고 있습니다...\n\n' +
      '당신의 페르소나가 AI 고유의 미학으로 시각화됩니다.\n' +
      '잠시만 기다려주세요! (약 45초 소요)'
    );

    try {
      const userData = {
        environment: userState.environmentalContext,
        facialAnalysis: userState.lastPersonaResult?.facialData,
        emotionalData: userState.lastPersonaResult?.scores,
        persona: userState.currentPersona
      };

      const dreamscapeResult = await this.dreamscapeGenerator.generateDreamscapeImage(
        userState.currentPersona, 
        userData,
        'auto' // 자동 스타일 선택
      );

      if (dreamscapeResult.success) {
        await this.bot.sendPhoto(chatId, dreamscapeResult.imageUrl, {
          caption: `🌌 *${dreamscapeResult.style} - 데이터 드림스케이프*\n\n` +
                   `페르소나: ${userState.currentPersona}\n` +
                   `스타일: ${dreamscapeResult.description}\n` +
                   `생성 시간: ${new Date().toLocaleString()}\n\n` +
                   `✨ AI가 해석한 당신의 내면적 특성을 시각화한 고유한 작품입니다.`,
          parse_mode: 'Markdown'
        });

        // 드림스케이프 메타데이터 저장
        userState.dreamscapeImages = userState.dreamscapeImages || [];
        userState.dreamscapeImages.push({
          url: dreamscapeResult.imageUrl,
          metadata: dreamscapeResult.metadata,
          generatedAt: new Date()
        });
        this.userStates.set(chatId, userState);

      } else {
        await this.bot.sendMessage(chatId, 
          '😔 드림스케이프 생성 중 오류가 발생했습니다.\n' +
          '잠시 후 다시 시도해주세요.'
        );
      }
    } catch (error) {
      console.error('드림스케이프 생성 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 드림스케이프 생성 중 오류가 발생했습니다.\n' +
        '잠시 후 다시 시도해주세요.'
      );
    }
  }

  /**
   * 페르소나 로고 생성
   */
  async generatePersonaLogo(chatId) {
    const userState = this.userStates.get(chatId);
    
    if (!userState || !userState.currentPersona) {
      await this.bot.sendMessage(chatId, 
        '🎨 페르소나 로고를 생성하려면 먼저 페르소나 분석을 진행해주세요!\n\n' +
        '사진을 보내거나 건강 관련 메시지를 입력해보세요!'
      );
      return;
    }

    await this.bot.sendMessage(chatId, 
      '🎨 *나만의 로고 완성* - 페르소나 심볼을 압축하여 로고를 생성하고 있습니다...\n\n' +
      '당신의 고유한 정체성을 상징하는 로고가 만들어집니다.\n' +
      '잠시만 기다려주세요! (약 30초 소요)'
    );

    try {
      const userData = {
        environment: userState.environmentalContext,
        facialAnalysis: userState.lastPersonaResult?.facialData,
        emotionalData: userState.lastPersonaResult?.scores,
        persona: userState.currentPersona
      };

      const logoResult = await this.dreamscapeGenerator.generatePersonaLogo(
        userState.currentPersona, 
        userData,
        'minimal' // 기본 미니멀 스타일
      );

      if (logoResult.success) {
        await this.bot.sendPhoto(chatId, logoResult.imageUrl, {
          caption: `🎨 *${userState.currentPersona} 페르소나 로고*\n\n` +
                   `스타일: ${logoResult.logoStyle}\n` +
                   `생성 시간: ${new Date().toLocaleString()}\n\n` +
                   `✨ 이 로고는 당신의 고유한 정체성을 상징하는 디지털 자산입니다.\n\n` +
                   `💡 활용 아이디어:\n` +
                   `• 소셜 미디어 프로필\n` +
                   `• 개인 명함\n` +
                   `• 블로그/웹사이트\n` +
                   `• 개인 브랜딩`,
          parse_mode: 'Markdown'
        });

        // 로고 메타데이터 저장
        userState.personaLogos = userState.personaLogos || [];
        userState.personaLogos.push({
          url: logoResult.imageUrl,
          metadata: logoResult.metadata,
          generatedAt: new Date()
        });
        this.userStates.set(chatId, userState);

      } else {
        await this.bot.sendMessage(chatId, 
          '😔 로고 생성 중 오류가 발생했습니다.\n' +
          '잠시 후 다시 시도해주세요.'
        );
      }
    } catch (error) {
      console.error('로고 생성 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 로고 생성 중 오류가 발생했습니다.\n' +
        '잠시 후 다시 시도해주세요.'
      );
    }
  }

  /**
   * 사용 가능한 스타일 목록 표시
   */
  async showAvailableStyles(chatId) {
    const dreamscapeStyles = this.dreamscapeGenerator.getAvailableStyles();
    const logoStyles = this.dreamscapeGenerator.getAvailableLogoStyles();

    let message = `🎨 *MKM Lab AI 이미지 생성 스타일*\n\n`;
    
    message += `🌌 *데이터 드림스케이프 스타일*\n`;
    dreamscapeStyles.forEach(style => {
      message += `• *${style.name}*: ${style.description}\n`;
    });
    
    message += `\n🎨 *로고 스타일*\n`;
    logoStyles.forEach(style => {
      message += `• *${style.name}*: ${style.description}\n`;
    });
    
    message += `\n💡 *사용법*\n`;
    message += `• /dreamscape - 데이터 드림스케이프 생성\n`;
    message += `• /logo - 페르소나 로고 생성\n`;
    message += `• /image - 기본 페르소나 이미지 생성\n`;
    message += `• /limited - 한정판 이벤트 이미지 생성`;

    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}

module.exports = { MessageHandler }; 