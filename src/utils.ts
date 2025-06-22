import { OviceConfig, APIResponse, Workspace } from './types.js';

// 環境変数の型安全な取得
export function getOviceConfig(): OviceConfig | null {
  const apiDomain = process.env.OVICE_DOMAIN || "api.ovice.com";
  const apiClientId = process.env.OVICE_CLIENT_ID;
  const apiClientSecret = process.env.OVICE_CLIENT_SECRET;
  const organizationId = process.env.OVICE_ORGANIZATION_ID;
  const serviceName = process.env.OVICE_SERVICE_NAME || "This is demo";
  const serviceLogoUrl = process.env.OVICE_SERVICE_LOGO_URL || "https://assets-global.website-files.com/6304384d32da77e91a7afeed/6407da43523f291bf65b73fc_logo.svg";

  if (!apiClientId || !apiClientSecret || !organizationId) {
    return null;
  }

  return {
    apiDomain,
    apiClientId,
    apiClientSecret,
    organizationId,
    serviceName,
    serviceLogoUrl,
  };
}

// 共通のエラーレスポンス生成
export function createErrorResponse(message: string): APIResponse {
  return {
    content: [{
      type: "text",
      text: message,
    }],
  };
}

// 共通の成功レスポンス生成
export function createSuccessResponse(data: any): APIResponse {
  return {
    content: [{
      type: "text",
      text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
    }],
  };
}

// 共通のAPI呼び出し関数
export async function callOviceAPI<T = any>(
  config: OviceConfig,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `https://${config.apiDomain}/api/public/v1/${config.organizationId}/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'accept': 'application/json',
      'client_id': config.apiClientId,
      'client_secret': config.apiClientSecret,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// アプリドメインの取得
export function getAppDomain(apiDomain: string): string {
  if (/^api\.(rc\.)?ovice\.com$/.test(apiDomain)) {
    return apiDomain.replace(/^api\./, "app.");
  }
  return "app.ovice.com";
}

// ワークスペース検索のヘルパー関数
export async function findWorkspaceById(config: OviceConfig, workspaceId: string): Promise<Workspace | null> {
  const workspaces = await callOviceAPI<Workspace[]>(config, "organizations/workspaces");
  return workspaces.find((ws: Workspace) => ws.id === parseInt(workspaceId, 10)) || null;
}

// 環境変数不足エラーメッセージ
export const ENV_ERROR_MESSAGE = "Error: 必要な環境変数が設定されていません。環境変数 OVICE_CLIENT_ID, OVICE_CLIENT_SECRET, OVICE_ORGANIZATION_ID を設定してください。";