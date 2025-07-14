/**
 * MKM Lab AI 데이터 드림스케이프 이미지 생성 시스템
 * 
 * '내면의 초상을, AI의 시선으로 재창조하다'
 * 
 * 핵심 철학:
 * 1. 초월적 개인화 (Transcendental Personalization)
 * 2. AI 고유의 미학 (AI-Native Aesthetics)  
 * 3. 정체성의 유동성 (Fluidity of Identity)
 */

const axios = require('axios');

class DataDreamscapeGenerator {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.DALLE_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/images/generations';
    
    // 데이터 드림스케이프 시그니처 스타일 정의
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
        technique: 'ultra-abstract, minimalist, zen-like composition'
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
        technique: 'high-tech, cutting-edge, sci-fi sophistication'
      },
      
      'ethereal_soul': {
        name: '에테리얼 소울',
        description: '감성적, 영적인 측면을 부드러운 유기적 형태와 환상적 색감으로 구현',
        elements: [
          'soft organic forms',
          'spiritual light patterns',
          'gentle energy flows',
          'dreamlike landscapes',
          'soulful expressions'
        ],
        colors: ['pastel pinks', 'soft lavenders', 'gentle teals', 'warm creams'],
        technique: 'ethereal, dreamy, emotionally resonant'
      }
    };

    // 페르소나별 데이터 드림스케이프 매핑
    this.personaDreamscapes = {
      'P1': { // The Visionary Leader
        primary: 'future_vision',
        secondary: 'origin_echoes',
        signatureElements: [
          'leadership energy fields',
          'visionary neural pathways',
          'innovative thought patterns',
          'strategic data flows'
        ],
        emotionalPalette: ['determined', 'inspiring', 'forward-thinking', 'transformative']
      },
      
      'P2': { // The Balanced Builder
        primary: 'ethereal_soul',
        secondary: 'origin_echoes',
        signatureElements: [
          'harmonious geometric balance',
          'stable energy foundations',
          'peaceful data symmetries',
          'grounded spiritual patterns'
        ],
        emotionalPalette: ['centered', 'peaceful', 'harmonious', 'grounded']
      },
      
      'P3': { // The Dynamic Explorer
        primary: 'future_vision',
        secondary: 'ethereal_soul',
        signatureElements: [
          'dynamic energy trails',
          'exploratory data paths',
          'adventurous spirit flows',
          'boundary-breaking patterns'
        ],
        emotionalPalette: ['energetic', 'curious', 'adventurous', 'free-spirited']
      },
      
      'P4': { // The Mindful Guardian
        primary: 'ethereal_soul',
        secondary: 'origin_echoes',
        signatureElements: [
          'protective energy shields',
          'mindful awareness fields',
          'nurturing care patterns',
          'wisdom light flows'
        ],
        emotionalPalette: ['protective', 'wise', 'nurturing', 'mindful']
      }
    };

    // 생체 데이터 시각화 패턴
    this.bioDataPatterns = {
      facialFeatures: [
        'micro-expression data flows',
        'facial symmetry patterns',
        'skin texture algorithms',
        'facial landmark networks'
      ],
      emotionalData: [
        'emotion recognition patterns',
        'mood fluctuation curves',
        'personality trait visualizations',
        'behavioral data streams'
      ],
      environmentalData: [
        'weather influence patterns',
        'cultural context flows',
        'geographic data mappings',
        'temporal rhythm cycles'
      ]
    };
  }

  /**
   * 데이터 드림스케이프 페르소나 이미지 생성
   */
  async generateDreamscapeImage(personaCode, userData = {}, style = 'auto') {
    try {
      const personaConfig = this.personaDreamscapes[personaCode];
      if (!personaConfig) {
        throw new Error(`Unknown persona code: ${personaCode}`);
      }

      // 스타일 자동 선택 또는 사용자 지정
      const selectedStyle = style === 'auto' ? personaConfig.primary : style;
      const dreamscapeStyle = this.dreamscapeStyles[selectedStyle];
      
      if (!dreamscapeStyle) {
        throw new Error(`Unknown dreamscape style: ${selectedStyle}`);
      }

      const prompt = this.buildDreamscapePrompt(personaConfig, dreamscapeStyle, userData);
      const imageData = await this.generateImage(prompt);
      
      return {
        success: true,
        imageUrl: imageData.url,
        prompt: prompt,
        style: dreamscapeStyle.name,
        description: dreamscapeStyle.description,
        personaCode: personaCode,
        isDreamscape: true,
        metadata: this.generateDreamscapeMetadata(personaCode, selectedStyle, userData)
      };
    } catch (error) {
      console.error('드림스케이프 이미지 생성 오류:', error);
      return {
        success: false,
        error: error.message,
        fallbackUrl: this.getDreamscapeFallbackImage(personaCode)
      };
    }
  }

  /**
   * 데이터 드림스케이프 프롬프트 구성
   */
  buildDreamscapePrompt(personaConfig, dreamscapeStyle, userData) {
    let prompt = `Create a unique "Data Dreamscape" artwork that represents an individual's inner essence through AI interpretation. `;
    
    // 기본 드림스케이프 스타일
    prompt += `Style: ${dreamscapeStyle.technique}, `;
    
    // 페르소나 시그니처 요소
    prompt += `Core elements: ${personaConfig.signatureElements.join(', ')}, `;
    
    // 드림스케이프 스타일 요소
    prompt += `Visual elements: ${dreamscapeStyle.elements.join(', ')}, `;
    
    // 색상 팔레트
    prompt += `Color palette: ${dreamscapeStyle.colors.join(', ')}, `;
    
    // 감정적 톤
    prompt += `Emotional tone: ${personaConfig.emotionalPalette.join(', ')}, `;
    
    // 생체 데이터 시각화
    if (userData.facialAnalysis) {
      prompt += `Bio-data visualization: ${this.bioDataPatterns.facialFeatures.join(', ')}, `;
    }
    
    if (userData.emotionalData) {
      prompt += `Emotional patterns: ${this.bioDataPatterns.emotionalData.join(', ')}, `;
    }
    
    // 환경 데이터 통합
    if (userData.environment) {
      prompt += `Environmental integration: ${this.bioDataPatterns.environmentalData.join(', ')}, `;
    }
    
    // AI 고유 미학 강조
    prompt += `AI-native aesthetics, data-driven art, transcendental personalization, `;
    prompt += `fluid identity representation, ethereal beauty, `;
    prompt += `high quality, detailed, professional AI art, 4K resolution, `;
    prompt += `unique artistic vision, groundbreaking visual style`;
    
    return prompt;
  }

  /**
   * 로고 생성 시스템
   */
  async generatePersonaLogo(personaCode, userData = {}, logoStyle = 'minimal') {
    try {
      const personaConfig = this.personaDreamscapes[personaCode];
      if (!personaConfig) {
        throw new Error(`Unknown persona code: ${personaCode}`);
      }

      const prompt = this.buildLogoPrompt(personaConfig, logoStyle, userData);
      const imageData = await this.generateImage(prompt);
      
      return {
        success: true,
        imageUrl: imageData.url,
        prompt: prompt,
        logoStyle: logoStyle,
        personaCode: personaCode,
        isLogo: true,
        metadata: this.generateLogoMetadata(personaCode, logoStyle, userData)
      };
    } catch (error) {
      console.error('로고 생성 오류:', error);
      return {
        success: false,
        error: error.message,
        fallbackUrl: this.getLogoFallbackImage(personaCode)
      };
    }
  }

  /**
   * 로고 프롬프트 구성
   */
  buildLogoPrompt(personaConfig, logoStyle, userData) {
    let prompt = `Create a minimalist, symbolic logo that represents an individual's unique persona essence. `;
    
    // 로고 스타일
    switch (logoStyle) {
      case 'minimal':
        prompt += `Minimalist design, clean lines, simple geometric forms, `;
        break;
      case 'abstract':
        prompt += `Abstract symbolic representation, flowing organic shapes, `;
        break;
      case 'modern':
        prompt += `Modern typography, contemporary design principles, `;
        break;
      case 'vintage':
        prompt += `Vintage aesthetic, classic typography, timeless appeal, `;
        break;
    }
    
    // 페르소나 심볼 압축
    prompt += `Symbolic elements: ${personaConfig.signatureElements.join(', ')}, `;
    
    // 색상 팔레트 (로고용)
    const logoColors = this.getLogoColorPalette(personaConfig);
    prompt += `Color palette: ${logoColors.join(', ')}, `;
    
    // 로고 특성
    prompt += `Logo characteristics: scalable, memorable, unique, `;
    prompt += `works in black and white, professional quality, `;
    prompt += `high contrast, clear visibility at small sizes, `;
    prompt += `transparent background, vector-style design`;
    
    return prompt;
  }

  /**
   * 로고 색상 팔레트 생성
   */
  getLogoColorPalette(personaConfig) {
    const baseColors = {
      'P1': ['electric blue', 'deep purple', 'silver'],
      'P2': ['emerald green', 'golden', 'deep blue'],
      'P3': ['fiery orange', 'vibrant yellow', 'dynamic red'],
      'P4': ['soft lavender', 'gentle pink', 'calm teal']
    };
    
    return baseColors[personaConfig.primary] || ['black', 'white', 'gray'];
  }

  /**
   * 실제 이미지 생성 API 호출
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

    return {
      url: response.data.data[0].url,
      revised_prompt: response.data.data[0].revised_prompt
    };
  }

  /**
   * 드림스케이프 메타데이터 생성
   */
  generateDreamscapeMetadata(personaCode, style, userData) {
    return {
      generationType: 'data_dreamscape',
      personaCode: personaCode,
      style: style,
      timestamp: new Date().toISOString(),
      userData: {
        hasFacialData: !!userData.facialAnalysis,
        hasEnvironmentalData: !!userData.environment,
        hasEmotionalData: !!userData.emotionalData
      },
      philosophy: {
        transcendentalPersonalization: true,
        aiNativeAesthetics: true,
        fluidIdentity: true
      }
    };
  }

  /**
   * 로고 메타데이터 생성
   */
  generateLogoMetadata(personaCode, style, userData) {
    return {
      generationType: 'persona_logo',
      personaCode: personaCode,
      logoStyle: style,
      timestamp: new Date().toISOString(),
      usage: {
        socialMedia: true,
        businessCards: true,
        websites: true,
        printMaterials: true
      },
      fileFormats: ['PNG', 'JPG', 'SVG']
    };
  }

  /**
   * 폴백 이미지 URL 반환
   */
  getDreamscapeFallbackImage(personaCode) {
    const fallbackUrls = {
      'P1': 'https://via.placeholder.com/1024x1024/1e3a8a/ffffff?text=Visionary+Leader+Dreamscape',
      'P2': 'https://via.placeholder.com/1024x1024/059669/ffffff?text=Balanced+Builder+Dreamscape',
      'P3': 'https://via.placeholder.com/1024x1024/d97706/ffffff?text=Dynamic+Explorer+Dreamscape',
      'P4': 'https://via.placeholder.com/1024x1024/7c3aed/ffffff?text=Mindful+Guardian+Dreamscape'
    };
    
    return fallbackUrls[personaCode] || fallbackUrls['P1'];
  }

  getLogoFallbackImage(personaCode) {
    const fallbackUrls = {
      'P1': 'https://via.placeholder.com/512x512/1e3a8a/ffffff?text=VL',
      'P2': 'https://via.placeholder.com/512x512/059669/ffffff?text=BB',
      'P3': 'https://via.placeholder.com/512x512/d97706/ffffff?text=DE',
      'P4': 'https://via.placeholder.com/512x512/7c3aed/ffffff?text=MG'
    };
    
    return fallbackUrls[personaCode] || fallbackUrls['P1'];
  }

  /**
   * 사용 가능한 드림스케이프 스타일 목록 반환
   */
  getAvailableStyles() {
    return Object.keys(this.dreamscapeStyles).map(key => ({
      key: key,
      name: this.dreamscapeStyles[key].name,
      description: this.dreamscapeStyles[key].description
    }));
  }

  /**
   * 사용 가능한 로고 스타일 목록 반환
   */
  getAvailableLogoStyles() {
    return [
      { key: 'minimal', name: '미니멀', description: '깔끔하고 단순한 디자인' },
      { key: 'abstract', name: '추상적', description: '유기적이고 흐르는 형태' },
      { key: 'modern', name: '모던', description: '현대적 타이포그래피' },
      { key: 'vintage', name: '빈티지', description: '클래식하고 시대를 초월한 매력' }
    ];
  }
}

module.exports = DataDreamscapeGenerator; 