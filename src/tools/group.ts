import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { APIResponse, Group, User } from '../types.js';
import { 
  getOviceConfig, 
  createErrorResponse, 
  createSuccessResponse, 
  callOviceAPI,
  ENV_ERROR_MESSAGE 
} from '../utils.js';

// グループ関連ツールの登録
export function registerGroupTools(server: McpServer) {
  // 組織のグループ一覧を取得
  server.tool(
    "get_organization_groups",
    "組織のグループ一覧を取得する",
    {},
    async (): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const data = await callOviceAPI<Group[]>(config, "organizations/groups");
        return createSuccessResponse(data);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );

  // グループのメンバー一覧を取得
  server.tool(
    "get_group_members",
    "グループのメンバー一覧を取得する",
    {
      groupId: z.string().describe("グループID"),
    },
    async ({ groupId }): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const data = await callOviceAPI<User[]>(config, `groups/members?group_id=${groupId}`);
        return createSuccessResponse(data);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );
}