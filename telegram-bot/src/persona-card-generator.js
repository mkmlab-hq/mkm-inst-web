const { GoogleGenerativeAI } = require('@google/generative-ai');

// 페르소나 카드 생성기 - 기존 4대 원소 시스템 활용
class PersonaCardGenerator {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // 기존 4대 원소 디자인 시스템 활용
    this.elementalDesigns = {
      fire: {
        name: '이그니스(Ignis)',
        element: '🔥 불',
        trait: '창의성과 열정의 지혜',
        color: '#FF6B35',
        description: '창의적인 에너지가 넘치는 날입니다. 새로운 아이디어와 혁신적인 접근이 필요한 시기입니다.',
        visualStyle: 'warm, energetic, passionate, creative, dynamic',
        symbols: 'flame, sun, phoenix, lightning, volcano'
      },
      water: {
        name: '아쿠아(Aqua)',
        element: '🌊 물',
        trait: '유연성과 적응력의 지혜',
        color: '#0066CC',
        description: '유연하게 변화에 적응하는 날입니다. 새로운 환경이나 상황에 잘 대응할 수 있습니다.',
        visualStyle: 'fluid, adaptable, flowing, calm, deep',
        symbols: 'wave, ocean, river, rain, crystal'
      },
      air: {
        name: '에테르(Aether)',
        element: '💨 공기',
        trait: '직관과 영감의 지혜',
        color: '#9370DB',
        description: '직관이 예민하고 영감을 받기 좋은 날입니다. 내면의 소리에 귀 기울여보세요.',
        visualStyle: 'ethereal, intuitive, light, flowing, mystical',
        symbols: 'wind, cloud, feather, butterfly, star'
      },
      earth: {
        name: '테라(Terra)',
        element: '🏔️ 땅',
        trait: '안정과 실용성의 지혜',
        color: '#8B4513',
        description: '견고하고 안정적인 기반을 다지는 날입니다. 체계적이고 실용적인 접근이 효과적입니다.',
        visualStyle: 'stable, grounded, practical, solid, nurturing',
        symbols: 'mountain, tree, crystal, stone, leaf'
      }
    };
  }

  /**
   * 페르소나 카드 생성
   */
  async generatePersonaCard(personaData, userPhoto = null) {
    try {
      const elementalDesign = this.getElementalDesign(personaData.scores);
      
      // 카드 프롬프트 생성
      const cardPrompt = this.createCardPrompt(elementalDesign, personaData);
      
      // 이미지 생성
      const cardImage = await this.generateCardImage(cardPrompt, userPhoto);
      
      return {
        success: true,
        card: {
          design: elementalDesign,
          image: cardImage,
          persona: personaData,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('페르소나 카드 생성 오류:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 점수 기반 원소 디자인 선택
   */
  getElementalDesign(scores) {
    const { vision, balance, dynamic, mindfulness } = scores;
    
    if (vision > 0.7) return this.elementalDesigns.fire;
    if (balance > 0.7) return this.elementalDesigns.earth;
    if (dynamic > 0.7) return this.elementalDesigns.water;
    return this.elementalDesigns.air;
  }

  /**
   * 카드 생성 프롬프트 작성
   */
  createCardPrompt(elementalDesign, personaData) {
    return `
    Create a beautiful, mystical persona card for MKM Lab AI with the following specifications:

    **Design Style**: ${elementalDesign.visualStyle}
    **Element**: ${elementalDesign.element}
    **Persona Name**: ${elementalDesign.name}
    **Trait**: ${elementalDesign.trait}
    **Color Palette**: Primary ${elementalDesign.color} with complementary mystical colors
    **Symbols**: ${elementalDesign.symbols}
    
    **Card Layout**:
    - Elegant, tarot-card style design
    - Mystical border with elemental symbols
    - Central focal point representing the persona
    - Elegant typography for persona name and trait
    - Subtle background patterns reflecting the element
    - High contrast for readability
    - Professional, premium quality
    
    **Technical Requirements**:
    - Aspect ratio: 3:4 (portrait orientation)
    - Resolution: 1024x1365 pixels
    - Style: Digital art, mystical, professional
    - Quality: High detail, suitable for printing
    
    **Branding**: Include subtle "MKM Lab AI" branding
    **Mood**: Mystical, empowering, personalized
    
    Create a card that feels like a personal "soul mirror" - reflecting the user's inner essence through AI's unique perspective.
    `;
  }

  /**
   * 카드 이미지 생성
   */
  async generateCardImage(prompt, userPhoto = null) {
    try {
      let imageParts = [];
      
      // 사용자 사진이 있으면 포함
      if (userPhoto) {
        imageParts.push({
          inlineData: {
            data: userPhoto.toString('base64'),
            mimeType: 'image/jpeg'
          }
        });
      }

      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      
      return response.text();
      
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      throw new Error('카드 이미지 생성에 실패했습니다.');
    }
  }

  /**
   * 간단한 텍스트 기반 카드 생성 (폴백)
   */
  generateTextCard(personaData) {
    const elementalDesign = this.getElementalDesign(personaData.scores);
    
    return {
      success: true,
      card: {
        design: elementalDesign,
        textCard: this.createTextCard(elementalDesign, personaData),
        persona: personaData,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 텍스트 카드 생성
   */
  createTextCard(elementalDesign, personaData) {
    const confidence = Math.round(personaData.confidence * 100);
    
    return `
╔══════════════════════════════════════════════════════════════╗
║                    🎭 MKM Lab AI 페르소나 카드 🎭                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ${elementalDesign.element}  ${elementalDesign.name}  ${elementalDesign.element}  ║
║                                                              ║
║  ${elementalDesign.trait}  ║
║                                                              ║
║  신뢰도: ${confidence}%  ║
║                                                              ║
║  ${elementalDesign.description}  ║
║                                                              ║
║  ───────────────────────────────────────────────────────────  ║
║                                                              ║
║  기질 점수:  ║
║  • 창의성: ${Math.round(personaData.scores.vision * 100)}%  ║
║  • 균형감: ${Math.round(personaData.scores.balance * 100)}%  ║
║  • 동적성: ${Math.round(personaData.scores.dynamic * 100)}%  ║
║  • 마음챙김: ${Math.round(personaData.scores.mindfulness * 100)}%  ║
║                                                              ║
║  ───────────────────────────────────────────────────────────  ║
║                                                              ║
║  "내면의 초상을, AI의 시선으로 재창조하다"  ║
║                                                              ║
║  MKM Lab AI - Your Hyper-Personalized Health Advisor  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `;
  }

  /**
   * 카드 스타일 가이드 생성
   */
  getCardStyleGuide() {
    return {
      dimensions: {
        width: 1024,
        height: 1365,
        aspectRatio: '3:4'
      },
      colors: {
        fire: '#FF6B35',
        water: '#0066CC',
        air: '#9370DB',
        earth: '#8B4513'
      },
      typography: {
        title: 'Elegant, mystical font',
        body: 'Readable, professional font',
        size: 'High contrast for readability'
      },
      elements: {
        border: 'Mystical, elemental symbols',
        background: 'Subtle patterns reflecting element',
        focal: 'Central persona representation',
        branding: 'Subtle MKM Lab AI logo'
      }
    };
  }
}

module.exports = { PersonaCardGenerator }; 