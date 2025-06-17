# AppleScript MCP Server

AppleScriptをMCP (Model Context Protocol)経由で実行できるサーバーです。AIアシスタントがmacOSの自動化タスクを安全に実行できるようにします。

## 機能

- **スクリプトレジストリ**: 再利用可能なAppleScriptをJSON形式で管理
- **テンプレート機能**: `{{placeholder}}` 構文を使用した動的パラメータ
- **セキュリティ検証**: 実行前のスクリプト検証
- **6つのMCPツール**:
  - `run_applescript` - 登録済みスクリプトを実行
  - `run_raw_applescript` - 生のAppleScriptコードを直接実行
  - `list_scripts` - 登録済みスクリプト一覧を表示
  - `get_script_info` - 特定のスクリプトの詳細を取得
  - `add_script` - 新しいスクリプトを登録
  - `remove_script` - スクリプトを削除

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
        "message": "Hello from AppleScript!"
      }
    }
  }
}
```

### 生のAppleScriptの実行

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_raw_applescript",
    "arguments": {
      "script": "display dialog \"Hello, World!\""
    }
  }
}
```

## セキュリティ

- すべてのスクリプトは実行前に検証されます
- 危険なコマンド（`do shell script`、`System Events`など）はブロックされます
- スクリプトは`scripts-registry.json`に永続化されます

## ライセンス

MITライセンス

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容について議論してください。