import { RedNoteApi } from '../api/rednote.js';
import { validateNotEmpty, validateString, validateEnum } from '../utils/validators.js';
import logger from '../utils/logger.js';

export class AnalysisTools {
  private api: RedNoteApi;

  constructor() {
    this.api = new RedNoteApi();
  }

  async analyzeContent(params: any) {
    try {
      validateNotEmpty(params.content, 'content');
      validateString(params.content, 'content');
      
      if (params.analysis_type) {
        validateEnum(params.analysis_type, 'analysis_type', ['sentiment', 'keywords', 'category', 'all']);
      }

      logger.info('Executing analyze content tool', { 
        contentLength: params.content.length,
        analysisType: params.analysis_type 
      });
      
      const result = await this.api.analyzeContent(params.content, params.analysis_type || 'all');
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      logger.error('Error in analyzeContent tool:', error);
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