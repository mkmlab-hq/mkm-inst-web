require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { PersonaAnalyzer } = require('./persona-analyzer');
const { MessageHandler } = require('./message-handler');
const axios = require('axios');

// i18n-node 다국어 지원 추가
const i18n = require('i18n');
i18n.configure({
  locales: ['ko', 'en'],
  directory: __dirname + '/../../locales',
  defaultLocale: 'en', // 기본 언어를 영어로 설정
  objectNotation: true
});

// 언어 감지 함수
function detectLang(msg) {
  // ko만 한국어, 그 외(감지 실패 포함)는 모두 영어
  return (msg.from && msg.from.language_code && msg.from.language_code === 'ko') ? 'ko' : 'en';
}

// 메시지 전송 래퍼
function sendI18nMessage(chatId, msg, key, params, opts = {}) {
  i18n.setLocale(detectLang(msg));
  return bot.sendMessage(chatId, i18n.__(key, params), opts);
}

// 메인 버튼 다국어화
function getMainButtons(lang) {
  i18n.setLocale(lang);
  return [
    [{ text: i18n.__('menu.tongue'), callback_data: 'start_tongue_analysis' }],
    [{ text: i18n.__('menu.voice'), callback_data: 'start_voice_analysis' }],
    [{ text: i18n.__('menu.persona_chat'), callback_data: 'start_persona_chat' }]
  ];
}

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

// RAG 어드바이저(헌법/백서/윤리 질의) 버튼 추가
const RAG_BUTTON = [{ text: 'MKM Lab 원칙/백서/윤리 질의', callback_data: 'ask_constitution' }];

// 온보딩 메시지 및 메인 버튼
const MAIN_BUTTONS = [
  [{ text: '👅 AI 혀 통찰(설진 검사)', callback_data: 'start_tongue_analysis' }],
  [{ text: '🎤 AI 음성 역학 분석(음성 검사)', callback_data: 'start_voice_analysis' }],
  [{ text: '💬 나의 페르소나와 대화하기', callback_data: 'start_persona_chat' }]
];

bot.onText(/\/start/, (msg) => {
  const lang = detectLang(msg);
  bot.sendMessage(msg.chat.id, i18n.__({ phrase: 'onboarding', locale: lang }), {
    reply_markup: {
      inline_keyboard: getMainButtons(lang)
    }
  });
});

// 설진 검사 시작
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'start_tongue_analysis') {
    userStep[chatId] = { step: 'tongue', tongue: null, voice: null };
    await bot.sendMessage(chatId, `[AI 혀 통찰(설진 검사)]\nAI가 수천 년의 지혜와 최첨단 기술을 융합하여, 당신의 혀에 담긴 미세한 패턴을 통찰합니다.\n지금 바로 혀 사진을 첨부해 주세요. (예시 이미지 첨부)`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '사진 첨부하기', callback_data: 'attach_tongue' }],
          [{ text: '👉 건너뛰기', callback_data: 'skip_tongue' }]
        ]
      }
    });
    return;
  }

  if (data === 'start_voice_analysis') {
    userStep[chatId] = { step: 'voice', tongue: null, voice: null };
    await bot.sendMessage(chatId, `[AI 음성 역학 분석(음성 검사)]\nAI가 당신의 목소리에서 에너지 흐름과 심리적 역동성을 분석합니다.\n마이크 아이콘을 누른 후, 5초간 자유롭게 이야기하거나 '아~' 소리를 내어 녹음해 주세요.`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎤 녹음 시작', callback_data: 'attach_voice' }],
          [{ text: '👉 건너뛰기', callback_data: 'skip_voice' }]
        ]
      }
    });
    return;
  }

  // 기존 페르소나 카드/대화 흐름 등은 그대로 유지
  if (data === 'start_persona_card') {
    // 카드 생성 횟수 제한 체크 (백엔드 연동)
    try {
      const res = await axios.post(process.env.MKM_ANALYSIS_ENGINE_URL + '/card/check-limit', { telegram_id: chatId });
      if (res.data && res.data.allowed === false) {
        await bot.sendMessage(chatId, `오늘은 [아침/점심/저녁] 페르소나 카드를 모두 받으셨군요!\n당신의 페르소나는 잠시 휴식 중입니다. 내일 새로운 모습으로 다시 찾아올게요!✨`);
        return;
      } else if (res.data && typeof res.data.remaining === 'number') {
        await bot.sendMessage(chatId, `오늘 ${res.data.remaining}장의 카드를 더 받을 수 있습니다.`);
      }
    } catch (err) {
      await bot.sendMessage(chatId, '카드 생성 가능 여부 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    userStep[chatId] = { step: 1, tongue: null, voice: null };
    await bot.sendMessage(chatId, `[STEP 1/2] AI 혀 통찰: 당신의 혀는 몸과 마음의 거울!\nAI가 수천 년의 지혜와 최첨단 기술을 융합하여, 당신의 혀에 담긴 미세한 패턴을 통찰합니다.\n지금 바로 혀 사진을 첨부해 주세요. (예시 이미지 첨부)`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '사진 첨부하기', callback_data: 'attach_tongue' }],
          [{ text: '👉 건너뛰기', callback_data: 'skip_tongue' }]
        ]
      }
    });
    return;
  }

  if (data === 'start_persona_chat') {
    // 페르소나 카드 유무 확인 및 대화 진입
    try {
      const res = await axios.post(process.env.MKM_ANALYSIS_ENGINE_URL + '/card/get-latest', { telegram_id: chatId });
      if (!res.data || !res.data.persona_card) {
        await bot.sendMessage(chatId, '아직 페르소나 카드가 없습니다. 먼저 "내 안의 페르소나 발견하기"를 진행해 주세요!');
        return;
      }
      const personaName = res.data.persona_card.name || '당신의 페르소나';
      const thumbnailUrl = res.data.persona_card.thumbnail_url;
      if (thumbnailUrl) {
        await bot.sendPhoto(chatId, thumbnailUrl);
      }
      await bot.sendMessage(chatId, `${personaName}입니다. 당신의 내면 깊은 곳에서 깨어난 진짜 페르소나, 바로 저입니다.\n당신의 오늘과 내일을 저와 함께 탐험해 볼까요? 무엇이 궁금하신가요?`);
      // 이후 답변마다 썸네일+페르소나명+어조 유지
    } catch (err) {
      await bot.sendMessage(chatId, '페르소나 카드 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
    return;
  }

  if (data === 'attach_tongue') {
    await bot.sendMessage(chatId, '갤러리에서 혀 사진을 첨부해 주세요!');
    userStep[chatId].waitingTongue = true;
    return;
  }

  if (data === 'skip_tongue') {
    userStep[chatId].tongue = null;
    userStep[chatId].step = 2;
    await bot.sendMessage(chatId, `[STEP 2/2] AI 음성 역학 분석: 목소리에 담긴 에너지와 감정!\nAI가 당신의 목소리에서 에너지 흐름과 심리적 역동성을 분석합니다.\n마이크 아이콘을 누른 후, 5초간 자유롭게 이야기하거나 '아~' 소리를 내어 녹음해 주세요.`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎤 녹음 시작', callback_data: 'attach_voice' }],
          [{ text: '👉 건너뛰기', callback_data: 'skip_voice' }]
        ]
      }
    });
    await bot.sendMessage(chatId, `선택하지 않아도 괜찮아요. 당신의 페르소나 여정은 계속됩니다.`);
    return;
  }

  if (data === 'attach_voice') {
    await bot.sendMessage(chatId, '마이크 아이콘을 눌러 음성 메시지를 녹음해 주세요!');
    userStep[chatId].waitingVoice = true;
    return;
  }

  if (data === 'skip_voice') {
    userStep[chatId].voice = null;
    if (!userStep[chatId].tongue && !userStep[chatId].voice) {
      await bot.sendMessage(chatId, `두 가지 측정을 모두 건너뛰셨군요!\nAI가 당신의 기존 데이터와 통찰을 바탕으로, 여정은 계속됩니다. 더 정확한 카드를 위해 다음번에 참여해 주세요!`);
    } else {
      await bot.sendMessage(chatId, `훌륭해요! 당신의 데이터를 모두 취합했습니다.\n이제 세상에 단 하나뿐인 당신의 건강 페르소나 카드를 만들 시간입니다.`);
    }
    delete userStep[chatId];
    return;
  }

  try {
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

// 측정 흐름 상태 관리
const userStep = {};

// 사진/음성 메시지 처리도 step에 따라 분기
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  if (userStep[chatId] && userStep[chatId].step === 'tongue') {
    userStep[chatId].tongue = msg.photo;
    await bot.sendMessage(chatId, `혀 사진이 성공적으로 업로드되었습니다!\n이제 AI가 분석을 시작합니다. 결과는 곧 안내해 드릴게요.`);
    // 설진 분석 결과 처리 로직 연결 필요
    // await triggerPersonaCardCreation(chatId, userStep[chatId]);
    delete userStep[chatId];
  }
});
bot.on('voice', async (msg) => {
  const chatId = msg.chat.id;
  if (userStep[chatId] && userStep[chatId].step === 'voice') {
    userStep[chatId].voice = msg.voice;
    await bot.sendMessage(chatId, `음성 메시지가 성공적으로 업로드되었습니다!\n이제 AI가 분석을 시작합니다. 결과는 곧 안내해 드릴게요.`);
    // 음성 분석 결과 처리 로직 연결 필요
    // await triggerPersonaCardCreation(chatId, userStep[chatId]);
    delete userStep[chatId];
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