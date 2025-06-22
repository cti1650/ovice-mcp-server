import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { APIResponse, Workspace, User } from '../types.js';
import { 
  getOviceConfig, 
  createErrorResponse, 
  createSuccessResponse, 
  callOviceAPI, 
  findWorkspaceById, 
  getAppDomain,
  ENV_ERROR_MESSAGE 
} from '../utils.js';

// ワークスペース関連ツールの登録
export function registerWorkspaceTools(server: McpServer) {
  // 組織のワークスペース一覧を取得
  server.tool(
    "get_organization_workspaces",
    "組織のワークスペース一覧を取得する",
    {},
    async (): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const data = await callOviceAPI<Workspace[]>(config, "organizations/workspaces");
        return createSuccessResponse(data);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );

  // ワークスペースのユーザー一覧を取得
  server.tool(
    "get_workspace_users",
    "ワークスペースのユーザー一覧を取得する",
    {
      workspaceId: z.string().describe("ワークスペースID"),
    },
    async ({ workspaceId }): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const data = await callOviceAPI<User[]>(config, `workspaces/workspace_users?workspace_id=${workspaceId}`);
        return createSuccessResponse(data);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );

  // スペースIDからスペース名を取得
  server.tool(
    "get_space_name_by_id",
    "スペースIDからスペース名を取得する",
    {
      spaceId: z.string().describe("スペースID"),
    },
    async ({ spaceId }): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const workspace = await findWorkspaceById(config, spaceId);
        
        if (!workspace) {
          return createErrorResponse(`Error: スペースID "${spaceId}" が見つかりませんでした。`);
        }

        return createSuccessResponse(workspace.name);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );

  // ワークスペースにアクセスするためのパスを返す
  server.tool(
    "get_workspace_access_path",
    "ワークスペースにアクセスするためのパスを返す",
    {
      workspaceId: z.string().describe("ワークスペースID"),
    },
    async ({ workspaceId }): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const appDomain = getAppDomain(config.apiDomain);
        const workspace = await findWorkspaceById(config, workspaceId);
        
        if (!workspace) {
          return createErrorResponse(`Error: ワークスペースID "${workspaceId}" が見つかりませんでした。`);
        }

        if (!workspace.domain) {
          return createErrorResponse(`Error: ワークスペース "${workspace.name}" にドメインが設定されていません。`);
        }

        const accessPath = `https://${appDomain}/ws/${workspace.domain}/`;
        return createSuccessResponse(accessPath);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );
}