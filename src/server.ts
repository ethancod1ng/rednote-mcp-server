import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TOOL_DEFINITIONS } from './types/mcp.js';
import { SearchTools } from './tools/search.js';
import { ContentTools } from './tools/content.js';
import { UserTools } from './tools/user.js';
import { AnalysisTools } from './tools/analysis.js';
import logger from './utils/logger.js';

export class RedNoteMCPServer {
  private server: Server;
  private searchTools: SearchTools;
  private contentTools: ContentTools;
  private userTools: UserTools;
  private analysisTools: AnalysisTools;

  constructor() {
    this.server = new Server({
      name: 'rednote-mcp-server',
      version: '1.0.0',
      capabilities: {
        tools: {},
      },
    });

    this.searchTools = new SearchTools();
    this.contentTools = new ContentTools();
    this.userTools = new UserTools();
    this.analysisTools = new AnalysisTools();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.info('Listing available tools');
      
      return {
        tools: Object.values(TOOL_DEFINITIONS).map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: params } = request.params;
      
      logger.info(`Calling tool: ${name}`, { params });

      try {
        switch (name) {
          case 'rednote_search_notes':
            return await this.searchTools.searchNotes(params);

          case 'rednote_get_note':
            return await this.contentTools.getNote(params);

          case 'rednote_get_user_notes':
            return await this.contentTools.getUserNotes(params);

          case 'rednote_get_trending_topics':
            return await this.contentTools.getTrendingTopics(params);

          case 'rednote_get_user_info':
            return await this.userTools.getUserInfo(params);

          case 'rednote_analyze_content':
            return await this.analysisTools.analyzeContent(params);

          default:
            logger.error(`Unknown tool: ${name}`);
            return {
              content: [{
                type: 'text',
                text: `Error: Unknown tool '${name}'`
              }],
              isError: true
            };
        }
      } catch (error) {
        logger.error(`Error executing tool ${name}:`, error);
        return {
          content: [{
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    });

    this.server.onerror = (error) => {
      logger.error('Server error:', error);
    };

    process.on('SIGINT', async () => {
      logger.info('Shutting down server...');
      await this.server.close();
      process.exit(0);
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    logger.info('RedNote MCP Server started');
  }

  getServer(): Server {
    return this.server;
  }
}