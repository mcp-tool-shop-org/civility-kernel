<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.md">English</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

一个策略层，它使得智能体的行为**受偏好驱动**，而不是单纯地追求效率最大化。

它可靠地完成以下四项任务：

1) **检查**策略（在策略发布之前，发现并修复潜在的错误或不安全配置）。
2) **规范化**策略（将等效的输入转换为相同的输出）。
3) **比较差异并批准**更改（以人类可读的方式显示更改，并进行明确的授权）。
4) **自动回滚**（在覆盖现有策略之前，先保存之前的策略）。

这是确保安全性的机制，它允许您构建具有“边界”的智能体。

---

## 核心思想

您的智能体生成候选方案。 civility-kernel 决定下一步该做什么：

**生成 → 过滤（硬性约束）→ 评分（权重）→ 选择 或 询问**

硬性约束是不可谈判的。 软性偏好用于权衡取舍。 不确定性可能会导致“询问人类”。

---

## 安装

```bash
npm i @mcptoolshop/civility-kernel
```

## 人类治理循环

您可以始终查看您的策略所执行的操作。
智能体必须在应用更改之前显示更改。
您可以回滚。
没有任何内容会在您不知情的情况下进行更新。

预览策略合约：
```bash
npm run policy:explain
```

提出更新（显示差异，提示批准）：
```bash
npm run policy:propose
```

规范化当前策略文件（仅进行格式化）：
```bash
npm run policy:canonicalize
```

### 自动回滚安全机制

在应用更改时，`policy-check` 可以先备份旧策略：

```bash
npx tsx scripts/policy-check.ts policies/default.json --propose policies/proposed.json --write-prev policies/previous.json
```

## 策略文件

推荐的约定：

- `policies/default.json` — 正在使用的策略
- `policies/previous.json` — 自动回滚的目标
- `policies/profiles/*.json` — 命名配置文件（工作模式 / 低摩擦模式 / 安全模式）

## CLI 选项 (policy-check)

- `--explain` — 打印人类可读的策略摘要
- `--propose <file>` — 检查 + 显示规范化差异 + 提示批准
- `--apply` — 以规范形式重写策略文件
- `--write-prev <file>` — 在覆盖之前备份旧的规范化策略
- `--diff short|full` — `short` 显示“概要”更改；`full` 显示所有更改
- `--prev <file>` — 确定性的 CI 差异模式

## 公共 API

- `lintPolicy(policy, { registry, scorers })`
- `canonicalizePolicy(policy, registry, scorers?)`
- `diffPolicy(a, b, { mode })` (short vs full)
- `explainPolicy(policy, registry, { format })`

## CI

CI 运行：
- 示例
- 测试
- 构建
- `policy-check` 对比固定文件 (`policies/default.json` vs `policies/previous.json`)

这可以防止发布有问题的策略或误导性的差异。

## 开发

```bash
npm test
npm run build
npm run example:basic
npm run policy:check
```

## 安全与数据范围

Civility Kernel 是一个**纯粹的库**——没有网络请求，没有遥测，没有副作用。

- **访问的数据：** 从本地文件系统读取 JSON 策略文件。 在进程中验证、规范化和比较策略文档。 所有操作都是确定性的。
- **未访问的数据：** 没有网络请求。 没有遥测。 没有凭据存储。 核心评估策略约束，但不观察或记录智能体操作。
- **所需的权限：** 访问策略 JSON 文件的文件系统读权限。 仅在明确请求时才进行写入（通过 `--apply`）。

请参阅 [SECURITY.md](SECURITY.md)，了解漏洞报告。

---

## 评分卡

| 类别 | 评分 |
|----------|-------|
| 安全性 | 10/10 |
| 错误处理 | 10/10 |
| 操作员文档 | 10/10 |
| 发布质量 | 10/10 |
| 身份验证 | 10/10 |
| **Overall** | **50/50** |

---

## 许可证

MIT (参见 LICENSE)

---

由 <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a> 构建。
