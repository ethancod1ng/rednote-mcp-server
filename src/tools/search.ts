import { RedNoteApi } from '../api/rednote.js';
import { validateSearchParams } from '../utils/validators.js';
import logger from '../utils/logger.js';

export class SearchTools {
  private api: RedNoteApi;

  constructor() {
    this.api = new RedNoteApi();
  }

  async searchNotes(params: any) {
    try {
      validateSearchParams(params);
      
      const searchParams = {
        keyword: params.keyword,
        type: params.type || 'all',
        sort: params.sort || 'relevant',
        limit: params.limit || 20
      };

      logger.info('Executing search notes tool', { params: searchParams });
      
      const result = await this.api.searchNotes(searchParams);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      logger.error('Error in searchNotes tool:', error);
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