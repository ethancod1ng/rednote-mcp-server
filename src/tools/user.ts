import { RedNoteApi } from '../api/rednote.js';
import { validateNotEmpty, validateString } from '../utils/validators.js';
import logger from '../utils/logger.js';

export class UserTools {
  private api: RedNoteApi;

  constructor() {
    this.api = new RedNoteApi();
  }

  async getUserInfo(params: any) {
    try {
      validateNotEmpty(params.user_id, 'user_id');
      validateString(params.user_id, 'user_id');

      logger.info('Executing get user info tool', { userId: params.user_id });
      
      const result = await this.api.getUserInfo(params.user_id);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      logger.error('Error in getUserInfo tool:', error);
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