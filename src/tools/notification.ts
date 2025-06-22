import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { 
  APIResponse, 
  NotificationRequest, 
  WorkspaceNotificationRequest, 
  GroupNotificationRequest
} from '../types.js';
import { 
  getOviceConfig, 
  createErrorResponse, 
  createSuccessResponse, 
  callOviceAPI,
  ENV_ERROR_MESSAGE 
} from '../utils.js';

// 通知関連ツールの登録
export function registerNotificationTools(server: McpServer) {
  // 組織に通知を送信
  server.tool(
    "send_organization_notification",
    "組織に通知を送信する",
    {
      message: z.string().describe("通知メッセージ"),
      serviceName: z.string().optional().describe("サービス名（環境変数 OVICE_SERVICE_NAME で設定可能）"),
      serviceLogoUrl: z.string().optional().describe("サービスロゴURL（環境変数 OVICE_SERVICE_LOGO_URL で設定可能）"),
    },
    async ({ message, serviceName, serviceLogoUrl }): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const requestBody: NotificationRequest = {
          message,
          service_name: serviceName || config.serviceName,
          service_logo_url: serviceLogoUrl || config.serviceLogoUrl,
        };

        const data = await callOviceAPI(config, "organizations/notification", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        return createSuccessResponse(data);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );

  // ワークスペースに通知を送信
  server.tool(
    "send_workspace_notification",
    "ワークスペースに通知を送信する",
    {
      workspaceId: z.string().describe("ワークスペースID"),
      auth: z.array(z.enum(["admin", "member", "visitor", "guest"])).describe("通知対象の権限レベル"),
      message: z.string().describe("通知メッセージ"),
      serviceName: z.string().optional().describe("サービス名（環境変数 OVICE_SERVICE_NAME で設定可能）"),
      serviceLogoUrl: z.string().optional().describe("サービスロゴURL（環境変数 OVICE_SERVICE_LOGO_URL で設定可能）"),
    },
    async ({ workspaceId, auth, message, serviceName, serviceLogoUrl }): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const requestBody: WorkspaceNotificationRequest = {
          workspace_id: workspaceId,
          auth,
          message,
          service_name: serviceName || config.serviceName,
          service_logo_url: serviceLogoUrl || config.serviceLogoUrl,
        };

        const data = await callOviceAPI(config, "workspaces/notification", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        return createSuccessResponse(data);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );

  // グループに通知を送信
  server.tool(
    "send_group_notification",
    "グループに通知を送信する",
    {
      groupId: z.string().describe("グループID"),
      message: z.string().describe("通知メッセージ"),
      serviceName: z.string().optional().describe("サービス名（環境変数 OVICE_SERVICE_NAME で設定可能）"),
      serviceLogoUrl: z.string().optional().describe("サービスロゴURL（環境変数 OVICE_SERVICE_LOGO_URL で設定可能）"),
    },
    async ({ groupId, message, serviceName, serviceLogoUrl }): Promise<APIResponse> => {
      const config = getOviceConfig();
      if (!config) {
        return createErrorResponse(ENV_ERROR_MESSAGE);
      }

      try {
        const requestBody: GroupNotificationRequest = {
          group_id: groupId,
          message,
          service_name: serviceName || config.serviceName,
          service_logo_url: serviceLogoUrl || config.serviceLogoUrl,
        };

        const data = await callOviceAPI(config, "groups/notification", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        return createSuccessResponse(data);
      } catch (error) {
        return createErrorResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  );
}