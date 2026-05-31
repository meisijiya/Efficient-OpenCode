# Efficient OpenCode 🚀

> 一键搭建高效 OpenCode + OhMyOpenAgent 多智能体编程环境

本仓库提供 **`eoc.js` 配置切换器**——一键搭建、随时切换、自动备份的多引擎 OhMyOpenAgent 配置管理工具。支持 DeepSeek V4 / MiMo V2.5 / MiniMax M2.7 三引擎方案，集成 EasyVision 图片拦截、browser-automation 浏览器自动化及 19 个必装 Skill。

## ⚡ 快速开始

### 方式一：eoc.js 智能管理（🎉 推荐）

```bash
git clone git@github.com:meisijiya/Efficient-OpenCode.git
cd Efficient-OpenCode

# 一键安装（交互式选择引擎+Prompt模式）
./eoc

# 或跳过交互，直接指定方案
./eoc install -d        # DeepSeek + MiniMax（追加模式）
./eoc install -m        # MiMo + MiniMax（追加模式）
./eoc install -x        # 纯 MiniMax M2.7（追加模式）
./eoc install -t        # 自定义模板（手动输入模型 ID）
./eoc install -2        # 自定义模板 双引擎（Pro/Fast 自定义）
./eoc install -s        # 🆕 SoloFast 模板（只输入 Fast 模型，其余 MiniMax）
./eoc install -d -p     # DeepSeek + MiniMax（覆盖模式）
```

> ⚠️ **安装前必须**：在 OpenCode 中通过 `/connect` 连接对应模型。
> 常用模型 ID 见下方 [预设模型 ID 速查](#-预设模型-id-速查) 表格。

**`eoc` 命令一览**：

| 命令 | 功能 |
|:---|:---|
| `./eoc` | 智能入口——首次自动引导安装，已安装则进入切换菜单 |
| `./eoc install` | 安装/重装配置到 `~/.config/opencode/` |
| `./eoc switch` | 🎮 方向键菜单切换配置方案（8选1，支持详情/回滚） |
| `./eoc status` | 📊 查看当前激活的配置方案和模型分配详情 |
| `./eoc rollback` | ⏪ 回滚到历史备份（自动保留最近10份） |
| `./eoc skills` | 📦 一键安装 19 个推荐 Skill（自动跳过已装） |
| `./eoc help` | ❓ 显示帮助信息 |

**核心特性**：
- 🎮 方向键 ↑↓ 交互菜单 + 命令行参数双模式
- 🔍 模型 ID 指纹自动识别当前方案
- 💾 自动备份（时间戳命名，保留 10 个，自动去重）
- 📦 零 npm 依赖——纯 Node.js 内置模块
- 🧠 安装 vs 切换分离——依赖只装一次，后续秒切
- 🎯 一键安装 19 个推荐 Skill（MiniMax + browser-automation + Superpowers）

### 方式二：传统 install.sh（保留兼容）

```bash
git clone git@github.com:meisijiya/Efficient-OpenCode.git
cd Efficient-OpenCode
chmod +x install.sh

# 交互式安装
./install.sh

# 跳过交互
./install.sh --mimo      # MiMo + MiniMax（默认）
./install.sh --deepseek  # DeepSeek + MiniMax
./install.sh --minimax   # 纯 MiniMax M2.7
./install.sh --template  # 自定义模板
./install.sh --solofast  # 🆕 SoloFast 模板
```

### 方式三：手动安装

```bash
# 1. 克隆仓库
git clone git@github.com:meisijiya/Efficient-OpenCode.git

# 2. 复制配置文件

# MiMo 版本
cp configs/opencode.json ~/.config/opencode/opencode.json
cp configs/oh-my-openagent-mimo.json ~/.config/opencode/oh-my-openagent.json

# DeepSeek 版本
cp configs/opencode.json ~/.config/opencode/opencode.json
cp configs/oh-my-openagent-deepseek.json ~/.config/opencode/oh-my-openagent.json

# 3. 复制 EasyVision 配置
cp configs/opencode-minimax-easy-vision.jsonc ~/.config/opencode/

# 4. 安装 EasyVision 插件（官方安装方式）
opencode plugin opencode-minimax-easy-vision --global

# 5. 重启 OpenCode 生效
```

### 方式四：项目级配置（可选）

```bash
mkdir .opencode
cp configs/opencode.json .opencode/opencode.json
cp configs/oh-my-openagent.json .opencode/oh-my-openagent.json
cp configs/opencode-minimax-easy-vision.jsonc .opencode/
```

**⚠️ 注意**：项目级配置会覆盖用户级配置，只对当前项目生效。

## 📁 配置文件清单

### configs/ 目录下的文件

| 文件名 | 用途 | Prompt 模式 |
|--------|------|-------------|
| `opencode.json` | OpenCode 主配置（所有方案通用） | — |
| `oh-my-openagent-mimo.json` | MiMo 版本 | `append` |
| `oh-my-openagent-deepseek.json` | DeepSeek 版本 | `append` |
| `oh-my-openagent-minimax.json` | 纯 MiniMax M2.7 | `append` |
| `oh-my-openagent-template.json` | 模板（手动输入模型 ID） | `append` |
| `oh-my-openagent-mimo-prompt.json` | MiMo 版本 | `prompt` 覆盖 |
| `oh-my-openagent-deepseek-prompt.json` | DeepSeek 版本 | `prompt` 覆盖 |
| `oh-my-openagent-minimax-prompt.json` | 纯 MiniMax M2.7 | `prompt` 覆盖 |
| `oh-my-openagent-template-prompt.json` | 模板 4 引擎（手动输入模型 ID） | `prompt` 覆盖 |
| `oh-my-openagent-template2.json` | 🆕 模板 双引擎（仅 Pro/Fast 自定义） | `append` |
| `oh-my-openagent-template2-prompt.json` | 🆕 模板 双引擎（仅 Pro/Fast 自定义） | `prompt` 覆盖 |
| `ohmyopencode-solofast.json` | 🆕 SoloFast 模板（仅 Fast 自定义，其余 MiniMax） | `append` |
| `opencode-minimax-easy-vision.jsonc` | EasyVision 图片拦截配置 | — |

### 🔌 预设模型 ID 速查

> ⚠️ **重要**：使用前请在 OpenCode 中通过 `/connect` 命令连接对应模型

| 方案 | 层级 | 模型 ID |
|:---|:---|:---|
| **DeepSeek + MiniMax** | 推理 (Pro) | `opencode-go/deepseek-v4-pro` |
| | 轻量 (Fast) | `opencode-go/deepseek-v4-flash` |
| | 执行 (Exec) | `minimax-cn-coding-plan/MiniMax-M2.7` |
| **MiMo + MiniMax** | 推理 (Pro) | `xiaomi-token-plan-cn/mimo-v2.5-pro` |
| | 轻量 (Fast) | `xiaomi-token-plan-cn/mimo-v2.5` |
| | 执行 (Exec) | `minimax-cn-coding-plan/MiniMax-M2.7` |
| **纯 MiniMax** | 全部 | `minimax-cn-coding-plan/MiniMax-M2.7` |
| **所有方案** | 视觉 (Looker) | `opencode-go/mimo-v2.5` |

> 📝 **Template2 方案**：仅需输入 Pro/Fast 两个模型 ID，Exec 已硬编码为 MiniMax M2.7
> 📝 **SoloFast 方案**：仅需输入 Fast 一个模型 ID，其余全部硬编码为 MiniMax M2.7

### 🔀 Prompt 注入模式说明

OhMyOpenAgent 支持两种自定义注入方式：

| 模式 | 字段 | 效果 | 适用场景 |
|------|------|------|---------|
| **追加模式** | `prompt_append` | 你的内容追加在官方系统提示**之后** | 新手、希望保留官方完整行为的场景 |
| **覆盖模式** | `prompt` | 你的内容**完全替换**官方系统提示 | 进阶、需要自定义全部 Agent 行为的场景 |

> ⚠️ 覆盖模式需要自己在 prompt 中定义完整身份和全部行为规则。当前 `-prompt.json` 变体已包含完整的 `<agent-identity>` 身份声明、角色描述和边界约束。

### 🏗️ 自定义模板（方案 4）

`oh-my-openagent-template.json` 使用三层占位符，安装时由你输入实际模型 ID：

| 占位符 | 用途 | 覆盖的 Agent |
|--------|------|-------------|
| `__PRO_MODEL__` | 推理型模型 | Sisyphus、Oracle、Prometheus、Hephaestus、Metis |
| `__FAST_MODEL__` | 轻量模型 | Explore、Librarian、Sisyphus-Junior |
| `__EXEC_MODEL__` | 执行型模型 | Atlas、Momus、Multimodal-Looker |
| `__FALLBACK_MODEL__` | 备选模型 | 所有 Agent 的 fallback |

```bash
./install.sh --template
# 按提示输入 4 个模型 ID → 自动生成最终配置
```

### 🚀 SoloFast 模板（🆕 推荐，方案 5）

`ohmyopencode-solofast.json` 是简化版模板——**只需要输入一个 Fast 模型 ID**，其余全部固定为 MiniMax M2.7：

| 占位符 | 用途 | 覆盖的 Agent |
|--------|------|-------------|
| `{{FAST_MODEL_ID}}` | 推理型模型 | Sisyphus、Oracle、Prometheus、Hephaestus、Metis |
| `minimax-cn-coding-plan/MiniMax-M2.7` | 执行/轻量 | 其余所有 Agent（已自动配置） |

```bash
./eoc install -s        # eoc 方式
./install.sh --solofast  # install.sh 方式
# 只需要输入 1 个 Fast 模型 ID → 秒级搭建
```

> 💡 **SoloFast 适用于**：你只有一个主力推理模型（如 `openrouter/anthropic/claude-sonnet-4`），想让其余所有 Agent 统一用 MiniMax M2.7 执行代码搜索和轻量任务。

### 安装后需要放在 `~/.config/opencode/` 的文件

**选择方案 A：MiMo + MiniMax（默认）**

```bash
~/.config/opencode/
├── opencode.json                   # ← 从 configs/opencode.json 复制
├── oh-my-openagent.json            # ← 从 configs/oh-my-openagent-mimo.json 复制（重命名）
└── opencode-minimax-easy-vision.jsonc  # ← 从 configs/opencode-minimax-easy-vision.jsonc 复制
```

**选择方案 B：DeepSeek + MiniMax**

```bash
~/.config/opencode/
├── opencode.json                   # ← 从 configs/opencode.json 复制
├── oh-my-openagent.json            # ← 从 configs/oh-my-openagent-deepseek.json 复制（重命名）
└── opencode-minimax-easy-vision.jsonc  # ← 从 configs/opencode-minimax-easy-vision.jsonc 复制
```

### ⚠️ 重要说明

1. **目标文件名必须是 `opencode.json` 和 `oh-my-openagent.json`**，无论选择哪个方案
2. **`opencode-minimax-easy-vision.jsonc` 两个方案通用**，必须复制

## 📋 两套配置说明

本仓库提供两套配置，适用于不同的模型组合：

### 方案 A：MiMo + MiniMax（默认）

| 引擎 | 模型 | 职责 |
|------|------|------|
| 推理引擎 | MiMo V2.5 Pro | 架构决策、复杂推理、规划 |
| 执行引擎 | MiniMax M2.7 | 代码执行、多模态生成、创意突破 |
| 低成本引擎 | MiMo V2.5 | 代码搜索、文档查询、简单任务 |

**配置文件**：
- `opencode.json`
- `oh-my-openagent-mimo.json`

### 方案 B：DeepSeek + MiniMax

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

#### 🌐 browser-automation Skill（浏览器自动化）

本仓库提供 `browser-automation` **Skill**——合并 agent-browser CLI + Playwright CLI 的统一浏览器自动化方案。

| 组件 | 说明 |
|:---|:---|
| **工具** | `agent-browser`（Vercel Labs，Rust 原生）+ `playwright` CLI（Microsoft） |
| **安装** | `npm install -g agent-browser && npm install -g playwright && playwright install chromium` |
| **加载** | OpenCode 中加载 `browser-automation` Skill（自动加载到 `~/.agents/skills/`） |
| **原理** | 决策树选工具：agent-browser（@eN 快照，极省 token）| playwright CLI（单次截图/PDF） |
| **共享浏览器** | agent-browser 自动复用 Playwright 的 Chromium（`~/.cache/ms-playwright/`），无需重复下载 |

> ⚠️ **WSL2 注意**：Chromium 统一由 Playwright 管理，agent-browser 通过 `AGENT_BROWSER_EXECUTABLE_PATH` 环境变量指向同一浏览器。
> ```bash
> export AGENT_BROWSER_EXECUTABLE_PATH="~/.cache/ms-playwright/chromium-*/chrome-linux/chrome"
> ```
>
> 📖 完整命令参考：`skills/browser-automation/SKILL.md` | [agent-browser](https://github.com/vercel-labs/agent-browser) | [playwright](https://playwright.dev)

#### 其他配置

- `compaction`：上下文压缩配置（推荐保持默认）
- `plugin`：插件列表（不建议修改）

### oh-my-openagent.json

OhMyOpenAgent 多智能体配置，包含：
- 11 个智能体定义（Sisyphus、Atlas、Oracle 等）
- 14 种任务分类路由
- **Sisyphus 强制委托规则**（本仓库核心优化）

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

### 5. description / prompt_append 字段分工优化

通过源码级分析确认了 OhMyOpenAgent 配置中各字段的实际注入路径：

| 字段 | 注入位置 | 最佳用法 |
|------|---------|---------|
| `prompt_append` | Agent 自己的 System Prompt 末尾 | **操作边界约束**（能力速查表、委托规则、行为纪律） |
| `description` | Sisyphus 的"可用子代理"菜单（截断到 120 字符） | **一行速查标识**（让 Sisyphus 快速判断派谁） |
| `skills` | Agent 的 Skill 指令注入 | 控制加载哪些能力模块 |

**优化措施**：
- `description`：从 200-400 字精简到 30-105 字，不浪费被截断的部分
- `prompt_append`：移除冗余的身份描述（官方硬编码已定义），专注于追加官方未覆盖的操作边界
- 11 个 Agent + 16 个 Category 全部完成此优化

**效果**：Sisyphus 菜单更清爽，Agent 提示词更精简，token 不浪费在重复的身份声明上。

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

## 📚 文档说明

- **[OhMyOpenCode 使用指南](docs/ohmyopencode-guide.md)**：完整的安装、配置和使用教程
- **[Skill 必装合集](docs/ohmyopencode的skill必装合集.md)**：28 个 Skill 的分级推荐与场景化实战指南

## 📖 参考资源

- [OhMyOpenAgent 官方仓库](https://github.com/code-yeongyu/oh-my-openagent)
- [OpenCode 官方文档](https://opencode.ai/docs/)
- [DeepSeek 平台](https://platform.deepseek.com/)
- [DeepSeek-Reasonix 缓存优化](https://github.com/esengine/DeepSeek-Reasonix)
- [MiniMax Skills 仓库](https://github.com/MiniMax-AI/skills)

## 📝 更新日志

### 2026-05-30
- 🆕 新增 `ohmyopencode-solofast.json` SoloFast 模板——只需一个 Fast 模型 ID，其余全部 MiniMax M2.7
  - `install.sh` 支持 `--solofast`/`-s` 参数和交互选项 5
  - `eoc.js` 支持 `-s`/`--solofast` 命令行参数 + 交互菜单 [S]
- 🔧 修复 EasyVision 安装方式：从 `npm install -g` 改为官方 `opencode plugin` 命令（`eoc.js` + `install.sh`）
- 🆕 新增 `eoc.js` 配置切换器（~1700 行）——方向键交互菜单 + 命令行双模式，install/switch 二合一
  - 支持智能入口：首次引导安装，已安装进入切换菜单
  - 支持项目级配置（`./.opencode/`）管理，全局/项目级双层级
  - 全局命令设置：一键写入 `.bashrc`，任意目录 `eoc` 直达
  - 自动备份：时间戳命名 + 去重 + 保留 10 份，支持回滚
  - 模型 ID 指纹检测：3 层降级识别当前配置方案
  - 模板切换内联填 ID：菜单内直输模型 ID，不再踢回命令行
  - 备用屏幕缓冲区渲染，零重影
  - CJK 显示宽度精准计算，中文边框完美对齐
  - 零 npm 依赖，纯 Node.js 内置模块
- 🆕 新增 Template2 双引擎配置（`oh-my-openagent-template2.json`）——仅需 Pro/Fast 两个模型 ID
- 🔧 统一所有配置中 multimodal-looker 模型为 `opencode-go/mimo-v2.5`
- 新增 4 个 `prompt` 覆盖版配置（`-prompt.json`），完全替换官方系统提示
- 新增纯 MiniMax M2.7 配置 + 三层占位符模板配置
- install.sh 增加模型引擎 4 选 1 + Prompt 注入模式 2 选 1
- 优化 description/prompt_append 字段分工：description 精简到 <120 字符，prompt_append 专注操作边界约束
- 修复 README 中过时的配置文件引用路径

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
