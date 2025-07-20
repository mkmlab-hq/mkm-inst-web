// 텔레그램 메시지 핸들러
const { WeatherService } = require('./weather-service');
const { PersonaDiary } = require('./persona-diary');
const { PersonaDiaryAPI } = require('./persona-diary-api');
const NLPService = require('./nlp-service');
const { FaceAnalyzer } = require('./face-analyzer');
const { PersonaCardGenerator } = require('./persona-card-generator');

class MessageHandler {
  constructor(bot, personaAnalyzer) {
    this.bot = bot;
    this.personaAnalyzer = personaAnalyzer;
    this.weatherService = new WeatherService();
    this.userStates = new Map(); // 사용자 상태 관리
    this.personaDiary = new PersonaDiary(); // 페르소나 다이어리 시스템
    this.personaDiaryAPI = new PersonaDiaryAPI(); // 페르소나 다이어리 API 클라이언트
    this.nlpService = new NLPService(); // Google Cloud Natural Language API 서비스
    this.faceAnalyzer = new FaceAnalyzer(); // 실제 얼굴 분석기
    this.personaCardGenerator = new PersonaCardGenerator(); // 페르소나 카드 생성기
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
      
      // MVP 핵심 기능만 유지
      case '/persona':
        await this.showPersonaInfo(chatId);
        break;
      
      case '/weather':
        await this.showWeatherOptions(chatId);
        break;
      
      case '/advice':
        await this.showAdviceOptions(chatId);
        break;
      
      // 모든 복잡한 기능 제거 - MVP 단순화
      default:
        await this.bot.sendMessage(chatId, 
          '🎯 *MKM Lab AI 페르소나 분석*\n\n' +
          '사용 가능한 명령어:\n' +
          '• /analyze - 페르소나 분석 시작\n' +
          '• /help - 도움말 보기\n' +
          '• /persona - 내 페르소나 보기\n' +
          '• /weather - 날씨 기반 조언\n' +
          '• /advice - 건강 조언 받기\n\n' +
          '📸 사진, 🎥 영상, 🎤 음성으로도 분석 가능합니다!'
        );
    }
  }

  async handlePhoto(msg) {
    const chatId = msg.chat.id;
    const userState = this.userStates.get(chatId) || {};
    
    await this.bot.sendMessage(chatId, 
      '📸 사진을 받았습니다! AI 얼굴 분석을 시작합니다...'
    );

    try {
      // 사진 정보 확인
      const photo = msg.photo[msg.photo.length - 1]; // 최고 해상도 사진
      const fileSize = photo.file_size || 0;
      
      console.log(`📸 사진 수신: ${Math.round(fileSize / 1024)}KB`);
      
      // 사진 다운로드 시도
      let photoBuffer = null;
      try {
        const file = await this.bot.getFile(photo.file_id);
        photoBuffer = await this.downloadFile(file.file_path);
        console.log('✅ 사진 다운로드 성공');
      } catch (downloadError) {
        console.error('❌ 사진 다운로드 실패:', downloadError);
        await this.bot.sendMessage(chatId, 
          '😔 사진 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
        return;
      }

      // 실제 얼굴 분석 수행
      try {
        console.log('🔍 실제 얼굴 분석 시작...');
        const facialAnalysis = await this.faceAnalyzer.analyzeFace(photoBuffer);
        
        // 페르소나 분류
        const persona = this.faceAnalyzer.classifyPersona(facialAnalysis);
        
        // 기본 건강 조언 생성
        const advice = this.faceAnalyzer.generateBasicAdvice(persona);
        
        // 분석 결과 전송
        const resultMessage = `🎭 *${persona.name} (${persona.code})*\n\n` +
          `신뢰도: ${Math.round(persona.confidence * 100)}%\n\n` +
          `📋 *${advice.title}*\n\n` +
          advice.advice.map(item => `• ${item}`).join('\n') + '\n\n' +
          `🔍 *얼굴 분석 결과*\n` +
          `• 얼굴 형태: ${facialAnalysis.face_shape?.type || '분석 중'}\n` +
          `• 눈의 특징: ${facialAnalysis.eyes?.characteristics || '분석 중'}\n` +
          `• 전체적 인상: ${facialAnalysis.overall_impression?.type || '분석 중'}\n` +
          `• 추정 나이: ${facialAnalysis.estimated_age || '분석 중'}\n` +
          `• 건강 지표: ${facialAnalysis.health_indicator?.skin_tone || '분석 중'}`;

        await this.bot.sendMessage(chatId, resultMessage, { parse_mode: 'Markdown' });
        
        // 사용자 상태 업데이트
        userState.currentPersona = persona.code;
        userState.lastPersonaResult = {
          persona: persona,
          facialAnalysis: facialAnalysis,
          analysisType: 'photo'
        };
        userState.lastAnalysis = new Date();
        userState.lastAnalysisType = 'photo';
        userState.facialAnalysis = facialAnalysis;
        this.userStates.set(chatId, userState);

        // 상담 옵션 제공
        await this.bot.sendMessage(chatId, 
          '💬 더 자세한 상담을 원하시면 "상담하기" 또는 "질문하기"라고 말씀해주세요!'
        );
        
      } catch (analysisError) {
        console.error('❌ 실제 얼굴 분석 실패:', analysisError);
        
        // 폴백: 시뮬레이션 분석
        await this.bot.sendMessage(chatId, 
          '⚠️ AI 분석에 일시적 문제가 있어 기본 분석을 제공합니다...'
        );
        
        setTimeout(async () => {
          try {
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
            if (curiosityQuestion) {
              await this.bot.sendMessage(chatId, curiosityQuestion, { parse_mode: 'Markdown' });
            }
            
            // 사용자 상태 업데이트
            const previousResult = userState.lastPersonaResult;
            userState.currentPersona = result.persona.code;
            userState.lastPersonaResult = result;
            userState.lastAnalysis = new Date();
            userState.lastAnalysisType = 'photo_fallback';
            userState.facialAnalysis = facialData;
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

          } catch (fallbackError) {
            console.error('❌ 폴백 분석도 실패:', fallbackError);
            await this.bot.sendMessage(chatId, 
              '😔 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            );
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('❌ 사진 처리 전체 오류:', error);
      await this.bot.sendMessage(chatId, 
        '😔 사진 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
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
      
      // 타임아웃 설정 (30초)
      const timeout = setTimeout(() => {
        reject(new Error('파일 다운로드 타임아웃 (30초)'));
      }, 30000);
      
      const request = protocol.get(filePath, (response) => {
        clearTimeout(timeout);
        
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        // 파일 크기 확인
        const contentLength = parseInt(response.headers['content-length'], 10);
        if (contentLength && contentLength > 50 * 1024 * 1024) { // 50MB 제한
          reject(new Error('파일이 너무 큽니다 (50MB 제한)'));
          return;
        }

        const chunks = [];
        let totalSize = 0;
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
          totalSize += chunk.length;
          
          // 실시간 크기 체크
          if (totalSize > 50 * 1024 * 1024) { // 50MB 제한
            response.destroy();
            reject(new Error('파일이 너무 큽니다 (50MB 제한)'));
          }
        });
        
        response.on('end', () => {
          console.log(`✅ 파일 다운로드 완료: ${Math.round(totalSize / 1024)}KB`);
          resolve(Buffer.concat(chunks));
        });
        
        response.on('error', (error) => {
          clearTimeout(timeout);
          reject(new Error(`다운로드 오류: ${error.message}`));
        });
      });
      
      request.on('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(`네트워크 오류: ${error.message}`));
      });
      
      request.setTimeout(30000, () => {
        clearTimeout(timeout);
        request.destroy();
        reject(new Error('연결 타임아웃 (30초)'));
      });
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

    console.log(`🧠 텍스트 메시지 분석 시작: "${text}"`);

    // 다이어리 상태 처리
    if (userState.diaryState) {
      await this.handleDiaryState(chatId, text, userState);
      return;
    }

    // 분석 옵션 선택 모드 처리
    if (userState.waitingForAnalysisChoice) {
      await this.handleAnalysisChoice(chatId, text, userState);
      return;
    }

    try {
      // Google Cloud Natural Language API를 사용한 진짜 자연어 처리
      const nlpResult = await this.nlpService.analyzeIntent(text);
      
      console.log(`🧠 NLP 분석 결과:`, {
        intent: nlpResult.intent,
        confidence: nlpResult.confidence,
        sentiment: nlpResult.sentiment.score,
        entities: nlpResult.entities.length,
        urgency: nlpResult.urgency
      });

      // 긴급도가 높은 경우 즉시 응답
      if (nlpResult.urgency >= 4) {
        await this.bot.sendMessage(chatId, 
          '🚨 말씀하신 내용이 긴급해 보입니다. 즉시 의료진과 상담하시는 것을 권장합니다.',
          { parse_mode: 'Markdown' }
        );
        return;
      }

      // 의도별 맞춤형 응답 생성
      const response = await this.generateContextualResponse(chatId, text, nlpResult, userState);
      
      // 응답 전송
      await this.bot.sendMessage(chatId, response.message, { 
        parse_mode: 'Markdown',
        ...(response.keyboard && { reply_markup: response.keyboard })
      });

      // 후속 액션 처리
      if (response.followUp) {
        await this.handleFollowUpAction(chatId, response.followUp, nlpResult, userState);
      }

    } catch (error) {
      console.error('NLP 분석 오류:', error);
      
      // NLP 실패 시 기본 응답
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

  async generateContextualResponse(chatId, text, nlpResult, userState) {
    const { intent, confidence, sentiment, entities, urgency } = nlpResult;
    
    // 의도별 기본 응답
    let response = {
      message: '',
      followUp: null,
      keyboard: null
    };

    switch (intent) {
      case 'SYMPTOM_COMPLAINT':
        response = await this.handleSymptomComplaint(chatId, text, nlpResult, userState);
        break;
        
      case 'HEALTH_STATE':
        response = await this.handleHealthState(chatId, text, nlpResult, userState);
        break;
        
      case 'HEALTH_QUESTION':
        response = await this.handleHealthQuestion(chatId, text, nlpResult, userState);
        break;
        
      case 'HEALTH_REFERENCE':
        response = await this.handleHealthReference(chatId, text, nlpResult, userState);
        break;
        
      case 'WEATHER_INQUIRY':
        response = await this.handleWeatherInquiry(chatId, text, nlpResult, userState);
        break;
        
      case 'GENERAL_GREETING':
        response = await this.handleGeneralGreeting(chatId, text, nlpResult, userState);
        break;
        
      case 'ANALYSIS_REQUEST':
        response = await this.handleAnalysisRequest(chatId, text, nlpResult, userState);
        break;
        
      case 'ADVICE_REQUEST':
        response = await this.handleAdviceRequest(chatId, text, nlpResult, userState);
        break;
        
      default:
        response = await this.handleGeneralConversation(chatId, text, nlpResult, userState);
    }

    return response;
  }

  async handleSymptomComplaint(chatId, text, nlpResult, userState) {
    const urgency = nlpResult.urgency;
    const symptoms = nlpResult.entities.filter(e => e.type === 'SYMPTOM');
    
    let message = '';
    let followUp = null;
    let keyboard = null;

    if (urgency >= 3) {
      message = `⚠️ 말씀하신 증상이 심각해 보입니다.\n\n`;
      message += `*감지된 증상:*\n`;
      symptoms.forEach(symptom => {
        message += `• ${symptom.name}\n`;
      });
      message += `\n💡 *권장사항:*\n`;
      message += `• 즉시 의료진과 상담하세요\n`;
      message += `• 응급실 방문을 고려하세요\n`;
      message += `• 증상이 악화되면 119에 연락하세요`;
      
      followUp = 'URGENT_CARE';
    } else {
      message = `🤔 말씀하신 증상을 살펴보겠습니다.\n\n`;
      message += `*감지된 증상:*\n`;
      symptoms.forEach(symptom => {
        message += `• ${symptom.name}\n`;
      });
      message += `\n🔍 맞춤형 건강 조언을 찾아보고 있어요...`;
      
      followUp = 'SYMPTOM_ANALYSIS';
      
      keyboard = {
        inline_keyboard: [
          [{ text: '🔍 상세 분석 받기', callback_data: 'detailed_analysis' }],
          [{ text: '💡 맞춤 조언 받기', callback_data: 'personalized_advice' }],
          [{ text: '📊 건강 리포트 생성', callback_data: 'health_report' }]
        ]
      };
    }

    return { message, followUp, keyboard };
  }

  async handleHealthState(chatId, text, nlpResult, userState) {
    const emotionalState = this.nlpService.analyzeEmotionalState(nlpResult.sentiment);
    const healthEntities = nlpResult.entities.filter(e => e.type === 'HEALTH_INDICATOR');
    
    let message = '';
    let followUp = null;

    if (emotionalState === 'NEGATIVE') {
      message = `😔 현재 건강 상태가 좋지 않으신 것 같아요.\n\n`;
      message += `*감지된 상태:*\n`;
      healthEntities.forEach(entity => {
        message += `• ${entity.name}\n`;
      });
      message += `\n🤗 함께 해결책을 찾아보겠습니다...`;
      
      followUp = 'NEGATIVE_HEALTH_SUPPORT';
    } else if (emotionalState === 'POSITIVE') {
      message = `😊 건강 상태가 좋으시군요!\n\n`;
      message += `*감지된 상태:*\n`;
      healthEntities.forEach(entity => {
        message += `• ${entity.name}\n`;
      });
      message += `\n💪 더 나은 건강을 위한 조언을 드리겠습니다...`;
      
      followUp = 'POSITIVE_HEALTH_ENHANCEMENT';
    } else {
      message = `💭 현재 건강 상태를 분석해보겠습니다.\n\n`;
      message += `*감지된 상태:*\n`;
      healthEntities.forEach(entity => {
        message += `• ${entity.name}\n`;
      });
      message += `\n🔍 개선 방안을 찾아보고 있어요...`;
      
      followUp = 'NEUTRAL_HEALTH_ANALYSIS';
    }

    return { message, followUp };
  }

  async handleHealthQuestion(chatId, text, nlpResult, userState) {
    const questionEntities = nlpResult.entities.filter(e => e.type === 'HEALTH_TOPIC');
    
    let message = `💡 좋은 질문이네요!\n\n`;
    message += `*질문 주제:*\n`;
    questionEntities.forEach(entity => {
      message += `• ${entity.name}\n`;
    });
    message += `\n🔍 관련 정보를 찾아서 자세히 답변드리겠습니다...`;
    
    const followUp = 'HEALTH_QUESTION_ANSWER';
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '📚 상세 정보 보기', callback_data: 'detailed_info' }],
        [{ text: '💡 실용적 조언', callback_data: 'practical_advice' }],
        [{ text: '🎯 맞춤 솔루션', callback_data: 'custom_solution' }]
      ]
    };

    return { message, followUp, keyboard };
  }

  async handleHealthReference(chatId, text, nlpResult, userState) {
    const referenceEntities = nlpResult.entities.filter(e => e.type === 'HEALTH_REFERENCE');
    
    let message = `🔍 말씀하신 건강 관련 내용을 분석해보겠습니다.\n\n`;
    message += `*참조된 내용:*\n`;
    referenceEntities.forEach(entity => {
      message += `• ${entity.name}\n`;
    });
    message += `\n📊 관련 데이터와 함께 종합 분석을 진행합니다...`;
    
    const followUp = 'HEALTH_REFERENCE_ANALYSIS';

    return { message, followUp };
  }

  async handleWeatherInquiry(chatId, text, nlpResult, userState) {
    const locationEntities = nlpResult.entities.filter(e => e.type === 'LOCATION');
    
    if (locationEntities.length > 0) {
      const location = locationEntities[0].name;
      return await this.handleWeatherQuery(chatId, text);
    } else {
      let message = `🌤️ 날씨 정보를 확인하려면:\n\n`;
      message += `1. 📍 위치 정보를 공유해주세요 (📍 버튼 클릭)\n`;
      message += `2. 또는 도시명을 포함해서 메시지를 보내주세요\n`;
      message += `   예: "서울 날씨 어때?", "뉴욕 날씨 알려줘"`;
      
      return { message };
    }
  }

  async handleGeneralGreeting(chatId, text, nlpResult, userState) {
    const timeOfDay = this.getCurrentTimeOfDay();
    let greeting = '';
    
    switch (timeOfDay) {
      case 'morning':
        greeting = '🌅 좋은 아침이에요!';
        break;
      case 'afternoon':
        greeting = '☀️ 좋은 오후에요!';
        break;
      case 'evening':
        greeting = '🌆 좋은 저녁이에요!';
        break;
      default:
        greeting = '🌙 안녕하세요!';
    }
    
    let message = `${greeting}\n\n`;
    message += `당신의 AI 건강 동반자입니다! 🤖\n\n`;
    message += `💡 *오늘 할 수 있는 것들:*\n`;
    message += `• 📸 사진으로 페르소나 분석\n`;
    message += `• 💬 건강 관련 질문하기\n`;
    message += `• 🌤️ 날씨 기반 추천 받기\n`;
    message += `• 📊 건강 상태 체크하기`;
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '🔬 분석 시작하기', callback_data: 'start_analysis' }],
        [{ text: '💡 건강 조언 받기', callback_data: 'get_advice' }],
        [{ text: '🌤️ 날씨 확인하기', callback_data: 'check_weather' }]
      ]
    };

    return { message, keyboard };
  }

  async handleAnalysisRequest(chatId, text, nlpResult, userState) {
    let message = `🔬 페르소나 분석을 시작하겠습니다!\n\n`;
    message += `*분석 방법을 선택해주세요:*\n\n`;
    message += `1. 📸 **얼굴 사진 분석** (가장 정확)\n`;
    message += `2. 💓 **생체 정보 입력** (혈압, 맥박 등)\n`;
    message += `3. 💬 **메시지 기반 분석** (현재 진행 중)\n`;
    message += `4. 📍 **위치 기반 분석** (날씨 연동)\n\n`;
    message += `현재 메시지 기반 분석을 진행하고 있습니다...`;
    
    const followUp = 'ANALYSIS_IN_PROGRESS';
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '📸 사진으로 분석', callback_data: 'photo_analysis' }],
        [{ text: '💓 생체 정보 입력', callback_data: 'vital_signs' }],
        [{ text: '📍 위치 공유하기', callback_data: 'share_location' }]
      ]
    };

    return { message, followUp, keyboard };
  }

  async handleAdviceRequest(chatId, text, nlpResult, userState) {
    const adviceTopics = nlpResult.entities.filter(e => e.type === 'ADVICE_TOPIC');
    
    let message = `💡 건강 조언을 드리겠습니다!\n\n`;
    
    if (adviceTopics.length > 0) {
      message += `*요청하신 주제:*\n`;
      adviceTopics.forEach(topic => {
        message += `• ${topic.name}\n`;
      });
      message += `\n🔍 관련 조언을 찾아보고 있어요...`;
    } else {
      message += `어떤 건강 관련 조언이 필요하신가요?\n\n`;
      message += `• 🏃‍♂️ 운동\n`;
      message += `• 🍎 식단\n`;
      message += `• 😌 스트레스 관리\n`;
      message += `• 💤 수면\n`;
      message += `• 🎯 일반적인 건강 관리`;
    }
    
    const followUp = 'ADVICE_GENERATION';
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '🏃‍♂️ 운동 조언', callback_data: 'exercise_advice' }],
        [{ text: '🍎 식단 조언', callback_data: 'diet_advice' }],
        [{ text: '😌 스트레스 관리', callback_data: 'stress_management' }],
        [{ text: '💤 수면 조언', callback_data: 'sleep_advice' }]
      ]
    };

    return { message, followUp, keyboard };
  }

  async handleGeneralConversation(chatId, text, nlpResult, userState) {
    let message = `💭 말씀해주신 내용을 분석해보겠습니다.\n\n`;
    message += `*감지된 키워드:*\n`;
    nlpResult.entities.slice(0, 3).forEach(entity => {
      message += `• ${entity.name}\n`;
    });
    message += `\n🔍 관련 건강 정보를 찾아보고 있어요...`;
    
    const followUp = 'GENERAL_ANALYSIS';
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '🔬 페르소나 분석', callback_data: 'persona_analysis' }],
        [{ text: '💡 건강 조언', callback_data: 'health_advice' }],
        [{ text: '🌤️ 날씨 확인', callback_data: 'weather_check' }]
      ]
    };

    return { message, followUp, keyboard };
  }

  async handleFollowUpAction(chatId, followUpType, nlpResult, userState) {
    console.log(`🔄 후속 액션 처리: ${followUpType}`);
    
    switch (followUpType) {
      case 'SYMPTOM_ANALYSIS':
        await this.performSymptomAnalysis(chatId, nlpResult, userState);
        break;
        
      case 'HEALTH_QUESTION_ANSWER':
        await this.answerHealthQuestion(chatId, nlpResult, userState);
        break;
        
      case 'ANALYSIS_IN_PROGRESS':
        await this.performTextBasedAnalysis(chatId, nlpResult, userState);
        break;
        
      case 'ADVICE_GENERATION':
        await this.generatePersonalizedAdvice(chatId, nlpResult, userState);
        break;
        
      case 'GENERAL_ANALYSIS':
        await this.performGeneralAnalysis(chatId, nlpResult, userState);
        break;
        
      default:
        console.log(`알 수 없는 후속 액션: ${followUpType}`);
    }
  }

  async performSymptomAnalysis(chatId, nlpResult, userState) {
    setTimeout(async () => {
      try {
        // 환경 데이터 준비
        const envData = userState.environmentalContext ? {
          weather: userState.environmentalContext.weather?.condition || 'sunny',
          time: this.getCurrentTimeOfDay(),
          season: this.getCurrentSeason()
        } : null;

        // 종합 페르소나 분석
        const result = this.personaAnalyzer.analyzePersona(null, null, envData);
        const formatted = this.personaAnalyzer.formatPersonaResult(result);
        
        await this.bot.sendMessage(chatId, formatted.text, { parse_mode: 'Markdown' });
        
        // 증상별 맞춤 조언
        const symptoms = nlpResult.entities.filter(e => e.type === 'SYMPTOM');
        if (symptoms.length > 0) {
          const symptomAdvice = this.generateSymptomSpecificAdvice(symptoms, result.scores);
          await this.bot.sendMessage(chatId, 
            `💡 *증상별 맞춤 조언*\n\n${symptomAdvice}`,
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

      } catch (error) {
        console.error('증상 분석 오류:', error);
        await this.bot.sendMessage(chatId, 
          '😔 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
      }
    }, 2000);
  }

  generateSymptomSpecificAdvice(symptoms, scores) {
    let advice = '';
    
    symptoms.forEach(symptom => {
      const symptomName = symptom.name.toLowerCase();
      
      if (symptomName.includes('피로') || symptomName.includes('스트레스')) {
        advice += `• **${symptom.name}**: 충분한 휴식과 스트레스 관리가 필요합니다. 명상이나 가벼운 운동을 시도해보세요.\n`;
      } else if (symptomName.includes('수면') || symptomName.includes('불면')) {
        advice += `• **${symptom.name}**: 규칙적인 수면 패턴과 편안한 수면 환경을 만들어보세요.\n`;
      } else if (symptomName.includes('소화') || symptomName.includes('위')) {
        advice += `• **${symptom.name}**: 천천히 식사하고 소화에 좋은 음식을 섭취해보세요.\n`;
      } else if (symptomName.includes('두통') || symptomName.includes('머리')) {
        advice += `• **${symptom.name}**: 충분한 수분 섭취와 휴식을 취해보세요.\n`;
      } else {
        advice += `• **${symptom.name}**: 증상이 지속되면 의료진과 상담하시는 것을 권장합니다.\n`;
      }
    });
    
    return advice || '증상에 대한 구체적인 조언을 제공할 수 없습니다. 의료진과 상담하시는 것을 권장합니다.';
  }

  async answerHealthQuestion(chatId, nlpResult, userState) {
    setTimeout(async () => {
      const questionTopics = nlpResult.entities.filter(e => e.type === 'HEALTH_TOPIC');
      
      let answer = `💡 *질문에 대한 답변*\n\n`;
      
      questionTopics.forEach(topic => {
        const topicName = topic.name.toLowerCase();
        
        if (topicName.includes('운동')) {
          answer += `**${topic.name}**:\n`;
          answer += `• 하루 30분 이상의 중간 강도 운동을 권장합니다\n`;
          answer += `• 걷기, 수영, 자전거 타기 등이 좋습니다\n`;
          answer += `• 개인 상황에 맞는 운동을 선택하세요\n\n`;
        } else if (topicName.includes('식단') || topicName.includes('영양')) {
          answer += `**${topic.name}**:\n`;
          answer += `• 균형 잡힌 식단이 중요합니다\n`;
          answer += `• 채소, 과일, 단백질을 충분히 섭취하세요\n`;
          answer += `• 과식과 폭식을 피하세요\n\n`;
        } else if (topicName.includes('수면')) {
          answer += `**${topic.name}**:\n`;
          answer += `• 하루 7-9시간의 수면을 권장합니다\n`;
          answer += `• 규칙적인 수면 패턴을 유지하세요\n`;
          answer += `• 수면 전 전자기기 사용을 줄이세요\n\n`;
        } else {
          answer += `**${topic.name}**:\n`;
          answer += `• 이 주제에 대한 구체적인 정보를 제공할 수 없습니다\n`;
          answer += `• 의료진과 상담하시는 것을 권장합니다\n\n`;
        }
      });
      
      await this.bot.sendMessage(chatId, answer, { parse_mode: 'Markdown' });
      
    }, 1500);
  }

  async performTextBasedAnalysis(chatId, nlpResult, userState) {
    setTimeout(async () => {
      try {
        // 환경 데이터 준비
        const envData = userState.environmentalContext ? {
          weather: userState.environmentalContext.weather?.condition || 'sunny',
          time: this.getCurrentTimeOfDay(),
          season: this.getCurrentSeason()
        } : null;

        // 종합 페르소나 분석
        const result = this.personaAnalyzer.analyzePersona(null, null, envData);
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

      } catch (error) {
        console.error('텍스트 분석 오류:', error);
        await this.bot.sendMessage(chatId, 
          '😔 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
      }
    }, 2000);
  }

  async generatePersonalizedAdvice(chatId, nlpResult, userState) {
    setTimeout(async () => {
      const adviceTopics = nlpResult.entities.filter(e => e.type === 'ADVICE_TOPIC');
      
      let advice = `💡 *맞춤형 건강 조언*\n\n`;
      
      if (adviceTopics.length > 0) {
        adviceTopics.forEach(topic => {
          const topicName = topic.name.toLowerCase();
          
          if (topicName.includes('운동')) {
            advice += `**${topic.name}**:\n`;
            advice += `• 하루 30분 이상의 중간 강도 운동\n`;
            advice += `• 개인 상황에 맞는 운동 선택\n`;
            advice += `• 꾸준한 실천이 중요합니다\n\n`;
          } else if (topicName.includes('식단')) {
            advice += `**${topic.name}**:\n`;
            advice += `• 균형 잡힌 영양소 섭취\n`;
            advice += `• 규칙적인 식사 시간\n`;
            advice += `• 충분한 수분 섭취\n\n`;
          } else if (topicName.includes('스트레스')) {
            advice += `**${topic.name}**:\n`;
            advice += `• 명상과 마음챙김 연습\n`;
            advice += `• 충분한 휴식과 취미 활동\n`;
            advice += `• 사회적 지지망 활용\n\n`;
          } else if (topicName.includes('수면')) {
            advice += `**${topic.name}**:\n`;
            advice += `• 규칙적인 수면 패턴\n`;
            advice += `• 편안한 수면 환경 조성\n`;
            advice += `• 수면 전 이완 활동\n\n`;
          }
        });
      } else {
        advice += `**일반적인 건강 관리**:\n`;
        advice += `• 규칙적인 운동과 식단 관리\n`;
        advice += `• 충분한 수면과 스트레스 관리\n`;
        advice += `• 정기적인 건강 검진\n`;
        advice += `• 긍정적인 마음가짐 유지\n\n`;
      }
      
      advice += `💡 더 구체적인 조언이 필요하시면 언제든 말씀해주세요!`;
      
      await this.bot.sendMessage(chatId, advice, { parse_mode: 'Markdown' });
      
    }, 1500);
  }

  async performGeneralAnalysis(chatId, nlpResult, userState) {
    setTimeout(async () => {
      try {
        // 환경 데이터 준비
        const envData = userState.environmentalContext ? {
          weather: userState.environmentalContext.weather?.condition || 'sunny',
          time: this.getCurrentTimeOfDay(),
          season: this.getCurrentSeason()
        } : null;

        // 종합 페르소나 분석
        const result = this.personaAnalyzer.analyzePersona(null, null, envData);
        const formatted = this.personaAnalyzer.formatPersonaResult(result);
        
        await this.bot.sendMessage(chatId, formatted.text, { parse_mode: 'Markdown' });
        
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

      } catch (error) {
        console.error('일반 분석 오류:', error);
        await this.bot.sendMessage(chatId, 
          '😔 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
      }
    }, 2000);
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

    // 메인 메뉴 인라인 키보드
    const mainMenuKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📸 사진으로 분석하기',
              callback_data: 'photo_analysis'
            },
            {
              text: '🎤 음성으로 분석하기',
              callback_data: 'voice_analysis'
            }
          ],
          [
            {
              text: '💬 텍스트로 분석하기',
              callback_data: 'text_analysis'
            },
            {
              text: '🎭 페르소나 카드 생성',
              callback_data: 'generate_card'
            }
          ],
          [
            {
              text: '🌤️ 날씨 기반 조언',
              callback_data: 'weather_advice'
            },
            {
              text: '💡 건강 조언 받기',
              callback_data: 'health_advice'
            }
          ],
          [
            {
              text: '🔬 정밀 분석 (웹)',
              callback_data: 'web_analysis'
            }
          ]
        ]
      }
    };

    await this.bot.sendMessage(chatId, welcomeText, { 
      parse_mode: 'Markdown',
      ...mainMenuKeyboard
    });
  }

  async sendHelpMessage(chatId) {
    const helpText = `🤖 *페르소나 다이어리 봇 MVP 도움말*

*기본 명령어:*
/start - 봇 시작 및 환영 메시지
/help - 이 도움말 메시지 표시
/analyze - 페르소나 분석 시작

*핵심 기능:*
/persona - 현재 페르소나 정보 확인
/weather - 날씨 기반 건강 조언
/advice - 개인화된 건강 조언

*분석 방법:*
1. /start로 봇을 시작하세요
2. /analyze로 분석을 시작하세요
3. 15초 음성/영상 메시지를 보내세요
4. 또는 사진을 업로드하세요
5. 개인화된 건강 조언을 받으세요

*지원하는 입력:*
• 음성 메시지: 음성 기반 분석
• 영상 메시지: 영상 기반 분석
• 사진 업로드: 얼굴 분석
• 위치 공유: 지역별 건강 조언
• 텍스트 메시지: 대화형 분석

💡 *팁:* 정확한 분석을 위해 조용한 환경에서 15초 이상의 음성/영상을 녹음해주세요.

*웹 분석:*
분석 결과를 더 자세히 보려면 웹 링크를 통해 접속하세요.

궁금한 것이 있으시면 언제든 말씀해주세요! 😊`;

    await this.bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  async startAnalysis(chatId) {
    // 웹 분석 링크 생성 (환경 변수에서 가져오거나 기본값 사용)
    const baseUrl = process.env.WEB_APP_URL || 'https://mkm-inst-web-907685055657.asia-northeast3.run.app';
    const webAnalysisUrl = `${baseUrl}?user_id=${chatId}`;
    
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
    // 사용자 상태 설정 - 분석 옵션 선택 모드
    const userState = this.userStates.get(chatId) || {};
    userState.waitingForAnalysisChoice = true;
    this.userStates.set(chatId, userState);

    const telegramAnalysisText = `📱 *텔레그램 분석 옵션*

다음 중 하나를 선택해주세요:

1. 📸 *얼굴 사진 보내기* - 얼굴 사진을 보내면 AI가 분석하여 맞춤 솔루션을 제공합니다
2. 💓 *생체 정보 입력* - 혈압, 맥박 등을 메시지로 보내면 종합 분석을 합니다
3. 💬 *메시지 보내기* - 건강에 대해 이야기하면 텍스트 기반으로 분석합니다
4. 📍 *위치 정보 공유* - 날씨 기반 맞춤 추천을 받을 수 있습니다
5. 🎭 *페르소나 카드 생성* - 아름다운 페르소나 카드를 생성합니다

*추천 순서:*
1. 📸 **얼굴 사진 분석** (가장 정확한 분석)
2. 🎭 **페르소나 카드 생성** (시각적 결과물)
3. 💓 생체 정보 분석 (혈압, 맥박 등)
4. 💬 텍스트 분석 (대화 기반)

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
                   `• 감정과 기분을 포함해보세요\n`