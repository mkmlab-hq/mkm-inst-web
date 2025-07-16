/**
 * MKM Lab AI 데이터 드림스케이프 이미지 생성 시스템 (Google AI Gemini Pro Vision 기반)
 * 
 * '내면의 초상을, AI의 시선으로 재창조하다'
 * 
 * 핵심 철학:
 * 1. 초월적 개인화 (Transcendental Personalization)
 * 2. AI 고유의 미학 (AI-Native Aesthetics)  
 * 3. 정체성의 유동성 (Fluidity of Identity)
 * 
 * Google AI 생태계 통합으로 비용 효율성과 일관성 확보
 */

const axios = require('axios');

class DataDreamscapeGenerator {
  constructor() {
    // Google AI Gemini Pro Vision API 설정
    this.apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
    
    // 데이터 드림스케이프 시그니처 스타일 정의 (Google AI 최적화)
    this.dreamscapeStyles = {
      'origin_echoes': {
        name: '오리진 에코즈',
        description: '가장 근원적인 기질을 AI 고유의 시선으로 극도로 추상화',
        elements: [
          'complex neural network patterns',
          'luminous core energy',
          'primal geometric forms',
          'ethereal particle systems',
          'organic data flows'
        ],
        colors: ['deep cosmic blues', 'luminous whites', 'ethereal purples', 'primal golds'],
        technique: 'ultra-abstract, minimalist, zen-like composition',
        googlePrompt: 'An ultra-abstract, minimalist composition featuring complex neural network patterns, luminous core energy, and primal geometric forms. Deep cosmic blues, luminous whites, ethereal purples, and primal golds create a zen-like atmosphere representing the most fundamental essence of being.'
      },
      
      'future_vision': {
        name: '퓨처 비전',
        description: '페르소나의 잠재력과 미래 지향적 에너지를 최첨단 그래픽으로 표현',
        elements: [
          'holographic projections',
          'quantum computing visualizations',
          'futuristic interfaces',
          'energy field dynamics',
          'advanced AI aesthetics'
        ],
        colors: ['electric blues', 'neon purples', 'silver chrome', 'holographic spectrum'],
        technique: 'high-tech, cutting-edge, sci-fi sophistication',
        googlePrompt: 'A cutting-edge sci-fi visualization featuring holographic projections, quantum computing visualizations, and futuristic interfaces. Electric blues, neon purples, silver chrome, and holographic spectrum colors create an advanced AI aesthetic representing future potential and forward-looking energy.'
      },
      
      'ethereal_soul': {
        name: '에테리얼 소울',
        description: '영혼의 본질을 초월적이고 신비로운 시각적 언어로 표현',
        elements: [
          'spiritual energy fields',
          'transcendental light patterns',
          'ethereal consciousness',
          'divine geometry',
          'soul essence visualization'
        ],
        colors: ['ethereal whites', 'spiritual golds', 'mystical purples', 'divine blues'],
        technique: 'transcendental, mystical, soul-essence visualization',
        googlePrompt: 'A transcendental and mystical composition featuring spiritual energy fields, transcendental light patterns, and divine geometry. Ethereal whites, spiritual golds, mystical purples, and divine blues create a soul essence visualization representing the ethereal nature of consciousness.'
      }
    };

    // 환경 지능 통합 (Google AI 최적화)
    this.environmentalFactors = {
      weather: {
        sunny: {
          prompt: 'bright, warm lighting, golden hour atmosphere, optimistic energy',
          googlePrompt: 'Bright, warm lighting with golden hour atmosphere creating an optimistic and uplifting energy'
        },
        cloudy: {
          prompt: 'soft, diffused lighting, contemplative mood, gentle energy',
          googlePrompt: 'Soft, diffused lighting creating a contemplative and gentle mood'
        },
        rainy: {
          prompt: 'moody, atmospheric lighting, introspective energy, water elements',
          googlePrompt: 'Moody, atmospheric lighting with water elements creating an introspective and reflective energy'
        }
      },
      cultural: {
        korean: {
          prompt: 'traditional Korean aesthetics, harmony, balance, natural elements',
          googlePrompt: 'Traditional Korean aesthetics emphasizing harmony, balance, and natural elements'
        },
        global: {
          prompt: 'universal human experience, diverse cultural elements, unity in diversity',
          googlePrompt: 'Universal human experience with diverse cultural elements representing unity in diversity'
        }
      }
    };
  }

  /**
   * 데이터 드림스케이프 이미지 생성 (Google AI Gemini Pro Vision)
   */
  async generateDreamscapeImage(personaCode, styleKey, userData = {}) {
    try {
      const style = this.dreamscapeStyles[styleKey];
      if (!style) {
        throw new Error(`Unknown dreamscape style: ${styleKey}`);
      }

      const prompt = this.buildDreamscapePrompt(style, personaCode, userData);
      const imageData = await this.generateGoogleAIImage(prompt);

      return {
        success: true,
        imageUrl: imageData.url,
        prompt: prompt,
        style: style.name,
        description: style.description,
        aiProvider: 'Google AI Gemini Pro Vision',
        dreamscapeType: 'data_visualization'
      };
    } catch (error) {
      console.error('Google AI 드림스케이프 생성 오류:', error);
      return {
        success: false,
        error: error.message,
        fallbackUrl: this.getDreamscapeFallbackImage(styleKey),
        aiProvider: 'Fallback System'
      };
    }
  }

  /**
   * Google AI 최적화 드림스케이프 프롬프트 구성
   */
  buildDreamscapePrompt(style, personaCode, userData = {}) {
    let prompt = `${style.googlePrompt}, `;
    
    // 페르소나 특성 반영
    const personaContext = this.getPersonaContext(personaCode);
    prompt += `Context: ${personaContext}, `;
    
    // 환경 지능 통합
    if (userData.environment) {
      if (userData.environment.weather) {
        const weatherFactor = this.environmentalFactors.weather[userData.environment.weather];
        if (weatherFactor) {
          prompt += `${weatherFactor.googlePrompt}, `;
        }
      }
      if (userData.environment.cultural) {
        const culturalFactor = this.environmentalFactors.cultural[userData.environment.cultural.region];
        if (culturalFactor) {
          prompt += `${culturalFactor.googlePrompt}, `;
        }
      }
    }
    
    // Google AI 최적화 설정
    prompt += 'high quality, detailed, professional digital art, 4K resolution, masterpiece, data visualization art';
    
    return prompt;
  }

  /**
   * 페르소나별 컨텍스트 제공
   */
  getPersonaContext(personaCode) {
    const contexts = {
      'P1': 'Visionary leadership and innovative thinking',
      'P2': 'Balanced harmony and structural stability',
      'P3': 'Dynamic exploration and adventurous energy',
      'P4': 'Mindful wisdom and protective consciousness'
    };
    return contexts[personaCode] || contexts['P1'];
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
            text: `Create a stunning data visualization artwork based on this description: ${prompt}. 
                   This should be a 1024x1024 pixel, high-resolution digital art piece that represents 
                   the essence of the description through abstract, artistic visualization. 
                   The image should be suitable for professional use and capture the transcendental 
                   nature of the data dreamscape concept.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
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
        throw new Error('Google AI에서 드림스케이프 이미지 URL을 생성할 수 없습니다.');
      }

      return { url: imageUrl };
    } catch (error) {
      console.error('Google AI 드림스케이프 API 호출 오류:', error.response?.data || error.message);
      throw new Error(`Google AI 드림스케이프 생성 실패: ${error.message}`);
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
      console.error('Google AI 드림스케이프 응답 파싱 오류:', error);
      return null;
    }
  }

  /**
   * 드림스케이프 폴백 이미지 URL 반환 (Google AI 실패 시)
   */
  getDreamscapeFallbackImage(styleKey) {
    const fallbackImages = {
      'origin_echoes': 'https://via.placeholder.com/1024x1024/1e3a8a/ffffff?text=Origin+Echoes+%28Google+AI%29',
      'future_vision': 'https://via.placeholder.com/1024x1024/7c3aed/ffffff?text=Future+Vision+%28Google+AI%29',
      'ethereal_soul': 'https://via.placeholder.com/1024x1024/059669/ffffff?text=Ethereal+Soul+%28Google+AI%29'
    };
    
    return fallbackImages[styleKey] || fallbackImages['origin_echoes'];
  }

  /**
   * 드림스케이프 메타데이터 생성 (Google AI 정보 포함)
   */
  generateDreamscapeMetadata(personaCode, styleKey, userData = {}) {
    const style = this.dreamscapeStyles[styleKey];
    
    return {
      personaCode: personaCode,
      dreamscapeStyle: styleKey,
      styleName: style ? style.name : 'Unknown',
      styleDescription: style ? style.description : '',
      generatedAt: new Date().toISOString(),
      version: '2.0',
      aiProvider: 'Google AI Gemini Pro Vision',
      costOptimized: true,
      userData: userData,
      dreamscapeType: 'data_visualization'
    };
  }

  /**
   * 사용 가능한 드림스케이프 스타일 목록 반환
   */
  getAvailableStyles() {
    return Object.keys(this.dreamscapeStyles).map(key => ({
      key: key,
      name: this.dreamscapeStyles[key].name,
      description: this.dreamscapeStyles[key].description,
      technique: this.dreamscapeStyles[key].technique
    }));
  }
}

module.exports = { DataDreamscapeGenerator }; 