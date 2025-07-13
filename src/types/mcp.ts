export interface RedNoteToolParams {
  [key: string]: any;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export const TOOL_DEFINITIONS: Record<string, ToolDefinition> = {
  rednote_search_notes: {
    name: 'rednote_search_notes',
    description: '搜索小红书笔记',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: '搜索关键词'
        },
        type: {
          type: 'string',
          enum: ['note', 'video', 'all'],
          description: '内容类型',
          default: 'all'
        },
        sort: {
          type: 'string',
          enum: ['latest', 'popular', 'relevant'],
          description: '排序方式',
          default: 'relevant'
        },
        limit: {
          type: 'number',
          description: '返回数量限制',
          default: 20,
          minimum: 1,
          maximum: 100
        }
      },
      required: ['keyword']
    }
  },
  rednote_get_note: {
    name: 'rednote_get_note',
    description: '获取笔记详情',
    inputSchema: {
      type: 'object',
      properties: {
        note_id: {
          type: 'string',
          description: '笔记ID'
        },
        include_comments: {
          type: 'boolean',
          description: '是否包含评论',
          default: false
        }
      },
      required: ['note_id']
    }
  },
  rednote_get_user_info: {
    name: 'rednote_get_user_info',
    description: '获取用户信息',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: '用户ID或用户名'
        }
      },
      required: ['user_id']
    }
  },
  rednote_get_user_notes: {
    name: 'rednote_get_user_notes',
    description: '获取用户笔记',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: '用户ID'
        },
        limit: {
          type: 'number',
          description: '数量限制',
          default: 20,
          minimum: 1,
          maximum: 100
        },
        cursor: {
          type: 'string',
          description: '分页游标'
        }
      },
      required: ['user_id']
    }
  },
  rednote_get_trending_topics: {
    name: 'rednote_get_trending_topics',
    description: '获取热门话题',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: '分类'
        },
        limit: {
          type: 'number',
          description: '数量限制',
          default: 20,
          minimum: 1,
          maximum: 100
        }
      }
    }
  },
  rednote_analyze_content: {
    name: 'rednote_analyze_content',
    description: '分析内容',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: '内容文本'
        },
        analysis_type: {
          type: 'string',
          enum: ['sentiment', 'keywords', 'category', 'all'],
          description: '分析类型',
          default: 'all'
        }
      },
      required: ['content']
    }
  }
};