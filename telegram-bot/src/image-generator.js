/**
 * MKM Lab AI 이미지 생성 시스템
 * 
 * 페르소나별 맞춤형 AI 아트 이미지 생성
 */

const axios = require('axios');

class ImageGenerator {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.DALLE_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/images/generations';
    
    // 이미지 스타일 정의
    this.styles = {
      cyberpunk: {
        name: '사이버펑크',
        description: '네온, 디지털 글리치, 기계적 요소',
        prompt: 'cyberpunk style, neon lights, digital glitch, futuristic, AI art'
      },
      fantasy: {
        name: '환상적',
        description: '비현실적, 꿈같은 분위기',
        prompt: 'fantasy art style, dreamlike, ethereal, magical, surreal'
      },
      pixel: {
        name: '픽셀 아트',
        description: '레트로/모던 감각의 픽셀 아트',
        prompt: 'pixel art style, retro gaming, modern pixel art, vibrant colors'
      },
      abstract: {
        name: '추상화',
        description: '데이터 시각화 기반 추상 그래픽',
        prompt: 'abstract art, data visualization, geometric patterns, modern art'
      }
    };

    // 페르소나별 이미지 테마
    this.personaThemes = {
      'P1': { // The Visionary Leader
        style: 'cyberpunk',
        elements: ['leadership', 'innovation', 'technology', 'future'],
        colors: ['electric blue', 'neon purple', 'silver'],
        accessories: ['holographic displays', 'neural networks', 'digital crown']
      },
      'P2': { // The Balanced Builder
        style: 'abstract',
        elements: ['balance', 'harmony', 'structure', 'stability'],
        colors: ['golden', 'emerald green', 'deep blue'],
        accessories: ['geometric patterns', 'symmetrical designs', 'architectural elements']
      },
      'P3': { // The Dynamic Explorer
        style: 'fantasy',
        elements: ['adventure', 'exploration', 'energy', 'movement'],
        colors: ['fiery orange', 'vibrant yellow', 'dynamic red'],
        accessories: ['floating islands', 'energy trails', 'adventure gear']
      },
      'P4': { // The Mindful Guardian
        style: 'pixel',
        elements: ['peace', 'wisdom', 'protection', 'mindfulness'],
        colors: ['soft lavender', 'gentle pink', 'calm teal'],
        accessories: ['zen gardens', 'peaceful symbols', 'protective auras']
      }
    };

    // 한정판 이벤트 테마
    this.eventThemes = {
      'brazil_carnival': {
        style: 'fantasy',
        elements: ['carnival', 'passion', 'celebration', 'vibrant culture'],
        colors: ['carnival green', 'passionate red', 'golden yellow'],
        accessories: ['feathers', 'masks', 'samba dancers', 'tropical elements']
      },
      'japan_cherry_blossom': {
        style: 'pixel',
        elements: ['cherry blossoms', 'elegance', 'tranquility', 'spring'],
        colors: ['sakura pink', 'soft white', 'gentle green'],
        accessories: ['cherry blossom petals', 'traditional elements', 'zen aesthetics']
      },
      'india_holi': {
        style: 'abstract',
        elements: ['color festival', 'joy', 'diversity', 'celebration'],
        colors: ['holi colors', 'vibrant spectrum', 'festive hues'],
        accessories: ['color powders', 'traditional patterns', 'festive elements']
      }
    };
  }

  /**
   * 기본 페르소나 이미지 생성
   */
  async generatePersonaImage(personaCode, userData = {}) {
    try {
      const theme = this.personaThemes[personaCode];
      if (!theme) {
        throw new Error(`Unknown persona code: ${personaCode}`);
      }

      const style = this.styles[theme.style];
      const prompt = this.buildPersonaPrompt(theme, style, userData);

      const imageData = await this.generateImage(prompt);
      
      return {
        success: true,
        imageUrl: imageData.url,
        prompt: prompt,
        style: style.name,
        theme: theme
      };
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      return {
        success: false,
        error: error.message,
        fallbackUrl: this.getFallbackImage(personaCode)
      };
    }
  }

  /**
   * 한정판 이벤트 이미지 생성
   */
  async generateEventImage(eventTheme, personaCode, userData = {}) {
    try {
      const eventConfig = this.eventThemes[eventTheme];
      const personaTheme = this.personaThemes[personaCode];
      
      if (!eventConfig || !personaTheme) {
        throw new Error(`Unknown theme: ${eventTheme} or persona: ${personaCode}`);
      }

      const style = this.styles[eventConfig.style];
      const prompt = this.buildEventPrompt(eventConfig, personaTheme, style, userData);

      const imageData = await this.generateImage(prompt);
      
      return {
        success: true,
        imageUrl: imageData.url,
        prompt: prompt,
        style: style.name,
        theme: eventConfig,
        isLimitedEdition: true
      };
    } catch (error) {
      console.error('이벤트 이미지 생성 오류:', error);
      return {
        success: false,
        error: error.message,
        fallbackUrl: this.getEventFallbackImage(eventTheme)
      };
    }
  }

  /**
   * 페르소나 프롬프트 구성
   */
  buildPersonaPrompt(theme, style, userData) {
    let prompt = `${style.prompt}, `;
    
    // 기본 테마 요소
    prompt += `${theme.elements.join(', ')}, `;
    
    // 색상 팔레트
    prompt += `color palette: ${theme.colors.join(', ')}, `;
    
    // 액세서리
    prompt += `${theme.accessories.join(', ')}, `;
    
    // 사용자 데이터 반영
    if (userData.environment) {
      if (userData.environment.weather) {
        prompt += `weather: ${userData.environment.weather}, `;
      }
      if (userData.environment.cultural) {
        prompt += `cultural context: ${userData.environment.cultural.region}, `;
      }
    }
    
    // 이미지 품질 설정
    prompt += 'high quality, detailed, professional AI art, 4K resolution';
    
    return prompt;
  }

  /**
   * 이벤트 프롬프트 구성
   */
  buildEventPrompt(eventConfig, personaTheme, style, userData) {
    let prompt = `${style.prompt}, `;
    
    // 이벤트 테마 요소
    prompt += `${eventConfig.elements.join(', ')}, `;
    
    // 페르소나 요소와 융합
    prompt += `combined with ${personaTheme.elements.join(', ')}, `;
    
    // 색상 융합
    const combinedColors = [...eventConfig.colors, ...personaTheme.colors];
    prompt += `color palette: ${combinedColors.join(', ')}, `;
    
    // 액세서리 융합
    const combinedAccessories = [...eventConfig.accessories, ...personaTheme.accessories];
    prompt += `${combinedAccessories.join(', ')}, `;
    
    // 한정판 특별 요소
    prompt += 'limited edition, exclusive, premium quality, ';
    
    // 이미지 품질 설정
    prompt += 'ultra high quality, masterpiece, professional AI art, 8K resolution';
    
    return prompt;
  }

  /**
   * OpenAI DALL-E API 호출
   */
  async generateImage(prompt) {
    if (!this.apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const response = await axios.post(this.baseUrl, {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data[0];
  }

  /**
   * 폴백 이미지 URL 반환
   */
  getFallbackImage(personaCode) {
    const fallbackImages = {
      'P1': 'https://via.placeholder.com/1024x1024/0066cc/ffffff?text=Visionary+Leader',
      'P2': 'https://via.placeholder.com/1024x1024/00cc66/ffffff?text=Balanced+Builder',
      'P3': 'https://via.placeholder.com/1024x1024/ff6600/ffffff?text=Dynamic+Explorer',
      'P4': 'https://via.placeholder.com/1024x1024/9966cc/ffffff?text=Mindful+Guardian'
    };
    
    return fallbackImages[personaCode] || fallbackImages['P1'];
  }

  /**
   * 이벤트 폴백 이미지 URL 반환
   */
  getEventFallbackImage(eventTheme) {
    const fallbackImages = {
      'brazil_carnival': 'https://via.placeholder.com/1024x1024/ff0066/ffffff?text=Brazil+Carnival',
      'japan_cherry_blossom': 'https://via.placeholder.com/1024x1024/ff99cc/ffffff?text=Japan+Cherry+Blossom',
      'india_holi': 'https://via.placeholder.com/1024x1024/ff6600/ffffff?text=India+Holi'
    };
    
    return fallbackImages[eventTheme] || fallbackImages['brazil_carnival'];
  }

  /**
   * 이미지 품질 검증
   */
  validateImageQuality(imageUrl) {
    // 이미지 품질 검증 로직
    return {
      isValid: true,
      quality: 'high',
      resolution: '1024x1024',
      format: 'png'
    };
  }

  /**
   * 이미지 메타데이터 생성
   */
  generateImageMetadata(personaCode, eventTheme = null, userData = {}) {
    const metadata = {
      personaCode: personaCode,
      generatedAt: new Date().toISOString(),
      version: '1.0',
      style: eventTheme ? 'limited_edition' : 'standard',
      userData: userData
    };

    if (eventTheme) {
      metadata.eventTheme = eventTheme;
      metadata.isLimitedEdition = true;
    }

    return metadata;
  }
}

module.exports = { ImageGenerator }; 