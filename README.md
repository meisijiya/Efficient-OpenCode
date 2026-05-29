# Efficient OpenCode 🚀

> OhMyOpenCode 高效配置方案 — DeepSeek V4 × MiniMax M2.7 / MiMo V2.5 × MiniMax M2.7 双引擎效率革命

本仓库包含两套经过优化的 OhMyOpenCode 配置，旨在**最大化缓存命中率、降低 token 消耗、提升多智能体协作效率**。

## 📁 配置文件清单

### configs/ 目录下的文件

| 文件名 | 用途 | 是否必需 |
|--------|------|----------|
| `opencode.json` | OpenCode 主配置（MiMo 版本，默认） | ✅ 是 |
| `oh-my-openagent.json` | OhMyOpenAgent 多智能体配置（MiMo 版本，默认） | ✅ 是 |
| `opencode-deepseek.json` | OpenCode 主配置（DeepSeek 版本） | 按需选择 |
| `oh-my-openagent-deepseek.json` | OhMyOpenAgent 多智能体配置（DeepSeek 版本） | 按需选择 |
| `opencode-mimo.json` | OpenCode 主配置（MiMo 版本，备份） | ❌ 备份 |
| `oh-my-openagent-mimo.json` | OhMyOpenAgent 多智能体配置（MiMo 版本，备份） | ❌ 备份 |
| `opencode-minimax-easy-vision.jsonc` | EasyVision 图片拦截配置 | ✅ 是 |

### 安装后需要放在 `~/.config/opencode/` 的文件

**选择方案 A：MiMo + MiniMax（默认）**

```bash
~/.config/opencode/
├── opencode.json                   # ← 从 configs/opencode.json 复制
├── oh-my-openagent.json            # ← 从 configs/oh-my-openagent.json 复制
└── opencode-minimax-easy-vision.jsonc  # ← 从 configs/opencode-minimax-easy-vision.jsonc 复制
```

**选择方案 B：DeepSeek + MiniMax**

```bash
~/.config/opencode/
├── opencode.json                   # ← 从 configs/opencode-deepseek.json 复制（重命名）
├── oh-my-openagent.json            # ← 从 configs/oh-my-openagent-deepseek.json 复制（重命名）
└── opencode-minimax-easy-vision.jsonc  # ← 从 configs/opencode-minimax-easy-vision.jsonc 复制
```

### ⚠️ 重要说明

1. **目标文件名必须是 `opencode.json` 和 `oh-my-openagent.json`**，无论选择哪个方案
2. **`opencode-minimax-easy-vision.jsonc` 两个方案通用**，必须复制
3. **备份文件（`opencode-mimo.json`、`oh-my-openagent-mimo.json`）不需要复制**，仅供参考

## ⚡ 快速开始

### 方式一：一键安装（推荐）

```bash
git clone git@github.com:meisijiya/Efficient-OpenCode.git
cd Efficient-OpenCode
chmod +x install.sh
./install.sh
```

### 方式二：手动安装

```bash
# 1. 克隆仓库
git clone git@github.com:meisijiya/Efficient-OpenCode.git

# 2. 复制配置文件到 OpenCode 配置目录（选择 MiMo 或 DeepSeek 版本）

# MiMo 版本（默认）
cp configs/opencode.json ~/.config/opencode/opencode.json
cp configs/oh-my-openagent.json ~/.config/opencode/oh-my-openagent.json

# DeepSeek 版本
cp configs/opencode-deepseek.json ~/.config/opencode/opencode.json
cp configs/oh-my-openagent-deepseek.json ~/.config/opencode/oh-my-openagent.json

# 3. 复制 EasyVision 配置
cp configs/opencode-minimax-easy-vision.jsonc ~/.config/opencode/

# 4. 重启 OpenCode 生效
```

## 📋 两套配置说明

本仓库提供两套配置，适用于不同的模型组合：

### 1. MiMo + MiniMax（默认）

| 引擎 | 模型 | 职责 |
|------|------|------|
| 推理引擎 | MiMo V2.5 Pro | 架构决策、复杂推理、规划 |
| 执行引擎 | MiniMax M2.7 | 代码执行、多模态生成、创意突破 |
| 低成本引擎 | MiMo V2.5 | 代码搜索、文档查询、简单任务 |

**配置文件**：
- `opencode.json`
- `oh-my-openagent.json`

### 2. DeepSeek + MiniMax

| 引擎 | 模型 | 职责 |
|------|------|------|
| 推理引擎 | DeepSeek V4 Pro | 架构决策、复杂推理、规划 |
| 执行引擎 | MiniMax M2.7 | 代码执行、多模态生成、创意突破 |
| 低成本引擎 | DeepSeek V4 Flash | 代码搜索、文档查询、简单任务 |

**配置文件**：
- `opencode-deepseek.json`
- `oh-my-openagent-deepseek.json`

## 🔌 连接方式

通过 OpenCode 的 `/connect` 命令连接到 DeepSeek 和 MiniMax 服务，无需在配置文件中手动配置 provider。

## 📂 配置级别说明

### 默认：用户级配置（推荐）

本配置默认使用**用户级配置**，配置文件位于 `~/.config/opencode/` 目录下，对所有项目生效。

```
~/.config/opencode/
├── opencode.json                   # OpenCode 主配置
├── oh-my-openagent.json            # OhMyOpenAgent 多智能体配置
└── opencode-minimax-easy-vision.jsonc  # EasyVision 图片拦截配置
```

### 进阶：项目级配置（可选）

如果需要为不同项目使用不同配置（比如一个项目用 MiMo，另一个用 DeepSeek），可以在项目根目录下创建 `.opencode/` 目录：

```bash
# 在项目根目录下创建 .opencode 目录
mkdir .opencode

# 复制配置文件到项目级目录
cp configs/opencode.json .opencode/opencode.json
cp configs/oh-my-openagent.json .opencode/oh-my-openagent.json
cp configs/opencode-minimax-easy-vision.jsonc .opencode/
```

**⚠️ 注意事项**：
- 项目级配置会**覆盖**用户级配置
- 项目级配置只对当前项目生效
- 如果没有特殊需求，建议使用默认的用户级配置

## 🎯 本配置的核心优化

### 1. Compaction 上下文压缩

```json
"compaction": {
  "auto": true,
  "prune": true,
  "tail_turns": 3,
  "preserve_recent_tokens": 8000,
  "reserved": 16000
}
```

**效果**：长会话中自动压缩历史上下文，避免 token 无限膨胀。

### 2. Sisyphus 强制委托纪律

本配置在 Sisyphus 的 `prompt_append` 中加入了**强制委托规则**：

- ❌ 读文件/搜索代码 → 必须用 explore agent（Flash）
- ❌ 查文档/找库用法 → 必须用 librarian agent（Flash）
- ❌ 写代码/改代码 → 必须用 task(category=...) 委托
- ❌ 简单修复/typo → 必须用 task(category="quick") 委托

**效果**：Sisyphus（Pro）只做编排决策，具体活让 Flash 和 M2.7 干，成本直降 50%+。

### 3. Karpathy 四原则（全局执行宪法）

借鉴 [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) 项目，引入 Andrej Karpathy 关于 LLM 编程陷阱的四大原则：

| 原则 | 解决的问题 | 具体规则 |
|------|-----------|---------|
| **Think Before Coding** | 错误假设、隐藏困惑 | 明确声明假设、呈现多种解释、困惑时停下来 |
| **Simplicity First** | 过度复杂化 | 不添加未被要求的功能、不创建单次使用的抽象 |
| **Surgical Changes** | 范围蔓延 | 只修改必须修改的代码、匹配现有风格 |
| **Goal-Driven Execution** | 模糊执行 | 将任务转化为可验证的目标、循环直到验证通过 |

**效果**：减少不必要的 diff，减少因过度复杂化导致的重写，在实现前提出澄清问题。

### 4. 双引擎架构

| 引擎 | 模型 | 职责 |
|------|------|------|
| 推理引擎 | DeepSeek V4 Pro | 架构决策、复杂推理、规划 |
| 执行引擎 | MiniMax M2.7 | 代码执行、多模态生成、创意突破 |
| 低成本引擎 | DeepSeek V4 Flash | 代码搜索、文档查询、简单任务 |

## 📚 文档说明

- **[OhMyOpenCode 使用指南](docs/ohmyopencode-guide.md)**：完整的安装、配置和使用教程
- **[Skill 必装合集](docs/ohmyopencode的skill必装合集.md)**：28 个 Skill 的分级推荐与场景化实战指南

## 🔧 配置说明

### opencode.json

OpenCode 主配置，包含：
- 插件注册（oh-my-openagent、easy-vision、superpowers）
- **Compaction 上下文压缩配置**（本仓库核心优化）
- **MCP 服务配置**（EasyVision 需要）

#### API 信息填写

**必填**：`MINIMAX_API_KEY`

```json
{
  "mcp": {
    "MiniMax": {
      "type": "local",
      "command": ["uvx", "minimax-coding-plan-mcp", "-y"],
      "environment": {
        "MINIMAX_API_KEY": "你的MiniMax API Key",
        "MINIMAX_API_HOST": "https://api.minimaxi.com"
      },
      "enabled": true
    }
  }
}
```

**获取 API Key**：
1. 访问 [MiniMax 开放平台](https://platform.minimaxi.com/)
2. 注册/登录后，进入「API Keys」页面
3. 创建新的 API Key
4. 将获取的 Key 填入 `MINIMAX_API_KEY` 字段

**API Host 说明**：
- `https://api.minimaxi.com`：国内版（默认）
- `https://api.minimaxi.com`：国际版（如需）

#### 其他配置

- `compaction`：上下文压缩配置（推荐保持默认）
- `plugin`：插件列表（不建议修改）

### oh-my-openagent.json

OhMyOpenAgent 多智能体配置，包含：
- 11 个智能体定义（Sisyphus、Atlas、Oracle 等）
- 14 种任务分类路由
- **Sisyphus 强制委托规则**（本仓库核心优化）

## 🔧 MiniMax CLI 使用说明

本配置使用 **MiniMax CLI**（mmx-cli）进行多模态生成、视觉分析和资料检索，无需额外配置 MCP 服务。

### 安装 MiniMax CLI

```bash
# 安装 mmx-cli（需 Node.js ≥ 18）
npm install -g mmx-cli

# 登录 API Key（需先在 MiniMax 开放平台获取）
mmx-cli login
```

### 主要功能

- **多模态生成**：视频（Hailuo）、语音（Speech）、音乐（Music）、图片（Image）
- **视觉分析**：understand_image（图像理解和描述）
- **资料检索**：web_search（上网搜索）

### 优势

- ✅ 官方推荐，无需额外编写 MCP Server
- ✅ 两行代码即可安装和调用
- ✅ 集成所有 MiniMax 全模态能力

## 💡 最佳实践

### 1. 会话管理

- 短会话优先：完成一个任务就开新会话
- 用 `/handoff` 在会话间传递精炼上下文
- 避免在一个超长会话里死磕

### 2. 成本控制

- 能用 Flash 的绝不用 Pro
- 能并行的绝不串行
- 让 Sisyphus 只做编排，不写代码

### 3. 缓存优化

- `prompt_append` 创造稳定前缀（已配置）
- Compaction 自动压缩长会话（已配置）
- 避免频繁修改系统提示

## ⚠️ 注意事项

1. **本配置针对 DeepSeek v4 + MiniMax M2.7 双引擎优化**，如果你使用其他模型组合，需要调整 `oh-my-openagent.json` 中的模型配置。

2. **OpenCode 无法实现 DeepSeek-Reasonix 的 99.82% 缓存命中率**，因为架构不同（OpenCode 每轮重建上下文，Reasonix 使用 append-only 日志）。但本配置已经是 OpenCode 生态下的最优解。

3. **DeepSeek V4 Pro 是高级推理模型**，支持复杂推理任务，配合 MiniMax M2.7 的多模态能力实现最优组合。

4. **重启 OpenCode 后配置才生效**。

## 📖 参考资源

- [OhMyOpenAgent 官方仓库](https://github.com/code-yeongyu/oh-my-openagent)
- [OpenCode 官方文档](https://opencode.ai/docs/)
- [DeepSeek 平台](https://platform.deepseek.com/)
- [DeepSeek-Reasonix 缓存优化](https://github.com/esengine/DeepSeek-Reasonix)
- [MiniMax Skills 仓库](https://github.com/MiniMax-AI/skills)

## 📝 更新日志

### 2026-05-27
- 初始版本
- 添加 compaction 上下文压缩配置
- 强化 Sisyphus 委托纪律
- 整理 Skill 合集文档
- 切换到 DeepSeek V4 双引擎（Pro + Flash）
- 添加 EasyVision 图片拦截配置

---

**作者**：meisijiya（老江湖）

**许可证**：MIT
