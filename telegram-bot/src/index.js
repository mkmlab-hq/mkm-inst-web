require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { PersonaAnalyzer } = require('./persona-analyzer');
const { MessageHandler } = require('./message-handler');
const axios = require('axios');

// 환경 변수 확인
const token = process.env.TELEGRAM_BOT_TOKEN;
const googleAIKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || 'development';

console.log('🚀 MKM Lab AI 페르소나 봇 - 퀀텀 리프 작전 시작!');
console.log('🔧 환경 변수 확인:');
console.log(`   PORT: ${port}`);
console.log(`   NODE_ENV: ${nodeEnv}`);
console.log(`   TELEGRAM_BOT_TOKEN: ${token ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
console.log(`   GOOGLE_AI_API_KEY: ${googleAIKey ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
console.log(`   MKM_ANALYSIS_ENGINE_URL: ${process.env.MKM_ANALYSIS_ENGINE_URL || 'http://localhost:8000'}`);
console.log(`   MKM_API_KEY: ${process.env.MKM_API_KEY ? '✅ 설정됨' : '❌ 설정되지 않음'}`);

// Google AI API 키 경고
if (!googleAIKey) {
  console.warn('⚠️  GOOGLE_AI_API_KEY가 설정되지 않았습니다.');
  console.warn('📝 이미지 생성 기능이 폴백 모드로 작동합니다.');
  console.warn('🔗 Google AI 설정 가이드: docs/API_SETUP_GUIDE.md');
}

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN이 설정되지 않았습니다.');
  console.log('📝 Cloud Run 환경 변수에 TELEGRAM_BOT_TOKEN을 추가해주세요.');
  console.log('🔄 봇 없이 HTTP 서버만 시작합니다...');
  
  // 토큰이 없어도 HTTP 서버는 시작
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'running',
      message: 'HTTP 서버는 실행 중이지만 텔레그램 봇 토큰이 설정되지 않았습니다.',
      service: 'mkm-telegram-bot',
      aiProvider: 'Google AI Gemini Pro Vision',
      timestamp: new Date().toISOString()
    }));
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 HTTP 서버가 포트 ${port}에서 시작되었습니다.`);
  });

  return;
}

// 봇 초기화 (webhook 방식)
const bot = new TelegramBot(token, { webHook: true });
const webhookUrl = 'https://mkm-inst-web-907685055657.asia-northeast3.run.app/telegram-webhook';
bot.setWebHook(webhookUrl);

// 서비스 초기화
const personaAnalyzer = new PersonaAnalyzer();
const messageHandler = new MessageHandler(bot, personaAnalyzer);

// HTTP 서버 생성 (Cloud Run 요구사항)
const server = http.createServer((req, res) => {
  // CORS 헤더 추가
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 텔레그램 웹훅 엔드포인트
  if (req.url === '/telegram-webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        bot.processUpdate(update);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (error) {
        console.error('❌ 웹훅 처리 오류:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      }
    });
    return;
  }

  // 헬스체크 엔드포인트
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      service: 'persona-diary-bot',
      aiProvider: 'Google AI Gemini Pro Vision',
      imageGeneration: googleAIKey ? 'enabled' : 'fallback',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 루트 엔드포인트
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: '페르소나 다이어리 텔레그램 봇이 실행 중입니다!',
      service: 'persona-diary-bot',
      version: '2.0.0',
      aiProvider: 'Google AI Gemini Pro Vision',
      imageGeneration: googleAIKey ? 'enabled' : 'fallback',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 분석 결과 수신 엔드포인트
  if (req.url === '/send-analysis-result' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { user_id, analysis_result } = data;
        
        console.log(`📊 분석 결과 수신: 사용자 ${user_id}`);
        
        // 텔레그램으로 결과 전송
        await messageHandler.sendAnalysisResultToUser(user_id, analysis_result);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true,
          message: '분석 결과가 성공적으로 전송되었습니다.',
          aiProvider: 'Google AI Gemini Pro Vision'
        }));
      } catch (error) {
        console.error('❌ 분석 결과 처리 오류:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false,
          error: '분석 결과 처리 중 오류가 발생했습니다.'
        }));
      }
    });
    return;
  }

  // 404 처리
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// 서버 시작 (0.0.0.0으로 바인딩하여 Cloud Run에서 접근 가능하도록)
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 HTTP 서버가 포트 ${port}에서 시작되었습니다.`);
  console.log(`🔗 헬스체크: http://localhost:${port}/health`);
});

console.log('🤖 페르소나 다이어리 텔레그램 봇이 시작되었습니다!');
console.log('🎨 AI 이미지 생성: Google AI Gemini Pro Vision');
console.log('📱 봇을 찾아서 /start 명령어를 입력해보세요.');

// 에러 핸들링
bot.on('error', (error) => {
  console.error('❌ 봇 에러:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ 폴링 에러:', error);
});

// 메시지 핸들링
bot.on('message', async (msg) => {
  try {
    await messageHandler.handleMessage(msg);
  } catch (error) {
    console.error('❌ 메시지 처리 에러:', error);
    
    // 사용자에게 에러 메시지 전송
    try {
      await bot.sendMessage(msg.chat.id, 
        '😔 죄송합니다. 일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'
      );
    } catch (sendError) {
      console.error('❌ 에러 메시지 전송 실패:', sendError);
    }
  }
});

// 콜백 쿼리 핸들링 (인라인 버튼 클릭)
bot.on('callback_query', async (callbackQuery) => {
  try {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    console.log(`🔘 콜백 쿼리 수신: ${data} (채팅 ID: ${chatId})`);

    // 콜백 쿼리 응답 (즉시 응답하여 로딩 상태 해제)
    await bot.answerCallbackQuery(callbackQuery.id);

    switch (data) {
      case 'telegram_analysis':
        await messageHandler.showTelegramAnalysisOptions(chatId);
        break;
      
      case 'generate_card':
        await messageHandler.generatePersonaCard(chatId);
        break;
      
      case 'music_five_elements':
        await messageHandler.generateFiveElementsMusic(chatId);
        break;
      
      case 'music_gamma_frequency':
        await messageHandler.generateGammaFrequencyMusic(chatId);
        break;
      
      case 'web_analysis':
        await messageHandler.startAnalysis(chatId);
        break;
      
      case 'photo_analysis':
        await bot.sendMessage(chatId, 
          '📸 *얼굴 사진 분석*\n\n아래 클립 아이콘(📎)을 눌러 갤러리에서 얼굴 사진을 첨부해 주세요!\n\n사진을 첨부하면 AI가 자동으로 페르소나 카드를 생성해드립니다.',
          { parse_mode: 'Markdown' }
        );
        break;
      case 'voice_analysis':
        await bot.sendMessage(chatId, 
          '🎤 *음성 분석*\n\n마이크 아이콘(🎤)을 누르고 "아~" 소리를 3초간 내주세요!\n\n3초 이내의 짧은 음성 메시지만 분석에 사용됩니다.',
          { parse_mode: 'Markdown' }
        );
        break;
      
      case 'text_analysis':
        await bot.sendMessage(chatId, '💬 건강 관련 메시지를 입력해주세요!');
        break;
      
      // case 'weather_advice':
      //   await messageHandler.showWeatherOptions(chatId);
      //   break;
      
      case 'persona_info':
        await messageHandler.showPersonaInfo(chatId);
        break;
      
      case 'health_advice':
        await messageHandler.showAdviceOptions(chatId);
        break;
      
      case 'environment_analysis':
        await messageHandler.showEnvironmentOptions(chatId);
        break;
      
      // 페르소나 다이어리 관련
      case 'diary_write':
        await messageHandler.startDiaryEntry(chatId);
        break;
      
      case 'diary_read':
        await messageHandler.showDiaryEntries(chatId);
        break;
      
      case 'diary_stats':
        await messageHandler.showDiaryStats(chatId);
        break;
      
      case 'diary_search':
        await messageHandler.startDiarySearch(chatId);
        break;
      
      // AI 음악 솔루션
      case 'music_options':
        await messageHandler.showMusicOptions(chatId);
        break;
      
      // 이미지 생성 관련
      case 'generate_image':
        await messageHandler.generatePersonaImage(chatId);
        break;
      
      case 'generate_limited':
        await messageHandler.generateLimitedEditionImage(chatId);
        break;
      
      case 'generate_dreamscape':
        await messageHandler.generateDreamscapeImage(chatId);
        break;
      
      case 'generate_logo':
        await messageHandler.generatePersonaLogo(chatId);
        break;
      
      // 스타일 관련
      case 'show_styles':
        await messageHandler.showAvailableStyles(chatId);
        break;
      
      // 이벤트 관련
      case 'limited_events':
        await messageHandler.showLimitedEditionEvents(chatId);
        break;
      
      case 'event_dashboard':
        await messageHandler.showEventDashboard(chatId);
        break;
      
      // 분석 관련
      case 'disposition_analysis':
        await messageHandler.showDispositionAnalysis(chatId);
        break;
      
      case 'persona_evolution':
        await messageHandler.showPersonaEvolution(chatId);
        break;
      
      // 상담 관련
      case 'consult_ignis_창의적 아이디어 발굴하기':
      case 'consult_terra_업무 계획 세우기':
      case 'consult_aqua_새로운 환경 적응하기':
      case 'consult_aether_직관적 의사결정하기':
        await bot.sendMessage(chatId, '💬 상담 기능은 곧 업데이트될 예정입니다!');
        break;
      
      case 'premium_ignis_창의적 아이디어 발굴하기':
      case 'premium_terra_업무 계획 세우기':
      case 'premium_aqua_새로운 환경 적응하기':
      case 'premium_aether_직관적 의사결정하기':
        await bot.sendMessage(chatId, '📊 정밀 분석 기능은 곧 업데이트될 예정입니다!');
        break;
      
      case 'action_ignis_창의적 아이디어 발굴하기':
      case 'action_terra_업무 계획 세우기':
      case 'action_aqua_새로운 환경 적응하기':
      case 'action_aether_직관적 의사결정하기':
        await bot.sendMessage(chatId, '🎯 액션 플랜 기능은 곧 업데이트될 예정입니다!');
        break;
      
      // 원소 기반 능동적 AI 제안 처리
      case 'custom_solution': {
        // 맞춤 솔루션 기능: 백엔드 연동
        const analysisUrl = process.env.MKM_ANALYSIS_ENGINE_URL;
        const apiKey = process.env.MKM_API_KEY;
        if (!analysisUrl || !apiKey) {
          await bot.sendMessage(chatId, '❌ 맞춤 솔루션 기능을 사용할 수 없습니다. (백엔드 연동 정보가 누락됨)');
          break;
        }
        try {
          // 예시: 사용자 ID, 최근 페르소나 결과 등 전달 (실제 구현에 맞게 수정 필요)
          const payload = {
            telegram_id: chatId,
            // 필요한 추가 정보(userState 등)도 여기에 포함 가능
          };
          const response = await axios.post(`${analysisUrl}/custom-solution`, payload, {
            headers: { 'x-api-key': apiKey }
          });
          const solution = response.data?.solution || response.data?.message || '✅ 맞춤 솔루션이 도착했습니다!';
          await bot.sendMessage(chatId, `🎯 맞춤 솔루션\n\n${solution}`);
        } catch (error) {
          console.error('❌ 맞춤 솔루션 API 호출 오류:', error?.response?.data || error.message);
          await bot.sendMessage(chatId, '❌ 맞춤 솔루션을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        }
        break;
      }
      
      default:
        if (data.startsWith('proactive_')) {
          await messageHandler.handleProactiveSuggestion(chatId, data);
        } else {
          console.log(`⚠️ 처리되지 않은 콜백 데이터: ${data}`);
          await bot.sendMessage(chatId, 
            '🔧 해당 기능은 현재 개발 중입니다. 다른 옵션을 선택해주세요!'
          );
        }
    }

  } catch (error) {
    console.error('❌ 콜백 쿼리 처리 에러:', error);
    try {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '오류가 발생했습니다. 다시 시도해주세요.'
      });
    } catch (answerError) {
      console.error('❌ 콜백 응답 전송 실패:', answerError);
    }
  }
});

// 프로세스 종료 처리
process.on('SIGINT', () => {
  console.log('\n🛑 봇을 종료합니다...');
  bot.stopPolling();
  server.close(() => {
    console.log('HTTP 서버가 종료되었습니다.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 봇을 종료합니다...');
  bot.stopPolling();
  server.close(() => {
    console.log('HTTP 서버가 종료되었습니다.');
    process.exit(0);
  });
}); 