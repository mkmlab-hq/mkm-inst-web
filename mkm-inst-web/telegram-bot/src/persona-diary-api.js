const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class PersonaDiaryAPI {
  constructor() {
    // API 서버 URL (환경변수에서 가져오거나 기본값 사용)
    this.apiBaseUrl = process.env.PERSONA_DIARY_API_URL || 'http://localhost:8000';
    this.timeout = 30000; // 30초 타임아웃
    
    console.log(`🔗 페르소나 다이어리 API 연결: ${this.apiBaseUrl}`);
  }

  /**
   * API 서버 상태 확인
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/health`, {
        timeout: this.timeout
      });
      return {
        success: true,
        status: response.data.status,
        version: response.data.version,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      console.error('❌ API 서버 상태 확인 실패:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 15초 영상 업로드 및 얼굴 분석
   */
  async analyzeFace(videoBuffer, filename) {
    try {
      const formData = new FormData();
      formData.append('video', videoBuffer, {
        filename: filename,
        contentType: 'video/mp4'
      });

      console.log(`📹 영상 분석 시작: ${filename}`);
      
      const response = await axios.post(`${this.apiBaseUrl}/analyze-face/`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: this.timeout,
        maxContentLength: 100 * 1024 * 1024, // 100MB
        maxBodyLength: 100 * 1024 * 1024
      });

      console.log('✅ 영상 분석 완료');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ 영상 분석 실패:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  /**
   * 페르소나 목록 조회
   */
  async getPersonas() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/personas`, {
        timeout: this.timeout
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ 페르소나 목록 조회 실패:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 분석 결과 조회
   */
  async getAnalysisResult(analysisId) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/analysis/${analysisId}`, {
        timeout: this.timeout
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ 분석 결과 조회 실패:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * AI 어드바이저에게 질문
   */
  async askAdvisor(question, personaData = null, vitalSigns = null) {
    try {
      const requestData = {
        question: question,
        persona_data: personaData,
        vital_signs: vitalSigns
      };

      console.log('🤖 AI 어드바이저 질문:', question);
      
      const response = await axios.post(`${this.apiBaseUrl}/ask-advisor/`, requestData, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ AI 어드바이저 응답 완료');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ AI 어드바이저 질문 실패:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  /**
   * 지식 베이스 검색
   */
  async searchKnowledgeBase(query, topK = 5) {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/advisor/search`, {
        query: query,
        top_k: topK
      }, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ 지식 베이스 검색 실패:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 어드바이저 통계 조회
   */
  async getAdvisorStats() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/advisor/stats`, {
        timeout: this.timeout
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ 어드바이저 통계 조회 실패:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 영상 파일 검증
   */
  validateVideoFile(file) {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'];
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: '파일 크기가 너무 큽니다. (최대 100MB)'
      };
    }
    
    if (!allowedTypes.includes(file.mime_type)) {
      return {
        valid: false,
        error: '지원하지 않는 영상 형식입니다. (MP4, AVI, MOV, MKV만 지원)'
      };
    }
    
    return {
      valid: true
    };
  }

  /**
   * 분석 결과를 텔레그램 메시지로 포맷팅
   */
  formatAnalysisResult(analysisData) {
    try {
      const result = analysisData.data.result;
      const vitalSigns = result.vital_signs;
      const persona = result.persona_analysis.persona;
      const solutions = result.persona_analysis.solutions;

      let message = `🎭 *페르소나 다이어리 분석 결과*\n\n`;
      
      // 생체 신호
      message += `💓 *생체 신호*\n`;
      message += `• 심박수: ${vitalSigns.heart_rate} BPM\n`;
      message += `• 혈압: ${vitalSigns.blood_pressure.systolic}/${vitalSigns.blood_pressure.diastolic} mmHg\n`;
      message += `• 신호 품질: ${Math.round(vitalSigns.signal_quality * 100)}%\n\n`;
      
      // 페르소나
      message += `👤 *당신의 페르소나*\n`;
      message += `• ${persona.name} (${persona.code})\n`;
      message += `• 특징: ${persona.characteristics.join(', ')}\n\n`;
      
      // 맞춤 솔루션
      message += `💡 *맞춤 솔루션*\n`;
      message += `• ${solutions.title}\n\n`;
      
      // 일일 루틴 (첫 3개만)
      if (solutions.daily_routine && solutions.daily_routine.length > 0) {
        message += `📅 *오늘의 루틴*\n`;
        solutions.daily_routine.slice(0, 3).forEach((routine, index) => {
          message += `${index + 1}. ${routine}\n`;
        });
        message += `\n`;
      }
      
      // 추천사항 (첫 2개만)
      if (solutions.recommendations && solutions.recommendations.length > 0) {
        message += `✨ *추천사항*\n`;
        solutions.recommendations.slice(0, 2).forEach((rec, index) => {
          message += `${index + 1}. ${rec}\n`;
        });
      }
      
      return message;
    } catch (error) {
      console.error('❌ 분석 결과 포맷팅 실패:', error);
      return '😔 분석 결과를 표시하는 중 오류가 발생했습니다.';
    }
  }

  /**
   * AI 어드바이저 응답을 텔레그램 메시지로 포맷팅
   */
  formatAdvisorResponse(advisorData) {
    try {
      const response = advisorData.data.result;
      
      let message = `🤖 *AI 어드바이저 응답*\n\n`;
      message += `${response.answer}\n\n`;
      
      if (response.sources && response.sources.length > 0) {
        message += `📚 *참고 자료*\n`;
        response.sources.slice(0, 3).forEach((source, index) => {
          message += `${index + 1}. ${source.title}\n`;
        });
      }
      
      return message;
    } catch (error) {
      console.error('❌ 어드바이저 응답 포맷팅 실패:', error);
      return '😔 AI 어드바이저 응답을 표시하는 중 오류가 발생했습니다.';
    }
  }
}

module.exports = { PersonaDiaryAPI }; 