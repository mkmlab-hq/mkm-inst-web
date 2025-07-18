/**
 * MKM Lab 한정판 이벤트 시스템
 * 
 * 사용자 참여율 증대 및 바이럴 확산을 위한 한정판 이벤트 관리
 */

class LimitedEditionEvents {
  constructor() {
    this.activeEvents = new Map();
    this.userProgress = new Map();
    this.eventHistory = new Map();
    
    // 이벤트 정의
    this.initializeEvents();
  }

  initializeEvents() {
    // 첫 번째 한정판 이벤트: "글로벌 문화 축제 에디션"
    this.activeEvents.set('global_culture_festival_2024', {
      id: 'global_culture_festival_2024',
      name: '🌍 글로벌 문화 축제 에디션',
      description: '세계 각국의 문화 축제를 테마로 한 특별한 페르소나를 만나보세요!',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-08-15'),
      themes: [
        {
          id: 'brazil_carnival',
          name: '🇧🇷 브라질 카니발',
          description: '열정적이고 화려한 카니발 페르소나',
          requirements: ['invite_3_friends', 'use_bot_5_times'],
          rewards: ['exclusive_persona', 'carnival_theme']
        },
        {
          id: 'japan_cherry_blossom',
          name: '🇯🇵 일본 벚꽃 축제',
          description: '우아하고 아름다운 벚꽃 페르소나',
          requirements: ['share_location', 'complete_survey'],
          rewards: ['exclusive_persona', 'sakura_theme']
        },
        {
          id: 'india_holi',
          name: '🇮🇳 인도 홀리 축제',
          description: '다채롭고 활기찬 홀리 페르소나',
          requirements: ['send_photo', 'invite_2_friends'],
          rewards: ['exclusive_persona', 'holi_theme']
        }
      ],
      globalRewards: {
        'invite_10_friends': '🌍 글로벌 마스터 페르소나',
        'use_bot_20_times': '⭐ VIP 기능 30일 무료',
        'complete_all_themes': '🏆 레전더리 컬렉터 배지'
      }
    });

    // 두 번째 한정판 이벤트: "별자리 탄생석 에디션"
    this.activeEvents.set('zodiac_birthstone_2024', {
      id: 'zodiac_birthstone_2024',
      name: '✨ 별자리 탄생석 에디션',
      description: '당신의 별자리와 탄생석을 테마로 한 운세 페르소나!',
      startDate: new Date('2024-08-20'),
      endDate: new Date('2024-09-20'),
      themes: [
        {
          id: 'aries_fire',
          name: '♈ 양자리 - 다이아몬드',
          description: '불꽃처럼 강렬한 리더십 페르소나',
          requirements: ['birthday_verification', 'social_media_share'],
          rewards: ['exclusive_persona', 'fire_theme']
        },
        {
          id: 'taurus_earth',
          name: '♉ 황소자리 - 에메랄드',
          description: '안정적이고 신뢰할 수 있는 페르소나',
          requirements: ['location_share', 'complete_profile'],
          rewards: ['exclusive_persona', 'earth_theme']
        },
        {
          id: 'gemini_air',
          name: '♊ 쌍둥이자리 - 진주',
          description: '다재다능하고 적응력 강한 페르소나',
          requirements: ['multiple_analyses', 'friend_invite'],
          rewards: ['exclusive_persona', 'air_theme']
        }
      ]
    });
  }

  /**
   * 사용자 이벤트 진행 상황 확인
   */
  getUserProgress(userId, eventId) {
    const userKey = `${userId}_${eventId}`;
    return this.userProgress.get(userKey) || {
      userId: userId,
      eventId: eventId,
      progress: {},
      completedThemes: [],
      rewards: [],
      inviteCount: 0,
      usageCount: 0,
      lastActivity: null
    };
  }

  /**
   * 이벤트 진행 상황 업데이트
   */
  updateProgress(userId, eventId, action, data = {}) {
    const userKey = `${userId}_${eventId}`;
    const progress = this.getUserProgress(userId, eventId);
    
    // 액션별 진행 상황 업데이트
    switch (action) {
      case 'invite_friend':
        progress.inviteCount = (progress.inviteCount || 0) + 1;
        break;
      case 'use_bot':
        progress.usageCount = (progress.usageCount || 0) + 1;
        break;
      case 'send_photo':
        progress.progress.photo_sent = true;
        break;
      case 'share_location':
        progress.progress.location_shared = true;
        break;
      case 'complete_survey':
        progress.progress.survey_completed = true;
        break;
      case 'social_media_share':
        progress.progress.social_shared = true;
        break;
      case 'birthday_verification':
        progress.progress.birthday_verified = true;
        break;
    }

    progress.lastActivity = new Date();
    this.userProgress.set(userKey, progress);

    // 보상 확인
    return this.checkRewards(userId, eventId);
  }

  /**
   * 보상 확인 및 지급
   */
  checkRewards(userId, eventId) {
    const event = this.activeEvents.get(eventId);
    const progress = this.getUserProgress(userId, eventId);
    const rewards = [];

    if (!event) return rewards;

    // 테마별 보상 확인
    event.themes.forEach(theme => {
      if (this.isThemeCompleted(progress, theme)) {
        if (!progress.completedThemes.includes(theme.id)) {
          progress.completedThemes.push(theme.id);
          rewards.push({
            type: 'theme_completion',
            theme: theme,
            reward: theme.rewards
          });
        }
      }
    });

    // 글로벌 보상 확인
    if (event.globalRewards) {
      if (progress.inviteCount >= 10 && !progress.rewards.includes('global_master')) {
        progress.rewards.push('global_master');
        rewards.push({
          type: 'global_reward',
          name: '글로벌 마스터',
          reward: event.globalRewards['invite_10_friends']
        });
      }

      if (progress.usageCount >= 20 && !progress.rewards.includes('vip_access')) {
        progress.rewards.push('vip_access');
        rewards.push({
          type: 'global_reward',
          name: 'VIP 접근권',
          reward: event.globalRewards['use_bot_20_times']
        });
      }

      if (progress.completedThemes.length >= event.themes.length && !progress.rewards.includes('legendary_collector')) {
        progress.rewards.push('legendary_collector');
        rewards.push({
          type: 'global_reward',
          name: '레전더리 컬렉터',
          reward: event.globalRewards['complete_all_themes']
        });
      }
    }

    // 진행 상황 저장
    const userKey = `${userId}_${eventId}`;
    this.userProgress.set(userKey, progress);

    return rewards;
  }

  /**
   * 테마 완료 여부 확인
   */
  isThemeCompleted(progress, theme) {
    return theme.requirements.every(req => {
      switch (req) {
        case 'invite_3_friends':
          return progress.inviteCount >= 3;
        case 'invite_2_friends':
          return progress.inviteCount >= 2;
        case 'use_bot_5_times':
          return progress.usageCount >= 5;
        case 'send_photo':
          return progress.progress.photo_sent;
        case 'share_location':
          return progress.progress.location_shared;
        case 'complete_survey':
          return progress.progress.survey_completed;
        case 'social_media_share':
          return progress.progress.social_shared;
        case 'birthday_verification':
          return progress.progress.birthday_verified;
        default:
          return false;
      }
    });
  }

  /**
   * 활성 이벤트 목록 조회
   */
  getActiveEvents() {
    const now = new Date();
    const active = [];

    this.activeEvents.forEach((event, eventId) => {
      if (now >= event.startDate && now <= event.endDate) {
        active.push({
          id: eventId,
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          themes: event.themes.map(theme => ({
            id: theme.id,
            name: theme.name,
            description: theme.description
          }))
        });
      }
    });

    return active;
  }

  /**
   * 이벤트 정보 조회
   */
  getEventInfo(eventId) {
    return this.activeEvents.get(eventId);
  }

  /**
   * 사용자 이벤트 대시보드 생성
   */
  generateUserDashboard(userId, eventId) {
    const event = this.getEventInfo(eventId);
    const progress = this.getUserProgress(userId, eventId);

    if (!event) return null;

    const dashboard = {
      eventName: event.name,
      eventDescription: event.description,
      progress: {
        inviteCount: progress.inviteCount || 0,
        usageCount: progress.usageCount || 0,
        completedThemes: progress.completedThemes.length,
        totalThemes: event.themes.length
      },
      themes: event.themes.map(theme => ({
        ...theme,
        completed: this.isThemeCompleted(progress, theme),
        progress: this.getThemeProgress(progress, theme)
      })),
      rewards: progress.rewards,
      timeRemaining: this.getTimeRemaining(event.endDate)
    };

    return dashboard;
  }

  /**
   * 테마별 진행률 계산
   */
  getThemeProgress(progress, theme) {
    const completed = theme.requirements.filter(req => {
      switch (req) {
        case 'invite_3_friends':
          return progress.inviteCount >= 3;
        case 'invite_2_friends':
          return progress.inviteCount >= 2;
        case 'use_bot_5_times':
          return progress.usageCount >= 5;
        case 'send_photo':
          return progress.progress.photo_sent;
        case 'share_location':
          return progress.progress.location_shared;
        case 'complete_survey':
          return progress.progress.survey_completed;
        case 'social_media_share':
          return progress.progress.social_shared;
        case 'birthday_verification':
          return progress.progress.birthday_verified;
        default:
          return false;
      }
    }).length;

    return {
      completed: completed,
      total: theme.requirements.length,
      percentage: Math.round((completed / theme.requirements.length) * 100)
    };
  }

  /**
   * 남은 시간 계산
   */
  getTimeRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return '종료됨';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}일 ${hours}시간 남음`;
  }

  /**
   * 이벤트 통계 조회
   */
  getEventStats(eventId) {
    const stats = {
      totalParticipants: 0,
      totalInvites: 0,
      totalUsage: 0,
      themeCompletions: {},
      rewards: {}
    };

    this.userProgress.forEach((progress, key) => {
      if (key.includes(eventId)) {
        stats.totalParticipants++;
        stats.totalInvites += progress.inviteCount || 0;
        stats.totalUsage += progress.usageCount || 0;

        progress.completedThemes.forEach(themeId => {
          stats.themeCompletions[themeId] = (stats.themeCompletions[themeId] || 0) + 1;
        });

        progress.rewards.forEach(reward => {
          stats.rewards[reward] = (stats.rewards[reward] || 0) + 1;
        });
      }
    });

    return stats;
  }
}

module.exports = { LimitedEditionEvents }; 