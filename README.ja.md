# AppleScript MCP Server

[English](README.md)

事前登録されたAppleScriptをMCP (Model Context Protocol)経由で実行できるサーバーです。AIアシスタントがmacOSの自動化タスクを安全に実行できるようにします。スクリプト管理はMCP外で行います。

## 機能

- **スクリプトレジストリ**: 再利用可能なAppleScriptをJSON形式で管理
- **テンプレート機能**: `{{placeholder}}` 構文を使用した動的パラメータ
- **セキュリティ検証**: 実行前のスクリプト検証
- **3つのMCPツール**:
  - `run_applescript` - 登録済みスクリプトを実行
  - `list_scripts` - 登録済みスクリプト一覧を表示
  - `get_script_info` - 特定のスクリプトの詳細を取得
- **独立したスクリプト管理**: スクリプトの追加・削除は`manage-scripts.js`ユーティリティで行い、MCPを介しません

## 必要要件

- macOS (AppleScriptが必要)
- Node.js 16以上
- npm または yarn

## インストール

```bash
# 依存関係をインストール
npm install

# TypeScriptをビルド
npm run build
```

## 使用方法

### 開発環境での実行

```bash
npm run dev
```

### プロダクション環境での実行

```bash
npm start
```

### スクリプト管理

```bash
# JSONファイルからスクリプトを追加
node manage-scripts.js add my-script.json

# スクリプトを削除
node manage-scripts.js remove script_name

# 全スクリプトを一覧表示
node manage-scripts.js list

# スクリプト詳細を表示
node manage-scripts.js info script_name
```

### テストの実行

```bash
# すべてのテストを実行
./tests/test-batch.sh

# 個別のテストを実行
./tests/test-individual.sh
```

## プロジェクト構成

```
.
├── src/                    # ソースコード
│   ├── server.ts          # MCPサーバー実装
│   ├── applescript.ts     # AppleScript実行エンジン
│   ├── registry.ts        # スクリプトレジストリ管理
│   └── types.ts           # TypeScript型定義
├── dist/                   # コンパイル済みJavaScript
├── tests/                  # テストファイル
│   ├── test-batch.sh      # バッチテスト実行
│   ├── test-individual.sh # 個別テスト実行
│   └── test-messages.jsonl # テストメッセージ
├── manage-scripts.js       # スクリプト管理ユーティリティ
├── scripts-registry.json   # 登録済みスクリプト
├── package.json           # npm設定
├── tsconfig.json          # TypeScript設定
└── CLAUDE.md              # AI開発ガイドライン
```

## スクリプトの例

### 登録済みスクリプトの実行

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_applescript",
    "arguments": {
      "script_name": "show_notification",
      "parameters": {
        "message": "AppleScriptからこんにちは！"
      }
    }
  }
}
```

### 新しいスクリプトの追加

スクリプト定義のJSONファイルを作成:

```json
{
  "name": "my_script",
  "script": "display dialog \"{{message}}\"",
  "description": "カスタムメッセージでダイアログを表示",
  "args": [
    {
      "name": "message",
      "type": "string",
      "description": "表示するメッセージ",
      "required": true
    }
  ],
  "usage": "my_script(message=\"こんにちは\")",
  "category": "ui"
}
```

次に追加:

```bash
node manage-scripts.js add my-script.json
```

## セキュリティ

- すべてのスクリプトは実行前に検証されます
- 危険なコマンド（`do shell script`、`System Events`など）はブロックされます
- スクリプトは`scripts-registry.json`に永続化されます

## プライベートスクリプト

個人用のAppleScriptを非公開にする方法：

1. カスタムスクリプトは`scripts-registry.json`に保存されます（gitignore対象）
2. リポジトリには`scripts-registry.sample.json`のサンプルスクリプトが含まれています
3. 初回起動時、サンプルレジストリがコピーされてプライベートレジストリが作成されます
4. プライベートスクリプトはリポジトリにコミットされません

## ライセンス

MITライセンス

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容について議論してください。