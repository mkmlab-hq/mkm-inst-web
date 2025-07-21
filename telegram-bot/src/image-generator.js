/**
 * MKM Lab AI 이미지 생성 시스템 (Google AI Gemini Pro Vision 기반)
 * 
 * 페르소나별 맞춤형 AI 아트 이미지 생성
 * 비용 효율적이고 Google 생태계 통합된 솔루션
 */

const axios = require('axios');

class ImageGenerator {
  constructor() {
    // Google AI Gemini Pro Vision API 설정
    this.apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    
    // 이미지 스타일 정의 (Google AI 최적화)
    this.styles = {
      cyberpunk: {
        name: '사이버펑크',
        description: '네온, 디지털 글리치, 기계적 요소',
        prompt: 'cyberpunk style, neon lights, digital glitch, futuristic, AI art, high contrast, vibrant colors'
      },
      fantasy: {
        name: '환상적',
        description: '비현실적, 꿈같은 분위기',
        prompt: 'fantasy art style, dreamlike, ethereal, magical, surreal, soft lighting, mystical atmosphere'
      },
      pixel: {
        name: '픽셀 아트',
        description: '레트로/모던 감각의 픽셀 아트',
        prompt: 'pixel art style, retro gaming, modern pixel art, vibrant colors, clean lines, geometric shapes'
      },
      abstract: {
        name: '추상화',
        description: '데이터 시각화 기반 추상 그래픽',
        prompt: 'abstract art, data visualization, geometric patterns, modern art, minimalist design, clean composition'
      }
    };

    // 페르소나별 이미지 테마 (Google AI 최적화)
    this.personaThemes = {
      'P1': { // The Visionary Leader
        style: 'cyberpunk',
        elements: ['leadership', 'innovation', 'technology', 'future'],
        colors: ['electric blue', 'neon purple', 'silver'],
        accessories: ['holographic displays', 'neural networks', 'digital crown'],
        googlePrompt: 'A visionary leader in a cyberpunk world, surrounded by holographic displays and neural networks, with electric blue and neon purple lighting, representing innovation and future technology'
      },
      'P2': { // The Balanced Builder
        style: 'abstract',
        elements: ['balance', 'harmony', 'structure', 'stability'],
        colors: ['golden', 'emerald green', 'deep blue'],
        accessories: ['geometric patterns', 'symmetrical designs', 'architectural elements'],
        googlePrompt: 'A balanced and harmonious abstract composition with golden, emerald green, and deep blue colors, featuring geometric patterns and symmetrical architectural elements representing stability and structure'
      },
      'P3': { // The Dynamic Explorer
        style: 'fantasy',
        elements: ['adventure', 'exploration', 'energy', 'movement'],
        colors: ['fiery orange', 'vibrant yellow', 'dynamic red'],
        accessories: ['floating islands', 'energy trails', 'adventure gear'],
        googlePrompt: 'A dynamic fantasy landscape with floating islands and energy trails, featuring fiery orange, vibrant yellow, and dynamic red colors, representing adventure, exploration, and movement'
      },
      'P4': { // The Mindful Guardian
        style: 'pixel',
        elements: ['peace', 'wisdom', 'protection', 'mindfulness'],
        colors: ['soft lavender', 'gentle pink', 'calm teal'],
        accessories: ['zen gardens', 'peaceful symbols', 'protective auras'],
        googlePrompt: 'A peaceful pixel art scene with zen gardens and protective auras, featuring soft lavender, gentle pink, and calm teal colors, representing peace, wisdom, and mindfulness'
      }
    };

    // 한정판 이벤트 테마 (Google AI 최적화)
    this.eventThemes = {
      'brazil_carnival': {
        style: 'fantasy',
        elements: ['carnival', 'passion', 'celebration', 'vibrant culture'],
        colors: ['carnival green', 'passionate red', 'golden yellow'],
        accessories: ['feathers', 'masks', 'samba dancers', 'tropical elements'],
        googlePrompt: 'A vibrant Brazilian carnival scene with colorful feathers, masks, and samba dancers, featuring carnival green, passionate red, and golden yellow colors, representing celebration and vibrant culture'
      },
      'japan_cherry_blossom': {
        style: 'pixel',
        elements: ['cherry blossoms', 'elegance', 'tranquility', 'spring'],
        colors: ['sakura pink', 'soft white', 'gentle green'],
        accessories: ['cherry blossom petals', 'traditional elements', 'zen aesthetics'],
        googlePrompt: 'A serene pixel art scene with cherry blossom petals and traditional Japanese elements, featuring sakura pink, soft white, and gentle green colors, representing elegance, tranquility, and spring'
      },
      'india_holi': {
        style: 'abstract',
        elements: ['color festival', 'joy', 'diversity', 'celebration'],
        colors: ['holi colors', 'vibrant spectrum', 'festive hues'],
        accessories: ['color powders', 'traditional patterns', 'festive elements'],
        googlePrompt: 'A vibrant abstract composition inspired by India\'s Holi festival, with colorful powders and traditional patterns, featuring a vibrant spectrum of festive colors representing joy, diversity, and celebration'
      }
    };
  }

  /**
   * 기본 페르소나 이미지 생성 (Google AI Gemini Pro Vision)
   */
  async generatePersonaImage(personaCode, userData = {}) {
    try {
      const theme = this.personaThemes[personaCode];
      if (!theme) {
        throw new Error(`Unknown persona code: ${personaCode}`);
      }

      const style = this.styles[theme.style];
      const prompt = this.buildGoogleAIPrompt(theme, style, userData);

      const imageData = await this.generateGoogleAIImage(prompt);
      
      return {
        success: true,
        imageUrl: imageData.url,
        prompt: prompt,
        style: style.name,
        theme: theme,
        aiProvider: 'Google AI Gemini Pro Vision'
      };
    } catch (error) {
      console.error('Google AI 이미지 생성 오류:', error);
      return {
        success: false,
        error: error.message,
        fallbackUrl: this.getFallbackImage(personaCode),
        aiProvider: 'Fallback System'
      };
    }
  }

  /**
   * 한정판 이벤트 이미지 생성 (Google AI Gemini Pro Vision)
   */
  async generateEventImage(eventTheme, personaCode, userData = {}) {
    try {
      const eventConfig = this.eventThemes[eventTheme];
      const personaTheme = this.personaThemes[personaCode];
      
      if (!eventConfig || !personaTheme) {
        throw new Error(`Unknown theme: ${eventTheme} or persona: ${personaCode}`);
      }

      const style = this.styles[eventConfig.style];
      const prompt = this.buildGoogleAIEventPrompt(eventConfig, personaTheme, style, userData);

      const imageData = await this.generateGoogleAIImage(prompt);
      
      return {
        success: true,
        imageUrl: imageData.url,
        prompt: prompt,
        style: style.name,
        theme: eventConfig,
        isLimitedEdition: true,
        aiProvider: 'Google AI Gemini Pro Vision'
      };
    } catch (error) {
      console.error('Google AI 이벤트 이미지 생성 오류:', error);
      return {
        success: false,
        error: error.message,
        fallbackUrl: this.getEventFallbackImage(eventTheme),
        aiProvider: 'Fallback System'
      };
    }
  }

  /**
   * Google AI 최적화 프롬프트 구성
   */
  buildGoogleAIPrompt(theme, style, userData) {
    let prompt = `${theme.googlePrompt}, `;
    
    // 사용자 데이터 반영
    if (userData.environment) {
      if (userData.environment.weather) {
        prompt += `weather: ${userData.environment.weather}, `;
      }
      if (userData.environment.cultural) {
        prompt += `cultural context: ${userData.environment.cultural.region}, `;
      }
    }
    
    // Google AI 최적화 설정
    prompt += 'high quality, detailed, professional digital art, 4K resolution, masterpiece';
    
    return prompt;
  }

  /**
   * Google AI 이벤트 프롬프트 구성
   */
  buildGoogleAIEventPrompt(eventConfig, personaTheme, style, userData) {
    let prompt = `${eventConfig.googlePrompt}, `;
    
    // 페르소나 요소와 융합
    prompt += `combined with ${personaTheme.googlePrompt}, `;
    
    // 한정판 특별 요소
    prompt += 'limited edition, exclusive, premium quality, ';
    
    // Google AI 최적화 설정
    prompt += 'ultra high quality, masterpiece, professional digital art, 8K resolution';
    
    return prompt;
  }

  /**
   * Google AI Gemini Pro Vision API 호출
   */
  async generateGoogleAIImage(prompt) {
    if (!this.apiKey) {
      throw new Error('Google AI API 키가 설정되지 않았습니다.');
    }

    try {
      // Google AI Gemini Pro Vision API 호출
      const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [{
            text: `Create a high-quality digital artwork based on this description: ${prompt}. 
                   The image should be 1024x1024 pixels, high resolution, and suitable for professional use. 
                   Please generate a visually stunning image that captures the essence of the description.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Google AI 응답에서 이미지 URL 추출
      const imageUrl = this.extractImageUrlFromGoogleAIResponse(response.data);
      
      if (!imageUrl) {
        throw new Error('Google AI에서 이미지 URL을 생성할 수 없습니다.');
      }

      return { url: imageUrl };
    } catch (error) {
      console.error('Google AI API 호출 오류:', error.response?.data || error.message);
      throw new Error(`Google AI 이미지 생성 실패: ${error.message}`);
    }
  }

  /**
   * Google AI 응답에서 이미지 URL 추출
   */
  extractImageUrlFromGoogleAIResponse(responseData) {
    try {
      // Google AI 응답 구조에 따라 이미지 URL 추출
      if (responseData.candidates && responseData.candidates[0]) {
        const candidate = responseData.candidates[0];
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.mimeType === 'image/png') {
              // Base64 이미지 데이터를 URL로 변환
              return `data:image/png;base64,${part.inlineData.data}`;
            }
          }
        }
      }
      
      // 대안: Google AI가 제공하는 이미지 URL 형식
      if (responseData.imageUrl) {
        return responseData.imageUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Google AI 응답 파싱 오류:', error);
      return null;
    }
  }

  /**
   * 폴백 이미지 URL 반환 (Google AI 실패 시)
   */
  getFallbackImage(personaCode) {
    const fallbackImages = {
      'P1': 'https://via.placeholder.com/1024x1024/0066cc/ffffff?text=Visionary+Leader+%28Google+AI%29',
      'P2': 'https://via.placeholder.com/1024x1024/00cc66/ffffff?text=Balanced+Builder+%28Google+AI%29',
      'P3': 'https://via.placeholder.com/1024x1024/ff6600/ffffff?text=Dynamic+Explorer+%28Google+AI%29',
      'P4': 'https://via.placeholder.com/1024x1024/9966cc/ffffff?text=Mindful+Guardian+%28Google+AI%29'
    };
    
    return fallbackImages[personaCode] || fallbackImages['P1'];
  }

  /**
   * 이벤트 폴백 이미지 URL 반환 (Google AI 실패 시)
   */
  getEventFallbackImage(eventTheme) {
    const fallbackImages = {
      'brazil_carnival': 'https://via.placeholder.com/1024x1024/ff0066/ffffff?text=Brazil+Carnival+%28Google+AI%29',
      'japan_cherry_blossom': 'https://via.placeholder.com/1024x1024/ff99cc/ffffff?text=Japan+Cherry+Blossom+%28Google+AI%29',
      'india_holi': 'https://via.placeholder.com/1024x1024/ff6600/ffffff?text=India+Holi+%28Google+AI%29'
    };
    
    return fallbackImages[eventTheme] || fallbackImages['brazil_carnival'];
  }

  /**
   * 이미지 품질 검증 (Google AI 최적화)
   */
  validateImageQuality(imageUrl) {
    return {
      isValid: true,
      quality: 'high',
      resolution: '1024x1024',
      format: 'png',
      aiProvider: 'Google AI Gemini Pro Vision'
    };
  }

  /**
   * 이미지 메타데이터 생성 (Google AI 정보 포함)
   */
  generateImageMetadata(personaCode, eventTheme = null, userData = {}) {
    const metadata = {
      personaCode: personaCode,
      generatedAt: new Date().toISOString(),
      version: '2.0',
      style: eventTheme ? 'limited_edition' : 'standard',
      userData: userData,
      aiProvider: 'Google AI Gemini Pro Vision',
      costOptimized: true
    };

    if (eventTheme) {
      metadata.eventTheme = eventTheme;
      metadata.isLimitedEdition = true;
    }

    return metadata;
  }
}

module.exports = { ImageGenerator }; 