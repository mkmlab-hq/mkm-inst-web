// 텔레그램 메시지 핸들러
const { WeatherService } = require('./weather-service');
const { EnvironmentalIntelligence } = require('./environmental-intelligence');
const { LimitedEditionEvents } = require('./limited-edition-events');
const { ImageGenerator } = require('./image-generator');
const DataDreamscapeGenerator = require('./data-dreamscape-generator');
const { PersonaDiary } = require('./persona-diary');
const { PersonaDiaryAPI } = require('./persona-diary-api');

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
    this.personaDiary = new PersonaDiary(); // 페르소나 다이어리 시스템
    this.personaDiaryAPI = new PersonaDiaryAPI(); // 페르소나 다이어리 API 클라이언트
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

    // 음성 메시지 처리 (15초 음성 촬영)
    if (msg.voice || msg.audio) {
      await this.handleVoiceMessage(msg);
      return;
    }

    // 영상 메시지 처리 (15초 영상 촬영)
    if (msg.video) {
      await this.handleVideoMessage(msg);
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
      
      case '/diary':
        await this.showDiaryOptions(chatId);
        break;
      
      case '/write':
        await this.startDiaryEntry(chatId);
        break;
      
      case '/read':
        await this.showDiaryEntries(chatId);
        break;
      
      case '/stats':
        await this.showDiaryStats(chatId);
        break;
      
      case '/search':
        await this.startDiarySearch(chatId);
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
      
      // 원소 기반 페르소나 생성
      const elementalPersona = this.getElementalPersona(result.scores);
      
      // 새로운 원소 기반 결과 메시지
      const elementalResult = `🌟 *${elementalPersona.element} ${elementalPersona.name}의 지혜*\n\n${elementalPersona.description}\n\n💫 *${elementalPersona.trait}*\n\n오늘 당신의 신체가 선택한 원소는 ${elementalPersona.element}입니다.`;
      
      await this.bot.sendMessage(chatId, elementalResult, { parse_mode: 'Markdown' });
      
      // 능동적 AI 동반자 메시지
      await this.sendProactiveAIAdvice(chatId, elementalPersona);
      
      // 지식의 갈증 유발 질문
      const curiosityQuestion = this.getCuriosityQuestion(elementalPersona);
      await this.bot.sendMessage(chatId, curiosityQuestion, { parse_mode: 'Markdown' });
      
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
            `🔄 *페르소나 진화 감지*\n\n${evolution.summary}`,
            { parse_mode: 'Markdown' }
          );
        }
      }
    }, 2000);
  }

  async handleVoiceMessage(msg) {
    const chatId = msg.chat.id;
    const userState = this.userStates.get(chatId) || {};
    
    // 음성 메시지 정보 확인
    const voiceInfo = msg.voice || msg.audio;
    const duration = voiceInfo.duration || 0;
    
    await this.bot.sendMessage(chatId, 
      `🎤 음성 메시지를 받았습니다! (${duration}초)\n음성 기반 페르소나 분석을 시작합니다...`
    );

    // 음성 분석 시뮬레이션 (실제로는 음성 분석 API 호출)
    setTimeout(async () => {
      // 음성 특징 데이터 시뮬레이션
      const voiceData = {
        pitch: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        tempo: ['fast', 'moderate', 'slow'][Math.floor(Math.random() * 3)],
        clarity: ['clear', 'moderate', 'muffled'][Math.floor(Math.random() * 3)],
        energy: ['energetic', 'calm', 'dynamic'][Math.floor(Math.random() * 3)],
        emotion: ['confident', 'thoughtful', 'enthusiastic'][Math.floor(Math.random() * 3)]
      };

      // 환경 데이터 준비
      const envData = userState.environmentalContext ? {
        weather: userState.environmentalContext.weather?.condition || 'sunny',
        time: this.getCurrentTimeOfDay(),
        season: this.getCurrentSeason()
      } : null;

      // 종합 페르소나 분석 (음성 데이터 기반)
      const result = this.personaAnalyzer.analyzePersona(null, voiceData, envData);
      const formatted = this.personaAnalyzer.formatPersonaResult(result);
      
      await this.bot.sendMessage(chatId, formatted.text, { parse_mode: 'Markdown' });
      
      // 음성 기반 특별 조언 추가
      const voiceAdvice = this.getVoiceBasedAdvice(voiceData);
      if (voiceAdvice) {
        await this.bot.sendMessage(chatId, 
          `🎤 *음성 기반 맞춤 조언*\n\n${voiceAdvice}`,
          { parse_mode: 'Markdown' }
        );
      }
      
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
      userState.lastAnalysisType = 'voice';
      this.userStates.set(chatId, userState);

      // 페르소나 진화 추적
      if (previousResult) {
        const evolution = this.personaAnalyzer.trackPersonaEvolution(chatId, result, previousResult);
        if (!evolution.isFirstTime && Object.keys(evolution.changes).length > 0) {
          await this.bot.sendMessage(chatId, 
            `🔄 *페르소나 진화 감지*\n\n${evolution.summary}`,
            { parse_mode: 'Markdown' }
          );
        }
      }
    }, 3000);
  }

  getVoiceBasedAdvice(voiceData) {
    const advice = [];
    
    if (voiceData.pitch === 'high') {
      advice.push("• 높은 음성 톤은 활발하고 열정적인 성격을 나타냅니다");
    } else if (voiceData.pitch === 'low') {
      advice.push("• 낮은 음성 톤은 신중하고 안정적인 성격을 나타냅니다");
    }
    
    if (voiceData.tempo === 'fast') {
      advice.push("• 빠른 말투는 동적이고 적응력 강한 성격을 나타냅니다");
    } else if (voiceData.tempo === 'slow') {
      advice.push("• 천천히 말하는 것은 신중하고 깊이 있는 사고를 나타냅니다");
    }
    
    if (voiceData.energy === 'energetic') {
      advice.push("• 활기찬 음성은 긍정적이고 동기부여가 강한 성격을 나타냅니다");
    } else if (voiceData.energy === 'calm') {
      advice.push("• 차분한 음성은 마음챙김과 내면의 평화를 중요시하는 성격을 나타냅니다");
    }
    
    return advice.join('\n');
  }

  async handleVideoMessage(msg) {
    const chatId = msg.chat.id;
    const userState = this.userStates.get(chatId) || {};
    
    // 영상 메시지 정보 확인
    const videoInfo = msg.video;
    const duration = videoInfo.duration || 0;
    const fileSize = videoInfo.file_size || 0;
    
    await this.bot.sendMessage(chatId, 
      `📹 영상을 받았습니다! (${duration}초, ${Math.round(fileSize / 1024 / 1024 * 100) / 100}MB)\n얼굴 분석을 시작합니다...`
    );

    try {
      // API 서버 상태 확인
      const healthCheck = await this.personaDiaryAPI.checkHealth();
      if (!healthCheck.success) {
        await this.bot.sendMessage(chatId, 
          '😔 분석 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
        );
        return;
      }

      // 영상 파일 검증
      const validation = this.personaDiaryAPI.validateVideoFile({
        size: fileSize,
        mime_type: videoInfo.mime_type || 'video/mp4'
      });

      if (!validation.valid) {
        await this.bot.sendMessage(chatId, validation.error);
        return;
      }

      // 영상 파일 다운로드
      const file = await this.bot.getFile(videoInfo.file_id);
      const videoBuffer = await this.downloadFile(file.file_path);
      
      // 페르소나 다이어리 API로 얼굴 분석 요청
      const analysisResult = await this.personaDiaryAPI.analyzeFace(
        videoBuffer, 
        `video_${chatId}_${Date.now()}.mp4`
      );

      if (!analysisResult.success) {
        await this.bot.sendMessage(chatId, 
          `😔 분석 중 오류가 발생했습니다: ${analysisResult.error}`
        );
        return;
      }

      // 분석 결과를 텔레그램 메시지로 포맷팅
      const formattedMessage = this.personaDiaryAPI.formatAnalysisResult(analysisResult);
      
      await this.bot.sendMessage(chatId, formattedMessage, { parse_mode: 'Markdown' });
      
      // 사용자 상태 업데이트
      const result = analysisResult.data.data.result;
      userState.currentPersona = result.persona_analysis.persona.code;
      userState.lastPersonaResult = result;
      userState.lastAnalysis = new Date();
      userState.lastAnalysisType = 'video';
      userState.lastVitalSigns = result.vital_signs;
      this.userStates.set(chatId, userState);

      // AI 어드바이저 추천 메시지
      await this.bot.sendMessage(chatId, 
        '🤖 더 자세한 건강 상담이 필요하시면 "상담하기" 또는 "질문하기"라고 말씀해주세요!'
      );

    } catch (error) {
      console.error('영상 처리 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 영상 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  }

  async downloadFile(filePath) {
    const https = require('https');
    const http = require('http');
    
    return new Promise((resolve, reject) => {
      const protocol = filePath.startsWith('https') ? https : http;
      
      protocol.get(filePath, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      }).on('error', reject);
    });
  }

  async handleAdvisorQuestion(chatId, question, userState) {
    await this.bot.sendMessage(chatId, 
      '🤖 AI 어드바이저가 당신의 질문을 분석하고 있습니다...'
    );

    try {
      // 페르소나 데이터 준비
      const personaData = userState.lastPersonaResult ? {
        code: userState.lastPersonaResult.persona_analysis.persona.code,
        name: userState.lastPersonaResult.persona_analysis.persona.name,
        characteristics: userState.lastPersonaResult.persona_analysis.persona.characteristics
      } : null;

      // 생체 신호 데이터 준비
      const vitalSigns = userState.lastVitalSigns || null;

      // AI 어드바이저에게 질문
      const advisorResult = await this.personaDiaryAPI.askAdvisor(
        question, 
        personaData, 
        vitalSigns
      );

      if (!advisorResult.success) {
        await this.bot.sendMessage(chatId, 
          `😔 AI 어드바이저 응답 중 오류가 발생했습니다: ${advisorResult.error}`
        );
        return;
      }

      // 응답을 텔레그램 메시지로 포맷팅
      const formattedMessage = this.personaDiaryAPI.formatAdvisorResponse(advisorResult);
      
      await this.bot.sendMessage(chatId, formattedMessage, { parse_mode: 'Markdown' });

      // 추가 질문 안내
      await this.bot.sendMessage(chatId, 
        '💡 더 궁금한 점이 있으시면 언제든 질문해주세요!'
      );

    } catch (error) {
      console.error('AI 어드바이저 질문 처리 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 AI 어드바이저 응답 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
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

    // 다이어리 상태 처리
    if (userState.diaryState) {
      await this.handleDiaryState(chatId, text, userState);
      return;
    }

    // 날씨 관련 키워드
    const weatherKeywords = ['날씨', '비', '맑음', '흐림', '더워', '추워', '습도', '기온'];
    const hasWeatherKeyword = weatherKeywords.some(keyword => text.includes(keyword));

    if (hasWeatherKeyword) {
      await this.handleWeatherQuery(chatId, text);
      return;
    }

    // AI 어드바이저 질문 키워드
    const advisorKeywords = ['상담', '질문', '조언', '도움', '어떻게', '왜', '무엇', '어떤'];
    const hasAdvisorKeyword = advisorKeywords.some(keyword => text.includes(keyword));

    if (hasAdvisorKeyword && userState.currentPersona) {
      await this.handleAdvisorQuestion(chatId, text, userState);
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
              `🔄 *페르소나 진화 감지*\n\n${evolution.summary}`,
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
    const welcomeText = `🎉 *페르소나 다이어리에 오신 것을 환영합니다!*

*Your Hyper-Personalized AI Health Advisor*

당신만을 위한 **초개인화 건강 솔루션**을 제공하는 AI 페르소나 분석 봇입니다.

*🌟 핵심 가치:*
• 🎯 **초개인화** - 당신만의 고유한 건강 페르소나
• 🔬 **과학적** - rPPG 기술 기반 생체 신호 분석
• 🤖 **AI 기반** - RAG 기술로 맞춤형 건강 상담
• 🌍 **통합적** - 날씨, 환경, 개인 데이터 융합

*🎭 분석 방법:*
• 📹 **영상 분석** (추천) - 15초 영상으로 rPPG 생체 신호 분석
• 📸 **사진 분석** - 얼굴 사진으로 AI 특징 분석
• 🎤 **음성 분석** - 음성 메시지로 패턴 분석
• 💬 **텍스트 분석** - 건강 관련 메시지로 분석

*🤖 AI 어드바이저:*
분석 후 "상담하기", "질문하기" 등으로 AI 어드바이저와 상담하여 맞춤 솔루션을 받을 수 있습니다.

*💡 시작하기:*
• 📹 15초 영상을 보내면 가장 정확한 분석을 받을 수 있습니다
• 📸 얼굴 사진을 보내면 AI가 분석하여 맞춤 솔루션을 제공합니다
• 💬 건강 관련 메시지를 보내면 텍스트 기반 분석을 합니다
• 📍 위치 정보를 공유하면 날씨 기반 추천을 받을 수 있습니다

지금 바로 당신만의 특별한 건강 여정을 시작해보세요! ✨`;

    await this.bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' });
  }

  async sendHelpMessage(chatId) {
    const helpText = `📚 *페르소나 다이어리 도움말*

*🎭 분석 방법:*
📹 **영상 분석** (추천) - 15초 영상을 보내면 rPPG 기술로 생체 신호 분석
📸 **사진 분석** - 얼굴 사진을 보내면 AI가 특징 분석
🎤 **음성 분석** - 음성 메시지를 보내면 음성 패턴 분석
💬 **텍스트 분석** - 건강 관련 메시지를 보내면 텍스트 기반 분석

*🤖 AI 어드바이저:*
분석 후 "상담하기", "질문하기", "조언" 등의 키워드로 AI 어드바이저와 상담 가능

*📋 명령어 목록:*
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
/diary - 페르소나 다이어리
/write - 다이어리 작성
/read - 다이어리 읽기
/stats - 다이어리 통계
/search - 다이어리 검색

*💡 사용 팁:*
• 📹 15초 영상으로 가장 정확한 분석 가능
• 🤖 분석 후 AI 어드바이저와 상담하여 맞춤 솔루션 받기
• 📍 위치 정보 공유로 날씨 기반 추천 받기
• 📖 다이어리로 건강 변화 추적하기

*🎯 건강 페르소나:*
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
• 📖 페르소나 다이어리 (개인화된 일기 작성)

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
    // 웹 분석 링크 생성
    const webAnalysisUrl = `https://mkm-inst-web-abcdefg-uc.a.run.app?user_id=${chatId}`;
    
    const analysisText = `🔬 *정밀 페르소나 분석*

*새로운 웹 분석 시스템이 준비되었습니다!*

🌐 **웹에서 실시간 분석하기**
• 15초 실시간 얼굴 촬영
• 고정밀 생체 신호 분석 (심박수, 혈압)
• AI 기반 페르소나 진단
• 맞춤형 건강 솔루션 제공

📱 **텔레그램에서 간편 분석**
• 사진, 음성, 텍스트 기반 분석
• 빠른 결과 확인

*추천: 웹 분석 (가장 정확한 결과)*

어떤 방법으로 분석하시겠습니까?`;

    // 웹 분석 링크 버튼 생성
    const webAnalysisButton = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🔬 정밀 분석하기 (웹)',
              url: webAnalysisUrl
            }
          ],
          [
            {
              text: '📱 텔레그램에서 분석',
              callback_data: 'telegram_analysis'
            }
          ]
        ]
      }
    };

    await this.bot.sendMessage(chatId, analysisText, { 
      parse_mode: 'Markdown',
      ...webAnalysisButton
    });
  }

  async showTelegramAnalysisOptions(chatId) {
    const telegramAnalysisText = `📱 *텔레그램 분석 옵션*

다음 중 하나를 선택해주세요:

1. 📸 *얼굴 사진 보내기* - 얼굴 사진을 보내면 AI가 분석하여 맞춤 솔루션을 제공합니다
2. 💓 *생체 정보 입력* - 혈압, 맥박 등을 메시지로 보내면 종합 분석을 합니다
3. 💬 *메시지 보내기* - 건강에 대해 이야기하면 텍스트 기반으로 분석합니다
4. 📍 *위치 정보 공유* - 날씨 기반 맞춤 추천을 받을 수 있습니다

*추천 순서:*
1. 📸 **얼굴 사진 분석** (가장 정확한 분석)
2. 💓 생체 정보 분석 (혈압, 맥박 등)
3. 💬 텍스트 분석 (대화 기반)

예시 메시지:
• "혈압 120/80, 맥박 72"
• "요즘 피로하고 스트레스가 많아요"
• "운동을 시작하고 싶은데 어떤 것이 좋을까요?"
• "수면의 질을 개선하고 싶어요"
• "서울 날씨 어때?"

어떤 방법으로 분석하시겠습니까?`;

    await this.bot.sendMessage(chatId, telegramAnalysisText, { parse_mode: 'Markdown' });
  }

  async sendAnalysisResultToUser(userId, analysisResult) {
    try {
      const chatId = parseInt(userId);
      const result = analysisResult.result;
      
      // 결과 카드 생성
      const vitalSigns = result.vital_signs;
      const persona = result.persona_analysis.persona;
      
      let message = `🎉 *분석 완료! 당신의 건강 페르소나*

🏥 *생체 신호*
• 심박수: ${vitalSigns.heart_rate} BPM
• 혈압: ${vitalSigns.blood_pressure.systolic}/${vitalSigns.blood_pressure.diastolic} mmHg
• 상태: ${vitalSigns.blood_pressure_status.status_kr}

🎯 *당신의 페르소나*
• ${persona.name} (${persona.code})
• ${persona.description}
• 희귀도: ${persona.rarity_kr} (${persona.percentage})

💡 *맞춤 솔루션*
${result.persona_analysis.solutions.daily_routine.map(solution => `• ${solution}`).join('\n')}

*더 자세한 정보는 웹에서 확인하세요!*`;

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      
      console.log(`✅ 분석 결과 전송 완료: 사용자 ${userId}`);
      
    } catch (error) {
      console.error(`❌ 분석 결과 전송 실패 (사용자 ${userId}):`, error);
    }
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
    if (!userState || !userState.currentPersona) {
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

  // ===== 페르소나 다이어리 관련 메서드들 =====

  /**
   * 다이어리 옵션 표시
   */
  async showDiaryOptions(chatId) {
    const message = `📖 *MKM Lab 페르소나 다이어리*\n\n` +
                   `당신의 페르소나와 함께하는 개인화된 다이어리를 시작해보세요!\n\n` +
                   `📝 *사용 가능한 명령어*\n\n` +
                   `• /write - 새로운 다이어리 작성\n` +
                   `• /read - 최근 다이어리 읽기\n` +
                   `• /stats - 다이어리 통계 보기\n` +
                   `• /search - 다이어리 검색\n\n` +
                   `💡 *특별한 기능*\n` +
                   `• 페르소나별 맞춤 다이어리 프롬프트\n` +
                   `• 날씨와 연동된 감정 분석\n` +
                   `• 기분과 활동 패턴 추적\n` +
                   `• 주간/월간 통계 리포트`;

    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  /**
   * 다이어리 작성 시작
   */
  async startDiaryEntry(chatId) {
    const userState = this.userStates.get(chatId) || {};
    
    if (!userState.currentPersona) {
      await this.bot.sendMessage(chatId, 
        '📝 다이어리를 작성하려면 먼저 페르소나 분석을 진행해주세요!\n\n' +
        '사진을 보내거나 /analyze 명령어를 사용해보세요!'
      );
      return;
    }

    // 다이어리 작성 상태로 설정
    userState.diaryState = 'waiting_for_content';
    this.userStates.set(chatId, userState);

    // 페르소나별 맞춤 프롬프트 생성
    const weather = userState.environmentalContext?.weather?.condition || '맑음';
    const prompt = this.personaDiary.generateDiaryPrompt(userState.currentPersona, weather);

    const message = `📝 *새로운 다이어리 작성*\n\n` +
                   `페르소나: ${userState.currentPersona}\n` +
                   `날씨: ${weather}\n\n` +
                   `💭 *오늘의 다이어리 프롬프트*\n` +
                   `${prompt}\n\n` +
                   `📝 위 프롬프트를 참고하여 오늘 하루의 경험과 생각을 자유롭게 적어주세요.\n\n` +
                   `💡 *다이어리 작성 팁*\n` +
                   `• 감정과 기분을 포함해보세요\n` +
                   `• 주요 활동들을 기록해보세요\n` +
                   `• 특별한 순간이나 깨달음을 적어보세요\n` +
                   `• 내일의 계획이나 목표도 포함해보세요`;

    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  /**
   * 다이어리 항목 저장
   */
  async saveDiaryEntry(chatId, content) {
    const userState = this.userStates.get(chatId) || {};
    
    if (!userState.currentPersona) {
      await this.bot.sendMessage(chatId, '❌ 페르소나 정보가 없습니다.');
      return;
    }

    try {
      const entry = {
        content: content,
        mood: this.extractMoodFromContent(content),
        activities: this.extractActivitiesFromContent(content),
        persona: userState.currentPersona,
        weather: userState.environmentalContext?.weather?.condition || '알 수 없음',
        tags: this.extractTagsFromContent(content)
      };

      const savedEntry = await this.personaDiary.saveDiaryEntry(chatId.toString(), entry);

      await this.bot.sendMessage(chatId, 
        `✅ *다이어리 저장 완료!*\n\n` +
        `📅 ${new Date().toLocaleDateString()}\n` +
        `📝 ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}\n\n` +
        `💡 /read 명령어로 최근 다이어리를 확인할 수 있습니다!`,
        { parse_mode: 'Markdown' }
      );

      // 다이어리 상태 초기화
      userState.diaryState = null;
      this.userStates.set(chatId, userState);

    } catch (error) {
      console.error('다이어리 저장 오류:', error);
      await this.bot.sendMessage(chatId, '❌ 다이어리 저장 중 오류가 발생했습니다.');
    }
  }

  /**
   * 다이어리 항목들 표시
   */
  async showDiaryEntries(chatId) {
    try {
      const entries = await this.personaDiary.getDiaryEntries(chatId.toString(), 5);
      
      if (entries.length === 0) {
        await this.bot.sendMessage(chatId, 
          '📖 아직 작성된 다이어리가 없습니다.\n\n' +
          '/write 명령어로 첫 번째 다이어리를 작성해보세요!'
        );
        return;
      }

      let message = `📖 *최근 다이어리 (${entries.length}개)*\n\n`;
      
      entries.forEach((entry, index) => {
        const date = new Date(entry.timestamp).toLocaleDateString();
        const content = entry.content.length > 100 ? 
          entry.content.substring(0, 100) + '...' : entry.content;
        
        message += `📅 *${date}*\n`;
        message += `😊 기분: ${entry.mood || '기록 없음'}\n`;
        message += `📝 ${content}\n\n`;
      });

      message += `💡 더 많은 다이어리를 보려면 /stats 명령어를 사용하세요!`;

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    } catch (error) {
      console.error('다이어리 읽기 오류:', error);
      await this.bot.sendMessage(chatId, '❌ 다이어리 읽기 중 오류가 발생했습니다.');
    }
  }

  /**
   * 다이어리 통계 표시
   */
  async showDiaryStats(chatId) {
    try {
      const stats = await this.personaDiary.getDiaryStats(chatId.toString());
      
      let message = `📊 *다이어리 통계*\n\n`;
      
      message += `📝 총 작성 수: ${stats.totalEntries}개\n`;
      
      if (stats.averageMood > 0) {
        message += `😊 평균 기분 점수: ${stats.averageMood}/5.0\n\n`;
      }

      if (Object.keys(stats.moodDistribution).length > 0) {
        message += `😊 *기분 분포*\n`;
        Object.entries(stats.moodDistribution).forEach(([mood, count]) => {
          message += `• ${mood}: ${count}회\n`;
        });
        message += `\n`;
      }

      if (Object.keys(stats.activityFrequency).length > 0) {
        message += `🏃 *주요 활동*\n`;
        const topActivities = Object.entries(stats.activityFrequency)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);
        
        topActivities.forEach(([activity, count]) => {
          message += `• ${activity}: ${count}회\n`;
        });
        message += `\n`;
      }

      message += `💡 /search 명령어로 특정 키워드로 다이어리를 검색할 수 있습니다!`;

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    } catch (error) {
      console.error('다이어리 통계 오류:', error);
      await this.bot.sendMessage(chatId, '❌ 다이어리 통계 계산 중 오류가 발생했습니다.');
    }
  }

  /**
   * 다이어리 검색 시작
   */
  async startDiarySearch(chatId) {
    const userState = this.userStates.get(chatId) || {};
    userState.diaryState = 'waiting_for_search';
    this.userStates.set(chatId, userState);

    await this.bot.sendMessage(chatId, 
      `🔍 *다이어리 검색*\n\n` +
      `검색하고 싶은 키워드를 입력해주세요.\n\n` +
      `💡 *검색 예시*\n` +
      `• 운동, 요가, 명상\n` +
      `• 회사, 학교, 친구\n` +
      `• 스트레스, 기쁨, 감사\n` +
      `• 프로젝트, 학습, 여행`
    );
  }

  /**
   * 다이어리 검색 실행
   */
  async searchDiaryEntries(chatId, query) {
    try {
      const results = await this.personaDiary.searchDiaryEntries(chatId.toString(), query);
      
      if (results.length === 0) {
        await this.bot.sendMessage(chatId, 
          `🔍 "${query}"에 대한 검색 결과가 없습니다.\n\n` +
          `다른 키워드로 검색해보세요!`
        );
        return;
      }

      let message = `🔍 *"${query}" 검색 결과 (${results.length}개)*\n\n`;
      
      results.slice(0, 3).forEach((entry, index) => {
        const date = new Date(entry.timestamp).toLocaleDateString();
        const content = entry.content.length > 80 ? 
          entry.content.substring(0, 80) + '...' : entry.content;
        
        message += `📅 *${date}*\n`;
        message += `📝 ${content}\n\n`;
      });

      if (results.length > 3) {
        message += `... 그리고 ${results.length - 3}개 더\n\n`;
      }

      message += `💡 더 정확한 검색을 위해 구체적인 키워드를 사용해보세요!`;

      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

    } catch (error) {
      console.error('다이어리 검색 오류:', error);
      await this.bot.sendMessage(chatId, '❌ 다이어리 검색 중 오류가 발생했습니다.');
    }
  }

  // ===== 다이어리 상태 처리 =====

  /**
   * 다이어리 상태별 메시지 처리
   */
  async handleDiaryState(chatId, text, userState) {
    switch (userState.diaryState) {
      case 'waiting_for_content':
        await this.saveDiaryEntry(chatId, text);
        break;
      
      case 'waiting_for_search':
        await this.searchDiaryEntries(chatId, text);
        // 검색 상태 초기화
        userState.diaryState = null;
        this.userStates.set(chatId, userState);
        break;
      
      default:
        // 알 수 없는 상태는 초기화
        userState.diaryState = null;
        this.userStates.set(chatId, userState);
        await this.bot.sendMessage(chatId, 
          '❓ 알 수 없는 상태입니다. 다시 시작해주세요.'
        );
    }
  }

  // ===== 헬퍼 메서드들 =====

  /**
   * 텍스트에서 기분 추출
   */
  extractMoodFromContent(content) {
    const moodKeywords = {
      '매우 좋음': ['매우 좋', '완벽', '최고', '행복', '기쁨', '즐거움'],
      '좋음': ['좋', '만족', '기쁘', '즐거', '편안', '평온'],
      '보통': ['보통', '그럭저럭', '괜찮', '무난'],
      '나쁨': ['나쁘', '안 좋', '스트레스', '피곤', '지치'],
      '매우 나쁨': ['매우 나쁘', '최악', '끔찍', '힘들', '고통']
    };

    const lowerContent = content.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return mood;
      }
    }
    
    return '보통';
  }

  /**
   * 텍스트에서 활동 추출
   */
  extractActivitiesFromContent(content) {
    const activityKeywords = [
      '운동', '달리기', '걷기', '수영', '요가', '명상',
      '독서', '공부', '학습', '작업', '회의', '프로젝트',
      '요리', '청소', '쇼핑', '여행', '영화', '음악',
      '친구', '가족', '데이트', '산책', '카페', '식사'
    ];

    const activities = [];
    const lowerContent = content.toLowerCase();
    
    activityKeywords.forEach(activity => {
      if (lowerContent.includes(activity)) {
        activities.push(activity);
      }
    });
    
    return activities;
  }

  /**
   * 텍스트에서 태그 추출
   */
  extractTagsFromContent(content) {
    const tags = [];
    
    // 해시태그 추출
    const hashtags = content.match(/#[\w가-힣]+/g);
    if (hashtags) {
      tags.push(...hashtags.map(tag => tag.substring(1)));
    }
    
    // 주요 키워드 추출
    const keywords = this.extractActivitiesFromContent(content);
    tags.push(...keywords);
    
    return tags;
  }

  // 원소 기반 페르소나 시스템
  getElementalPersona(scores) {
    const { vision, balance, dynamic, mindfulness } = scores;
    
    if (vision > 0.7) return {
      name: '이그니스(Ignis)',
      element: '🔥 불',
      trait: '창의성과 열정의 지혜',
      description: '창의적인 에너지가 넘치는 날입니다. 새로운 아이디어와 혁신적인 접근이 필요한 시기입니다.',
      color: '#FF6B35'
    };
    
    if (balance > 0.7) return {
      name: '테라(Terra)', 
      element: '🏔️ 땅',
      trait: '안정과 실용성의 지혜',
      description: '견고하고 안정적인 기반을 다지는 날입니다. 체계적이고 실용적인 접근이 효과적입니다.',
      color: '#8B4513'
    };
    
    if (dynamic > 0.7) return {
      name: '아쿠아(Aqua)',
      element: '🌊 물', 
      trait: '유연성과 적응력의 지혜',
      description: '유연하게 변화에 적응하는 날입니다. 새로운 환경이나 상황에 잘 대응할 수 있습니다.',
      color: '#0066CC'
    };
    
    return {
      name: '에테르(Aether)',
      element: '💨 공기',
      trait: '직관과 영감의 지혜', 
      description: '직관이 예민하고 영감을 받기 좋은 날입니다. 내면의 소리에 귀 기울여보세요.',
      color: '#9370DB'
    };
  }

  // 능동적 AI 동반자 - 먼저 말을 거는 AI
  async sendProactiveAIAdvice(chatId, persona) {
    const proactiveMessages = {
      '이그니스(Ignis)': {
        message: `🔥 *${persona.name}의 지혜*가 감지되었습니다!\n\n오늘 창의적인 에너지가 넘치는 날이네요. 혹시 최근에 풀리지 않던 문제가 있다면, 오늘 새로운 관점에서 다시 한번 생각해보는 건 어떨까요?\n\n제가 창의적 문제 해결을 위한 브레인스토밍 파트너가 되어드릴 수 있습니다! 💡`,
        suggestions: ['창의적 아이디어 발굴하기', '혁신적 해결책 찾기', '새로운 프로젝트 시작하기']
      },
      '테라(Terra)': {
        message: `🏔️ *${persona.name}의 지혜*가 감지되었습니다!\n\n오늘 안정적이고 체계적인 에너지가 필요한 날이네요. 미뤄뒀던 계획이나 정리할 일이 있다면, 오늘이 완벽한 타이밍입니다!\n\n제가 체계적인 계획 수립을 도와드릴 수 있습니다! 📋`,
        suggestions: ['업무 계획 세우기', '목표 정리하기', '습관 형성하기']
      },
      '아쿠아(Aqua)': {
        message: `🌊 *${persona.name}의 지혜*가 감지되었습니다!\n\n오늘 유연하게 변화에 적응하는 에너지가 필요한 날이네요. 새로운 상황이나 도전이 예상된다면, 오늘의 유연한 마음가짐으로 잘 대응할 수 있을 것입니다!\n\n제가 적응 전략을 함께 고민해드릴 수 있습니다! 🌊`,
        suggestions: ['새로운 환경 적응하기', '변화 대응 전략 세우기', '유연한 사고 연습하기']
      },
      '에테르(Aether)': {
        message: `💨 *${persona.name}의 지혜*가 감지되었습니다!\n\n오늘 직관이 예민하고 영감을 받기 좋은 날이네요. 중요한 결정이 필요하거나 내면의 소리를 들어야 할 때입니다!\n\n제가 직관적 의사결정을 지원해드릴 수 있습니다! ✨`,
        suggestions: ['직관적 의사결정하기', '명상과 내면 탐색하기', '영감 받기']
      }
    };

    const advice = proactiveMessages[persona.name];
    if (advice) {
      await this.bot.sendMessage(chatId, advice.message, { parse_mode: 'Markdown' });
      
      // 제안 버튼 생성
      const keyboard = {
        inline_keyboard: advice.suggestions.map(suggestion => [{
          text: suggestion,
          callback_data: `proactive_${persona.name.toLowerCase().split('(')[0]}_${suggestion}`
        }])
      };
      
      await this.bot.sendMessage(chatId, 
        '💡 *오늘의 제안*\n\n어떤 활동을 도와드릴까요?',
        { 
          parse_mode: 'Markdown',
          reply_markup: keyboard
        }
      );
    }
  }

  // 지식의 갈증 유발 질문
  getCuriosityQuestion(persona) {
    const curiosityQuestions = {
      '이그니스(Ignis)': "왜 오늘 당신의 신체는 '창의성'을 선택했을까요? 어젯밤의 꿈이나 최근 경험이 영향을 미쳤을 수 있습니다. 🔍 *정밀 분석*으로 원인을 파악해보세요!",
      '테라(Terra)': "오늘의 '안정' 상태는 어떤 요인에서 비롯되었을까요? 수면 패턴, 식습관, 스트레스 수준을 종합 분석해드립니다. 📊 *심화 리포트*로 확인해보세요!",
      '아쿠아(Aqua)': "유연한 적응력이 필요한 상황이 예상됩니다. 어떤 변화에 대비해야 할까요? 🔮 *미래 예측 분석*으로 준비해보세요!",
      '에테르(Aether)': "직관이 예민한 오늘, 중요한 결정이 필요한가요? ⚖️ *의사결정 지원 분석*으로 최적의 선택을 도와드립니다!"
    };
    
    return curiosityQuestions[persona.name] || curiosityQuestions['에테르(Aether)'];
  }

  // 능동적 제안 처리
  async handleProactiveSuggestion(chatId, callbackData) {
    const parts = callbackData.split('_');
    const personaType = parts[1];
    const suggestion = parts.slice(2).join('_');
    
    const suggestionHandlers = {
      'ignis': {
        '창의적 아이디어 발굴하기': '🔥 *창의적 아이디어 발굴 세션*\n\n오늘의 이그니스 에너지를 활용해보세요!\n\n1️⃣ **브레인스토밍**: 현재 직면한 문제를 3가지 관점에서 접근해보기\n2️⃣ **아날로그 사고**: 완전히 다른 분야의 해결책을 적용해보기\n3️⃣ **역발상**: 문제를 거꾸로 생각해보기\n\n어떤 주제로 창의적 사고를 시작할까요?',
        '혁신적 해결책 찾기': '💡 *혁신적 해결책 워크숍*\n\n기존 방식을 완전히 뒤엎는 해결책을 찾아보세요!\n\n🎯 **목표**: 현재 문제의 근본 원인을 파악하고 혁신적 접근법 도출\n📋 **단계**: 문제 정의 → 기존 방식 분석 → 한계점 파악 → 혁신적 대안 제시\n\n어떤 문제를 혁신적으로 해결하고 싶으신가요?',
        '새로운 프로젝트 시작하기': '🚀 *새로운 프로젝트 기획*\n\n이그니스의 창의적 에너지로 새로운 여정을 시작해보세요!\n\n📝 **프로젝트 기획 가이드**:\n• 비전과 목표 설정\n• 창의적 접근법 설계\n• 실행 계획 수립\n• 성공 지표 정의\n\n어떤 새로운 프로젝트를 시작하고 싶으신가요?'
      },
      'terra': {
        '업무 계획 세우기': '📋 *체계적 업무 계획*\n\n테라의 안정적 에너지로 견고한 기반을 다져보세요!\n\n🗓️ **계획 수립 프레임워크**:\n• 우선순위 설정 (중요도 vs 긴급성)\n• 시간 블록 할당\n• 마일스톤 정의\n• 진행 상황 추적\n\n어떤 업무를 체계적으로 계획하고 싶으신가요?',
        '목표 정리하기': '🎯 *목표 정리 및 설정*\n\n테라의 실용적 에너지로 명확한 목표를 세워보세요!\n\n📊 **목표 설정 방법**:\n• SMART 목표 설정 (구체적, 측정 가능, 달성 가능, 관련성, 기한)\n• 장단기 목표 균형\n• 실행 가능한 액션 플랜\n• 정기적 리뷰 시스템\n\n어떤 목표를 정리하고 싶으신가요?',
        '습관 형성하기': '🔄 *건강한 습관 형성*\n\n테라의 안정적 에너지로 지속 가능한 습관을 만들어보세요!\n\n⏰ **습관 형성 전략**:\n• 작은 습관부터 시작 (1% 개선)\n• 환경 설계 (습관 실행을 쉽게)\n• 스택킹 (기존 습관에 연결)\n• 추적 및 보상\n\n어떤 습관을 형성하고 싶으신가요?'
      },
      'aqua': {
        '새로운 환경 적응하기': '🌊 *적응력 향상 가이드*\n\n아쿠아의 유연한 에너지로 새로운 환경에 잘 적응해보세요!\n\n🔄 **적응 전략**:\n• 마인드셋 전환 (변화를 기회로)\n• 관찰 및 학습 (새로운 환경 파악)\n• 유연한 접근법 (다양한 방법 시도)\n• 네트워킹 (새로운 관계 구축)\n\n어떤 새로운 환경에 적응하고 싶으신가요?',
        '변화 대응 전략 세우기': '🛡️ *변화 대응 전략*\n\n아쿠아의 적응력을 활용해 변화에 대비해보세요!\n\n📈 **변화 대응 프레임워크**:\n• 변화 인식 및 수용\n• 영향도 분석\n• 대응 전략 수립\n• 실행 및 모니터링\n\n어떤 변화에 대비하고 싶으신가요?',
        '유연한 사고 연습하기': '🧠 *유연한 사고 훈련*\n\n아쿠아의 유연성을 활용해 사고의 경계를 넓혀보세요!\n\n💭 **유연한 사고 연습**:\n• 다각적 관점 연습\n• 가정에 의문 제기\n• 창의적 문제 해결\n• 감정적 유연성 향상\n\n어떤 주제로 유연한 사고를 연습하고 싶으신가요?'
      },
      'aether': {
        '직관적 의사결정하기': '✨ *직관적 의사결정 가이드*\n\n에테르의 직관적 에너지를 활용해 중요한 결정을 내려보세요!\n\n🔮 **직관 활용 방법**:\n• 내면의 소리 듣기\n• 몸의 반응 관찰\n• 꿈과 영감 활용\n• 명상과 명료성 확보\n\n어떤 결정을 직관적으로 내리고 싶으신가요?',
        '명상과 내면 탐색하기': '🧘‍♀️ *내면 탐색 여정*\n\n에테르의 영적 에너지로 깊은 내면을 탐색해보세요!\n\n🌙 **내면 탐색 방법**:\n• 명상과 마음챙김\n• 자아 성찰과 일기\n• 꿈 해석과 상징 이해\n• 영적 성장과 깨달음\n\n어떤 방식으로 내면을 탐색하고 싶으신가요?',
        '영감 받기': '💫 *영감 수집 여정*\n\n에테르의 영감적 에너지로 창의적 영감을 받아보세요!\n\n🌟 **영감 수집 방법**:\n• 자연과의 연결\n• 예술과 문화 체험\n• 대화와 교류\n• 고독과 명상\n\n어떤 분야에서 영감을 받고 싶으신가요?'
      }
    };
    
    const handler = suggestionHandlers[personaType];
    if (handler && handler[suggestion]) {
      await this.bot.sendMessage(chatId, handler[suggestion], { parse_mode: 'Markdown' });
      
      // 추가 상호작용 옵션 제공
      const keyboard = {
        inline_keyboard: [
          [{ text: '💬 더 자세히 상담하기', callback_data: `consult_${personaType}_${suggestion}` }],
          [{ text: '📊 정밀 분석 받기', callback_data: `premium_${personaType}_${suggestion}` }],
          [{ text: '🎯 구체적 액션 플랜', callback_data: `action_${personaType}_${suggestion}` }]
        ]
      };
      
      await this.bot.sendMessage(chatId, 
        '💡 *다음 단계*\n\n어떤 도움을 더 받고 싶으신가요?',
        { 
          parse_mode: 'Markdown',
          reply_markup: keyboard
        }
      );
    } else {
      await this.bot.sendMessage(chatId, '😔 해당 제안에 대한 정보를 찾을 수 없습니다.');
    }
  }
}

module.exports = { MessageHandler }; 