# oVice API Docs

## データ構造

- Organizations(組織)
  - Workspaces(ワークスペース)
    - Users(ユーザー)

## endpoints

ドメイン(環境変数で変更可能)：`https://api.ovice.com`
パス(固定値)：`/api/public/v1`

### Workspace Path

`GET: {domain}/ws/{workspace_domain}/`

### Organizations

`GET: /{organization_id}/organizations/workspaces`
  ```bash
  curl -X 'GET' \
  '{endpoint}/{organization_id}/organizations/workspaces' \
  -H 'accept: application/json' \
  -H 'client_id: {client_id}' \
  -H 'client_secret: {client_secret}'
  ```

`POST: /{organization_id}/organizations/notification`
  ```bash
  curl -X 'POST' \
  '{endpoint}/{organization_id}/organizations/notification' \
  -H 'accept: */*' \
  -H 'client_id: {client_id}' \
  -H 'client_secret: {client_secret}' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Hello, this is my first notification",
    "service_name": "This is demo",
    "service_logo_url": "https://assets-global.website-files.com/6304384d32da77e91a7afeed/6407da43523f291bf65b73fc_logo.svg"
  }'
  ```

### Workspaces

`GET: /{organization_id}/workspaces/workspace_users`
  ```bash
  curl -X 'GET' \
  '{endpoint}/{organization_id}/workspaces/workspace_users?workspace_id={workspace_id}' \
  -H 'accept: application/json' \
  -H 'client_id: {client_id}' \
  -H 'client_secret: {client_secret}'
  ```

`POST: /{organization_id}/workspaces/notification`
  ```bash
  curl -X 'POST' \
  '{endpoint}/{organization_id}/workspaces/notification' \
  -H 'accept: */*' \
  -H 'client_id: {client_id}' \
  -H 'client_secret: {client_secret}' \
  -H 'Content-Type: application/json' \
  -d '{
    "workspace_id": {workspace_id},
    "auth": [
      "admin",
      "member",
      "visitor",
      "guest"
    ],
    "message": "Hello, this is my first notification",
    "service_name": "This is demo",
    "service_logo_url": "https://assets-global.website-files.com/6304384d32da77e91a7afeed/6407da43523f291bf65b73fc_logo.svg"
  }'
  ```

### Group

`GET: /{organization_id}/organizations/groups`
  ```bash
  curl -X 'GET' \
  '{endpoint}/{organization_id}/organizations/groups' \
  -H 'accept: application/json' \
  -H 'client_id: {client_id}' \
  -H 'client_secret: {client_secret}'
  ```

`POST: /{organization_id}/groups/notification`
  ```bash
  curl -X 'POST' \
  '{endpoint}/{organization_id}/groups/notification' \
  -H 'accept: */*' \
  -H 'client_id: {client_id}' \
  -H 'client_secret: {client_secret}' \
  -H 'Content-Type: application/json' \
  -d '{
    "group_id": {group_id},
    "message": "Hello, this is my first notification",
    "service_name": "This is demo",
    "service_logo_url": "https://assets-global.website-files.com/6304384d32da77e91a7afeed/6407da43523f291bf65b73fc_logo.svg"
  }'
  ```