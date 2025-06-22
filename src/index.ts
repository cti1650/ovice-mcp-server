#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerWorkspaceTools } from './tools/workspace.js';
import { registerGroupTools } from './tools/group.js';
import { registerNotificationTools } from './tools/notification.js';

// MCPサーバーの初期化
const server = new McpServer({
  name: "local-ovice-mcp-test",
  version: "0.1.0",
});

// 各機能のツールを登録
registerWorkspaceTools(server);
registerGroupTools(server);
registerNotificationTools(server);

// サーバー起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ovice MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});