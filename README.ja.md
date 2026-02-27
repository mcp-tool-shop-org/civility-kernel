<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/civility-kernel/readme.png" alt="civility-kernel logo" width="360" />
</div>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/civility-kernel/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/civility-kernel/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License"></a>
  <a href="https://mcp-tool-shop-org.github.io/civility-kernel/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/civility-kernel"><img src="https://img.shields.io/npm/v/%40mcptoolshop%2Fcivility-kernel" alt="npm version"></a>
</p>

エージェントの動作を、単なる効率最大化だけでなく、**優先順位に基づいたものにする**ポリシーレイヤーです。

これは、以下の4つのことを確実に行います。

1) **Lint**（ポリシーのチェック）：問題のある設定や安全でない設定を、リリース前に検出します。
2) **Canonicalize**（正規化）：同じ入力に対して、常に同じ出力が得られるようにします。
3) **Diff + approve**（変更点の比較と承認）：人間が読みやすく、明示的な同意を得るための仕組みです。
4) **Rollback**（ロールバック）：自動的に以前のポリシーを保存し、上書きする前に復元できるようにします。

これは、「境界線を持つエージェント」を構築するための、安全性を確保するための基本的な仕組みです。

---

## 基本的な考え方

エージェントが候補となる計画を生成します。civility-kernelが次に何を行うかを決定します。

**生成 → フィルタ（必須条件）→ スコアリング（重み付け）→ 選択または質問**

必須条件は交渉不可能です。ソフトな優先順位がトレードオフをガイドします。不確実性が、「人に確認を求める」状況を引き起こすことがあります。

---

## インストール

```bash
npm i @mcptoolshop/civility-kernel
```

## 人間の監視ループ

ポリシーが何をしているかは常に確認できます。
エージェントは、変更を適用する前に、その内容を表示する必要があります。
ロールバックが可能です。
何も静かに更新されることはありません。

ポリシー契約のプレビュー：
```bash
npm run policy:explain
```

更新の提案（差分を表示し、承認を求めます）：
```bash
npm run policy:propose
```

現在のポリシーファイルを正規化（フォーマットのみの変更）：
```bash
npm run policy:canonicalize
```

### 自動ロールバック機能

変更を適用する際、`policy-check`は、古いポリシーを最初にバックアップできます。

```bash
npx tsx scripts/policy-check.ts policies/default.json --propose policies/proposed.json --write-prev policies/previous.json
```

## ポリシーファイル

推奨される構成：

- `policies/default.json`：アクティブなポリシー
- `policies/previous.json`：自動ロールバックの対象
- `policies/profiles/*.json`：名前付きプロファイル（作業用 / 簡単設定用 / 安全モード）

## CLIオプション（policy-check）

- `--explain`：人間が読めるポリシーの概要を表示します。
- `--propose <file>`：Lintを実行し、正規化された差分を表示し、承認を求めます。
- `--apply`：ポリシーファイルを正規化された形式で書き換えます。
- `--write-prev <file>`：上書きする前に、古い正規化されたポリシーをバックアップします。
- `--diff short|full`：`short`は主要な変更点のみを表示し、`full`はすべてを表示します。
- `--prev <file>`：決定論的なCI差分モード

## 公開API

- `lintPolicy(policy, { registry, scorers })`
- `canonicalizePolicy(policy, registry, scorers?)`
- `diffPolicy(a, b, { mode })`（short vs full）
- `explainPolicy(policy, registry, { format })`

## CI

CIの実行内容：
- 例
- テスト
- ビルド
- `policy-check`（`policies/default.json`と`policies/previous.json`を比較）

これにより、問題のあるポリシーや誤解を招く差分がリリースされるのを防ぎます。

## 開発

```bash
npm test
npm run build
npm run example:basic
npm run policy:check
```

## セキュリティとデータ範囲

Civility Kernelは、**純粋なライブラリ**です。ネットワークリクエスト、テレメトリ、副作用はありません。

- **アクセスするデータ:** ローカルファイルシステムからJSONポリシーファイルを読み込みます。ポリシー文書を検証、正規化、差分化します。すべての操作は決定論的です。
- **アクセスしないデータ:** ネットワークリクエストはありません。テレメトリはありません。認証情報の保存もありません。このカーネルはポリシーの制約を評価しますが、エージェントの動作を監視したり、ログに記録したりすることはありません。
- **必要な権限:** ポリシーJSONファイルのファイルシステム読み取り権限。明示的に`--apply`オプションを指定した場合にのみ書き込み権限が必要です。

脆弱性報告については、[SECURITY.md](SECURITY.md)を参照してください。

---

## スコアカード

| カテゴリ | スコア |
|----------|-------|
| セキュリティ | 10/10 |
| エラー処理 | 10/10 |
| オペレーター向けドキュメント | 10/10 |
| リリース時の品質 | 10/10 |
| 識別 | 10/10 |
| **Overall** | **50/50** |

---

## ライセンス

MIT（LICENSEを参照）

---

構築者：<a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
