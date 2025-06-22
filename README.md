# Local ovice MCP Test

## このリポジトリについて

ローカル環境でMCPサーバーを構築する個人的な検証のためのリポジトリです（動作保証いたしかねます）

ovice API と連携し、ワークスペース、グループ、ユーザー管理や通知機能を提供するMCPサーバーです。

## 機能概要

このMCPサーバーは以下の機能を提供します：

- **ワークスペース管理**: 組織内のワークスペース一覧取得、ユーザー一覧、アクセスURL生成
- **グループ管理**: 組織内のグループ一覧取得、メンバー管理
- **通知機能**: 組織、ワークスペース、グループへの通知送信
- **情報取得**: スペース名の取得など

## 初期設定

### Claude Desktop

設定ファイルを編集してMCPサーバーを登録します。

**MacOS**: `~/Library/Application\ Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "local-ovice-mcp-test": {
      "command": "npx",
      "args": ["github:cti1650/local-ovice-mcp-test"],
      "env": {
        "OVICE_DOMAIN": "api.ovice.com",
        "OVICE_CLIENT_ID": "your-client-id",
        "OVICE_CLIENT_SECRET": "your-client-secret",
        "OVICE_ORGANIZATION_ID": "your-organization-id",
        "OVICE_SERVICE_NAME": "Your Service Name",
        "OVICE_SERVICE_LOGO_URL": "https://your-logo-url.com/logo.svg"
      }
    }
  }
}
```

### 環境変数

| 変数名 | 必須 | デフォルト値 | 説明 |
|--------|------|-------------|------|
| `OVICE_CLIENT_ID` | ✓ | - | oVice APIクライアントID |
| `OVICE_CLIENT_SECRET` | ✓ | - | oVice APIクライアントシークレット |
| `OVICE_ORGANIZATION_ID` | ✓ | - | 組織ID |
| `OVICE_DOMAIN` | - | "api.ovice.com" | oVice APIドメイン（本番環境以外では変更が必要） |
| `OVICE_SERVICE_NAME` | - | "This is demo" | 通知に表示されるサービス名 |
| `OVICE_SERVICE_LOGO_URL` | - | oViceロゴURL | 通知に表示されるサービスロゴURL |

## 利用可能なツール

### ワークスペース関連

#### `get_organization_workspaces`
- **説明**: 組織のワークスペース一覧を取得
- **パラメータ**: なし
- **戻り値**: ワークスペース一覧（JSON形式）

#### `get_workspace_users`
- **説明**: 指定したワークスペースのユーザー一覧を取得
- **パラメータ**: 
  - `workspaceId` (string): ワークスペースID
- **戻り値**: ユーザー一覧（JSON形式）

#### `get_space_name_by_id`
- **説明**: スペースIDからスペース名を取得
- **パラメータ**: 
  - `spaceId` (string): スペースID
- **戻り値**: スペース名

#### `get_workspace_access_path`
- **説明**: ワークスペースにアクセスするためのURLを生成
- **パラメータ**: 
  - `workspaceId` (string): ワークスペースID
- **戻り値**: アクセスURL (`https://{appDomain}/ws/{workspaceDomain}/`)
- **備考**: APIからワークスペース情報を取得し、ドメインベースのURLを生成

### グループ関連

#### `get_organization_groups`
- **説明**: 組織のグループ一覧を取得
- **パラメータ**: なし
- **戻り値**: グループ一覧（JSON形式）

#### `get_group_members`
- **説明**: 指定したグループのメンバー一覧を取得
- **パラメータ**: 
  - `groupId` (string): グループID
- **戻り値**: メンバー一覧（JSON形式）

### 通知機能

#### `send_organization_notification`
- **説明**: 組織全体に通知を送信
- **パラメータ**: 
  - `message` (string): 通知メッセージ
  - `serviceName` (string, optional): サービス名
  - `serviceLogoUrl` (string, optional): サービスロゴURL
- **戻り値**: 送信結果（JSON形式）

#### `send_workspace_notification`
- **説明**: 特定のワークスペースに通知を送信
- **パラメータ**: 
  - `workspaceId` (string): ワークスペースID
  - `auth` (array): 通知対象の権限レベル ("admin", "member", "visitor", "guest")
  - `message` (string): 通知メッセージ
  - `serviceName` (string, optional): サービス名
  - `serviceLogoUrl` (string, optional): サービスロゴURL
- **戻り値**: 送信結果（JSON形式）

#### `send_group_notification`
- **説明**: 特定のグループに通知を送信
- **パラメータ**: 
  - `groupId` (string): グループID
  - `message` (string): 通知メッセージ
  - `serviceName` (string, optional): サービス名
  - `serviceLogoUrl` (string, optional): サービスロゴURL
- **戻り値**: 送信結果（JSON形式）

## API仕様

このMCPサーバーは oVice Public API v1 を使用します：
- **エンドポイント**: `https://{OVICE_DOMAIN}/api/public/v1/`
- **認証**: クライアントIDとクライアントシークレットによるヘッダー認証

## エラーハンドリング

- 環境変数が不足している場合は適切なエラーメッセージを表示
- API呼び出し失敗時はHTTPステータスコードとエラー詳細を返却
- 指定されたリソース（ワークスペース、グループなど）が見つからない場合は専用のエラーメッセージを表示

## 参考サイト

- [簡易な自作MCPサーバーをお試しで実装する方法](https://zenn.dev/smartround_dev/articles/02af1058e9f80f)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
