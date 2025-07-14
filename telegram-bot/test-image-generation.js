/**
 * MKM Lab 이미지 생성 시스템 테스트
 */

const { ImageGenerator } = require('./src/image-generator');

class ImageGenerationTest {
  constructor() {
    this.imageGenerator = new ImageGenerator();
  }

  async runTests() {
    console.log('🎨 MKM Lab 이미지 생성 시스템 테스트 시작\n');

    // 테스트 데이터
    const testUserData = {
      environment: {
        weather: 'sunny',
        cultural: {
          region: '서울',
          language: '한국어'
        }
      },
      persona: 'P1',
      scores: {
        thinking: 80,
        introversion: 60,
        driving: 70,
        practical: 50,
        stable: 65
      }
    };

    // 1. 기본 페르소나 이미지 생성 테스트
    console.log('1. 기본 페르소나 이미지 생성 테스트:');
    console.log('   페르소나: P1 (The Visionary Leader)');
    console.log('   사용자 데이터:', JSON.stringify(testUserData, null, 2));
    
    try {
      const personaResult = await this.imageGenerator.generatePersonaImage('P1', testUserData);
      console.log('   결과:', personaResult.success ? '성공' : '실패');
      if (personaResult.success) {
        console.log('   이미지 URL:', personaResult.imageUrl);
        console.log('   스타일:', personaResult.style);
        console.log('   프롬프트:', personaResult.prompt.substring(0, 100) + '...');
      } else {
        console.log('   오류:', personaResult.error);
        console.log('   폴백 URL:', personaResult.fallbackUrl);
      }
    } catch (error) {
      console.log('   테스트 오류:', error.message);
    }

    console.log('');

    // 2. 한정판 이벤트 이미지 생성 테스트
    console.log('2. 한정판 이벤트 이미지 생성 테스트:');
    console.log('   이벤트 테마: brazil_carnival');
    console.log('   페르소나: P3 (The Dynamic Explorer)');
    
    try {
      const eventResult = await this.imageGenerator.generateEventImage('brazil_carnival', 'P3', testUserData);
      console.log('   결과:', eventResult.success ? '성공' : '실패');
      if (eventResult.success) {
        console.log('   이미지 URL:', eventResult.imageUrl);
        console.log('   스타일:', eventResult.style);
        console.log('   한정판:', eventResult.isLimitedEdition);
        console.log('   프롬프트:', eventResult.prompt.substring(0, 100) + '...');
      } else {
        console.log('   오류:', eventResult.error);
        console.log('   폴백 URL:', eventResult.fallbackUrl);
      }
    } catch (error) {
      console.log('   테스트 오류:', error.message);
    }

    console.log('');

    // 3. 프롬프트 구성 테스트
    console.log('3. 프롬프트 구성 테스트:');
    
    const theme = this.imageGenerator.personaThemes['P2'];
    const style = this.imageGenerator.styles[theme.style];
    const prompt = this.imageGenerator.buildPersonaPrompt(theme, style, testUserData);
    
    console.log('   페르소나: P2 (The Balanced Builder)');
    console.log('   스타일:', style.name);
    console.log('   생성된 프롬프트:', prompt);

    console.log('');

    // 4. 메타데이터 생성 테스트
    console.log('4. 메타데이터 생성 테스트:');
    
    const metadata = this.imageGenerator.generateImageMetadata('P2', 'japan_cherry_blossom', testUserData);
    console.log('   메타데이터:', JSON.stringify(metadata, null, 2));

    console.log('');

    // 5. 모든 페르소나 스타일 테스트
    console.log('5. 모든 페르소나 스타일 테스트:');
    
    Object.keys(this.imageGenerator.personaThemes).forEach(personaCode => {
      const theme = this.imageGenerator.personaThemes[personaCode];
      const style = this.imageGenerator.styles[theme.style];
      console.log(`   ${personaCode}: ${style.name} 스타일`);
      console.log(`   색상: ${theme.colors.join(', ')}`);
      console.log(`   요소: ${theme.elements.join(', ')}`);
      console.log('');
    });

    console.log('✅ 이미지 생성 시스템 테스트 완료!');
  }

  // 프롬프트 구성 테스트를 위한 헬퍼 메서드
  buildPersonaPrompt(theme, style, userData) {
    return this.imageGenerator.buildPersonaPrompt(theme, style, userData);
  }
}

// 테스트 실행
async function runImageTests() {
  const test = new ImageGenerationTest();
  await test.runTests();
}

// API 키가 설정되어 있으면 테스트 실행
if (process.env.OPENAI_API_KEY || process.env.DALLE_API_KEY) {
  runImageTests().catch(console.error);
} else {
  console.log('🎨 이미지 생성 시스템 테스트');
  console.log('');
  console.log('⚠️  OpenAI API 키가 설정되지 않았습니다.');
  console.log('   환경 변수 OPENAI_API_KEY 또는 DALLE_API_KEY를 설정해주세요.');
  console.log('');
  console.log('   테스트는 API 키 없이도 프롬프트 구성과 메타데이터 생성 기능을 확인할 수 있습니다.');
  console.log('');
  
  const test = new ImageGenerationTest();
  test.runTests().catch(console.error);
} 