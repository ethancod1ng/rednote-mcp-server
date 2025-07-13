import { RedNoteApi } from '../api/rednote.js';
import { validateNotEmpty, validateString, validateNumber } from '../utils/validators.js';
import logger from '../utils/logger.js';

export class ContentTools {
  private api: RedNoteApi;

  constructor() {
    this.api = new RedNoteApi();
  }

  async getNote(params: any) {
    try {
      validateNotEmpty(params.note_id, 'note_id');
      validateString(params.note_id, 'note_id');

      logger.info('Executing get note tool', { noteId: params.note_id });
      
      const result = await this.api.getNote(params.note_id, params.include_comments || false);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      logger.error('Error in getNote tool:', error);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }

  async getUserNotes(params: any) {
    try {
      validateNotEmpty(params.user_id, 'user_id');
      validateString(params.user_id, 'user_id');
      
      if (params.limit) {
        validateNumber(params.limit, 'limit', 1, 100);
      }

      logger.info('Executing get user notes tool', { 
        userId: params.user_id, 
        limit: params.limit,
        cursor: params.cursor 
      });
      
      const result = await this.api.getUserNotes(
        params.user_id, 
        params.limit || 20, 
        params.cursor
      );
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      logger.error('Error in getUserNotes tool:', error);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }

  async getTrendingTopics(params: any) {
    try {
      if (params.limit) {
        validateNumber(params.limit, 'limit', 1, 100);
      }

      logger.info('Executing get trending topics tool', { 
        category: params.category,
        limit: params.limit 
      });
      
      const result = await this.api.getTrendingTopics(params.category, params.limit || 20);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      logger.error('Error in getTrendingTopics tool:', error);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}