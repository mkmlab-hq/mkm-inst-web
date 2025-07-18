require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { PersonaAnalyzer } = require('./persona-analyzer');
const { MessageHandler } = require('./message-handler');

// 환경 변수 확인
const token = process.env.TELEGRAM_BOT_TOKEN;
const googleAIKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || 'development';

console.log('🚀 페르소나 다이어리 텔레그램 봇 v2.0.0 시작');
console.log('🔧 환경 변수 확인:');
console.log(`   PORT: ${port}`);
console.log(`   NODE_ENV: ${nodeEnv}`);
console.log(`   TELEGRAM_BOT_TOKEN: ${token ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
console.log(`   GOOGLE_AI_API_KEY: ${googleAIKey ? '✅ 설정됨' : '❌ 설정되지 않음'}`);

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

// 봇 초기화
const bot = new TelegramBot(token, { polling: true });

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

    console.log(`🔘 콜백 쿼리 수신: ${data}`);

    switch (data) {
      case 'telegram_analysis':
        await messageHandler.showTelegramAnalysisOptions(chatId);
        break;
      
      case 'music_five_elements':
        await messageHandler.generateFiveElementsMusic(chatId);
        break;
      
      case 'music_gamma_frequency':
        await messageHandler.generateGammaFrequencyMusic(chatId);
        break;
      
      // 원소 기반 능동적 AI 제안 처리
      default:
        if (data.startsWith('proactive_')) {
          await messageHandler.handleProactiveSuggestion(chatId, data);
        } else {
          await bot.answerCallbackQuery(callbackQuery.id, {
            text: '알 수 없는 옵션입니다.'
          });
        }
    }

    // 콜백 쿼리 응답
    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (error) {
    console.error('❌ 콜백 쿼리 처리 에러:', error);
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: '오류가 발생했습니다.'
    });
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