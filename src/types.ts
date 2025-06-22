// 型定義

export interface OviceConfig {
  apiDomain: string;
  apiClientId: string;
  apiClientSecret: string;
  organizationId: string;
  serviceName: string;
  serviceLogoUrl: string;
}

export interface Workspace {
  id: number;
  name: string;
  domain?: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface NotificationRequest {
  message: string;
  service_name: string;
  service_logo_url: string;
}

export interface WorkspaceNotificationRequest extends NotificationRequest {
  workspace_id: string;
  auth: string[];
}

export interface GroupNotificationRequest extends NotificationRequest {
  group_id: string;
}

export interface APIResponse<T = any> {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

export type AuthLevel = "admin" | "member" | "visitor" | "guest";