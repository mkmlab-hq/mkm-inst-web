require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { PersonaAnalyzer } = require('./persona-analyzer');
const { MessageHandler } = require('./message-handler');

// 환경 변수 확인
const token = process.env.TELEGRAM_BOT_TOKEN;
const port = process.env.PORT || 8080;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN이 설정되지 않았습니다.');
  console.log('📝 .env 파일에 TELEGRAM_BOT_TOKEN을 추가해주세요.');
  process.exit(1);
}

// 봇 초기화
const bot = new TelegramBot(token, { polling: true });

// 서비스 초기화
const personaAnalyzer = new PersonaAnalyzer();
const messageHandler = new MessageHandler(bot, personaAnalyzer);

// HTTP 서버 생성 (Cloud Run 요구사항)
const server = http.createServer((req, res) => {
  // 헬스체크 엔드포인트
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      service: 'mkm-telegram-bot',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 루트 엔드포인트
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'MKM Lab Telegram Bot is running!',
      service: 'mkm-telegram-bot',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 404 처리
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// 서버 시작
server.listen(port, () => {
  console.log(`🚀 HTTP 서버가 포트 ${port}에서 시작되었습니다.`);
  console.log(`🔗 헬스체크: http://localhost:${port}/health`);
});

console.log('🤖 MKM Lab 텔레그램 봇이 시작되었습니다!');
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