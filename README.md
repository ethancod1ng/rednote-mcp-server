# RedNote MCP Server

一个基于 Model Context Protocol (MCP) 的小红书平台集成服务器，为 AI 助手提供访问小红书内容和功能的能力。

## 功能特性

- 🔍 **内容搜索**: 支持关键词搜索小红书笔记
- 📝 **笔记获取**: 获取笔记详情和用户内容
- 👥 **用户信息**: 查询用户资料和统计数据
- 📈 **趋势分析**: 获取热门话题和内容趋势
- 🤖 **内容分析**: 提供情感分析、关键词提取等功能

## 快速开始

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

### 启动服务器

```bash
npm start
```

### 开发模式

```bash
npm run dev
```

## 可用工具

### 搜索工具

#### `rednote_search_notes`
搜索小红书笔记

**参数:**
- `keyword` (required): 搜索关键词
- `type` (optional): 内容类型 (`note`, `video`, `all`)
- `sort` (optional): 排序方式 (`latest`, `popular`, `relevant`)
- `limit` (optional): 返回数量限制 (1-100)

**示例:**
```json
{
  "keyword": "美食",
  "type": "note",
  "sort": "popular",
  "limit": 20
}
```

### 内容工具

#### `rednote_get_note`
获取笔记详情

**参数:**
- `note_id` (required): 笔记ID
- `include_comments` (optional): 是否包含评论

#### `rednote_get_user_notes`
获取用户笔记

**参数:**
- `user_id` (required): 用户ID
- `limit` (optional): 数量限制
- `cursor` (optional): 分页游标

#### `rednote_get_trending_topics`
获取热门话题

**参数:**
- `category` (optional): 分类
- `limit` (optional): 数量限制

### 用户工具

#### `rednote_get_user_info`
获取用户信息

**参数:**
- `user_id` (required): 用户ID或用户名

### 分析工具

#### `rednote_analyze_content`
分析内容

**参数:**
- `content` (required): 内容文本
- `analysis_type` (optional): 分析类型 (`sentiment`, `keywords`, `category`, `all`)

## 配置

配置文件位于 `config/` 目录下，支持不同环境的配置:

- `default.json`: 默认配置
- `production.json`: 生产环境配置
- `development.json`: 开发环境配置

### 主要配置项

```json
{
  "api": {
    "timeout": 15000,
    "retries": 3,
    "retryDelay": 2000
  },
  "cache": {
    "enabled": true,
    "ttl": 300000,
    "maxSize": 1000
  },
  "logging": {
    "level": "info"
  }
}
```

## MCP 集成

### 在 Claude Desktop 中使用

1. 构建项目:
   ```bash
   npm run build
   ```

2. 在 Claude Desktop 配置文件中添加:
   ```json
   {
     "mcpServers": {
       "rednote": {
         "command": "node",
         "args": ["/path/to/rednote-mcp-server/dist/index.js"]
       }
     }
   }
   ```

### 使用其他 MCP 客户端

服务器实现了标准的 MCP 协议，可以与任何兼容的 MCP 客户端集成。

## 开发

### 项目结构

```
src/
├── index.ts              # 入口文件
├── server.ts             # MCP 服务器实现
├── tools/                # MCP 工具定义
│   ├── search.ts         # 搜索相关工具
│   ├── content.ts        # 内容获取工具
│   ├── user.ts           # 用户信息工具
│   └── analysis.ts       # 分析工具
├── api/                  # API 客户端
│   ├── client.ts         # HTTP 客户端
│   └── rednote.ts        # 小红书 API 封装
├── utils/                # 工具函数
│   ├── cache.ts          # 缓存管理
│   ├── logger.ts         # 日志工具
│   └── validators.ts     # 参数验证
└── types/                # 类型定义
    ├── api.ts            # API 响应类型
    ├── mcp.ts            # MCP 相关类型
    └── rednote.ts        # 小红书数据类型
```

### 代码质量

```bash
# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 运行测试
npm test
```

## 注意事项

1. **API 限制**: 当前实现使用模拟数据，实际使用时需要集成真实的小红书 API
2. **速率限制**: 请注意 API 调用频率限制，避免被平台限制
3. **数据合规**: 确保数据获取和使用符合相关法律法规
4. **缓存策略**: 合理使用缓存以提高性能和减少 API 调用

## 许可证

MIT License

## 贡献

欢迎提交 Issues 和 Pull Requests！