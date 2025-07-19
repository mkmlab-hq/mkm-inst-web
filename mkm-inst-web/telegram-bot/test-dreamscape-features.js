/**
 * MKM Lab AI 데이터 드림스케이프 기능 테스트 스크립트
 * 
 * '내면의 초상을, AI의 시선으로 재창조하다' 철학 구현 테스트
 */

require('dotenv').config();
const DataDreamscapeGenerator = require('./src/data-dreamscape-generator');

class DreamscapeFeatureTester {
  constructor() {
    this.dreamscapeGenerator = new DataDreamscapeGenerator();
  }

  async runAllTests() {
    console.log('🌌 MKM Lab AI 데이터 드림스케이프 기능 테스트 시작\n');
    
    try {
      // 1. 사용 가능한 스타일 목록 테스트
      await this.testAvailableStyles();
      
      // 2. 데이터 드림스케이프 이미지 생성 테스트
      await this.testDreamscapeImageGeneration();
      
      // 3. 페르소나 로고 생성 테스트
      await this.testPersonaLogoGeneration();
      
      // 4. 메타데이터 생성 테스트
      await this.testMetadataGeneration();
      
      console.log('\n✅ 모든 테스트가 완료되었습니다!');
      
    } catch (error) {
      console.error('❌ 테스트 중 오류 발생:', error.message);
    }
  }

  async testAvailableStyles() {
    console.log('📋 1. 사용 가능한 스타일 목록 테스트');
    
    const dreamscapeStyles = this.dreamscapeGenerator.getAvailableStyles();
    const logoStyles = this.dreamscapeGenerator.getAvailableLogoStyles();
    
    console.log('\n🌌 데이터 드림스케이프 스타일:');
    dreamscapeStyles.forEach(style => {
      console.log(`  • ${style.name}: ${style.description}`);
    });
    
    console.log('\n🎨 로고 스타일:');
    logoStyles.forEach(style => {
      console.log(`  • ${style.name}: ${style.description}`);
    });
    
    console.log('✅ 스타일 목록 테스트 완료\n');
  }

  async testDreamscapeImageGeneration() {
    console.log('🌌 2. 데이터 드림스케이프 이미지 생성 테스트');
    
    const testUserData = {
      environment: {
        weather: 'sunny',
        cultural: { region: 'Korea' },
        economic: { inflation: 2.5 }
      },
      facialAnalysis: {
        eyes: 'bright',
        mouth: 'firm',
        forehead: 'high',
        jaw: 'strong',
        overall: 'confident'
      },
      emotionalData: {
        thinking: 8,
        introverted: 3,
        dominant: 7,
        practical: 6,
        stable: 5
      }
    };

    // 각 페르소나별 드림스케이프 생성 테스트
    const personas = ['P1', 'P2', 'P3', 'P4'];
    
    for (const persona of personas) {
      console.log(`\n  테스트 중: ${persona} 페르소나`);
      
      try {
        const result = await this.dreamscapeGenerator.generateDreamscapeImage(
          persona, 
          testUserData, 
          'auto'
        );
        
        if (result.success) {
          console.log(`    ✅ 성공: ${result.style}`);
          console.log(`    📝 프롬프트: ${result.prompt.substring(0, 100)}...`);
          console.log(`    🖼️  이미지 URL: ${result.imageUrl}`);
          console.log(`    📊 메타데이터: ${JSON.stringify(result.metadata, null, 2)}`);
        } else {
          console.log(`    ❌ 실패: ${result.error}`);
          console.log(`    🔄 폴백 URL: ${result.fallbackUrl}`);
        }
        
      } catch (error) {
        console.log(`    ❌ 오류: ${error.message}`);
      }
      
      // API 호출 간격 조절
      await this.delay(2000);
    }
    
    console.log('✅ 드림스케이프 이미지 생성 테스트 완료\n');
  }

  async testPersonaLogoGeneration() {
    console.log('🎨 3. 페르소나 로고 생성 테스트');
    
    const testUserData = {
      environment: {
        weather: 'cloudy',
        cultural: { region: 'Japan' }
      },
      facialAnalysis: {
        eyes: 'deep',
        mouth: 'soft',
        forehead: 'broad',
        jaw: 'round',
        overall: 'thoughtful'
      },
      emotionalData: {
        thinking: 5,
        introverted: 7,
        dominant: 4,
        practical: 8,
        stable: 6
      }
    };

    const logoStyles = ['minimal', 'abstract', 'modern', 'vintage'];
    const testPersona = 'P2'; // 균형 조성가로 테스트
    
    for (const style of logoStyles) {
      console.log(`\n  테스트 중: ${style} 스타일 로고`);
      
      try {
        const result = await this.dreamscapeGenerator.generatePersonaLogo(
          testPersona, 
          testUserData, 
          style
        );
        
        if (result.success) {
          console.log(`    ✅ 성공: ${result.logoStyle}`);
          console.log(`    📝 프롬프트: ${result.prompt.substring(0, 100)}...`);
          console.log(`    🖼️  이미지 URL: ${result.imageUrl}`);
          console.log(`    📊 메타데이터: ${JSON.stringify(result.metadata, null, 2)}`);
        } else {
          console.log(`    ❌ 실패: ${result.error}`);
          console.log(`    🔄 폴백 URL: ${result.fallbackUrl}`);
        }
        
      } catch (error) {
        console.log(`    ❌ 오류: ${error.message}`);
      }
      
      // API 호출 간격 조절
      await this.delay(2000);
    }
    
    console.log('✅ 페르소나 로고 생성 테스트 완료\n');
  }

  async testMetadataGeneration() {
    console.log('📊 4. 메타데이터 생성 테스트');
    
    const testUserData = {
      environment: { weather: 'rainy' },
      facialAnalysis: { eyes: 'bright' },
      emotionalData: { thinking: 7 }
    };

    // 드림스케이프 메타데이터 테스트
    const dreamscapeMetadata = this.dreamscapeGenerator.generateDreamscapeMetadata(
      'P3', 
      'future_vision', 
      testUserData
    );
    
    console.log('\n🌌 드림스케이프 메타데이터:');
    console.log(JSON.stringify(dreamscapeMetadata, null, 2));
    
    // 로고 메타데이터 테스트
    const logoMetadata = this.dreamscapeGenerator.generateLogoMetadata(
      'P1', 
      'minimal', 
      testUserData
    );
    
    console.log('\n🎨 로고 메타데이터:');
    console.log(JSON.stringify(logoMetadata, null, 2));
    
    console.log('✅ 메타데이터 생성 테스트 완료\n');
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 철학 및 스타일 정보 출력
  printPhilosophyInfo() {
    console.log('🎭 MKM Lab AI 데이터 드림스케이프 철학');
    console.log('=====================================');
    console.log('');
    console.log('🌟 핵심 철학: "내면의 초상을, AI의 시선으로 재창조하다"');
    console.log('');
    console.log('1. 초월적 개인화 (Transcendental Personalization)');
    console.log('   - 사용자의 물리적 외형을 넘어, AI가 분석한 잠재된 기질, 영혼의 색깔, 무의식적인 에너지를 시각화');
    console.log('');
    console.log('2. AI 고유의 미학 (AI-Native Aesthetics)');
    console.log('   - 인간 예술가의 모방을 넘어, 데이터와 알고리즘의 언어에서만 나올 수 있는 고유한 시각적 스타일');
    console.log('');
    console.log('3. 정체성의 유동성 (Fluidity of Identity)');
    console.log('   - 페르소나가 고정된 것이 아니라, 환경과 경험에 따라 변화하고 진화하듯이 다양한 스펙트럼과 변주');
    console.log('');
    console.log('🌌 시그니처 스타일: 데이터 드림스케이프 (Data Dreamscape)');
    console.log('   - 생체 데이터 시각화, 공상 과학적 영혼, 환상적 환경 구성, 감성적 빛과 색');
    console.log('');
  }
}

// 테스트 실행
async function main() {
  const tester = new DreamscapeFeatureTester();
  
  // 철학 정보 출력
  tester.printPhilosophyInfo();
  
  // 테스트 실행
  await tester.runAllTests();
}

// 스크립트가 직접 실행될 때만 테스트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DreamscapeFeatureTester; 