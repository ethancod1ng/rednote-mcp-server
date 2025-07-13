import { ApiClient } from './client.js';
import { 
  RedNoteNote, 
  RedNoteUser, 
  RedNoteTopic, 
  SearchParams, 
  SearchResult, 
  AnalysisResult 
} from '../types/rednote.js';
import logger from '../utils/logger.js';

export class RedNoteApi {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient('', {
      timeout: 15000,
      retries: 2,
      retryDelay: 2000
    });
  }

  async searchNotes(params: SearchParams): Promise<SearchResult> {
    logger.info('Searching notes', { params });
    
    try {
      const mockResult: SearchResult = {
        notes: this.generateMockNotes(params.limit || 20),
        hasMore: true,
        nextCursor: 'mock_cursor_' + Date.now(),
        total: 1000
      };
      
      return mockResult;
    } catch (error) {
      logger.error('Error searching notes:', error);
      throw new Error(`Failed to search notes: ${error}`);
    }
  }

  async getNote(noteId: string, includeComments: boolean = false): Promise<RedNoteNote> {
    logger.info('Getting note', { noteId, includeComments });
    
    try {
      const mockNote = this.generateMockNote(noteId);
      return mockNote;
    } catch (error) {
      logger.error('Error getting note:', error);
      throw new Error(`Failed to get note ${noteId}: ${error}`);
    }
  }

  async getUserInfo(userId: string): Promise<RedNoteUser> {
    logger.info('Getting user info', { userId });
    
    try {
      const mockUser = this.generateMockUser(userId);
      return mockUser;
    } catch (error) {
      logger.error('Error getting user info:', error);
      throw new Error(`Failed to get user info for ${userId}: ${error}`);
    }
  }

  async getUserNotes(userId: string, limit: number = 20, cursor?: string): Promise<SearchResult> {
    logger.info('Getting user notes', { userId, limit, cursor });
    
    try {
      const mockResult: SearchResult = {
        notes: this.generateMockNotes(limit),
        hasMore: true,
        nextCursor: cursor ? cursor + '_next' : 'user_cursor_' + Date.now()
      };
      
      return mockResult;
    } catch (error) {
      logger.error('Error getting user notes:', error);
      throw new Error(`Failed to get user notes for ${userId}: ${error}`);
    }
  }

  async getTrendingTopics(category?: string, limit: number = 20): Promise<RedNoteTopic[]> {
    logger.info('Getting trending topics', { category, limit });
    
    try {
      const mockTopics = this.generateMockTopics(limit);
      return mockTopics;
    } catch (error) {
      logger.error('Error getting trending topics:', error);
      throw new Error(`Failed to get trending topics: ${error}`);
    }
  }

  async analyzeContent(content: string, analysisType: string = 'all'): Promise<AnalysisResult> {
    logger.info('Analyzing content', { contentLength: content.length, analysisType });
    
    try {
      const result: AnalysisResult = {};
      
      if (analysisType === 'sentiment' || analysisType === 'all') {
        result.sentiment = {
          score: Math.random() * 2 - 1,
          label: Math.random() > 0.5 ? 'positive' : 'negative',
          confidence: Math.random()
        };
      }
      
      if (analysisType === 'keywords' || analysisType === 'all') {
        result.keywords = this.extractKeywords();
      }
      
      if (analysisType === 'category' || analysisType === 'all') {
        result.category = this.predictCategory();
      }
      
      return result;
    } catch (error) {
      logger.error('Error analyzing content:', error);
      throw new Error(`Failed to analyze content: ${error}`);
    }
  }

  private generateMockNote(id?: string): RedNoteNote {
    const noteId = id || 'note_' + Math.random().toString(36).substring(7);
    return {
      id: noteId,
      title: '美食分享 | 今日午餐推荐',
      content: '今天分享一个超级好吃的菜谱，简单易做，营养丰富！大家一定要试试看～',
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ],
      author: this.generateMockUser('user_' + Math.random().toString(36).substring(7)),
      tags: ['美食', '菜谱', '午餐', '健康'],
      likeCount: Math.floor(Math.random() * 1000),
      commentCount: Math.floor(Math.random() * 100),
      shareCount: Math.floor(Math.random() * 50),
      collectCount: Math.floor(Math.random() * 200),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      type: Math.random() > 0.7 ? 'video' : 'note',
      location: '上海市'
    };
  }

  private generateMockUser(id: string): RedNoteUser {
    const usernames = ['小红薯', '美食达人', '旅行者', '时尚博主', '生活家'];
    return {
      id,
      username: 'user_' + Math.random().toString(36).substring(7),
      nickname: usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000),
      avatar: 'https://example.com/avatar.jpg',
      description: '分享生活中的美好时光 ✨',
      followerCount: Math.floor(Math.random() * 10000),
      followingCount: Math.floor(Math.random() * 1000),
      noteCount: Math.floor(Math.random() * 500),
      likeCount: Math.floor(Math.random() * 50000),
      verified: Math.random() > 0.8
    };
  }

  private generateMockNotes(count: number): RedNoteNote[] {
    return Array.from({ length: count }, () => this.generateMockNote());
  }

  private generateMockTopics(count: number): RedNoteTopic[] {
    const topicNames = ['美食', '旅行', '时尚', '美妆', '健身', '读书', '电影', '音乐', '摄影', '宠物'];
    return Array.from({ length: Math.min(count, topicNames.length) }, (_, i) => ({
      id: 'topic_' + i,
      name: topicNames[i],
      description: `关于${topicNames[i]}的精彩内容`,
      noteCount: Math.floor(Math.random() * 10000),
      participantCount: Math.floor(Math.random() * 50000),
      trending: Math.random() > 0.5
    }));
  }

  private extractKeywords(): string[] {
    const commonWords = ['美食', '分享', '推荐', '好吃', '简单', '健康', '生活', '时尚', '美丽'];
    return commonWords.filter(() => Math.random() > 0.5).slice(0, 5);
  }

  private predictCategory(): string {
    const categories = ['美食', '时尚', '旅行', '生活', '美妆', '健身'];
    return categories[Math.floor(Math.random() * categories.length)];
  }
}